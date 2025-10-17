import { GraphStore } from "../db/graphStore";
import {
  ArtifactLayer,
  KnowledgeArtifact,
  KnowledgeSnapshot,
  LinkRelationship,
  LinkRelationshipKind
} from "../domain/artifacts";

export interface ExternalArtifact {
  id: string;
  uri: string;
  layer: ArtifactLayer;
  language?: string;
  owner?: string;
  lastSynchronizedAt?: string;
  hash?: string;
  metadata?: Record<string, unknown>;
}

export interface ExternalLink {
  id?: string;
  sourceId: string;
  targetId: string;
  kind: LinkRelationshipKind;
  confidence?: number;
  createdAt?: string;
  createdBy?: string;
  metadata?: Record<string, unknown>;
}

export interface ExternalSnapshot {
  id?: string;
  label: string;
  createdAt?: string;
  artifacts: ExternalArtifact[];
  links: ExternalLink[];
  metadata?: Record<string, unknown>;
}

export type StreamEventKind =
  | "artifact-upsert"
  | "artifact-remove"
  | "link-upsert"
  | "link-remove";

export interface ExternalStreamEvent {
  kind: StreamEventKind;
  sequenceId: string;
  detectedAt: string;
  artifact?: ExternalArtifact;
  artifactId?: string;
  link?: ExternalLink;
  linkId?: string;
  metadata?: Record<string, unknown>;
}

export interface StreamCheckpoint {
  lastSequenceId: string;
  updatedAt: string;
}

export class KnowledgeGraphBridge {
  private checkpoint: StreamCheckpoint | null = null;

  constructor(private readonly store: GraphStore) {}

  ingestSnapshot(snapshot: ExternalSnapshot): KnowledgeSnapshot {
    const normalizedArtifacts = snapshot.artifacts.map(toKnowledgeArtifact);
    const normalizedLinks = snapshot.links.map(link => toLinkRelationship(link));

    for (const artifact of normalizedArtifacts) {
      this.store.upsertArtifact(artifact);
    }

    for (const link of normalizedLinks) {
      this.store.upsertLink(link);
    }

    const knowledgeSnapshot: KnowledgeSnapshot = {
      id: snapshot.id ?? generateId(),
      label: snapshot.label,
      createdAt: snapshot.createdAt ?? new Date().toISOString(),
      artifactCount: normalizedArtifacts.length,
      edgeCount: normalizedLinks.length,
      payloadHash: computePayloadHash(snapshot),
      metadata: snapshot.metadata
    };

    this.store.storeSnapshot(knowledgeSnapshot);

    return knowledgeSnapshot;
  }

  applyStreamEvent(event: ExternalStreamEvent): void {
    switch (event.kind) {
      case "artifact-upsert": {
        if (!event.artifact) {
          throw new Error("artifact-upsert event must include artifact payload");
        }
        this.store.upsertArtifact(toKnowledgeArtifact(event.artifact));
        break;
      }
      case "artifact-remove": {
        if (!event.artifactId && !event.artifact?.uri) {
          throw new Error("artifact-remove event must include artifactId or artifact.uri");
        }
        if (event.artifactId) {
          this.store.removeArtifact(event.artifactId);
        } else if (event.artifact?.uri) {
          this.store.removeArtifactByUri(event.artifact.uri);
        }
        break;
      }
      case "link-upsert": {
        if (!event.link) {
          throw new Error("link-upsert event must include link payload");
        }
        this.store.upsertLink(toLinkRelationship(event.link));
        break;
      }
      case "link-remove": {
        if (event.linkId) {
          this.store.removeLink(event.linkId);
        } else if (event.link?.id) {
          this.store.removeLink(event.link.id);
        } else {
          throw new Error("link-remove event must include linkId or link.id");
        }
        break;
      }
    }

    this.checkpoint = {
      lastSequenceId: event.sequenceId,
      updatedAt: event.detectedAt
    };
  }

  getCheckpoint(): StreamCheckpoint | null {
    return this.checkpoint;
  }
}

function toKnowledgeArtifact(artifact: ExternalArtifact): KnowledgeArtifact {
  return {
    id: artifact.id,
    uri: artifact.uri,
    layer: artifact.layer,
    language: artifact.language,
    owner: artifact.owner,
    lastSynchronizedAt: artifact.lastSynchronizedAt,
    hash: artifact.hash,
    metadata: artifact.metadata
  };
}

function toLinkRelationship(link: ExternalLink): LinkRelationship {
  return {
    id: link.id ?? generateId(),
    sourceId: link.sourceId,
    targetId: link.targetId,
    kind: link.kind,
    confidence: typeof link.confidence === "number" ? clamp(link.confidence, 0, 1) : 1,
    createdAt: link.createdAt ?? new Date().toISOString(),
    createdBy: link.createdBy ?? "external-bridge"
  };
}

function computePayloadHash(snapshot: ExternalSnapshot): string {
  const serialised = JSON.stringify({
    artifacts: snapshot.artifacts,
    links: snapshot.links,
    metadata: snapshot.metadata
  });

  let hash = 0;
  for (let index = 0; index < serialised.length; index += 1) {
    hash = (hash << 5) - hash + serialised.charCodeAt(index);
    hash |= 0;
  }

  return `simple-${(hash >>> 0).toString(16)}`;
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function generateId(): string {
  return `kg-${Math.random().toString(36).slice(2, 10)}-${Date.now().toString(36)}`;
}
