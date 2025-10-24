import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";

import { GraphStore } from "@copilot-improvement/shared";
import { afterEach, describe, expect, it } from "vitest";
import type { Connection } from "vscode-languageserver";

import { ProviderGuard } from "../settings/providerGuard";
import { LlmIngestionOrchestrator } from "./llmIngestionOrchestrator";

function createTempDir(prefix: string): string {
  return mkdtempSync(path.join(tmpdir(), prefix));
}

describe("LlmIngestionOrchestrator", () => {
  const tempDirs: string[] = [];

  afterEach(() => {
    while (tempDirs.length > 0) {
      const dir = tempDirs.pop();
      if (dir) {
        rmSync(dir, { recursive: true, force: true });
      }
    }
  });

  it("persists calibrated relationships and provenance", async () => {
    const workspaceDir = createTempDir("llm-ingestor-persist-");
    tempDirs.push(workspaceDir);

    const sourcePath = path.join(workspaceDir, "source.ts");
    writeFileSync(sourcePath, "import './target';\nexport const demo = 1;\n");

    const targetPath = path.join(workspaceDir, "target.ts");
    writeFileSync(targetPath, "export const value = 2;\n");

    const store = new GraphStore({ dbPath: path.join(workspaceDir, "graph.db") });

    const sourceArtifact = store.upsertArtifact({
      id: "source",
      uri: pathToFileURL(sourcePath).toString(),
      layer: "code"
    });

    const targetArtifact = store.upsertArtifact({
      id: "target",
      uri: pathToFileURL(targetPath).toString(),
      layer: "code"
    });

    const extractor = {
      extractRelationships: async (request: any) => ({
        prompt: request.prompt,
        promptHash: request.prompt.promptHash,
        modelId: "mock-model",
        issuedAt: request.prompt.issuedAt,
        relationships: [
          {
            sourceId: sourceArtifact.id,
            targetId: targetArtifact.id,
            relationship: "depends_on",
            confidence: 0.92,
            rationale: "source imports target",
            supportingChunks: ["chunk-1"]
          },
          {
            sourceId: sourceArtifact.id,
            targetId: "missing",
            relationship: "depends_on",
            confidence: 0.1
          }
        ],
        responseText: "{}",
        usage: undefined
      })
    };

    const connection = { console: { info: () => {} } } as unknown as Connection;
    const guard = new ProviderGuard(connection);
    guard.apply({ enableDiagnostics: true, llmProviderMode: "prompt" });

    const orchestrator = new LlmIngestionOrchestrator({
      graphStore: store,
      providerGuard: guard,
      relationshipExtractor: extractor as any,
      storageDirectory: workspaceDir,
      logger: noopLogger,
      now: () => new Date("2025-10-24T12:00:00.000Z")
    });

    orchestrator.enqueueArtifacts([sourceArtifact.id]);
    const results = await orchestrator.runOnce();

    expect(results).toHaveLength(1);
    expect(results[0].stored).toBe(1);

    const link = (store as any).getLink(sourceArtifact.id, targetArtifact.id, "depends_on");
    expect(link).toBeDefined();

    const provenance = (store as any).getLlmEdgeProvenance(link!.id);
    expect(provenance).toBeDefined();
    expect(provenance?.modelId).toBe("mock-model");
    expect(provenance?.diagnosticsEligible).toBe(true);
    expect(provenance?.supportingChunks).toEqual(["chunk-1"]);

    store.close();
  });

  it("writes dry-run snapshots without mutating the graph", async () => {
    const workspaceDir = createTempDir("llm-ingestor-dryrun-");
    tempDirs.push(workspaceDir);

    const sourcePath = path.join(workspaceDir, "source.md");
    writeFileSync(sourcePath, "# Title\n\nLinked content\n");

    const store = new GraphStore({ dbPath: path.join(workspaceDir, "graph.db") });
    const sourceArtifact = store.upsertArtifact({
      id: "doc",
      uri: pathToFileURL(sourcePath).toString(),
      layer: "requirements"
    });

    const extractor = {
      extractRelationships: async (request: any) => ({
        prompt: request.prompt,
        promptHash: request.prompt.promptHash,
        modelId: "mock",
        issuedAt: request.prompt.issuedAt,
        relationships: [
          {
            sourceId: sourceArtifact.id,
            targetId: "unknown",
            relationship: "documents",
            confidence: 0.3,
            confidenceLabel: "low",
            rationale: "insufficient evidence"
          }
        ],
        responseText: "{}",
        usage: undefined
      })
    };

    const connection = { console: { info: () => {} } } as unknown as Connection;
    const guard = new ProviderGuard(connection);
    guard.apply({ enableDiagnostics: true, llmProviderMode: "prompt" });

    const orchestrator = new LlmIngestionOrchestrator({
      graphStore: store,
      providerGuard: guard,
      relationshipExtractor: extractor as any,
      storageDirectory: workspaceDir,
      logger: noopLogger,
      now: () => new Date("2025-10-24T12:00:00.000Z")
    });

    orchestrator.enqueueArtifacts([sourceArtifact.id]);
    const results = await orchestrator.runDryRun(path.join(workspaceDir, "snapshots"));

    expect(results).toHaveLength(1);
    expect(results[0].dryRunSnapshotPath).toBeTruthy();
    expect(results[0].stored).toBe(0);

    const snapshotPath = results[0].dryRunSnapshotPath!;
    const snapshotExists = await import("node:fs/promises").then(fs => fs.stat(snapshotPath)).then(
      () => true,
      () => false
    );
    expect(snapshotExists).toBe(true);

    const link = (store as any).getLink(sourceArtifact.id, "unknown", "documents");
    expect(link).toBeUndefined();

    store.close();
  });
});

const noopLogger = {
  info: () => {},
  warn: () => {},
  error: () => {}
};
