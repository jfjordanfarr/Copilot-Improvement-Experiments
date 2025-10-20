import { randomUUID } from "node:crypto";

import { GraphStore, KnowledgeArtifact } from "@copilot-improvement/shared";

import { normalizeFileUri } from "../utils/uri";
import type { CodeTrackedArtifactChange } from "../watchers/artifactWatcher";

export interface PersistedCodeChange {
  artifact: KnowledgeArtifact;
  changeEventId: string;
}

export interface SaveCodeChangeOptions {
  graphStore: GraphStore;
  change: CodeTrackedArtifactChange;
  now?: () => Date;
}

const DEFAULT_SUMMARY = "Implementation updated";

export function saveCodeChange(options: SaveCodeChangeOptions): PersistedCodeChange {
  const nowFactory = options.now ?? (() => new Date());
  const artifact = resolveArtifact(options.change);

  options.graphStore.upsertArtifact(artifact);

  const changeEventId = randomUUID();
  options.graphStore.recordChangeEvent({
    id: changeEventId,
    artifactId: artifact.id,
    detectedAt: nowFactory().toISOString(),
    summary: DEFAULT_SUMMARY,
    changeType: "content",
    ranges: [],
    provenance: "save"
  });

  return {
    artifact,
    changeEventId
  };
}

function resolveArtifact(change: CodeTrackedArtifactChange): KnowledgeArtifact {
  const canonicalUri = normalizeFileUri(change.uri);
  const candidate = change.nextArtifact ?? change.previousArtifact;
  if (candidate) {
    return { ...candidate, uri: normalizeFileUri(candidate.uri ?? canonicalUri) };
  }

  const language = change.change.languageId;
  return {
    id: randomUUID(),
    uri: canonicalUri,
    layer: change.layer,
    language,
    owner: undefined,
    lastSynchronizedAt: undefined,
    hash: undefined,
    metadata: undefined
  };
}
