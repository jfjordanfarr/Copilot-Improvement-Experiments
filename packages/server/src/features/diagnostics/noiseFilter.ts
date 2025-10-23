import type { RippleImpact } from "./rippleTypes";
import type { NoiseFilterRuntimeConfig } from "../settings/settingsBridge";

export interface NoiseFilterTotals {
  byConfidence: number;
  byDepth: number;
  byTargetLimit: number;
  byChangeLimit: number;
}

export const ZERO_NOISE_FILTER_TOTALS: NoiseFilterTotals = {
  byConfidence: 0,
  byDepth: 0,
  byTargetLimit: 0,
  byChangeLimit: 0
};

interface HasRippleImpacts {
  rippleImpacts: RippleImpact[];
}

const CONFIDENCE_FALLBACK = 0.5;

function resolveConfidence(value: number | undefined): number {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return CONFIDENCE_FALLBACK;
  }
  if (value < 0) {
    return 0;
  }
  if (value > 1) {
    return 1;
  }
  return value;
}

function resolveTargetKey(impact: RippleImpact): string {
  return (
    impact.target.id ??
    impact.target.uri ??
    impact.hint.targetUri ??
    `${impact.hint.path?.join("->") ?? "__unknown__"}`
  );
}

export interface NoiseFilterResult<T extends HasRippleImpacts> {
  contexts: T[];
  totals: NoiseFilterTotals;
}

export function applyNoiseFilter<T extends HasRippleImpacts>(
  contexts: readonly T[],
  config: NoiseFilterRuntimeConfig
): NoiseFilterResult<T> {
  if (!contexts.length) {
    return { contexts: [], totals: { ...ZERO_NOISE_FILTER_TOTALS } };
  }

  const totals: NoiseFilterTotals = { ...ZERO_NOISE_FILTER_TOTALS };
  const minConfidence = resolveConfidence(config.minConfidence);
  const maxDepth = config.maxDepth ?? Number.POSITIVE_INFINITY;
  const maxPerChange = config.maxPerChange ?? Number.POSITIVE_INFINITY;
  const maxPerArtifact = config.maxPerArtifact ?? Number.POSITIVE_INFINITY;

  const filteredContexts = contexts.map(context => {
    if (!context.rippleImpacts.length) {
      return context;
    }

    const perArtifactCounts = new Map<string, number>();
    const retained: RippleImpact[] = [];
    let acceptedForChange = 0;

    for (const impact of context.rippleImpacts) {
      const confidence = resolveConfidence(impact.hint.confidence);
      if (confidence < minConfidence) {
        totals.byConfidence += 1;
        continue;
      }

      const depth = typeof impact.hint.depth === "number" && !Number.isNaN(impact.hint.depth)
        ? impact.hint.depth
        : 1;
      if (depth > maxDepth) {
        totals.byDepth += 1;
        continue;
      }

      if (acceptedForChange >= maxPerChange) {
        totals.byChangeLimit += 1;
        continue;
      }

      const targetKey = resolveTargetKey(impact);
      const existingForTarget = perArtifactCounts.get(targetKey) ?? 0;
      if (existingForTarget >= maxPerArtifact) {
        totals.byTargetLimit += 1;
        continue;
      }

      retained.push(impact);
      perArtifactCounts.set(targetKey, existingForTarget + 1);
      acceptedForChange += 1;
    }

    if (retained.length === context.rippleImpacts.length) {
      return context;
    }

    return {
      ...context,
      rippleImpacts: retained
    } as T;
  });

  return { contexts: filteredContexts, totals };
}
