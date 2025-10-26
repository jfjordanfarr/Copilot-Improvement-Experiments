import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { GraphStore, type DiagnosticRecord } from "@copilot-improvement/shared";

import { buildOutstandingDiagnosticsResult } from "./listOutstandingDiagnostics";

describe("buildOutstandingDiagnosticsResult", () => {
  let tempDir: string;
  let graphStore: GraphStore;

  beforeEach(() => {
    tempDir = mkdtempSync(join(tmpdir(), "list-diagnostics-"));
    const dbPath = join(tempDir, "graph.sqlite");
    graphStore = new GraphStore({ dbPath });
  });

  afterEach(() => {
    graphStore.close();
    rmSync(tempDir, { recursive: true, force: true });
  });

  it("projects diagnostic records with artifact metadata", () => {
    const triggerArtifact = createArtifact("trigger", "file:///docs/source.md");
    const targetArtifact = createArtifact("target", "file:///docs/target.md");
    graphStore.upsertArtifact(triggerArtifact);
    graphStore.upsertArtifact(targetArtifact);

    const diagnostic: DiagnosticRecord = {
      id: "diag-1",
      artifactId: targetArtifact.id,
      triggerArtifactId: triggerArtifact.id,
      changeEventId: "change-1",
      message: "documentation drift detected",
      severity: "warning",
      status: "active",
      createdAt: "2025-01-01T00:00:00.000Z",
      acknowledgedAt: undefined,
      acknowledgedBy: undefined,
      linkIds: ["link-1", "link-2"],
      llmAssessment: {
        summary: "The implementation has not been updated to match documentation.",
        confidence: 0.8,
        recommendedActions: ["Review linked implementation", "Update quickstart instructions"],
        generatedAt: "2025-01-01T01:00:00.000Z",
        model: {
          id: "local/ollama:llama3",
          vendor: "ollama"
        },
        promptHash: "hash-1"
      }
    };

    const snapshot = buildOutstandingDiagnosticsResult(
      [diagnostic],
      graphStore,
      () => new Date("2025-01-02T00:00:00.000Z")
    );

    expect(snapshot.generatedAt).toBe("2025-01-02T00:00:00.000Z");
    expect(snapshot.diagnostics).toHaveLength(1);
    expect(snapshot.diagnostics[0]).toMatchObject({
      recordId: diagnostic.id,
      message: diagnostic.message,
      severity: diagnostic.severity,
      changeEventId: diagnostic.changeEventId,
      createdAt: diagnostic.createdAt,
      linkIds: diagnostic.linkIds,
      target: {
        id: targetArtifact.id,
        uri: targetArtifact.uri,
        layer: targetArtifact.layer,
        language: targetArtifact.language
      },
      trigger: {
        id: triggerArtifact.id,
        uri: triggerArtifact.uri,
        layer: triggerArtifact.layer,
        language: triggerArtifact.language
      },
      llmAssessment: diagnostic.llmAssessment
    });
  });

  it("omits artifact metadata when missing", () => {
    const diagnostic: DiagnosticRecord = {
      id: "diag-2",
      artifactId: "unknown-target",
      triggerArtifactId: "unknown-trigger",
      changeEventId: "change-2",
      message: "dangling diagnostic",
      severity: "info",
      status: "active",
      createdAt: "2025-01-03T00:00:00.000Z",
      acknowledgedAt: undefined,
      acknowledgedBy: undefined,
      linkIds: []
    };

    const snapshot = buildOutstandingDiagnosticsResult(
      [diagnostic],
      graphStore,
      () => new Date("2025-01-04T00:00:00.000Z")
    );

    expect(snapshot.generatedAt).toBe("2025-01-04T00:00:00.000Z");
    expect(snapshot.diagnostics).toHaveLength(1);
    expect(snapshot.diagnostics[0]).toMatchObject({
      recordId: diagnostic.id,
      target: undefined,
      trigger: undefined
    });
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
