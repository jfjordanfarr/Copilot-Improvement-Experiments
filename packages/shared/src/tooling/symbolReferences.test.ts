import { describe, expect, it } from "vitest";

import { findSymbolReferenceAnomalies } from "./symbolReferences";

describe("findSymbolReferenceAnomalies", () => {
  it("returns an empty list until symbol linting is implemented", () => {
    const issues = findSymbolReferenceAnomalies({ workspaceRoot: "." });
    expect(issues).toEqual([]);
  });
});
