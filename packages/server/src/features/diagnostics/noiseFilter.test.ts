import { describe, expect, it } from "vitest";

import { applyNoiseFilter, ZERO_NOISE_FILTER_TOTALS, type NoiseFilterTotals } from "./noiseFilter";
import type { RippleImpact } from "./rippleTypes";
import type { NoiseFilterRuntimeConfig } from "../settings/settingsBridge";

interface TestContext {
  id: string;
  rippleImpacts: RippleImpact[];
}

const TARGET_A = {
  id: "artifact-a",
  uri: "file:///a.ts",
  layer: "code" as const
};

const TARGET_B = {
  id: "artifact-b",
  uri: "file:///b.ts",
  layer: "code" as const
};

interface ImpactOverrides {
  confidence?: number;
  depth?: number;
  path?: string[];
  target?: RippleImpact["target"];
}

function makeImpact(overrides: ImpactOverrides = {}): RippleImpact {
  const target = overrides.target ?? TARGET_A;
  return {
    target,
    hint: {
      sourceUri: "file:///source.ts",
      targetUri: target.uri,
      kind: "depends_on",
      confidence: overrides.confidence,
      depth: overrides.depth,
      path: overrides.path ?? [target.uri]
    }
  };
}

describe("applyNoiseFilter", () => {
  it("filters impacts below the confidence threshold", () => {
    const contexts: TestContext[] = [
      {
        id: "ctx",
        rippleImpacts: [
          makeImpact({ confidence: 0.2 }),
          makeImpact({ confidence: 0.65, target: TARGET_B }),
          makeImpact({ confidence: undefined })
        ]
      }
    ];

    const config: NoiseFilterRuntimeConfig = {
      minConfidence: 0.6
    };

    const result = applyNoiseFilter(contexts, config);
    expect(result.contexts[0].rippleImpacts).toHaveLength(1);
    const confidences = result.contexts[0].rippleImpacts.map(impact => impact.hint.confidence);
    expect(confidences).toEqual([0.65]);
    expect(result.totals).toEqual<NoiseFilterTotals>({
      ...ZERO_NOISE_FILTER_TOTALS,
      byConfidence: 2
    });
  });

  it("enforces maximum depth", () => {
    const contexts: TestContext[] = [
      {
        id: "ctx",
        rippleImpacts: [
          makeImpact({ depth: 1 }),
          makeImpact({ depth: 4, target: TARGET_B })
        ]
      }
    ];

    const config: NoiseFilterRuntimeConfig = {
      minConfidence: 0.1,
      maxDepth: 2
    };

    const result = applyNoiseFilter(contexts, config);
    expect(result.contexts[0].rippleImpacts).toHaveLength(1);
    expect(result.totals).toEqual<NoiseFilterTotals>({
      ...ZERO_NOISE_FILTER_TOTALS,
      byDepth: 1
    });
  });

  it("caps diagnostics per change", () => {
    const contexts: TestContext[] = [
      {
        id: "ctx",
        rippleImpacts: [
          makeImpact({ target: TARGET_A }),
          makeImpact({ target: TARGET_B }),
          makeImpact({ target: { id: "artifact-c", uri: "file:///c.ts", layer: "code" as const } })
        ]
      }
    ];

    const config: NoiseFilterRuntimeConfig = {
      minConfidence: 0,
      maxPerChange: 2
    };

    const result = applyNoiseFilter(contexts, config);
    expect(result.contexts[0].rippleImpacts).toHaveLength(2);
    expect(result.totals).toEqual<NoiseFilterTotals>({
      ...ZERO_NOISE_FILTER_TOTALS,
      byChangeLimit: 1
    });
  });

  it("caps diagnostics per artifact", () => {
    const contexts: TestContext[] = [
      {
        id: "ctx",
        rippleImpacts: [
          makeImpact({ target: TARGET_A }),
          makeImpact({ target: TARGET_A }),
          makeImpact({ target: TARGET_B })
        ]
      }
    ];

    const config: NoiseFilterRuntimeConfig = {
      minConfidence: 0,
      maxPerArtifact: 1
    };

    const result = applyNoiseFilter(contexts, config);
    expect(result.contexts[0].rippleImpacts).toHaveLength(2);
    const targetIds = result.contexts[0].rippleImpacts.map(impact => impact.target.id);
    expect(targetIds).toEqual(["artifact-a", "artifact-b"]);
    expect(result.totals).toEqual<NoiseFilterTotals>({
      ...ZERO_NOISE_FILTER_TOTALS,
      byTargetLimit: 1
    });
  });
});
