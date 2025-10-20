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
// feature touched 1760921415023
// burst edit 0
// burst edit 1
// burst edit 2
// feature touched 1760926003252
// burst edit 0
// burst edit 1
// burst edit 2
// feature touched 1760926491414
// burst edit 0
// burst edit 1
// burst edit 2