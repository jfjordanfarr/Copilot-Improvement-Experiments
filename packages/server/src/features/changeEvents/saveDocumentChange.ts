import { randomUUID } from "node:crypto";

import {
  GraphStore,
  KnowledgeArtifact,
  LinkInferenceRunResult
} from "@live-documentation/shared";

import { normalizeFileUri } from "../utils/uri";
import type { DocumentTrackedArtifactChange } from "../watchers/artifactWatcher";

export interface PersistedDocumentChange {
  artifact: KnowledgeArtifact;
  changeEventId: string;
}

export interface SaveDocumentChangeOptions {
  graphStore: GraphStore;
  change: DocumentTrackedArtifactChange;
  now?: () => Date;
}

const DEFAULT_SUMMARY = "Documentation updated";

export function persistInferenceResult(
  graphStore: GraphStore,
  inference: LinkInferenceRunResult | undefined
): void {
  if (!inference) {
    return;
  }

  const canonicalArtifacts = new Map<string, KnowledgeArtifact>();

  for (const artifact of inference.artifacts) {
    const stored = graphStore.upsertArtifact(artifact);
    canonicalArtifacts.set(artifact.id, stored);
    canonicalArtifacts.set(stored.id, stored);
  }

  for (const link of inference.links) {
    const source =
      canonicalArtifacts.get(link.sourceId) ?? graphStore.getArtifactById(link.sourceId);
    const target =
      canonicalArtifacts.get(link.targetId) ?? graphStore.getArtifactById(link.targetId);

    if (!source || !target) {
      continue;
    }

    graphStore.upsertLink({
      ...link,
      sourceId: source.id,
      targetId: target.id
    });
  }
}

export function saveDocumentChange(options: SaveDocumentChangeOptions): PersistedDocumentChange {
  const nowFactory = options.now ?? (() => new Date());
  const artifact = resolveArtifact(options);

  const storedArtifact = options.graphStore.upsertArtifact(artifact);

  const changeEventId = randomUUID();

  options.graphStore.recordChangeEvent({
    id: changeEventId,
    artifactId: storedArtifact.id,
    detectedAt: nowFactory().toISOString(),
    summary: DEFAULT_SUMMARY,
    changeType: "content",
    ranges: [],
    provenance: "save"
  });

  return {
    artifact: storedArtifact,
    changeEventId
  };
}

function resolveArtifact(options: SaveDocumentChangeOptions): KnowledgeArtifact {
  const canonicalUri = normalizeFileUri(options.change.uri);
  const candidate = options.change.nextArtifact ?? options.change.previousArtifact;
  if (candidate) {
    return { ...candidate, uri: normalizeFileUri(candidate.uri ?? canonicalUri) };
  }

  const language = options.change.change.languageId;
  return {
    id: randomUUID(),
    uri: canonicalUri,
    layer: options.change.layer,
    language,
    owner: undefined,
    lastSynchronizedAt: undefined,
    hash: undefined,
    metadata: undefined
  };
}
