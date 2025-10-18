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
});
