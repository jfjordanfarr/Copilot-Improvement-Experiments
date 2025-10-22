import { describe, expect, it } from "vitest";

import { detectFormat } from "./feedFormatDetector";

describe("feedFormatDetector", () => {
  describe("detectFormat", () => {
    it("should detect LSIF format from newline-delimited JSON", () => {
      const lsifContent = `
{"id":1,"type":"vertex","label":"metaData","version":"0.6.0"}
{"id":2,"type":"vertex","label":"document","uri":"file:///test.ts"}
      `.trim();

      const result = detectFormat(lsifContent);

      expect(result.format).toBe("lsif");
      expect(result.confidence).toBe(0.95);
    });

    it("should detect SCIP format from JSON with metadata.version and documents", () => {
      const scipContent = JSON.stringify({
        metadata: {
          version: "scip-typescript 0.3.0"
        },
        documents: [
          {
            relative_path: "src/test.ts",
            occurrences: []
          }
        ]
      });

      const result = detectFormat(scipContent);

      expect(result.format).toBe("scip");
      expect(result.confidence).toBe(0.95);
    });

    it("should detect ExternalSnapshot format from JSON with label/artifacts/links", () => {
      const snapshotContent = JSON.stringify({
        id: "test-snapshot",
        label: "Test Snapshot",
        createdAt: "2025-10-22T10:00:00Z",
        artifacts: [
          {
            id: "artifact-1",
            uri: "file:///test.ts",
            layer: "code"
          }
        ],
        links: []
      });

      const result = detectFormat(snapshotContent);

      expect(result.format).toBe("external-snapshot");
      expect(result.confidence).toBe(1.0);
    });

    it("should return unknown for unrecognized format", () => {
      const unknownContent = JSON.stringify({
        someField: "someValue",
        anotherField: 123
      });

      const result = detectFormat(unknownContent);

      expect(result.format).toBe("unknown");
      expect(result.confidence).toBe(0.0);
    });

    it("should return unknown for invalid JSON", () => {
      const invalidContent = "This is not JSON at all";

      const result = detectFormat(invalidContent);

      expect(result.format).toBe("unknown");
      expect(result.confidence).toBe(0.0);
    });

    it("should not detect LSIF if first line is not valid JSON", () => {
      const notLsifContent = `
not json
{"id":1,"type":"vertex"}
      `.trim();

      const result = detectFormat(notLsifContent);

      expect(result.format).not.toBe("lsif");
    });

    it("should detect SCIP even without documents array populated", () => {
      const scipContent = JSON.stringify({
        metadata: {
          version: "1.0.0"
        },
        documents: []
      });

      const result = detectFormat(scipContent);

      expect(result.format).toBe("scip");
      expect(result.confidence).toBe(0.95);
    });

    it("should detect ExternalSnapshot even with empty arrays", () => {
      const snapshotContent = JSON.stringify({
        label: "Empty Snapshot",
        artifacts: [],
        links: []
      });

      const result = detectFormat(snapshotContent);

      expect(result.format).toBe("external-snapshot");
      expect(result.confidence).toBe(1.0);
    });

    it("should prioritize ExternalSnapshot detection over SCIP when both patterns match", () => {
      // Edge case: a document that has both label+artifacts+links AND metadata+documents
      const ambiguousContent = JSON.stringify({
        label: "Test",
        artifacts: [],
        links: [],
        metadata: { version: "1.0" },
        documents: []
      });

      const result = detectFormat(ambiguousContent);

      // ExternalSnapshot check comes last, should take precedence
      expect(result.format).toBe("external-snapshot");
    });
  });
});
