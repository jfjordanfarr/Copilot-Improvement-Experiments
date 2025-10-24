import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { describe, expect, it, beforeEach, afterEach, vi } from "vitest";

import {
  GraphStore,
  KnowledgeGraphBridge,
  type ExternalSnapshot,
  type ExternalStreamEvent
} from "@copilot-improvement/shared";

import { FileFeedCheckpointStore } from "./feedCheckpointStore";
import { FeedDiagnosticsGateway, type FeedStatusSummary } from "./feedDiagnosticsGateway";
import { KnowledgeFeedManager } from "./knowledgeFeedManager";
import { KnowledgeGraphIngestor } from "./knowledgeGraphIngestor";

describe("KnowledgeFeedManager", () => {
  const feedId = "test-feed";

  let tempDir: string;
  let graphStore: GraphStore;
  let bridge: KnowledgeGraphBridge;
  let checkpoints: FileFeedCheckpointStore;
  let diagnostics: FeedDiagnosticsGateway;
  let statuses: FeedStatusSummary[];
  let ingestor: KnowledgeGraphIngestor;

  async function waitForStatus(expected: FeedStatusSummary["status"], timeoutMs = 500): Promise<void> {
    const deadline = Date.now() + timeoutMs;
    for (;;) {
      if (statuses.at(-1)?.status === expected) {
        return;
      }

      if (Date.now() >= deadline) {
        throw new Error(`Expected status ${expected}, saw ${statuses.at(-1)?.status ?? "<none>"}`);
      }

      await new Promise(resolve => setTimeout(resolve, 10));
    }
  }

  beforeEach(() => {
    tempDir = mkdtempSync(path.join(tmpdir(), "kg-manager-"));
    graphStore = new GraphStore({ dbPath: path.join(tempDir, "graph.db") });
    bridge = new KnowledgeGraphBridge(graphStore);
    checkpoints = new FileFeedCheckpointStore(path.join(tempDir, "checkpoints"));
    statuses = [];
    diagnostics = new FeedDiagnosticsGateway({
      onStatusChanged: summary => {
        statuses.push(summary);
      },
      logger: {
        info: vi.fn(),
        warn: vi.fn(),
        error: vi.fn()
      }
    });

    ingestor = new KnowledgeGraphIngestor({
      graphStore,
      bridge,
      checkpoints,
      diagnostics,
      logger: {
        info: vi.fn(),
        warn: vi.fn(),
        error: vi.fn()
      }
    });
  });

  afterEach(async () => {
    await ingestor.clearCheckpoint(feedId).catch(() => undefined);
    graphStore.close();
    rmSync(tempDir, { recursive: true, force: true });
  });

  it("ingests snapshot on start and exposes healthy feed", async () => {
    const snapshot: ExternalSnapshot = {
      id: "snapshot-1",
      label: "Initial feed snapshot",
      createdAt: "2025-01-01T00:00:00.000Z",
      artifacts: [
        { id: "artifact-doc", uri: "file:///workspace/docs/spec.md", layer: "requirements" },
        { id: "artifact-code", uri: "file:///workspace/src/index.ts", layer: "code" }
      ],
      links: [
        { id: "link-1", sourceId: "artifact-doc", targetId: "artifact-code", kind: "documents" }
      ]
    };

    const manager = new KnowledgeFeedManager({
      feeds: [
        {
          id: feedId,
          snapshot: {
            label: "Initial feed snapshot",
            load: () => Promise.resolve(snapshot)
          }
        }
      ],
      ingestor,
      diagnostics,
      logger: {
        info: vi.fn(),
        warn: vi.fn(),
        error: vi.fn()
      }
    });

    await manager.start();

    const healthyFeeds = manager.getHealthyFeeds();
    expect(healthyFeeds).toHaveLength(1);
    expect(healthyFeeds[0]?.snapshot?.label).toBe("Initial feed snapshot");

    const artifacts = graphStore.listArtifacts();
    expect(artifacts).toHaveLength(2);
    expect(statuses.at(-1)?.status).toBe("healthy");

    await manager.stop();
  });

  it("removes feed from healthy cache when stream ingestion fails", async () => {
    const snapshot: ExternalSnapshot = {
      id: "snapshot-1",
      label: "Initial feed snapshot",
      createdAt: "2025-01-01T00:00:00.000Z",
      artifacts: [
        { id: "artifact-doc", uri: "file:///workspace/docs/spec.md", layer: "requirements" }
      ],
      links: []
    };

    const failingStream = async function* (): AsyncIterable<ExternalStreamEvent> {
      yield await Promise.resolve({
        kind: "artifact-upsert",
        sequenceId: "seq-bad",
        detectedAt: "2025-01-01T01:00:00.000Z"
      } as ExternalStreamEvent);
    };

    const manager = new KnowledgeFeedManager({
      feeds: [
        {
          id: feedId,
          snapshot: {
            label: "Initial feed snapshot",
            load: () => Promise.resolve(snapshot)
          },
          stream: {
            label: "Failing stream",
            iterator: () => failingStream()
          }
        }
      ],
      ingestor,
      diagnostics,
      logger: {
        info: vi.fn(),
        warn: vi.fn(),
        error: vi.fn()
      },
      backoff: { initialMs: 10, multiplier: 2, maxMs: 50 }
    });

    await manager.start();

    await waitForStatus("degraded");
    expect(manager.getHealthyFeeds()).toHaveLength(0);

    await manager.stop();
  });
});
