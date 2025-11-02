import { describe, expect, it } from "vitest";

import {
  FallbackLLMBridge,
  inferFallbackGraph,
  LLMRelationshipRequest,
  LLMRelationshipSuggestion
} from "./fallbackInference";

class FakeBridge implements FallbackLLMBridge {
  constructor(private readonly suggestions: LLMRelationshipSuggestion[]) {}

  label = "test-llm";

  suggest(_request: LLMRelationshipRequest): Promise<LLMRelationshipSuggestion[]> {
    return Promise.resolve(this.suggestions);
  }
}

describe("fallback inference", () => {
  it("creates a documents link when markdown references an implementation artifact", async () => {
    const result = await inferFallbackGraph({
      seeds: [
        {
          uri: "file:///repo/docs/vision.md",
          layer: "vision",
          content: "Implements [Calculator](../src/calculator.ts)."
        },
        {
          uri: "file:///repo/src/calculator.ts",
          layer: "code",
          content:
            "export const add = (a: number, b: number) => a + b;" +
            "\n// business logic"
        }
      ]
    });

    expect(result.artifacts).toHaveLength(2);
    expect(result.links).toHaveLength(1);

    const [link] = result.links;
    const document = result.artifacts.find((artifact) => artifact.uri.endsWith("vision.md"));
    const implementation = result.artifacts.find((artifact) => artifact.uri.endsWith("calculator.ts"));

    expect(link.sourceId).toBe(document?.id);
    expect(link.targetId).toBe(implementation?.id);
    expect(link.kind).toBe("documents");

    expect(result.traces).toHaveLength(1);
    expect(result.traces[0].origin).toBe("heuristic");
    expect(result.traces[0].rationale).toContain("markdown link");
  });

  it("merges LLM suggestions and keeps the strongest confidence", async () => {
    const llm = new FakeBridge([
      {
        targetUri: "file:///repo/docs/api.md",
        kind: "references",
        confidence: 0.85,
        rationale: "LLM indicates related documentation"
      }
    ]);

    const result = await inferFallbackGraph(
      {
        seeds: [
          {
            uri: "file:///repo/docs/design.md",
            layer: "architecture",
            content: "Consider cross-linking important APIs. This document provides comprehensive architectural guidance for the system's REST interface design patterns."
          },
          {
            uri: "file:///repo/docs/api.md",
            layer: "requirements",
            content: "REST API surface definition"
          }
        ]
      },
      { llm }
    );

    expect(result.links).toHaveLength(1);
    const [link] = result.links;

    expect(link.createdBy).toBe("test-llm");
    expect(link.confidence).toBeCloseTo(0.85, 2);
    expect(result.traces[0].origin).toBe("llm");
    expect(result.traces[0].rationale).toContain("LLM");
  });

  it("detects re-exports and .js specifiers in TypeScript modules", async () => {
    const result = await inferFallbackGraph({
      seeds: [
        {
          uri: "file:///repo/src/index.ts",
          layer: "code",
          content:
            "export {helper} from './helper.js';\n" +
            "export type {HelperShape} from './helper.js';\n" +
            "import {util} from './util.js';\n" +
            "console.log(util);\n"
        },
        {
          uri: "file:///repo/src/helper.ts",
          layer: "code",
          content:
            "export const helper = () => 'helper';\n" +
            "export type HelperShape = {value: string};\n"
        },
        {
          uri: "file:///repo/src/util.ts",
          layer: "code",
          content: "export const util = () => 'util';\n"
        }
      ]
    });

    const indexArtifact = result.artifacts.find((artifact) => artifact.uri.endsWith("index.ts"));
    const helperArtifact = result.artifacts.find((artifact) => artifact.uri.endsWith("helper.ts"));
    const utilArtifact = result.artifacts.find((artifact) => artifact.uri.endsWith("util.ts"));

    expect(indexArtifact).toBeDefined();
    expect(helperArtifact).toBeDefined();
    expect(utilArtifact).toBeDefined();

    const hasEdge = (target: typeof helperArtifact | typeof utilArtifact) =>
      result.links.some((link) => link.sourceId === indexArtifact?.id && link.targetId === target?.id);

    expect(hasEdge(helperArtifact)).toBe(true);
    expect(hasEdge(utilArtifact)).toBe(true);
  });

  it("ignores module references that only appear inside comments", async () => {
    const result = await inferFallbackGraph({
      seeds: [
        {
          uri: "file:///repo/src/example.ts",
          layer: "code",
          content: [
            "// export {Foo} from './foo.js';",
            "/**",
            " * Usage example",
            " * ```",
            " * import bar from 'bar';",
            " * ```",
            " */",
            "export const value = 1;\n"
          ].join("\n")
        },
        {
          uri: "file:///repo/src/foo.ts",
          layer: "code",
          content: "export const foo = 1;\n"
        },
        {
          uri: "file:///repo/src/bar.ts",
          layer: "code",
          content: "export const bar = 1;\n"
        }
      ]
    });

    const exampleArtifact = result.artifacts.find((artifact) => artifact.uri.endsWith("example.ts"));
    const fooArtifact = result.artifacts.find((artifact) => artifact.uri.endsWith("foo.ts"));
    const barArtifact = result.artifacts.find((artifact) => artifact.uri.endsWith("bar.ts"));

    expect(exampleArtifact).toBeDefined();
    expect(fooArtifact).toBeDefined();
    expect(barArtifact).toBeDefined();

    const hasLinkTo = (targetId: string | undefined) =>
      result.links.some((link) => link.sourceId === exampleArtifact?.id && link.targetId === targetId);

    expect(hasLinkTo(fooArtifact?.id)).toBe(false);
    expect(hasLinkTo(barArtifact?.id)).toBe(false);
  });

  it("detects local includes in C sources", async () => {
    const result = await inferFallbackGraph({
      seeds: [
        {
          uri: "file:///repo/src/main.c",
          layer: "code",
          content: [
            "#include \"util.h\"",
            "#include <stdio.h>",
            "int main(void) {",
            "  return add(1, 2);",
            "}\n"
          ].join("\n")
        },
        {
          uri: "file:///repo/src/util.h",
          layer: "code",
          content: "int add(int left, int right);\n"
        },
        {
          uri: "file:///repo/src/util.c",
          layer: "code",
          content: [
            "#include \"util.h\"",
            "int add(int left, int right) {",
            "  return left + right;",
            "}\n"
          ].join("\n")
        }
      ]
    });

    const mainArtifact = result.artifacts.find(artifact => artifact.uri.endsWith("main.c"));
    const headerArtifact = result.artifacts.find(artifact => artifact.uri.endsWith("util.h"));

    expect(mainArtifact).toBeDefined();
    expect(headerArtifact).toBeDefined();

    const includeEdge = result.links.find(
      link => link.sourceId === mainArtifact?.id && link.targetId === headerArtifact?.id && link.kind === "includes"
    );

    expect(includeEdge).toBeDefined();

    const systemIncludeEdge = result.links.find(
      link => link.kind === "includes" && link.targetId !== headerArtifact?.id
    );

    expect(systemIncludeEdge).toBeUndefined();
  });
});
