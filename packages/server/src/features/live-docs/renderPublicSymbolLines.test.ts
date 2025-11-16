import path from "node:path";
import { describe, expect, it } from "vitest";

import { LIVE_DOCUMENTATION_FILE_EXTENSION } from "@copilot-improvement/shared/config/liveDocumentationConfig";

import { __testUtils } from "./generator";

describe("renderPublicSymbolLines", () => {
  it("renders each symbol as a heading with detail metadata", () => {
    const workspaceRoot = path.resolve("/workspace-root");
    const sourceRelativePath = "packages/shared/src/contracts/dependencies.ts";
    const sourceAbsolute = path.join(workspaceRoot, sourceRelativePath);
    const docAbsolute = path.join(
      workspaceRoot,
      ".live-documentation",
      "source",
      `${sourceRelativePath}${LIVE_DOCUMENTATION_FILE_EXTENSION}`
    );
    const docDir = path.dirname(docAbsolute);

    const analysis = {
      symbols: [
        {
          name: "DependencyGraphEdge",
          kind: "interface",
          location: { line: 16, character: 1 },
          documentation: {
            summary: "Represents a dependency edge.",
            source: "tsdoc"
          }
        },
        {
          name: "INSPECT_DEPENDENCIES_REQUEST",
          kind: "const",
          location: { line: 3, character: 1 }
        }
      ],
      dependencies: []
    };

    const lines = __testUtils.renderPublicSymbolLines({
      analysis,
      docDir,
      sourceAbsolute,
      workspaceRoot,
      sourceRelativePath
    });

    expect(lines).toContain("#### `DependencyGraphEdge`");
    expect(lines).toContain("- Type: interface");
    expect(lines).toContain(
      "- Source: [source](../../../../../../packages/shared/src/contracts/dependencies.ts#L16)"
    );

    const summaryHeadingIndex = lines.indexOf("##### `DependencyGraphEdge` — Summary");
    expect(summaryHeadingIndex).toBeGreaterThan(0);
    expect(lines[summaryHeadingIndex + 1]).toBe("Represents a dependency edge.");

    const dependencyHeadingIndex = lines.indexOf("#### `INSPECT_DEPENDENCIES_REQUEST`");
    expect(dependencyHeadingIndex).toBeGreaterThan(0);
    expect(lines[dependencyHeadingIndex - 1]).toBe("");
    expect(lines[dependencyHeadingIndex + 1]).toBe("- Type: const");
    expect(lines[dependencyHeadingIndex + 2]).toBe(
      "- Source: [source](../../../../../../packages/shared/src/contracts/dependencies.ts#L3)"
    );
    expect(lines).not.toContain("##### `INSPECT_DEPENDENCIES_REQUEST` — Summary");
    expect(lines[lines.length - 1]).not.toBe("");
  });
});
