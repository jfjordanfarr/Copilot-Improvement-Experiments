import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it, beforeEach, afterEach } from "vitest";

import { GraphStore } from "@copilot-improvement/shared";

import { AcknowledgementService } from "./acknowledgementService";
import type { HysteresisController } from "./hysteresisController";
import { DEFAULT_RUNTIME_SETTINGS } from "../settings/settingsBridge";
import { DriftHistoryStore } from "../../telemetry/driftHistoryStore";

describe("AcknowledgementService", () => {
  let tempDir: string;
  let graphStore: GraphStore;
  let service: AcknowledgementService;
  let hysteresis: FakeHysteresis;
  let driftHistory: DriftHistoryStore;
  let dbPath: string;

  beforeEach(() => {
    tempDir = mkdtempSync(join(tmpdir(), "ack-service-"));
    dbPath = join(tempDir, "graph.sqlite");
    graphStore = new GraphStore({ dbPath });
    hysteresis = new FakeHysteresis();
    driftHistory = new DriftHistoryStore({
      graphStore,
      now: () => new Date("2025-01-01T00:00:00.000Z")
    });

    service = new AcknowledgementService({
      graphStore,
      hysteresis: hysteresis as unknown as HysteresisController,
      runtimeSettings: DEFAULT_RUNTIME_SETTINGS,
      driftHistory,
      now: () => new Date("2025-01-01T00:00:00.000Z"),
      logger: new NullLogger()
    });
  });

  afterEach(() => {
    graphStore.close();
    rmSync(tempDir, { recursive: true, force: true });
  });

  it("acknowledges diagnostics and releases hysteresis", () => {
    const triggerArtifact = createArtifact("trigger-artifact", "file:///docs/source.md");
    const targetArtifact = createArtifact("target-artifact", "file:///docs/target.md");

    graphStore.upsertArtifact(triggerArtifact);
    graphStore.upsertArtifact(targetArtifact);
    recordChangeEvent(graphStore, "change-1", triggerArtifact.id);

    const emission = service.registerEmission({
      changeEventId: "change-1",
      triggerArtifactId: triggerArtifact.id,
      targetArtifactId: targetArtifact.id,
      message: "documentation drift",
      severity: "warning",
      linkIds: []
    });

    const outcome = service.acknowledgeDiagnostic({
      diagnosticId: emission.id,
      actor: "lead@example.com"
    });
    expect(outcome.kind).toBe("acknowledged");
    if (outcome.kind !== "acknowledged") {
      throw new Error(`Expected acknowledgement outcome to include record, received ${outcome.kind}`);
    }
    expect(outcome.record).toMatchObject({
      id: emission.id,
      status: "acknowledged",
      acknowledgedBy: "lead@example.com",
      acknowledgedAt: "2025-01-01T00:00:00.000Z"
    });

    const stored = graphStore.getDiagnosticById(emission.id);
    expect(stored).toBeDefined();
    expect(stored?.status).toBe("acknowledged");
    expect(stored?.acknowledgedBy).toBe("lead@example.com");
    expect(stored?.acknowledgedAt).toBe("2025-01-01T00:00:00.000Z");

    const history = graphStore.listDriftHistory({ diagnosticId: emission.id });
    expect(history).toHaveLength(2);
    expect(new Set(history.map(entry => entry.status))).toEqual(new Set(["emitted", "acknowledged"]));

    const acknowledged = history.find(entry => entry.status === "acknowledged");
    expect(acknowledged).toMatchObject({
      status: "acknowledged",
      actor: "lead@example.com"
    });

    expect(hysteresis.calls).toEqual([
      {
        triggerUri: triggerArtifact.uri,
        targetUri: targetArtifact.uri
      }
    ]);
  });

  it("treats missing diagnostics as no-ops", () => {
    const outcome = service.acknowledgeDiagnostic({
      diagnosticId: "missing",
      actor: "lead@example.com"
    });

    expect(outcome).toEqual({ kind: "not_found" });
    expect(hysteresis.calls).toEqual([]);
  });

  it("short-circuits repeated acknowledgements", () => {
    const triggerArtifact = createArtifact("trigger", "file:///source.md");
    const targetArtifact = createArtifact("target", "file:///target.md");
    graphStore.upsertArtifact(triggerArtifact);
    graphStore.upsertArtifact(targetArtifact);
  recordChangeEvent(graphStore, "change-2", triggerArtifact.id);

    const emission = service.registerEmission({
      changeEventId: "change-2",
      triggerArtifactId: triggerArtifact.id,
      targetArtifactId: targetArtifact.id,
      message: "stale doc",
      severity: "warning"
    });

    service.acknowledgeDiagnostic({ diagnosticId: emission.id, actor: "lead@example.com" });
    const outcome = service.acknowledgeDiagnostic({ diagnosticId: emission.id, actor: "lead@example.com" });

    expect(outcome.kind).toBe("already_acknowledged");
    if (outcome.kind !== "already_acknowledged") {
      throw new Error(`Expected already_acknowledged outcome, received ${outcome.kind}`);
    }
    expect(outcome.record).toMatchObject({
      id: emission.id,
      status: "acknowledged",
      acknowledgedAt: "2025-01-01T00:00:00.000Z"
    });
    expect(hysteresis.calls).toHaveLength(1);
  });

  it("suppresses emissions after acknowledgement until new change event", () => {
    const triggerArtifact = createArtifact("trigger-3", "file:///trigger3.md");
    const targetArtifact = createArtifact("target-3", "file:///target3.md");
    graphStore.upsertArtifact(triggerArtifact);
    graphStore.upsertArtifact(targetArtifact);

    const changeEventId = "change-ack";

    expect(
      service.shouldEmitDiagnostic({
        changeEventId,
        triggerArtifactId: triggerArtifact.id,
        targetArtifactId: targetArtifact.id
      })
    ).toBe(true);

    recordChangeEvent(graphStore, changeEventId, triggerArtifact.id);

    service.registerEmission({
      changeEventId,
      triggerArtifactId: triggerArtifact.id,
      targetArtifactId: targetArtifact.id,
      message: "needs review",
      severity: "warning"
    });

    const activeDiagnostics = service.listActiveDiagnostics();
    expect(activeDiagnostics).toHaveLength(1);
    expect(activeDiagnostics[0].changeEventId).toBe(changeEventId);

    const record = graphStore.findDiagnosticByChangeEvent({
      changeEventId,
      triggerArtifactId: triggerArtifact.id,
      artifactId: targetArtifact.id
    });
    expect(record).toBeDefined();

    service.acknowledgeDiagnostic({
      diagnosticId: record!.id,
      actor: "lead@example.com"
    });

    expect(
      service.shouldEmitDiagnostic({
        changeEventId,
        triggerArtifactId: triggerArtifact.id,
        targetArtifactId: targetArtifact.id
      })
    ).toBe(false);

    const driftEntries = graphStore.listDriftHistory({ diagnosticId: record!.id });
    expect(new Set(driftEntries.map(entry => entry.status))).toEqual(
      new Set(["emitted", "acknowledged"])
    );

    // New change event should emit again.
    const newChangeId = "change-ack-2";
    expect(
      service.shouldEmitDiagnostic({
        changeEventId: newChangeId,
        triggerArtifactId: triggerArtifact.id,
        targetArtifactId: targetArtifact.id
      })
    ).toBe(true);
  });

  it("persists acknowledgement state across service restart", () => {
    const trigger = createArtifact("restart-trigger", "file:///restart-trigger.md");
    const target = createArtifact("restart-target", "file:///restart-target.md");
    graphStore.upsertArtifact(trigger);
    graphStore.upsertArtifact(target);
    recordChangeEvent(graphStore, "restart-change", trigger.id);

    const changeEventId = "restart-change";
    const emitted = service.registerEmission({
      changeEventId,
      triggerArtifactId: trigger.id,
      targetArtifactId: target.id,
      message: "restart scenario",
      severity: "warning"
    });

    service.acknowledgeDiagnostic({ diagnosticId: emitted.id, actor: "lead@example.com" });

    graphStore.close();
    graphStore = new GraphStore({ dbPath });
    driftHistory = new DriftHistoryStore({
      graphStore,
      now: () => new Date("2025-01-01T00:05:00.000Z")
    });
    hysteresis = new FakeHysteresis();

    service = new AcknowledgementService({
      graphStore,
      hysteresis: hysteresis as unknown as HysteresisController,
      runtimeSettings: DEFAULT_RUNTIME_SETTINGS,
      driftHistory,
      now: () => new Date("2025-01-01T00:05:00.000Z"),
      logger: new NullLogger()
    });

    expect(
      service.shouldEmitDiagnostic({
        changeEventId,
        triggerArtifactId: trigger.id,
        targetArtifactId: target.id
      })
    ).toBe(false);

    const persistedEntries = graphStore.listDriftHistory({ diagnosticId: emitted.id });
    expect(new Set(persistedEntries.map(entry => entry.status))).toEqual(
      new Set(["emitted", "acknowledged"])
    );
    const acknowledged = persistedEntries.find(entry => entry.status === "acknowledged");
    expect(acknowledged).toMatchObject({ actor: "lead@example.com" });
  });
});

function createArtifact(id: string, uri: string) {
  return {
    id,
    uri,
    layer: "implementation" as const,
    language: "markdown",
    metadata: undefined,
    owner: undefined,
    lastSynchronizedAt: undefined,
    hash: undefined
  };
}

function recordChangeEvent(store: GraphStore, id: string, artifactId: string): void {
  store.recordChangeEvent({
    id,
    artifactId,
    detectedAt: "2025-01-01T00:00:00.000Z",
    summary: "test change",
    changeType: "content",
    ranges: [],
    provenance: "save"
  });
}

class FakeHysteresis {
  readonly calls: Array<{ triggerUri: string; targetUri: string }> = [];

  acknowledge(triggerUri: string, targetUri: string): void {
    this.calls.push({ triggerUri, targetUri });
  }
}

class NullLogger {
  info(): void {}
  warn(): void {}
  error(): void {}
}
