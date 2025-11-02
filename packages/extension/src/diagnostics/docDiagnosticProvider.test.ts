import { describe, expect, it, vi } from "vitest";

vi.mock("vscode", () => ({
  workspace: {
    asRelativePath: vi.fn((value: unknown) => String(value))
  },
  Uri: {
    parse: (value: string) => ({ toString: () => value, fsPath: value })
  }
}));

import {
  buildOpenActionTitle,
  buildRippleSummary,
  formatConfidenceLabel
} from "./docDiagnosticProvider";

describe("buildOpenActionTitle", () => {
  it("returns explicit titles for known relationships", () => {
    expect(buildOpenActionTitle("depends_on")).toBe("Open linked dependency");
    expect(buildOpenActionTitle("documents")).toBe("Open linked documentation");
    expect(buildOpenActionTitle("implements")).toBe("Open linked implementation");
    expect(buildOpenActionTitle("references")).toBe("Open linked reference");
    expect(buildOpenActionTitle("includes")).toBe("Open included file");
  });

  it("falls back to the default title for unknown kinds", () => {
    expect(buildOpenActionTitle(undefined)).toBe("Open linked artifact");
    expect(buildOpenActionTitle("custom"))
      .toBe("Open linked artifact");
  });
});

describe("formatConfidenceLabel", () => {
  it("returns percentages for numeric confidence values", () => {
    expect(formatConfidenceLabel(0.86)).toBe("86%");
    expect(formatConfidenceLabel(0.123)).toBe("12%");
  });

  it("returns 'unknown' for non-finite values", () => {
    expect(formatConfidenceLabel(Number.NaN)).toBe("unknown");
    expect(formatConfidenceLabel(Number.POSITIVE_INFINITY)).toBe("unknown");
  });
});

describe("buildRippleSummary", () => {
  const format = (uri: string) => uri.replace("file:///repo/", "");

  it("summarises relationship, depth, confidence, and path", () => {
    const summary = buildRippleSummary(
      {
        relationshipKind: "depends_on",
        depth: 2,
        confidence: 0.9,
        path: [
          "file:///repo/src/a.ts",
          "file:///repo/src/b.ts",
          "file:///repo/src/c.ts"
        ]
      },
      format
    );

    expect(summary).toContain("relationship depends_on");
    expect(summary).toContain("depth 2");
    expect(summary).toContain("confidence 90%");
    expect(summary).toContain("path src/a.ts → src/b.ts");
  });

  it("returns fallback label when metadata is missing", () => {
    const summary = buildRippleSummary({}, format);
    expect(summary).toBe("No ripple metadata available");
  });
});
