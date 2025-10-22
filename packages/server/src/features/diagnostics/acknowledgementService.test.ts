import { randomUUID } from "node:crypto";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it, beforeEach, afterEach } from "vitest";

import { GraphStore, type DiagnosticRecord } from "@copilot-improvement/shared";

import { AcknowledgementService } from "./acknowledgementService";
import type { HysteresisController } from "./hysteresisController";
import { DEFAULT_RUNTIME_SETTINGS } from "../settings/settingsBridge";

describe("AcknowledgementService", () => {
  let tempDir: string;
  let graphStore: GraphStore;
  let service: AcknowledgementService;
  let hysteresis: FakeHysteresis;

  beforeEach(() => {
    tempDir = mkdtempSync(join(tmpdir(), "ack-service-"));
    const dbPath = join(tempDir, "graph.sqlite");
    graphStore = new GraphStore({ dbPath });
    hysteresis = new FakeHysteresis();

    service = new AcknowledgementService({
      graphStore,
      hysteresis: hysteresis as unknown as HysteresisController,
      runtimeSettings: DEFAULT_RUNTIME_SETTINGS,
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

    const diagnostic: DiagnosticRecord = {
      id: randomUUID(),
      artifactId: targetArtifact.id,
      triggerArtifactId: triggerArtifact.id,
      changeEventId: "change-1",
      message: "documentation drift",
      severity: "warning",
      status: "active",
      createdAt: "2025-01-01T00:00:00.000Z",
      linkIds: []
    };

    graphStore.storeDiagnostic(diagnostic);

    const outcome = service.acknowledgeDiagnostic({
      diagnosticId: diagnostic.id,
      actor: "lead@example.com"
    });
    expect(outcome.kind).toBe("acknowledged");
    if (outcome.kind !== "acknowledged") {
      throw new Error(`Expected acknowledgement outcome to include record, received ${outcome.kind}`);
    }
    expect(outcome.record).toMatchObject({
      id: diagnostic.id,
      status: "acknowledged",
      acknowledgedBy: "lead@example.com",
      acknowledgedAt: "2025-01-01T00:00:00.000Z"
    });

    const stored = graphStore.getDiagnosticById(diagnostic.id);
    expect(stored).toBeDefined();
    expect(stored?.status).toBe("acknowledged");
    expect(stored?.acknowledgedBy).toBe("lead@example.com");
    expect(stored?.acknowledgedAt).toBe("2025-01-01T00:00:00.000Z");

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

    const diagnostic: DiagnosticRecord = {
      id: randomUUID(),
      artifactId: targetArtifact.id,
      triggerArtifactId: triggerArtifact.id,
      changeEventId: "change-2",
      message: "stale doc",
      severity: "warning",
      status: "active",
      createdAt: "2025-01-01T00:00:00.000Z",
      linkIds: []
    };

    graphStore.storeDiagnostic(diagnostic);

    service.acknowledgeDiagnostic({ diagnosticId: diagnostic.id, actor: "lead@example.com" });
    const outcome = service.acknowledgeDiagnostic({ diagnosticId: diagnostic.id, actor: "lead@example.com" });

    expect(outcome.kind).toBe("already_acknowledged");
    if (outcome.kind !== "already_acknowledged") {
      throw new Error(`Expected already_acknowledged outcome, received ${outcome.kind}`);
    }
    expect(outcome.record).toMatchObject({
      id: diagnostic.id,
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
