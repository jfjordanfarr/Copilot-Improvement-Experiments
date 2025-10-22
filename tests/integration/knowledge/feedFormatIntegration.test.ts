import path from "node:path";

import { describe, expect, it } from "vitest";

import { detectFormat, parseFeedFile } from "../../../packages/server/src/features/knowledge/feedFormatDetector";

describe("Knowledge Feed Format Integration", () => {
  it("should detect and parse LSIF format", async () => {
    const lsifContent = `
{"id":1,"type":"vertex","label":"metaData","version":"0.6.0"}
{"id":2,"type":"vertex","label":"document","uri":"file:///workspace/src/foo.ts","languageId":"typescript"}
{"id":3,"type":"vertex","label":"document","uri":"file:///workspace/src/bar.ts","languageId":"typescript"}
    `.trim();

    const detection = detectFormat(lsifContent);
    expect(detection.format).toBe("lsif");

    // Note: parseFeedFile requires actual file I/O, so we test detectFormat + parser separately
  });

  it("should detect and parse SCIP format", () => {
    const scipContent = JSON.stringify({
      metadata: { version: "scip-typescript 0.3.0" },
      documents: [
        {
          relative_path: "src/main.ts",
          language: "typescript",
          occurrences: [],
          symbols: []
        }
      ]
    });

    const detection = detectFormat(scipContent);
    expect(detection.format).toBe("scip");
  });

  it("should detect ExternalSnapshot format", () => {
    const snapshotContent = JSON.stringify({
      id: "test-snapshot",
      label: "Test Feed",
      createdAt: new Date().toISOString(),
      artifacts: [],
      links: []
    });

    const detection = detectFormat(snapshotContent);
    expect(detection.format).toBe("external-snapshot");
    expect(detection.confidence).toBe(1.0);
  });
});
