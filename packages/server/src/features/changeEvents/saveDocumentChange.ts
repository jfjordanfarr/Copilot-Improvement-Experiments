import { randomUUID } from "node:crypto";

import {
  GraphStore,
  KnowledgeArtifact,
  LinkInferenceRunResult
} from "@copilot-improvement/shared";

import type { MarkdownDocumentChange } from "../watchers/markdownWatcher";

export interface PersistedDocumentChange {
  artifact: KnowledgeArtifact;
  changeEventId: string;
}

export interface SaveDocumentChangeOptions {
  graphStore: GraphStore;
  change: MarkdownDocumentChange;
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

  for (const artifact of inference.artifacts) {
    graphStore.upsertArtifact(artifact);
  }

  for (const link of inference.links) {
    graphStore.upsertLink(link);
  }
}

export function saveDocumentChange(options: SaveDocumentChangeOptions): PersistedDocumentChange {
  const nowFactory = options.now ?? (() => new Date());
  const artifact = resolveArtifact(options);

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

function resolveArtifact(options: SaveDocumentChangeOptions): KnowledgeArtifact {
  const candidate = options.change.nextArtifact ?? options.change.previousArtifact;
  if (candidate) {
    return { ...candidate };
  }

  const language = options.change.change.languageId;
  return {
    id: randomUUID(),
    uri: options.change.uri,
    layer: options.change.layer,
    language,
    owner: undefined,
    lastSynchronizedAt: undefined,
    hash: undefined,
    metadata: undefined
  };
}
