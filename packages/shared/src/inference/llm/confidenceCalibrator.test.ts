import { describe, expect, it } from "vitest";

import { calibrateConfidence } from "./confidenceCalibrator";

describe("calibrateConfidence", () => {
  it("promotes labelled tiers to numeric confidence", () => {
    const results = calibrateConfidence([
      { sourceId: "a", targetId: "b", relationship: "depends_on", confidenceLabel: "high" },
      { sourceId: "a", targetId: "c", relationship: "depends_on", confidenceLabel: "medium" },
      { sourceId: "a", targetId: "d", relationship: "depends_on", confidenceLabel: "low" }
    ]);

    expect(results.map(result => result.confidenceTier)).toEqual(["high", "medium", "low"]);
    expect(results[0].calibratedConfidence).toBeCloseTo(0.9, 6);
    expect(results[1].calibratedConfidence).toBeCloseTo(0.6, 6);
    expect(results[2].calibratedConfidence).toBeCloseTo(0.3, 6);
  });

  it("derives tiers from numeric confidence", () => {
    const results = calibrateConfidence([
      { sourceId: "a", targetId: "b", relationship: "depends_on", confidence: 0.95 },
      { sourceId: "a", targetId: "c", relationship: "depends_on", confidence: 0.6 },
      { sourceId: "a", targetId: "d", relationship: "depends_on", confidence: 0.2 }
    ]);

    expect(results.map(result => result.confidenceTier)).toEqual(["high", "medium", "low"]);
    expect(results[0].diagnosticsEligible).toBe(true);
    expect(results[1].diagnosticsEligible).toBe(false);
    expect(results[2].diagnosticsEligible).toBe(false);
  });

  it("marks corroborated medium links as eligible", () => {
    const results = calibrateConfidence(
      [
        { sourceId: "a", targetId: "c", relationship: "depends_on", confidence: 0.55 }
      ],
      {
        corroboratedLinks: new Set(["a::c::depends_on"])
      }
    );

    expect(results[0].confidenceTier).toBe("medium");
    expect(results[0].diagnosticsEligible).toBe(true);
  });
});
