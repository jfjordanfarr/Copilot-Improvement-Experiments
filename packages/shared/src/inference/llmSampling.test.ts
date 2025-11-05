import { describe, expect, it, vi } from "vitest";

import {
  aggregateVotes,
  emitSamplingTelemetry,
  runSamplingSession,
  scoreSamples,
  type SamplingRequest,
  type SamplingVote
} from "./llmSampling";

describe("llmSampling", () => {
  it("aggregates votes by edge", () => {
    const votes: SamplingVote[] = [
      {
        variantId: "a",
        confidence: 0.9,
        edges: [
          { source: "alpha", target: "beta", relation: "supports" },
          { source: "beta", target: "gamma", relation: "contradicts" }
        ]
      },
      {
        variantId: "b",
        confidence: 0.5,
        edges: [
          { source: "alpha", target: "beta", relation: "supports" }
        ]
      }
    ];

    const result = aggregateVotes(votes);

    expect(result).toHaveLength(2);
    expect(result[0]).toMatchObject({
      edge: { source: "alpha", target: "beta", relation: "supports" },
      support: 2
    });
    expect(result[0].averageConfidence).toBeCloseTo(0.7, 5);
  });

  it("scores samples using the configured threshold", () => {
    const request: SamplingRequest = {
      sessionId: "session-123",
      variants: [],
      acceptanceThreshold: 0.6
    };

    const votes: SamplingVote[] = [
      {
        variantId: "a",
        confidence: 0.8,
        edges: [
          { source: "alpha", target: "beta", relation: "supports" }
        ]
      },
      {
        variantId: "b",
        edges: [
          { source: "alpha", target: "beta", relation: "supports" }
        ]
      }
    ];

    const evaluation = scoreSamples(votes, request);

    expect(evaluation.accepted).toHaveLength(1);
    expect(evaluation.pending).toHaveLength(0);
  });

  it("runs a session using a custom vote collector", async () => {
    const request: SamplingRequest = {
      sessionId: "session-collector",
      variants: [],
      collectVotes: vi.fn().mockResolvedValue([
        {
          variantId: "variant",
          edges: [
            { source: "alpha", target: "beta", relation: "supports" }
          ]
        }
      ])
    };

    const result = await runSamplingSession(request);

    expect(request.collectVotes).toHaveBeenCalledTimes(1);
    expect(result.votes).toHaveLength(1);
    expect(result.evaluation.pending).toHaveLength(1);
  });

  it("emits telemetry when enabled", async () => {
    const sink = vi.fn();
    const request: SamplingRequest = {
      sessionId: "telemetry",
      variants: [],
      telemetry: { enabled: true, sink }
    };

    await emitSamplingTelemetry({
      request,
      votes: [],
      evaluation: { accepted: [], pending: [], rejected: [] },
      startedAt: new Date(0),
      completedAt: new Date(1000)
    });

    expect(sink).toHaveBeenCalledWith(
      expect.objectContaining({
        sessionId: "telemetry",
        durationMs: 1000
      })
    );
  });
});
