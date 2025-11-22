import { describe, expect, it, beforeEach, afterEach } from "vitest";

import {
  GraphStore,
  type KnowledgeArtifact,
  type LinkRelationship,
  type SymbolNeighborGroup
} from "@live-documentation/shared";

import { inspectSymbolNeighbors } from "./symbolNeighbors";

function createArtifact(id: string, uri: string, layer: KnowledgeArtifact["layer"] = "code"): KnowledgeArtifact {
  return {
    id,
    uri,
    layer,
    language: "typescript",
    owner: "test-suite",
    hash: `hash-${id}`,
    lastSynchronizedAt: new Date(0).toISOString(),
    metadata: {}
  };
}

function createLink(
  id: string,
  sourceId: string,
  targetId: string,
  kind: LinkRelationship["kind"],
  confidence: number
): LinkRelationship {
  return {
    id,
    sourceId,
    targetId,
    kind,
    confidence,
    createdAt: new Date(0).toISOString(),
    createdBy: "test"
  };
}

describe("inspectSymbolNeighbors", () => {
  let store: GraphStore;

  beforeEach(() => {
    store = new GraphStore({ dbPath: ":memory:" });
  });

  afterEach(() => {
    store.close();
  });

  it("groups neighbors by link kind and orders within groups by confidence", () => {
    const origin = createArtifact("origin", "file:///repo/src/origin.ts");
    const depHigh = createArtifact("dep-high", "file:///repo/src/depHigh.ts");
    const depLow = createArtifact("dep-low", "file:///repo/src/depLow.ts");
    const doc = createArtifact("doc", "file:///repo/docs/spec.md", "architecture");

    store.upsertArtifact(origin);
    store.upsertArtifact(depHigh);
    store.upsertArtifact(depLow);
    store.upsertArtifact(doc);

    store.upsertLink(createLink("l1", origin.id, depHigh.id, "depends_on", 0.92));
    store.upsertLink(createLink("l2", origin.id, depLow.id, "depends_on", 0.51));
    store.upsertLink(createLink("l3", doc.id, origin.id, "documents", 0.77));

    const result = inspectSymbolNeighbors({ graphStore: store, artifactId: origin.id, maxDepth: 1 });

    expect(result.origin?.id).toBe(origin.id);
    expect(result.summary).toEqual({ totalNeighbors: 3, maxDepthReached: 1 });
    expect(result.groups).toHaveLength(2);

    const dependsGroup = result.groups.find((group: SymbolNeighborGroup) => group.kind === "depends_on");
    expect(dependsGroup).toBeDefined();
    expect(dependsGroup?.neighbors.map(neighbor => neighbor.artifact.id)).toEqual([
      depHigh.id,
      depLow.id
    ]);
    expect(dependsGroup?.neighbors[0].confidence).toBeCloseTo(0.92, 2);
    expect(dependsGroup?.neighbors[1].confidence).toBeCloseTo(0.51, 2);

    const documentsGroup = result.groups.find((group: SymbolNeighborGroup) => group.kind === "documents");
    expect(documentsGroup).toBeDefined();
    expect(documentsGroup?.neighbors).toHaveLength(1);
    const docNeighbor = documentsGroup?.neighbors[0];
    expect(docNeighbor?.direction).toBe("incoming");
    expect(docNeighbor?.artifact.id).toBe(doc.id);
    expect(docNeighbor?.path.artifacts.map(artifact => artifact.id)).toEqual([
      origin.id,
      doc.id
    ]);
  });

  it("respects hop limits when traversing the graph", () => {
    const origin = createArtifact("origin", "file:///repo/src/origin.ts");
    const first = createArtifact("first", "file:///repo/src/first.ts");
    const second = createArtifact("second", "file:///repo/src/second.ts");

    store.upsertArtifact(origin);
    store.upsertArtifact(first);
    store.upsertArtifact(second);

    store.upsertLink(createLink("l1", origin.id, first.id, "depends_on", 0.9));
    store.upsertLink(createLink("l2", first.id, second.id, "depends_on", 0.8));

    const shallow = inspectSymbolNeighbors({ graphStore: store, artifactId: origin.id, maxDepth: 1 });
    expect(shallow.summary).toEqual({ totalNeighbors: 1, maxDepthReached: 1 });
    expect(shallow.groups.flatMap((group: SymbolNeighborGroup) => group.neighbors.map(n => n.artifact.id))).toEqual([
      first.id
    ]);

    const deep = inspectSymbolNeighbors({ graphStore: store, artifactId: origin.id, maxDepth: 2 });
    expect(deep.summary).toEqual({ totalNeighbors: 2, maxDepthReached: 2 });
    expect(new Set(deep.groups.flatMap((group: SymbolNeighborGroup) => group.neighbors.map(n => n.artifact.id)))).toEqual(
      new Set([first.id, second.id])
    );
  });

  it("filters by relationship kind when provided", () => {
    const origin = createArtifact("origin", "file:///repo/src/origin.ts");
    const impl = createArtifact("impl", "file:///repo/src/impl.ts");
    const doc = createArtifact("doc", "file:///repo/docs/spec.md", "architecture");

    store.upsertArtifact(origin);
    store.upsertArtifact(impl);
    store.upsertArtifact(doc);

    store.upsertLink(createLink("l1", impl.id, origin.id, "implements", 0.8));
    store.upsertLink(createLink("l2", doc.id, origin.id, "documents", 0.7));

    const result = inspectSymbolNeighbors({
      graphStore: store,
      artifactId: origin.id,
      maxDepth: 1,
      linkKinds: ["documents"]
    });

    expect(result.summary).toEqual({ totalNeighbors: 1, maxDepthReached: 1 });
    expect(result.groups).toHaveLength(1);
    expect(result.groups[0].kind).toBe("documents");
    expect(result.groups[0].neighbors[0].artifact.id).toBe(doc.id);
  });

  it("resolves artifacts by URI when the identifier is unknown", () => {
    const origin = createArtifact("origin", "file:///repo/src/origin.ts");
    const peer = createArtifact("peer", "file:///repo/src/peer.ts");

    store.upsertArtifact(origin);
    store.upsertArtifact(peer);

    store.upsertLink(createLink("link", origin.id, peer.id, "depends_on", 0.66));

    const result = inspectSymbolNeighbors({
      graphStore: store,
      artifactUri: "file:///repo/src/origin.ts"
    });

    expect(result.origin?.id).toBe(origin.id);
    expect(result.summary.totalNeighbors).toBe(1);
  const group = result.groups.find((group: SymbolNeighborGroup) => group.kind === "depends_on");
    expect(group?.neighbors).toHaveLength(1);
    expect(group?.neighbors[0].artifact.id).toBe(peer.id);
  });
});
