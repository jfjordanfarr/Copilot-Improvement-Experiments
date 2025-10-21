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
// feature touched 1761061230047
// burst edit 0
// burst edit 1
// burst edit 2
// feature touched 1761061378324
// burst edit 0
// burst edit 1
// burst edit 2
// feature touched 1761062971187
// burst edit 0
// burst edit 1
// burst edit 2
// feature touched 1761063142298
// burst edit 0
// burst edit 1
// burst edit 2
// feature touched 1761063300473
// burst edit 0
// burst edit 1
// burst edit 2
// feature touched 1761063443237
// burst edit 0
// burst edit 1
// burst edit 2
// feature touched 1761063842903
// burst edit 0
// burst edit 1
// burst edit 2
// feature touched 1761064215723
// burst edit 0
// burst edit 1
// burst edit 2
// feature touched 1761064715102
// burst edit 0
// burst edit 1
// burst edit 2
// feature touched 1761064829121
// burst edit 0
// burst edit 1
// burst edit 2
// feature touched 1761065761439
// burst edit 0
// burst edit 1
// burst edit 2