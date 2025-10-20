import { describe, expect, it, vi } from "vitest";

import type { ChangeEvent, GraphStore, KnowledgeArtifact } from "@copilot-improvement/shared";

import type { QueuedChange } from "./changeQueue";
import { saveDocumentChange } from "./saveDocumentChange";
import type { DocumentTrackedArtifactChange } from "../watchers/artifactWatcher";

const BASE_CHANGE: QueuedChange = {
  uri: "file:///docs/spec.md",
  languageId: "markdown",
  version: 1
};

function buildDocumentChange(
  overrides: Partial<Omit<DocumentTrackedArtifactChange, "category">> = {}
): DocumentTrackedArtifactChange {
  const change: DocumentTrackedArtifactChange = {
    uri: BASE_CHANGE.uri,
    layer: "requirements",
    category: "document",
    change: BASE_CHANGE,
    previousArtifact: undefined,
    nextArtifact: undefined,
    hints: [],
    content: "# Spec",
    contentLength: 6,
    ...overrides
  };

  return change;
}

describe("saveDocumentChange", () => {
  it("persists the next artifact when inference provided", () => {
    const nextArtifact: KnowledgeArtifact = {
      id: "doc-artifact",
      uri: BASE_CHANGE.uri,
      layer: "requirements",
      language: "markdown",
      owner: undefined,
      lastSynchronizedAt: undefined,
      hash: undefined,
      metadata: undefined
    };

    const upsertArtifact = vi.fn();
    const recordChangeEvent = vi.fn();

    const graphStore = {
      upsertArtifact,
      recordChangeEvent
    } as unknown as GraphStore;

    const change = buildDocumentChange({
      previousArtifact: {
        id: "previous",
        uri: BASE_CHANGE.uri,
        layer: "requirements",
        language: "markdown",
        owner: undefined,
        lastSynchronizedAt: undefined,
        hash: undefined,
        metadata: undefined
      },
      nextArtifact
    });

    const persisted = saveDocumentChange({ graphStore, change });

    expect(upsertArtifact).toHaveBeenCalledWith(nextArtifact);
    expect(recordChangeEvent).toHaveBeenCalledTimes(1);
    const [[changeEvent]] = recordChangeEvent.mock.calls as Array<[ChangeEvent]>;
    expect(changeEvent).toMatchObject({
      artifactId: nextArtifact.id,
      summary: "Documentation updated"
    });
    expect(persisted.artifact).toEqual(nextArtifact);
  });

  it("falls back to the previous artifact when inference is unavailable", () => {
    const previousArtifact: KnowledgeArtifact = {
      id: "previous-artifact",
      uri: BASE_CHANGE.uri,
      layer: "requirements",
      language: "markdown",
      owner: undefined,
      lastSynchronizedAt: undefined,
      hash: undefined,
      metadata: undefined
    };

    const upsertArtifact = vi.fn();
    const recordChangeEvent = vi.fn();

    const graphStore = {
      upsertArtifact,
      recordChangeEvent
    } as unknown as GraphStore;

    const change = buildDocumentChange({ previousArtifact, nextArtifact: undefined });

    const persisted = saveDocumentChange({ graphStore, change });

    expect(upsertArtifact).toHaveBeenCalledWith(previousArtifact);
    const [[changeEvent]] = recordChangeEvent.mock.calls as Array<[ChangeEvent]>;
    expect(changeEvent.artifactId).toBe(previousArtifact.id);
    expect(persisted.artifact).toEqual(previousArtifact);
  });

  it("creates a placeholder artifact when none exist", () => {
    const upsertArtifact = vi.fn();
    const recordChangeEvent = vi.fn();

    const graphStore = {
      upsertArtifact,
      recordChangeEvent
    } as unknown as GraphStore;

    const change = buildDocumentChange({
      previousArtifact: undefined,
      nextArtifact: undefined,
      change: { ...BASE_CHANGE, languageId: "markdown" }
    });

    const persisted = saveDocumentChange({ graphStore, change });

    expect(upsertArtifact).toHaveBeenCalledTimes(1);
    const [[artifact]] = upsertArtifact.mock.calls as Array<[KnowledgeArtifact]>;
    expect(artifact.id).toBeTruthy();
    expect(artifact.uri).toBe(BASE_CHANGE.uri);
    expect(artifact.language).toBe("markdown");

    const [[changeEvent]] = recordChangeEvent.mock.calls as Array<[ChangeEvent]>;
    expect(changeEvent.artifactId).toBe(artifact.id);
    expect(persisted.artifact.id).toBe(artifact.id);
  });
});
