import { describe, expect, it, vi } from "vitest";

import type { ChangeEvent, GraphStore, KnowledgeArtifact } from "@copilot-improvement/shared";

import { saveCodeChange } from "./saveCodeChange";
import type { CodeTrackedArtifactChange } from "../watchers/artifactWatcher";

const BASE_CHANGE = {
  uri: "file:///src/core.ts",
  languageId: "typescript",
  version: 1
};

function buildCodeChange(
  overrides: Partial<Omit<CodeTrackedArtifactChange, "category">> = {}
): CodeTrackedArtifactChange {
  return {
    uri: BASE_CHANGE.uri,
    layer: "code",
    category: "code",
    change: BASE_CHANGE,
    previousArtifact: undefined,
    nextArtifact: undefined,
    hints: [],
    content: "export const value = 1;\n",
    contentLength: 24,
    ...overrides
  };
}

describe("saveCodeChange", () => {
  it("records change events using the canonical artifact id", () => {
    const inferredArtifact: KnowledgeArtifact = {
      id: "inference-artifact",
      uri: BASE_CHANGE.uri,
      layer: "code",
      language: "typescript",
      owner: undefined,
      lastSynchronizedAt: undefined,
      hash: undefined,
      metadata: undefined
    };

    const canonicalArtifact: KnowledgeArtifact = {
      ...inferredArtifact,
      id: "canonical-artifact"
    };

    const upsertArtifact = vi.fn().mockImplementation((artifact: KnowledgeArtifact) => {
      expect(artifact).toEqual(inferredArtifact);
      return canonicalArtifact;
    });
    const recordChangeEvent = vi.fn();

    const graphStore = {
      upsertArtifact,
      recordChangeEvent
    } as unknown as GraphStore;

    const change = buildCodeChange({
      previousArtifact: {
        id: "previous-artifact",
        uri: BASE_CHANGE.uri,
        layer: "code",
        language: "typescript",
        owner: undefined,
        lastSynchronizedAt: undefined,
        hash: undefined,
        metadata: undefined
      },
      nextArtifact: inferredArtifact
    });

    const persisted = saveCodeChange({ graphStore, change });

    expect(upsertArtifact).toHaveBeenCalledTimes(1);
    const [[artifact]] = upsertArtifact.mock.calls as Array<[KnowledgeArtifact]>;
    expect(artifact.id).toBe("inference-artifact");

    expect(recordChangeEvent).toHaveBeenCalledTimes(1);
    const [[changeEvent]] = recordChangeEvent.mock.calls as Array<[ChangeEvent]>;
    expect(changeEvent).toMatchObject({ artifactId: "canonical-artifact", summary: "Implementation updated" });

    expect(persisted.artifact).toEqual(canonicalArtifact);
    expect(persisted.changeEventId).toBeTruthy();
  });
});
