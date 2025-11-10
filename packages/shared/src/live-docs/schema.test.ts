import { describe, expect, it } from "vitest";

import { DEFAULT_LIVE_DOC_LAYER, normalizeLiveDocMetadata } from "./schema";

describe("normalizeLiveDocMetadata", () => {
  it("normalizes paths, identifiers, and provenance", () => {
    const metadata = normalizeLiveDocMetadata({
      sourcePath: " packages\\shared\\src\\example.ts ",
      liveDocId: "  LD-implementation-packages-shared-src-example-ts  ",
      generatedAt: " 2025-11-08T12:34:56.000Z ",
      layer: undefined,
      archetype: "implementation",
      provenance: {
        generators: [
          {
            tool: " live-docs-generator ",
            generatedAt: " 2025-11-08T12:34:56.000Z ",
            version: " 0.1.0 "
          },
          {
            tool: "",
            generatedAt: "2025-11-08T12:34:56.000Z"
          }
        ],
        docstrings: {
          status: "in-sync",
          lastComparedAt: " 2025-11-08T12:00:00.000Z ",
          waivedReason: "  "
        }
      },
      enrichers: {
        churn: 5
      }
    });

    expect(metadata.layer).toBe(DEFAULT_LIVE_DOC_LAYER);
    expect(metadata.sourcePath).toBe("packages/shared/src/example.ts");
    expect(metadata.liveDocId).toBe("LD-implementation-packages-shared-src-example-ts");
    expect(metadata.generatedAt).toBe("2025-11-08T12:34:56.000Z");
    expect(metadata.provenance?.generators).toHaveLength(1);
    expect(metadata.provenance?.generators?.[0]).toEqual({
      tool: "live-docs-generator",
      generatedAt: "2025-11-08T12:34:56.000Z",
      version: "0.1.0"
    });
    expect(metadata.provenance?.docstrings).toEqual({
      status: "in-sync",
      lastComparedAt: "2025-11-08T12:00:00.000Z"
    });
    expect(metadata.enrichers).toEqual({ churn: 5 });
  });

  it("throws when the source path is empty", () => {
    expect(() =>
      normalizeLiveDocMetadata({
        sourcePath: "   ",
        liveDocId: "LD-test"
      })
    ).toThrow(/requires a non-empty sourcePath/);
  });
});
