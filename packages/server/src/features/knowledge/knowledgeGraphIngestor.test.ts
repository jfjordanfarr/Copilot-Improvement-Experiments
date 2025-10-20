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
import { KnowledgeGraphIngestor } from "./knowledgeGraphIngestor";

describe("KnowledgeGraphIngestor", () => {
  const feedId = "test-feed";

  let tempDir: string;
  let graphStore: GraphStore;
  let bridge: KnowledgeGraphBridge;
  let checkpoints: FileFeedCheckpointStore;
  let statuses: FeedStatusSummary[];
  let diagnostics: FeedDiagnosticsGateway;
  let ingestor: KnowledgeGraphIngestor;

  beforeEach(() => {
    tempDir = mkdtempSync(path.join(tmpdir(), "kg-ingestor-"));
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
      },
      now: () => new Date("2025-01-01T00:00:00.000Z")
    });
  });

  afterEach(() => {
    graphStore.close();
    rmSync(tempDir, { recursive: true, force: true });
  });

  it("ingests snapshots without IDs and persists normalized artifacts", async () => {
    const snapshot = {
      id: "snapshot-1",
      label: "Initial import",
      createdAt: "2025-01-01T00:00:00.000Z",
      artifacts: [
        {
          uri: "file:///workspace/docs/spec.md",
          layer: "requirements"
        },
        {
          uri: "file:///workspace/src/index.ts",
          layer: "code"
        }
      ],
      links: [
        {
          sourceId: "file:///workspace/docs/spec.md",
          targetId: "file:///workspace/src/index.ts",
          kind: "documents"
        }
      ]
    } as unknown as ExternalSnapshot;

    const snapshotResult = await ingestor.ingestSnapshot(feedId, snapshot);

    expect(snapshotResult.feedId).toBe(feedId);
    expect(snapshotResult.normalizedSnapshot.artifacts.every(artifact => typeof artifact.id === "string" && artifact.id.length > 0)).toBe(true);
    expect(snapshotResult.knowledgeSnapshot.artifactCount).toBe(2);

    const artifacts = graphStore.listArtifacts();
    expect(artifacts).toHaveLength(2);

    const docArtifact = artifacts.find(artifact => artifact.uri === "file:///workspace/docs/spec.md");
    const codeArtifact = artifacts.find(artifact => artifact.uri === "file:///workspace/src/index.ts");

    expect(docArtifact?.id).toMatch(/^artifact-/);
    expect(codeArtifact?.id).toMatch(/^artifact-/);
    expect(docArtifact?.metadata?.knowledgeFeedId).toBe(feedId);

    const links = docArtifact ? graphStore.listLinkedArtifacts(docArtifact.id) : [];
    expect(links).toHaveLength(1);
    expect(links[0]?.kind).toBe("documents");

    const checkpoint = await checkpoints.read(feedId);
    expect(checkpoint?.lastSequenceId).toBe("snapshot-1");
    expect(statuses.at(-1)?.status).toBe("healthy");
  });

  it("maps stream link events that reference artifact URIs", async () => {
    await ingestor.ingestSnapshot(feedId, {
      id: "snapshot-1",
      label: "Initial import",
      createdAt: "2025-01-01T00:00:00.000Z",
      artifacts: [
        { uri: "file:///workspace/docs/spec.md", layer: "requirements" },
        { uri: "file:///workspace/src/index.ts", layer: "code" }
      ],
      links: []
    } as unknown as ExternalSnapshot);

    const streamEvent: ExternalStreamEvent = {
      kind: "link-upsert",
      sequenceId: "seq-1",
      detectedAt: "2025-01-01T01:00:00.000Z",
      link: {
        sourceId: "file:///workspace/docs/spec.md",
        targetId: "file:///workspace/src/index.ts",
        kind: "documents"
      }
    };

    const streamResult = await ingestor.ingestStreamEvent(feedId, streamEvent);

    expect(streamResult.feedId).toBe(feedId);
    expect(streamResult.normalizedEvent.link?.sourceId).not.toBeUndefined();

    const checkpoint = await checkpoints.read(feedId);
    expect(checkpoint?.lastSequenceId).toBe("seq-1");

    const docArtifact = graphStore.getArtifactByUri("file:///workspace/docs/spec.md");
    expect(docArtifact).toBeDefined();

    const links = docArtifact ? graphStore.listLinkedArtifacts(docArtifact.id) : [];
    expect(links.some(link => link.kind === "documents")).toBe(true);
    expect(statuses.at(-1)?.status).toBe("healthy");
  });

  it("marks degraded when stream validation fails", async () => {
    await ingestor.ingestSnapshot(feedId, {
      id: "snapshot-1",
      label: "Initial import",
      createdAt: "2025-01-01T00:00:00.000Z",
      artifacts: [],
      links: []
    } as unknown as ExternalSnapshot);

    const badEvent: ExternalStreamEvent = {
      kind: "artifact-upsert",
      sequenceId: "seq-2",
      detectedAt: "2025-01-01T02:00:00.000Z"
    } as ExternalStreamEvent;

    await expect(ingestor.ingestStreamEvent(feedId, badEvent)).rejects.toThrow();
    expect(statuses.at(-1)?.status).toBe("degraded");
  });
});
