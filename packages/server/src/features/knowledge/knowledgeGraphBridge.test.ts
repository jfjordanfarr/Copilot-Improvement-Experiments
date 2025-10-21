import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { describe, expect, it, beforeEach, afterEach } from "vitest";

import { GraphStore } from "@copilot-improvement/shared";

import {
  KnowledgeGraphBridgeService,
  type KnowledgeGraphBridgeLogger
} from "./knowledgeGraphBridge";

interface TestLogger {
  logger: KnowledgeGraphBridgeLogger;
  info: string[];
  warn: string[];
  error: string[];
}

function createTestLogger(): TestLogger {
  const info: string[] = [];
  const warn: string[] = [];
  const error: string[] = [];

  return {
    logger: {
      info: message => info.push(message),
      warn: message => warn.push(message),
      error: message => error.push(message)
    },
    info,
    warn,
    error
  } satisfies TestLogger;
}

describe("KnowledgeGraphBridgeService", () => {
  let tempDir: string;
  let storageDir: string;
  let graphStore: GraphStore;
  let testLogger: TestLogger;

  beforeEach(() => {
    tempDir = mkdtempSync(path.join(tmpdir(), "kg-bridge-"));
    storageDir = path.join(tempDir, "storage");
    graphStore = new GraphStore({ dbPath: path.join(tempDir, "graph.db") });
    testLogger = createTestLogger();
  });

  afterEach(() => {
    graphStore.close();
    rmSync(tempDir, { recursive: true, force: true });
  });

  it("ingests static knowledge feeds and exposes healthy descriptors", async () => {
    const workspaceRoot = tempDir;
    const feedDir = path.join(workspaceRoot, "data", "knowledge-feeds");
    mkdirSync(feedDir, { recursive: true });

    writeFileSync(
      path.join(feedDir, "sample.json"),
      JSON.stringify(
        {
          id: "sample-feed",
          label: "Sample Feed",
          createdAt: "2025-10-20T00:00:00.000Z",
          artifacts: [
            { id: "doc", uri: "file:///workspace/docs/spec.md", layer: "requirements" },
            { id: "code", uri: "file:///workspace/src/index.ts", layer: "code" }
          ],
          links: [
            { id: "link-1", sourceId: "doc", targetId: "code", kind: "documents" }
          ],
          metadata: { source: "unit-test" }
        },
        null,
        2
      ),
      "utf8"
    );

    const service = new KnowledgeGraphBridgeService({
      graphStore,
      storageDirectory: storageDir,
      workspaceRoot,
      logger: testLogger.logger
    });

    const observedStatuses: string[] = [];
    const disposable = service.onStatusChanged(summary => {
      if (summary) {
        observedStatuses.push(summary.status);
      }
    });

    const result = await service.start();

    expect(result.configuredFeeds).toBe(1);
    expect(service.getHealthyFeeds()).toHaveLength(1);
    expect(observedStatuses.at(-1)).toBe("healthy");

    const artifacts = graphStore.listArtifacts();
    expect(artifacts).toHaveLength(2);
    const knowledgeFeedIds = new Set(
      artifacts.map(artifact => artifact.metadata?.knowledgeFeedId)
    );
    expect(knowledgeFeedIds.has("sample-feed")).toBe(true);

    disposable.dispose();
    await service.dispose();
  });

  it("skips ingestion when workspace root is unavailable", async () => {
    const service = new KnowledgeGraphBridgeService({
      graphStore,
      storageDirectory: storageDir,
      workspaceRoot: null,
      logger: testLogger.logger
    });

    const result = await service.start();
    expect(result.configuredFeeds).toBe(0);
    expect(service.getHealthyFeeds()).toHaveLength(0);

    await service.dispose();
  });
});
