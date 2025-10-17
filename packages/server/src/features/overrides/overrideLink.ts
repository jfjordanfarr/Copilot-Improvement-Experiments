import { createHash } from "crypto";

import {
  GraphStore,
  KnowledgeArtifact,
  LinkOverrideReason,
  LinkRelationshipKind,
  OverrideLinkArtifactInput,
  OverrideLinkRequest,
  OverrideLinkResponse
} from "@copilot-improvement/shared";
import { v4 as uuid } from "uuid";

interface EnsureArtifactParams {
  store: GraphStore;
  descriptor: OverrideLinkArtifactInput;
  reason: LinkOverrideReason;
  timestamp: string;
}

export function applyOverrideLink(
  store: GraphStore,
  request: OverrideLinkRequest
): OverrideLinkResponse {
  const timestamp = new Date().toISOString();

  const source = ensureArtifact({
    store,
    descriptor: request.source,
    reason: request.reason,
    timestamp
  });

  const target = ensureArtifact({
    store,
    descriptor: request.target,
    reason: request.reason,
    timestamp
  });

  const linkId = computeLinkId(source.id, target.id, request.kind);

  store.upsertLink({
    id: linkId,
    sourceId: source.id,
    targetId: target.id,
    kind: request.kind,
    confidence: request.confidence ?? 1,
    createdAt: timestamp,
    createdBy: `override:${request.reason}`
  });

  return {
    linkId,
    sourceArtifactId: source.id,
    targetArtifactId: target.id
  };
}

function ensureArtifact(params: EnsureArtifactParams): KnowledgeArtifact {
  const existing = params.store.getArtifactByUri(params.descriptor.uri);
  if (existing) {
    if (params.descriptor.languageId && existing.language !== params.descriptor.languageId) {
      const updated: KnowledgeArtifact = {
        ...existing,
        language: params.descriptor.languageId
      };
      params.store.upsertArtifact(updated);
      return updated;
    }

    return existing;
  }

  const artifact: KnowledgeArtifact = {
    id: uuid(),
    uri: params.descriptor.uri,
    layer: params.descriptor.layer,
    language: params.descriptor.languageId,
    metadata: {
      override: {
        reason: params.reason,
        createdAt: params.timestamp
      }
    }
  };

  params.store.upsertArtifact(artifact);
  return artifact;
}

function computeLinkId(
  sourceId: string,
  targetId: string,
  kind: LinkRelationshipKind
): string {
  return createHash("sha1").update(`${sourceId}|${kind}|${targetId}`).digest("hex");
}
