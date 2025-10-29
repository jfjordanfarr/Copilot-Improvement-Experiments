import { describe, expect, it } from "vitest";

import { InferenceAccuracyTracker } from "./inferenceAccuracy";

describe("InferenceAccuracyTracker", () => {
  it("computes precision, recall, and F1 for a single benchmark", () => {
    const tracker = new InferenceAccuracyTracker({ now: () => 0, maxSamples: 10 });

    tracker.recordOutcome({ benchmarkId: "ts-basic", outcome: "truePositive", artifactUri: "file:///a.ts" });
    tracker.recordOutcome({ benchmarkId: "ts-basic", outcome: "truePositive", artifactUri: "file:///b.ts" });
    tracker.recordOutcome({ benchmarkId: "ts-basic", outcome: "falsePositive", artifactUri: "file:///c.ts" });
    tracker.recordOutcome({ benchmarkId: "ts-basic", outcome: "falseNegative", artifactUri: "file:///d.ts" });

    const summary = tracker.snapshot();

    expect(summary.benchmarks).toHaveLength(1);
    const benchmark = summary.benchmarks[0];
    expect(benchmark.truePositives).toBe(2);
    expect(benchmark.falsePositives).toBe(1);
    expect(benchmark.falseNegatives).toBe(1);
    expect(benchmark.precision).toBeCloseTo(2 / 3, 5);
    expect(benchmark.recall).toBeCloseTo(2 / 3, 5);
    expect(benchmark.f1Score).toBeCloseTo(2 / 3, 5);

    expect(summary.samples).toHaveLength(4);
    expect(summary.samples[0]).toMatchObject({ artifactUri: "file:///a.ts" });
  });

  it("tracks multiple benchmarks independently and enforces sample limits", () => {
    let now = 0;
    const tracker = new InferenceAccuracyTracker({ now: () => now, maxSamples: 3 });

    tracker.recordOutcome({ benchmarkId: "alpha", outcome: "truePositive", artifactUri: "file:///alpha.ts" });
    now += 10;
    tracker.recordOutcome({ benchmarkId: "beta", outcome: "falsePositive", artifactUri: "file:///beta.ts" });
    now += 10;
    tracker.recordOutcome({ benchmarkId: "alpha", outcome: "falseNegative", artifactUri: "file:///alpha2.ts" });
    now += 10;
    tracker.recordOutcome({ benchmarkId: "beta", outcome: "truePositive", artifactUri: "file:///beta2.ts" });

    const summary = tracker.snapshot();

    expect(summary.benchmarks).toHaveLength(2);
    const alpha = summary.benchmarks.find(entry => entry.benchmarkId === "alpha");
    const beta = summary.benchmarks.find(entry => entry.benchmarkId === "beta");
    expect(alpha).toBeDefined();
    expect(beta).toBeDefined();
    expect(summary.samples).toHaveLength(3);
    expect(summary.samples[0].artifactUri).toBe("file:///beta.ts");

    expect(summary.totals.totalEvaluated).toBe(4);
  });

  it("resets internal state when requested", () => {
    const tracker = new InferenceAccuracyTracker();

    tracker.recordOutcome({ benchmarkId: "gamma", outcome: "truePositive" });

    const beforeReset = tracker.snapshot({ reset: true });
    expect(beforeReset.totals.totalEvaluated).toBe(1);

    const afterReset = tracker.snapshot();
    expect(afterReset.totals.totalEvaluated).toBe(0);
    expect(afterReset.samples).toHaveLength(0);
  });
});
