import { createHash } from "node:crypto";

import {
  ExternalArtifact,
  ExternalLink,
  ExternalSnapshot,
  ExternalStreamEvent,
  GraphStore,
  KnowledgeGraphBridge,
  KnowledgeSnapshot,
  StreamCheckpoint
} from "@live-documentation/shared";

import { FeedCheckpointStore } from "./feedCheckpointStore";
import {
  FeedDiagnosticsGateway,
  FeedHealthStatus
} from "./feedDiagnosticsGateway";
import { assertValidSnapshot, assertValidStreamEvent } from "./schemaValidator";
import { normalizeFileUri } from "../utils/uri";

export interface KnowledgeGraphIngestorLogger {
  info(message: string): void;
  warn(message: string): void;
  error(message: string): void;
}

export interface KnowledgeGraphIngestorOptions {
  graphStore: GraphStore;
  bridge: KnowledgeGraphBridge;
  checkpoints: FeedCheckpointStore;
  diagnostics: FeedDiagnosticsGateway;
  logger?: KnowledgeGraphIngestorLogger;
  now?: () => Date;
}

export interface SnapshotIngestResult {
  feedId: string;
  normalizedSnapshot: ExternalSnapshot;
  knowledgeSnapshot: KnowledgeSnapshot;
}

export interface StreamIngestResult {
  feedId: string;
  normalizedEvent: ExternalStreamEvent;
  checkpoint: StreamCheckpoint;
}

export class KnowledgeGraphIngestor {
  private readonly locks = new Map<string, Promise<void>>();
  private readonly now: () => Date;

  constructor(private readonly options: KnowledgeGraphIngestorOptions) {
    this.now = options.now ?? (() => new Date());
  }

  async ingestSnapshot(feedId: string, snapshot: ExternalSnapshot): Promise<SnapshotIngestResult> {
    return this.withFeedLock(feedId, async () => {
      try {
        assertValidSnapshot(snapshot);
        const normalised = normaliseSnapshot(feedId, snapshot);
        const appliedSnapshot = this.options.bridge.ingestSnapshot(normalised);

        this.pruneMissingArtifacts(feedId, normalised.artifacts.map(artifact => artifact.id));
        await this.options.checkpoints.write(feedId, {
          lastSequenceId: appliedSnapshot.id,
          updatedAt: appliedSnapshot.createdAt
        });

        this.publishStatus(feedId, "healthy", `Snapshot ${appliedSnapshot.label} applied`, {
          artifactCount: appliedSnapshot.artifactCount,
          linkCount: appliedSnapshot.edgeCount
        });

        return {
          feedId,
          normalizedSnapshot: normalised,
          knowledgeSnapshot: appliedSnapshot
        } satisfies SnapshotIngestResult;
      } catch (error) {
        const message = describeError(error);
        this.publishStatus(feedId, "degraded", message);
        this.options.logger?.error?.(
          `[knowledge-ingestor] snapshot ingest failed for ${feedId}: ${message}`
        );
        throw error;
      }
    });
  }

  async ingestStreamEvent(feedId: string, event: ExternalStreamEvent): Promise<StreamIngestResult> {
    return this.withFeedLock(feedId, async () => {
      const checkpoint = await this.options.checkpoints.read(feedId);
      if (checkpoint?.lastSequenceId === event.sequenceId) {
        this.options.logger?.info?.(
          `[knowledge-ingestor] duplicate stream event ${event.sequenceId} ignored for ${feedId}`
        );
        return {
          feedId,
          normalizedEvent: event,
          checkpoint
        } satisfies StreamIngestResult;
      }

      try {
        assertValidStreamEvent(event);
        const normalised = this.normaliseStreamEvent(feedId, event);
        assertValidStreamEvent(normalised);

        this.options.bridge.applyStreamEvent(normalised);
        const nextCheckpoint =
          this.options.bridge.getCheckpoint() ?? createCheckpoint(normalised.sequenceId, normalised.detectedAt);
        await this.options.checkpoints.write(feedId, nextCheckpoint);

        this.publishStatus(feedId, "healthy", `Applied stream event ${normalised.sequenceId}`);

        return {
          feedId,
          normalizedEvent: normalised,
          checkpoint: nextCheckpoint
        } satisfies StreamIngestResult;
      } catch (error) {
        const message = describeError(error);
        this.publishStatus(feedId, "degraded", message);
        this.options.logger?.error?.(
          `[knowledge-ingestor] stream ingest failed for ${feedId} @ ${event.sequenceId}: ${message}`
        );
        throw error;
      }
    });
  }

  async loadCheckpoint(feedId: string): Promise<StreamCheckpoint | null> {
    return this.options.checkpoints.read(feedId);
  }

  async persistCheckpoint(feedId: string, checkpoint: StreamCheckpoint): Promise<void> {
    await this.options.checkpoints.write(feedId, checkpoint);
  }

  async clearCheckpoint(feedId: string): Promise<void> {
    await this.options.checkpoints.clear(feedId);
  }

  private async withFeedLock<T>(feedId: string, work: () => Promise<T>): Promise<T> {
    const pending = this.locks.get(feedId) ?? Promise.resolve();
    let release: (() => void) | undefined;
    const nextLock = new Promise<void>(resolve => {
      release = resolve;
    });
    this.locks.set(feedId, pending.then(() => nextLock));
    await pending;

    try {
      return await work();
    } finally {
      if (release) {
        release();
      }
      if (this.locks.get(feedId) === nextLock) {
        this.locks.delete(feedId);
      }
    }
  }

  private pruneMissingArtifacts(feedId: string, artifactIds: string[]): void {
    const existing = this.options.graphStore.listArtifacts();
    const expected = new Set(artifactIds);
    const removed = existing.filter(artifact => artifact.metadata?.knowledgeFeedId === feedId && !expected.has(artifact.id));

    if (!removed.length) {
      return;
    }

    for (const artifact of removed) {
      this.options.graphStore.removeArtifact(artifact.id);
    }

    this.options.logger?.info?.(
      `[knowledge-ingestor] pruned ${removed.length} stale artifact(s) for ${feedId}`
    );
  }

  private publishStatus(
    feedId: string,
    status: FeedHealthStatus,
    message?: string,
    details?: Record<string, unknown>
  ): void {
    this.options.diagnostics.updateStatus(feedId, status, message, details);
  }

  private normaliseStreamEvent(feedId: string, event: ExternalStreamEvent): ExternalStreamEvent {
    switch (event.kind) {
      case "artifact-upsert": {
        if (!event.artifact) {
          return event;
        }
        const artifact = {
          ...event.artifact,
          id: ensureArtifactId(feedId, event.artifact),
          uri: normalizeFileUri(event.artifact.uri),
          metadata: mergeMetadata(feedId, event.artifact.metadata)
        } satisfies ExternalArtifact;
        return { ...event, artifact };
      }
      case "artifact-remove": {
        if (event.artifactId) {
          return event;
        }
        if (event.artifact?.uri) {
          const index = this.buildArtifactIndex();
          const resolvedId = this.resolveStreamArtifactId(feedId, event.artifact.uri, index);
          return { ...event, artifactId: resolvedId };
        }
        return event;
      }
      case "link-upsert": {
        if (!event.link) {
          return event;
        }
        const index = this.buildArtifactIndex();
        const sourceId = this.resolveStreamArtifactId(feedId, event.link.sourceId, index);
        const targetId = this.resolveStreamArtifactId(feedId, event.link.targetId, index);
        const link = {
          ...event.link,
          id: ensureLinkId(feedId, event.link, sourceId, targetId),
          sourceId,
          targetId
        } satisfies ExternalLink;
        return { ...event, link };
      }
      case "link-remove": {
        if (event.linkId) {
          return event;
        }
        if (event.link) {
          const index = this.buildArtifactIndex();
          const sourceId = this.resolveStreamArtifactId(feedId, event.link.sourceId, index);
          const targetId = this.resolveStreamArtifactId(feedId, event.link.targetId, index);
          return {
            ...event,
            linkId: ensureLinkId(feedId, event.link, sourceId, targetId)
          };
        }
        return event;
      }
      default:
        return event;
    }
  }

  private buildArtifactIndex(): ArtifactIndex {
    const byId = new Map<string, string>();
    const byUri = new Map<string, string>();

    for (const artifact of this.options.graphStore.listArtifacts()) {
      byId.set(artifact.id, artifact.id);
      byUri.set(artifact.uri, artifact.id);
      byUri.set(normalizeFileUri(artifact.uri), artifact.id);
    }

    return { byId, byUri };
  }

  private resolveStreamArtifactId(
    feedId: string,
    candidate: string,
    index: ArtifactIndex
  ): string {
    if (index.byId.has(candidate)) {
      return candidate;
    }

    const canonical = normalizeFileUri(candidate);
    const idByUri = index.byUri.get(canonical) ?? index.byUri.get(candidate);
    if (idByUri) {
      return idByUri;
    }

    return computeStableId("artifact", feedId, canonical);
  }
}

interface NormalisedSnapshot extends ExternalSnapshot {
  artifacts: ExternalArtifact[];
  links: ExternalLink[];
}

function normaliseSnapshot(feedId: string, snapshot: ExternalSnapshot): NormalisedSnapshot {
  const artifactIdMap = new Map<string, string>();
  const artifacts = (snapshot.artifacts ?? []).map(artifact => {
    const id = ensureArtifactId(feedId, artifact);
    artifactIdMap.set(artifact.id ?? artifact.uri, id);
    artifactIdMap.set(id, id);
    const uri = normalizeFileUri(artifact.uri);
    artifactIdMap.set(uri, id);
    return {
      ...artifact,
      id,
      uri,
      metadata: mergeMetadata(feedId, artifact.metadata)
    } satisfies ExternalArtifact;
  });

  const links = (snapshot.links ?? []).map(link => {
    const sourceId = resolveArtifactId(artifactIdMap, link.sourceId);
    const targetId = resolveArtifactId(artifactIdMap, link.targetId);

    if (!sourceId || !targetId) {
      throw new Error(
        `Snapshot link references unknown artifacts (${link.sourceId} -> ${link.targetId})`
      );
    }

    return {
      ...link,
      id: ensureLinkId(feedId, link, sourceId, targetId),
      sourceId,
      targetId
    } satisfies ExternalLink;
  });

  return {
    ...snapshot,
    artifacts,
    links
  };
}

function ensureArtifactId(feedId: string, artifact: ExternalArtifact): string {
  if (artifact.id) {
    return artifact.id;
  }
  return computeStableId("artifact", feedId, normalizeFileUri(artifact.uri));
}

function ensureLinkId(
  feedId: string,
  link: ExternalLink,
  sourceId: string,
  targetId: string
): string {
  if (link.id) {
    return link.id;
  }
  const payload = `${sourceId}|${targetId}|${link.kind}`;
  return computeStableId("link", feedId, payload);
}

function resolveArtifactId(map: Map<string, string>, candidate: string): string | undefined {
  return map.get(candidate) ?? candidate;
}

function mergeMetadata(
  feedId: string,
  metadata: Record<string, unknown> | undefined
): Record<string, unknown> {
  return { ...(metadata ?? {}), knowledgeFeedId: feedId };
}

function computeStableId(prefix: string, feedId: string, value: string): string {
  const hash = createHash("sha1").update(`${feedId}|${value}`).digest("hex").slice(0, 16);
  return `${prefix}-${hash}`;
}

function createCheckpoint(sequenceId: string, detectedAt: string): StreamCheckpoint {
  return {
    lastSequenceId: sequenceId,
    updatedAt: detectedAt
  };
}

function describeError(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return String(error);
}

interface ArtifactIndex {
  byId: Map<string, string>;
  byUri: Map<string, string>;
}
