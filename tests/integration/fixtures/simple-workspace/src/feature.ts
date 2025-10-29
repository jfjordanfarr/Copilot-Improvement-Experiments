import { normalizeValue, summarizeShape } from "./util";

export interface FeatureEvaluation {
  ok: boolean;
  normalized: unknown;
  summary: string;
}

export function evaluateFeature(input: unknown): FeatureEvaluation {
  const normalized = normalizeValue(input);

  return {
    ok: normalized !== null,
    normalized,
    summary: summarizeShape(normalized)
  };
}

export function executeFeature(input: unknown): string {
  const evaluation = evaluateFeature(input);
  return evaluation.ok ? `ok:${evaluation.summary}` : "invalid";
}
