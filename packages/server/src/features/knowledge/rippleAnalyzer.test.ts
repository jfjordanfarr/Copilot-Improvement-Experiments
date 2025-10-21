import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { GraphStore, type KnowledgeArtifact } from "@copilot-improvement/shared";

import { RippleAnalyzer } from "./rippleAnalyzer";

const TEST_TIMESTAMP = "2025-01-01T00:00:00.000Z";

function toUri(filePath: string): string {
  return pathToFileURL(filePath).toString();
}

describe("RippleAnalyzer", () => {
  let tempDir: string;
  let graphStore: GraphStore;

  beforeEach(() => {
    tempDir = mkdtempSync(path.join(tmpdir(), "ripple-analyzer-"));
    graphStore = new GraphStore({ dbPath: path.join(tempDir, "graph.db") });
  });

  afterEach(() => {
    graphStore.close();
    rmSync(tempDir, { recursive: true, force: true });
  });

  it("returns direct ripple hints for neighboring artifacts", () => {
    const rootUri = toUri(path.join(tempDir, "src", "root.ts"));
    const dependentUri = toUri(path.join(tempDir, "src", "dependent.ts"));

    upsertArtifact(graphStore, {
      id: "root",
      uri: rootUri,
      layer: "code"
    });

    upsertArtifact(graphStore, {
      id: "dependent",
      uri: dependentUri,
      layer: "code"
    });

    graphStore.upsertLink({
      id: "link-dependent-root",
      sourceId: "dependent",
      targetId: "root",
      kind: "depends_on",
      confidence: 0.95,
      createdAt: TEST_TIMESTAMP,
      createdBy: "test"
    });

    const analyzer = new RippleAnalyzer({ graphStore });
    const rootArtifact = graphStore.getArtifactByUri(rootUri);
    expect(rootArtifact).not.toBeNull();

    const hints = analyzer.generateHintsForArtifact(rootArtifact!);
    const dependentHint = hints.find(hint => hint.targetUri === dependentUri);

    expect(dependentHint).toBeDefined();
    expect(dependentHint?.kind).toBe("depends_on");
    expect(dependentHint?.confidence).toBeCloseTo(0.9, 5);
    expect(dependentHint?.rationale).toContain("depth=1");
  });

  it("produces multi-hop hints with reduced confidence", () => {
    const rootUri = toUri(path.join(tempDir, "src", "root.ts"));
    const midUri = toUri(path.join(tempDir, "src", "mid.ts"));
    const leafUri = toUri(path.join(tempDir, "src", "leaf.ts"));

    upsertArtifact(graphStore, { id: "root", uri: rootUri, layer: "code" });
    upsertArtifact(graphStore, { id: "mid", uri: midUri, layer: "code" });
    upsertArtifact(graphStore, { id: "leaf", uri: leafUri, layer: "code" });

    graphStore.upsertLink({
      id: "link-mid-root",
      sourceId: "mid",
      targetId: "root",
      kind: "depends_on",
      confidence: 0.95,
      createdAt: TEST_TIMESTAMP,
      createdBy: "test"
    });

    graphStore.upsertLink({
      id: "link-leaf-mid",
      sourceId: "leaf",
      targetId: "mid",
      kind: "depends_on",
      confidence: 0.95,
      createdAt: TEST_TIMESTAMP,
      createdBy: "test"
    });

    const analyzer = new RippleAnalyzer({ graphStore });
    const rootArtifact = graphStore.getArtifactByUri(rootUri);
    expect(rootArtifact).not.toBeNull();

    const hints = analyzer.generateHintsForArtifact(rootArtifact!);

    const midHint = hints.find(hint => hint.targetUri === midUri);
    const leafHint = hints.find(hint => hint.targetUri === leafUri);

    expect(midHint).toBeDefined();
    expect(midHint?.confidence).toBeCloseTo(0.9, 5);

    expect(leafHint).toBeDefined();
    expect(leafHint?.rationale).toContain("depth=2");
    expect(leafHint!.confidence ?? 0).toBeLessThan(midHint!.confidence ?? 1);
  });

  it("honours allowed kind filters", () => {
    const docUri = toUri(path.join(tempDir, "docs", "vision.md"));
    const codeUri = toUri(path.join(tempDir, "src", "impl.ts"));

    upsertArtifact(graphStore, { id: "doc", uri: docUri, layer: "requirements" });
    upsertArtifact(graphStore, { id: "code", uri: codeUri, layer: "code" });

    graphStore.upsertLink({
      id: "link-doc-code",
      sourceId: "doc",
      targetId: "code",
      kind: "documents",
      confidence: 0.8,
      createdAt: TEST_TIMESTAMP,
      createdBy: "test"
    });

    const analyzer = new RippleAnalyzer({ graphStore });
    const docArtifact = graphStore.getArtifactByUri(docUri);
    expect(docArtifact).not.toBeNull();

    const hints = analyzer.generateHintsForArtifact(docArtifact!, {
      allowedKinds: ["documents"]
    });

    expect(hints).toHaveLength(1);
    expect(hints[0]?.targetUri).toBe(codeUri);
    expect(hints[0]?.kind).toBe("documents");
  });
});

function upsertArtifact(
  graphStore: GraphStore,
  artifact: Pick<KnowledgeArtifact, "id" | "uri" | "layer">
): void {
  const language = artifact.layer === "code" ? "typescript" : "markdown";

  graphStore.upsertArtifact({
    id: artifact.id,
    uri: artifact.uri,
    layer: artifact.layer,
    language,
    owner: "test",
    lastSynchronizedAt: TEST_TIMESTAMP,
    hash: undefined,
    metadata: undefined
  });
}
