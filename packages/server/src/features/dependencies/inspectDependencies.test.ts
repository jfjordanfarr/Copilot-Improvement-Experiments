import { describe, expect, it } from "vitest";
import { z } from "zod";

import {
  GraphStore,
  type KnowledgeArtifact,
  type LinkRelationship
} from "@copilot-improvement/shared";

import { inspectDependencies } from "./inspectDependencies";

function createArtifact(id: string, uri: string): KnowledgeArtifact {
  return {
    id,
    uri,
    layer: "code",
    language: "typescript",
    owner: "test-suite",
    hash: `hash-${id}`,
    lastSynchronizedAt: new Date(0).toISOString(),
    metadata: {}
  };
}

function createLink(sourceId: string, targetId: string): LinkRelationship {
  return {
    id: `${sourceId}->${targetId}`,
    sourceId,
    targetId,
    kind: "depends_on",
    confidence: 0.9,
    createdAt: new Date(0).toISOString(),
    createdBy: "test"
  };
}

const ResultSchema = z.object({
  trigger: z
    .object({ id: z.string(), uri: z.string(), layer: z.string() })
    .optional(),
  edges: z.array(
    z.object({
      dependent: z.object({ id: z.string(), uri: z.string(), layer: z.string() }),
      viaLinkId: z.string(),
      viaKind: z.string(),
      depth: z.number(),
      path: z.array(z.object({ id: z.string(), uri: z.string(), layer: z.string() }))
    })
  ),
  summary: z.object({
    totalDependents: z.number(),
    maxDepthReached: z.number()
  })
});

describe("inspectDependencies", () => {
  it("returns dependency edges and summary for known artifacts", () => {
    const store = new GraphStore({ dbPath: ":memory:" });

    const trigger = createArtifact("a", "file:///workspace/src/a.ts");
    const dependent = createArtifact("b", "file:///workspace/src/b.ts");
    const transitive = createArtifact("c", "file:///workspace/src/c.ts");

    store.upsertArtifact(trigger);
    store.upsertArtifact(dependent);
    store.upsertArtifact(transitive);

    store.upsertLink(createLink(dependent.id, trigger.id));
    store.upsertLink(createLink(transitive.id, dependent.id));

    const result = ResultSchema.parse(
      inspectDependencies({ graphStore: store, uri: trigger.uri, maxDepth: 3 })
    );

    expect(result.trigger?.id).toBe(trigger.id);
    expect(result.summary).toEqual(
      expect.objectContaining({ totalDependents: 2, maxDepthReached: 2 })
    );
    expect(result.edges).toHaveLength(2);

    const direct = result.edges.find(edge => edge.dependent.id === dependent.id);
    expect(direct).toBeDefined();
    expect(direct?.depth).toBe(1);

    const transitiveEdge = result.edges.find(edge => edge.dependent.id === transitive.id);
    expect(transitiveEdge).toBeDefined();
    expect(transitiveEdge?.depth).toBe(2);

    store.close();
  });

  it("returns empty summary when the artifact is unknown", () => {
    const store = new GraphStore({ dbPath: ":memory:" });

    const result = ResultSchema.parse(
      inspectDependencies({ graphStore: store, uri: "file:///missing.ts" })
    );

    expect(result.trigger).toBeUndefined();
    expect(result.edges).toEqual([]);
    expect(result.summary).toEqual({ totalDependents: 0, maxDepthReached: 0 });

    store.close();
  });
});
