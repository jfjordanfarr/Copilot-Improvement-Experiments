import { randomUUID } from "node:crypto";

import type {
  DiagnosticSeverity,
  DriftHistoryEntry,
  DriftHistorySummary,
  GraphStore,
  ListDriftHistoryOptions
} from "@copilot-improvement/shared";

export interface DriftHistoryStoreOptions {
  graphStore: GraphStore;
  now?: () => Date;
}

interface DriftHistoryBaseParams {
  diagnosticId: string;
  changeEventId: string;
  triggerArtifactId: string;
  targetArtifactId: string;
  severity: DiagnosticSeverity;
  metadata?: Record<string, unknown>;
  linkIds?: string[];
}

export type RecordDriftEmissionParams = DriftHistoryBaseParams;

export interface RecordDriftAcknowledgementParams extends DriftHistoryBaseParams {
  actor: string;
  notes?: string;
}

export class DriftHistoryStore {
  private readonly graphStore: GraphStore;
  private readonly now: () => Date;

  constructor(options: DriftHistoryStoreOptions) {
    this.graphStore = options.graphStore;
    this.now = options.now ?? (() => new Date());
  }

  recordEmission(params: RecordDriftEmissionParams): DriftHistoryEntry {
    const entry: DriftHistoryEntry = {
      id: randomUUID(),
      diagnosticId: params.diagnosticId,
      changeEventId: params.changeEventId,
      triggerArtifactId: params.triggerArtifactId,
      targetArtifactId: params.targetArtifactId,
      status: "emitted",
      severity: params.severity,
      recordedAt: this.now().toISOString(),
      metadata: this.mergeMetadata(params.metadata, params.linkIds)
    };

    this.graphStore.recordDriftHistory(entry);
    return entry;
  }

  recordAcknowledgement(params: RecordDriftAcknowledgementParams): DriftHistoryEntry {
    const entry: DriftHistoryEntry = {
      id: randomUUID(),
      diagnosticId: params.diagnosticId,
      changeEventId: params.changeEventId,
      triggerArtifactId: params.triggerArtifactId,
      targetArtifactId: params.targetArtifactId,
      status: "acknowledged",
      severity: params.severity,
      recordedAt: this.now().toISOString(),
      actor: params.actor,
      notes: params.notes,
      metadata: this.mergeMetadata(params.metadata, params.linkIds)
    };

    this.graphStore.recordDriftHistory(entry);
    return entry;
  }

  list(options?: ListDriftHistoryOptions): DriftHistoryEntry[] {
    return this.graphStore.listDriftHistory(options);
  }

  summarize(changeEventId: string): DriftHistorySummary {
    return this.graphStore.summarizeDriftHistory(changeEventId);
  }

  private mergeMetadata(
    metadata: Record<string, unknown> | undefined,
    linkIds: string[] | undefined
  ): Record<string, unknown> | undefined {
    const merged: Record<string, unknown> = { ...(metadata ?? {}) };
    if (Array.isArray(linkIds) && linkIds.length > 0) {
      merged.linkIds = [...linkIds];
    }

    return Object.keys(merged).length > 0 ? merged : undefined;
  }
}
