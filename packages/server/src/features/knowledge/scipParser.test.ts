import { describe, expect, it } from "vitest";

import type { SCIPIndex } from "@live-documentation/shared";

import { parseSCIP } from "./scipParser";

describe("scipParser", () => {
  const projectRoot = "/test/workspace";
  const feedId = "test-scip-feed";

  describe("parseSCIP", () => {
    it("should parse basic SCIP documents", () => {
      const scipIndex: SCIPIndex = {
        metadata: {
          version: "scip-typescript 0.3.0",
          toolInfo: {
            name: "scip-typescript",
            version: "0.3.0"
          }
        },
        documents: [
          {
            relative_path: "src/main.ts",
            language: "typescript",
            occurrences: [],
            symbols: []
          }
        ]
      };

      const snapshot = parseSCIP(scipIndex, { projectRoot, feedId });

      expect(snapshot.id).toMatch(/^scip-\d+$/);
      expect(snapshot.label).toBe(feedId);
      expect(snapshot.artifacts).toHaveLength(1);
      expect(snapshot.artifacts[0]).toMatchObject({
        id: "scip:src/main.ts",
        layer: "code",
        language: "typescript"
      });
      expect(snapshot.artifacts[0].uri).toMatch(/file:\/\/.*main\.ts$/);
    });

    it("should extract cross-document references", () => {
      const scipIndex: SCIPIndex = {
        metadata: { version: "1.0.0" },
        documents: [
          {
            relative_path: "src/foo.ts",
            occurrences: [
              {
                range: [0, 10, 15],
                symbol: "local foo 1234/FooClass#",
                symbol_roles: 1 // Definition
              }
            ],
            symbols: []
          },
          {
            relative_path: "src/bar.ts",
            occurrences: [
              {
                range: [5, 2, 7],
                symbol: "local foo 1234/FooClass#",
                symbol_roles: 0 // Reference (no definition bit)
              }
            ],
            symbols: []
          }
        ]
      };

      const snapshot = parseSCIP(scipIndex, { projectRoot, feedId });

      expect(snapshot.artifacts).toHaveLength(2);
      expect(snapshot.links).toHaveLength(1);

      const link = snapshot.links[0];
      expect(link.sourceId).toBe("scip:src/bar.ts");
      expect(link.targetId).toBe("scip:src/foo.ts");
      expect(link.kind).toBe("references");
      expect(link.metadata?.symbol).toBe("local foo 1234/FooClass#");
    });

    it("should distinguish write access as depends_on", () => {
      const scipIndex: SCIPIndex = {
        metadata: { version: "1.0.0" },
        documents: [
          {
            relative_path: "src/foo.ts",
            occurrences: [
              {
                symbol: "local variable x",
                symbol_roles: 1 // Definition
              }
            ],
            symbols: []
          },
          {
            relative_path: "src/bar.ts",
            occurrences: [
              {
                symbol: "local variable x",
                symbol_roles: 4 // Write access
              }
            ],
            symbols: []
          }
        ]
      };

      const snapshot = parseSCIP(scipIndex, { projectRoot, feedId });

      expect(snapshot.links).toHaveLength(1);
      expect(snapshot.links[0].kind).toBe("depends_on");
    });

    it("should infer language from file extension when not provided", () => {
      const scipIndex: SCIPIndex = {
        metadata: { version: "1.0.0" },
        documents: [
          { relative_path: "src/test.ts", occurrences: [], symbols: [] },
          { relative_path: "src/test.js", occurrences: [], symbols: [] },
          { relative_path: "src/test.py", occurrences: [], symbols: [] }
        ]
      };

      const snapshot = parseSCIP(scipIndex, { projectRoot, feedId });

      expect(snapshot.artifacts[0].language).toBe("typescript");
      expect(snapshot.artifacts[1].language).toBe("javascript");
      expect(snapshot.artifacts[2].language).toBe("python");
    });

    it("should prefer explicit language over inferred", () => {
      const scipIndex: SCIPIndex = {
        metadata: { version: "1.0.0" },
        documents: [
          {
            relative_path: "src/test.ts",
            language: "javascriptreact",
            occurrences: [],
            symbols: []
          }
        ]
      };

      const snapshot = parseSCIP(scipIndex, { projectRoot, feedId });

      expect(snapshot.artifacts[0].language).toBe("javascriptreact");
    });

    it("should handle empty SCIP index", () => {
      const scipIndex: SCIPIndex = {
        metadata: { version: "1.0.0" },
        documents: []
      };

      const snapshot = parseSCIP(scipIndex, { projectRoot, feedId });

      expect(snapshot.artifacts).toHaveLength(0);
      expect(snapshot.links).toHaveLength(0);
    });

    it("should skip same-document references", () => {
      const scipIndex: SCIPIndex = {
        metadata: { version: "1.0.0" },
        documents: [
          {
            relative_path: "src/foo.ts",
            occurrences: [
              {
                symbol: "local foo 1234/FooClass#",
                symbol_roles: 1 // Definition
              },
              {
                symbol: "local foo 1234/FooClass#",
                symbol_roles: 0 // Reference
              }
            ],
            symbols: []
          }
        ]
      };

      const snapshot = parseSCIP(scipIndex, { projectRoot, feedId });

      expect(snapshot.artifacts).toHaveLength(1);
      expect(snapshot.links).toHaveLength(0); // Same document, no link
    });

    it("should include metadata in artifacts", () => {
      const scipIndex: SCIPIndex = {
        metadata: { version: "1.0.0" },
        documents: [
          {
            relative_path: "src/test.ts",
            language: "typescript",
            occurrences: [],
            symbols: []
          }
        ]
      };

      const snapshot = parseSCIP(scipIndex, { projectRoot, feedId, confidence: 0.85 });

      expect(snapshot.artifacts[0].metadata).toMatchObject({
        source: "scip",
        feedId,
        relativePath: "src/test.ts",
        originalLanguage: "typescript",
        confidence: 0.85
      });
    });

    it("should use default confidence when not specified", () => {
      const scipIndex: SCIPIndex = {
        metadata: { version: "1.0.0" },
        documents: [
          { relative_path: "src/test.ts", occurrences: [], symbols: [] }
        ]
      };

      const snapshot = parseSCIP(scipIndex, { projectRoot, feedId });

      expect(snapshot.artifacts[0].metadata?.confidence).toBe(0.95);
    });

    it("should include snapshot metadata", () => {
      const scipIndex: SCIPIndex = {
        metadata: { version: "1.0.0" },
        documents: []
      };

      const snapshot = parseSCIP(scipIndex, { projectRoot, feedId });

      expect(snapshot.metadata).toMatchObject({
        source: "scip",
        feedId
      });
      expect(snapshot.createdAt).toMatch(/^\d{4}-\d{2}-\d{2}T/);
    });

    it("should normalize relative paths to URIs", () => {
      const scipIndex: SCIPIndex = {
        metadata: { version: "1.0.0" },
        documents: [
          { relative_path: "src/nested/deep/file.ts", occurrences: [], symbols: [] }
        ]
      };

      const snapshot = parseSCIP(scipIndex, { projectRoot: "/workspace/root", feedId });

      expect(snapshot.artifacts[0].uri).toMatch(/^file:\/\/\//);
      expect(snapshot.artifacts[0].uri).toContain("nested/deep/file.ts");
    });
  });
});
