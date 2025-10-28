import { describe, expect, it } from "vitest";

import { LatencyTracker } from "./latencyTracker";

describe("LatencyTracker", () => {
  it("records end-to-end latency for code changes", () => {
    let now = 0;
    const tracker = new LatencyTracker({ now: () => now, thresholdMs: 500, maxSamples: 5 });

    tracker.recordEnqueue("file:///src/index.ts");
    now = 25;
    tracker.registerPersisted({
      changeEventId: "code-1",
      uri: "file:///src/index.ts",
      changeType: "code",
      artifactId: "artifact-1"
    });
    now = 175;
    tracker.complete({ changeEventId: "code-1", diagnosticsEmitted: 2 });

    const summary = tracker.snapshot();
    expect(summary.totalChanges).toBe(1);
    expect(summary.completedChanges).toBe(1);
  expect(summary.averageLatencyMs).toBe(175);
    expect(summary.byType.code.completed).toBe(1);
  expect(summary.byType.code.averageLatencyMs).toBe(175);
    expect(summary.recentSamples).toHaveLength(1);
    expect(summary.recentSamples[0]).toMatchObject({
      changeEventId: "code-1",
      diagnosticsEmitted: 2,
      durationMs: 175
    });
  });

  it("discards queued changes that never persist", () => {
    const tracker = new LatencyTracker();
    tracker.recordEnqueue("file:///docs/guide.md");
    tracker.discardQueuedChange("file:///docs/guide.md");

    const summary = tracker.snapshot();
    expect(summary.queuedChanges).toBe(0);
    expect(summary.completedChanges).toBe(0);
  });

  it("resets internal state when requested", () => {
    const tracker = new LatencyTracker();
    tracker.recordEnqueue("file:///src/a.ts");
    tracker.registerPersisted({
      changeEventId: "change-1",
      uri: "file:///src/a.ts",
      changeType: "code"
    });
    tracker.complete({ changeEventId: "change-1", diagnosticsEmitted: 0 });

    const summary = tracker.snapshot({ reset: true });
    expect(summary.completedChanges).toBe(1);

    const afterReset = tracker.snapshot();
    expect(afterReset.completedChanges).toBe(0);
    expect(afterReset.recentSamples).toHaveLength(0);
  });
});
