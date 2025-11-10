import path from "node:path";
import { describe, expect, it } from "vitest";

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
      `${sourceRelativePath}.mdmd.md`
    );
    const docDir = path.dirname(docAbsolute);

    const analysis = {
      symbols: [
        {
          name: "DependencyGraphEdge",
          kind: "interface",
          location: { line: 16, character: 1 },
          documentation: "Represents a dependency edge."
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
    expect(lines).toContain("- Summary: Represents a dependency edge.");

    const dependencyHeadingIndex = lines.indexOf("#### `INSPECT_DEPENDENCIES_REQUEST`");
    expect(dependencyHeadingIndex).toBeGreaterThan(0);
    expect(lines[dependencyHeadingIndex - 1]).toBe("");
    expect(lines[dependencyHeadingIndex + 1]).toBe("- Type: const");
    expect(lines[dependencyHeadingIndex + 2]).toBe(
      "- Source: [source](../../../../../../packages/shared/src/contracts/dependencies.ts#L3)"
    );
    expect(lines[lines.length - 1]).not.toBe("");
  });
});
