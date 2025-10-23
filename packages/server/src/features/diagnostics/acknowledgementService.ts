import { randomUUID } from "node:crypto";

import type {
  AcknowledgementAction,
  DiagnosticRecord,
  GraphStore,
  DiagnosticSeverity
} from "@copilot-improvement/shared";

import type { HysteresisController } from "./hysteresisController";
import type { RuntimeSettings } from "../settings/settingsBridge";

interface Logger {
  info(message: string): void;
  warn(message: string): void;
  error(message: string): void;
}

interface DriftHistoryAdapter {
  recordEmission(params: {
    diagnosticId: string;
    changeEventId: string;
    triggerArtifactId: string;
    targetArtifactId: string;
    severity: DiagnosticSeverity;
    linkIds?: string[];
  }): void;
  recordAcknowledgement(params: {
    diagnosticId: string;
    changeEventId: string;
    triggerArtifactId: string;
    targetArtifactId: string;
    severity: DiagnosticSeverity;
    actor: string;
    notes?: string;
    linkIds?: string[];
  }): void;
}

export interface AcknowledgementServiceOptions {
  graphStore: GraphStore;
  hysteresis: HysteresisController;
  runtimeSettings: RuntimeSettings;
  driftHistory: DriftHistoryAdapter;
  logger?: Logger;
  now?: () => Date;
}

export interface AcknowledgeDiagnosticInput {
  diagnosticId: string;
  actor: string;
  notes?: string;
}

export interface ShouldEmitDiagnosticInput {
  changeEventId: string;
  targetArtifactId: string;
  triggerArtifactId: string;
}

export interface RegisterDiagnosticEmissionInput extends ShouldEmitDiagnosticInput {
  message: string;
  severity: DiagnosticSeverity;
  linkIds?: string[];
}

export type AcknowledgeOutcome =
  | { kind: "not_found" }
  | { kind: "acknowledged"; record: DiagnosticRecord }
  | { kind: "already_acknowledged"; record: DiagnosticRecord };

export class AcknowledgementService {
  private runtimeSettings: RuntimeSettings;
  private readonly nowFactory: () => Date;
  private readonly logger: Logger;
  private readonly driftHistory: DriftHistoryAdapter;

  constructor(private readonly options: AcknowledgementServiceOptions) {
    this.runtimeSettings = options.runtimeSettings;
    this.nowFactory = options.now ?? (() => new Date());
    this.logger =
      options.logger ?? ({
        info: () => {},
        warn: () => {},
        error: () => {}
      } satisfies Logger);
    this.driftHistory = options.driftHistory;
  }

  updateRuntimeSettings(settings: RuntimeSettings): void {
    this.runtimeSettings = settings;
    this.logger.info(
      `acknowledgement service runtime updated (noise=${settings.noiseSuppression.level}, hysteresis=${settings.noiseSuppression.hysteresisMs}ms)`
    );
  }

  shouldEmitDiagnostic(payload: ShouldEmitDiagnosticInput): boolean {
    const existing = this.options.graphStore.findDiagnosticByChangeEvent({
      changeEventId: payload.changeEventId,
      artifactId: payload.targetArtifactId,
      triggerArtifactId: payload.triggerArtifactId
    });
    return !existing || existing.status !== "acknowledged";
  }

  registerEmission(payload: RegisterDiagnosticEmissionInput): DiagnosticRecord {
    const existing = this.options.graphStore.findDiagnosticByChangeEvent({
      changeEventId: payload.changeEventId,
      artifactId: payload.targetArtifactId,
      triggerArtifactId: payload.triggerArtifactId
    });
    const now = this.nowFactory().toISOString();

    if (existing) {
      const updated: DiagnosticRecord = {
        ...existing,
        changeEventId: payload.changeEventId,
        message: payload.message,
        severity: payload.severity,
        status: "active",
        acknowledgedAt: existing.status === "acknowledged" ? existing.acknowledgedAt : undefined,
        acknowledgedBy: existing.status === "acknowledged" ? existing.acknowledgedBy : undefined,
        linkIds: payload.linkIds ?? existing.linkIds
      };

      this.options.graphStore.storeDiagnostic(updated);
      this.recordEmissionHistory(updated, payload.linkIds);
      return updated;
    }

    const record: DiagnosticRecord = {
      id: randomUUID(),
      artifactId: payload.targetArtifactId,
      triggerArtifactId: payload.triggerArtifactId,
      changeEventId: payload.changeEventId,
      message: payload.message,
      severity: payload.severity,
      status: "active",
      createdAt: now,
      linkIds: payload.linkIds ?? []
    };

    this.options.graphStore.storeDiagnostic(record);
    this.recordEmissionHistory(record, payload.linkIds);
    return record;
  }

  acknowledgeDiagnostic(payload: AcknowledgeDiagnosticInput): AcknowledgeOutcome {
    const diagnostic = this.options.graphStore.getDiagnosticById(payload.diagnosticId);
    if (!diagnostic) {
      this.logger.warn(`ack request ignored; diagnostic ${payload.diagnosticId} not found`);
      return { kind: "not_found" };
    }

    if (diagnostic.status === "acknowledged") {
      return {
        kind: "already_acknowledged",
        record: diagnostic
      };
    }

    const acknowledgedAt = this.nowFactory().toISOString();
    const hysteresisWindow = this.runtimeSettings.noiseSuppression.hysteresisMs;

    this.options.graphStore.updateDiagnosticStatus({
      id: payload.diagnosticId,
      status: "acknowledged",
      acknowledgedAt,
      acknowledgedBy: payload.actor
    });

    const logEntry: AcknowledgementAction = {
      id: randomUUID(),
      diagnosticId: payload.diagnosticId,
      actor: payload.actor,
      action: "acknowledge",
      notes: payload.notes,
      timestamp: acknowledgedAt
    };

    this.options.graphStore.logAcknowledgement(logEntry);

    this.releaseHysteresis(diagnostic);

    this.driftHistory.recordAcknowledgement({
      diagnosticId: payload.diagnosticId,
      changeEventId: diagnostic.changeEventId,
      triggerArtifactId: diagnostic.triggerArtifactId,
      targetArtifactId: diagnostic.artifactId,
      severity: diagnostic.severity,
      actor: payload.actor,
      notes: payload.notes,
      linkIds: diagnostic.linkIds
    });

    const updatedRecord =
      this.options.graphStore.getDiagnosticById(payload.diagnosticId) ?? {
        ...diagnostic,
        status: "acknowledged",
        acknowledgedAt,
        acknowledgedBy: payload.actor
      };

    this.logger.info(
      `diagnostic ${payload.diagnosticId} acknowledged by ${payload.actor} (hysteresis=${hysteresisWindow}ms)`
    );
    return { kind: "acknowledged", record: updatedRecord };
  }

  listActiveDiagnostics(): DiagnosticRecord[] {
    return this.options.graphStore.listDiagnosticsByStatus("active");
  }

  private releaseHysteresis(diagnostic: DiagnosticRecord): void {
    const trigger = this.options.graphStore.getArtifactById(diagnostic.triggerArtifactId);
    const target = this.options.graphStore.getArtifactById(diagnostic.artifactId);

    if (!trigger?.uri || !target?.uri) {
      this.logger.warn(
        `acknowledgement hysteresis release skipped; missing artifacts for diagnostic ${diagnostic.id}`
      );
      return;
    }

    this.options.hysteresis.acknowledge(trigger.uri, target.uri);
  }

  private recordEmissionHistory(record: DiagnosticRecord, linkIds?: string[]): void {
    this.driftHistory.recordEmission({
      diagnosticId: record.id,
      changeEventId: record.changeEventId,
      triggerArtifactId: record.triggerArtifactId,
      targetArtifactId: record.artifactId,
      severity: record.severity,
      linkIds: linkIds ?? record.linkIds
    });
  }
}
