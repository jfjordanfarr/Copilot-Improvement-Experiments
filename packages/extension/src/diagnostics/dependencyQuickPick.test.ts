import { describe, expect, it, vi } from "vitest";

vi.mock("vscode", () => {
  class Uri {
    constructor(private readonly value: string) {}

    toString(): string {
      return this.value;
    }

    static parse(value: string): Uri {
      return new Uri(value);
    }
  }

  const commands = {
    registerCommand: vi.fn(),
    executeCommand: vi.fn()
  };

  const workspace = {
    asRelativePath: vi.fn((uri: Uri) => uri.toString().replace(/^file:\/\//, "")),
    openTextDocument: vi.fn(() =>
      Promise.resolve({ uri: Uri.parse("file:///mock"), languageId: "typescript" })
    ),
    activeTextEditor: undefined as
      | { document: { uri: Uri } }
      | undefined
  };

  const window = {
    showInformationMessage: vi.fn(() => Promise.resolve(undefined)),
    showErrorMessage: vi.fn(() => Promise.resolve(undefined)),
    showQuickPick: vi.fn(() => Promise.resolve(undefined)),
    showTextDocument: vi.fn(() => Promise.resolve(undefined)),
    activeTextEditor: undefined as
      | { document: { uri: Uri } }
      | undefined
  };

  return {
    Uri,
    commands,
    workspace,
    window
  };
});

import {
  InspectDependenciesResultValidator,
  describeEdgePath,
  type ParsedEdge
} from "./dependencyQuickPick";

describe("describeEdgePath", () => {
  const format = (uri: string): string => uri.replace("file:///repo/", "");

  it("returns undefined for direct dependencies", () => {
    const edge: ParsedEdge = {
      dependent: { id: "b", uri: "file:///repo/src/b.ts", layer: "code" },
      viaLinkId: "edge-1",
      viaKind: "depends_on",
      depth: 1,
      path: [{ id: "b", uri: "file:///repo/src/b.ts", layer: "code" }]
    };

    expect(describeEdgePath(edge, format)).toBeUndefined();
  });

  it("returns formatted path for transitive dependencies", () => {
    const edge: ParsedEdge = {
      dependent: { id: "c", uri: "file:///repo/src/c.ts", layer: "code" },
      viaLinkId: "edge-2",
      viaKind: "depends_on",
      depth: 2,
      path: [
        { id: "b", uri: "file:///repo/src/b.ts", layer: "code" },
        { id: "c", uri: "file:///repo/src/c.ts", layer: "code" }
      ]
    };

    expect(describeEdgePath(edge, format)).toBe("via src/b.ts");
  });
});

describe("InspectDependenciesResultValidator", () => {
  it("accepts a well-formed response", () => {
    const payload = {
      trigger: { id: "a", uri: "file:///repo/src/a.ts", layer: "code" },
      edges: [
        {
          dependent: { id: "b", uri: "file:///repo/src/b.ts", layer: "code" },
          viaLinkId: "edge-1",
          viaKind: "depends_on",
          depth: 1,
          path: [{ id: "b", uri: "file:///repo/src/b.ts", layer: "code" }]
        }
      ],
      summary: { totalDependents: 1, maxDepthReached: 1 }
    };

    expect(() => InspectDependenciesResultValidator.parse(payload)).not.toThrow();
  });

  it("rejects responses with invalid edges", () => {
    const invalidPayload = {
      trigger: { id: "a", uri: "file:///repo/src/a.ts", layer: "code" },
      edges: [
        {
          dependent: { id: "b", uri: "file:///repo/src/b.ts", layer: "code" },
          viaLinkId: "edge-1",
          viaKind: "unsupported",
          depth: -1,
          path: []
        }
      ],
      summary: { totalDependents: -2, maxDepthReached: -1 }
    };

    expect(() => InspectDependenciesResultValidator.parse(invalidPayload)).toThrow();
  });
});
