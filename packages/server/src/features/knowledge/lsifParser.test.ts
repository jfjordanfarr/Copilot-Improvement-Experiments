import { describe, expect, it } from "vitest";

import { parseLSIF } from "./lsifParser";

describe("lsifParser", () => {
  const projectRoot = "/test/workspace";
  const feedId = "test-lsif-feed";

  describe("parseLSIF", () => {
    it("should parse basic LSIF document vertices", () => {
      const lsifContent = `
{"id":1,"type":"vertex","label":"metaData","version":"0.6.0","projectRoot":"file:///workspace"}
{"id":2,"type":"vertex","label":"project"}
{"id":3,"type":"vertex","label":"document","uri":"file:///workspace/src/main.ts","languageId":"typescript"}
      `.trim();

      const snapshot = parseLSIF(lsifContent, { projectRoot, feedId });

      expect(snapshot.id).toMatch(/^lsif-\d+$/);
      expect(snapshot.label).toBe(feedId);
      expect(snapshot.artifacts).toHaveLength(1);
      expect(snapshot.artifacts[0]).toMatchObject({
        id: "lsif:3",
        uri: "file:///workspace/src/main.ts",
        layer: "code",
        language: "typescript"
      });
      expect(snapshot.links).toHaveLength(0);
    });

    it("should extract definition and reference relationships", () => {
      const lsifContent = `
{"id":1,"type":"vertex","label":"metaData","version":"0.6.0"}
{"id":2,"type":"vertex","label":"document","uri":"file:///workspace/src/foo.ts","languageId":"typescript"}
{"id":3,"type":"vertex","label":"document","uri":"file:///workspace/src/bar.ts","languageId":"typescript"}
{"id":4,"type":"vertex","label":"range","start":{"line":0,"character":10},"end":{"line":0,"character":15}}
{"id":5,"type":"vertex","label":"range","start":{"line":5,"character":2},"end":{"line":5,"character":7}}
{"id":6,"type":"vertex","label":"resultSet"}
{"id":7,"type":"vertex","label":"definitionResult"}
{"id":8,"type":"edge","label":"contains","outV":2,"inVs":[4]}
{"id":9,"type":"edge","label":"contains","outV":3,"inVs":[5]}
{"id":10,"type":"edge","label":"next","outV":4,"inV":6}
{"id":11,"type":"edge","label":"next","outV":5,"inV":6}
{"id":12,"type":"edge","label":"textDocument/definition","outV":6,"inV":7}
{"id":13,"type":"edge","label":"item","outV":4,"inV":7,"property":"definitions"}
      `.trim();

      const snapshot = parseLSIF(lsifContent, { projectRoot, feedId });

      expect(snapshot.artifacts).toHaveLength(2);
      expect(snapshot.links).toHaveLength(1);
      
      const link = snapshot.links[0];
      expect(link.sourceId).toBe("lsif:3"); // bar.ts referencing
      expect(link.targetId).toBe("lsif:2"); // foo.ts definition
      expect(link.kind).toBe("references");
    });

    it("should handle empty LSIF content", () => {
      const snapshot = parseLSIF("", { projectRoot, feedId });

      expect(snapshot.artifacts).toHaveLength(0);
      expect(snapshot.links).toHaveLength(0);
    });

    it("should skip malformed lines", () => {
      const lsifContent = `
{"id":1,"type":"vertex","label":"metaData","version":"0.6.0"}
THIS IS NOT JSON
{"id":2,"type":"vertex","label":"document","uri":"file:///workspace/test.ts","languageId":"typescript"}
      `.trim();

      const snapshot = parseLSIF(lsifContent, { projectRoot, feedId });

      expect(snapshot.artifacts).toHaveLength(1);
      expect(snapshot.artifacts[0].id).toBe("lsif:2");
    });

    it("should normalize URIs relative to project root", () => {
      const lsifContent = `
{"id":1,"type":"vertex","label":"document","uri":"src/relative.ts","languageId":"typescript"}
      `.trim();

      const snapshot = parseLSIF(lsifContent, { projectRoot: "/project/root", feedId });

      expect(snapshot.artifacts[0].uri).toMatch(/^file:\/\/\//);
      expect(snapshot.artifacts[0].uri).toContain("relative.ts");
    });

    it("should include metadata in artifacts", () => {
      const lsifContent = `
{"id":1,"type":"vertex","label":"document","uri":"file:///test.ts","languageId":"typescript"}
      `.trim();

      const snapshot = parseLSIF(lsifContent, { projectRoot, feedId, confidence: 0.9 });

      expect(snapshot.artifacts[0].metadata).toMatchObject({
        source: "lsif",
        feedId,
        documentId: "1",
        confidence: 0.9
      });
    });

    it("should use default confidence when not specified", () => {
      const lsifContent = `
{"id":1,"type":"vertex","label":"document","uri":"file:///test.ts","languageId":"typescript"}
      `.trim();

      const snapshot = parseLSIF(lsifContent, { projectRoot, feedId });

      expect(snapshot.artifacts[0].metadata?.confidence).toBe(0.95);
    });

    it("should include snapshot metadata", () => {
      const lsifContent = `
{"id":1,"type":"vertex","label":"document","uri":"file:///test.ts","languageId":"typescript"}
      `.trim();

      const snapshot = parseLSIF(lsifContent, { projectRoot, feedId });

      expect(snapshot.metadata).toMatchObject({
        source: "lsif",
        feedId
      });
      expect(snapshot.createdAt).toMatch(/^\d{4}-\d{2}-\d{2}T/);
    });
  });
});
