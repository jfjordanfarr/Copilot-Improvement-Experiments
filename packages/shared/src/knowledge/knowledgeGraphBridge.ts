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
  private readonly artifactIdAliases = new Map<string, string>();

  constructor(private readonly store: GraphStore) {}

  ingestSnapshot(snapshot: ExternalSnapshot): KnowledgeSnapshot {
    const normalizedArtifacts = snapshot.artifacts.map(toKnowledgeArtifact);
    const normalizedLinks = snapshot.links.map(link => toLinkRelationship(link));

    const aliasMap = new Map<string, string>();

    for (const artifact of normalizedArtifacts) {
      const stored = this.store.upsertArtifact(artifact);
      aliasMap.set(artifact.id, stored.id);
      this.rememberArtifactAlias(artifact.id, stored.id);
    }

    for (const link of normalizedLinks) {
      const sourceId = this.resolveArtifactId(aliasMap, link.sourceId);
      const targetId = this.resolveArtifactId(aliasMap, link.targetId);

      this.store.upsertLink({
        ...link,
        sourceId,
        targetId
      });
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
        const stored = this.store.upsertArtifact(toKnowledgeArtifact(event.artifact));
        if (event.artifact.id) {
          this.rememberArtifactAlias(event.artifact.id, stored.id);
        }
        break;
      }
      case "artifact-remove": {
        if (!event.artifactId && !event.artifact?.uri) {
          throw new Error("artifact-remove event must include artifactId or artifact.uri");
        }
        if (event.artifactId) {
          const canonicalId = this.resolveArtifactId(new Map(), event.artifactId);
          this.store.removeArtifact(canonicalId);
          this.forgetArtifactAlias(canonicalId);
        } else if (event.artifact?.uri) {
          const existing = this.store.getArtifactByUri(event.artifact.uri);
          if (existing) {
            this.forgetArtifactAlias(existing.id);
          }
          this.store.removeArtifactByUri(event.artifact.uri);
        }
        break;
      }
      case "link-upsert": {
        if (!event.link) {
          throw new Error("link-upsert event must include link payload");
        }
        const link = toLinkRelationship(event.link);
        const sourceId = this.resolveArtifactId(new Map(), link.sourceId);
        const targetId = this.resolveArtifactId(new Map(), link.targetId);

        this.store.upsertLink({
          ...link,
          sourceId,
          targetId
        });
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

  private rememberArtifactAlias(externalId: string, canonicalId: string): void {
    this.artifactIdAliases.set(externalId, canonicalId);
    this.artifactIdAliases.set(canonicalId, canonicalId);
  }

  private forgetArtifactAlias(canonicalId: string): void {
    for (const [alias, mapped] of Array.from(this.artifactIdAliases.entries())) {
      if (alias === canonicalId || mapped === canonicalId) {
        this.artifactIdAliases.delete(alias);
      }
    }
  }

  private resolveArtifactId(local: Map<string, string>, candidate: string): string {
    const mapped = local.get(candidate) ?? this.artifactIdAliases.get(candidate);
    return mapped ?? candidate;
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
