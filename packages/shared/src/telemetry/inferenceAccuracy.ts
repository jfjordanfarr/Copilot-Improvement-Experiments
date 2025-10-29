import { normalizeFileUri } from "../uri/normalizeFileUri";

export type InferenceOutcome = "truePositive" | "falsePositive" | "falseNegative";

export interface RecordOutcomeOptions {
  benchmarkId: string;
  outcome: InferenceOutcome;
  artifactUri?: string;
  edgeId?: string;
  relation?: string;
  weight?: number;
  at?: number;
}

export interface InferenceAccuracyTrackerOptions {
  maxSamples?: number;
  now?: () => number;
  logger?: {
    warn(message: string): void;
  };
}

export interface AccuracySample {
  benchmarkId: string;
  outcome: InferenceOutcome;
  artifactUri?: string;
  edgeId?: string;
  relation?: string;
  weight: number;
  recordedAtIso: string;
}

export interface AccuracyTotals {
  totalEvaluated: number;
  truePositives: number;
  falsePositives: number;
  falseNegatives: number;
  precision: number | null;
  recall: number | null;
  f1Score: number | null;
}

export interface BenchmarkAccuracySummary extends AccuracyTotals {
  benchmarkId: string;
}

export interface InferenceAccuracySummary {
  totals: AccuracyTotals;
  benchmarks: BenchmarkAccuracySummary[];
  samples: AccuracySample[];
}

type BenchmarkKey = string;

interface MutableTotals {
  totalEvaluated: number;
  truePositives: number;
  falsePositives: number;
  falseNegatives: number;
}

const DEFAULT_MAX_SAMPLES = 200;

export class InferenceAccuracyTracker {
  private readonly now: () => number;
  private readonly logger?: InferenceAccuracyTrackerOptions["logger"];
  private readonly maxSamples: number;

  private readonly benchmarkTotals = new Map<BenchmarkKey, MutableTotals>();
  private readonly samples: AccuracySample[] = [];

  constructor(options: InferenceAccuracyTrackerOptions = {}) {
    this.maxSamples = Math.max(1, options.maxSamples ?? DEFAULT_MAX_SAMPLES);
    this.now = options.now ?? (() => Date.now());
    this.logger = options.logger;
  }

  recordOutcome(options: RecordOutcomeOptions): void {
    if (!options.benchmarkId) {
      throw new Error("benchmarkId is required");
    }

    const weight = typeof options.weight === "number" && Number.isFinite(options.weight) ? options.weight : 1;

    const canonicalArtifact = options.artifactUri ? normalizeFileUri(options.artifactUri) : undefined;

    const totals = this.getOrCreateTotals(options.benchmarkId);
    totals.totalEvaluated += weight;

    switch (options.outcome) {
      case "truePositive": {
        totals.truePositives += weight;
        break;
      }
      case "falsePositive": {
        totals.falsePositives += weight;
        break;
      }
      case "falseNegative": {
        totals.falseNegatives += weight;
        break;
      }
      default: {
        const exhaustive: never = options.outcome;
        if (this.logger) {
          this.logger.warn(`[inference-accuracy] Unrecognised outcome ${(exhaustive as string) ?? "unknown"}`);
        }
        return;
      }
    }

    const recordedAt = typeof options.at === "number" ? options.at : this.now();
    this.samples.push({
      benchmarkId: options.benchmarkId,
      outcome: options.outcome,
      artifactUri: canonicalArtifact,
      edgeId: options.edgeId,
      relation: options.relation,
      weight,
      recordedAtIso: new Date(recordedAt).toISOString()
    });

    if (this.samples.length > this.maxSamples) {
      this.samples.splice(0, this.samples.length - this.maxSamples);
    }
  }

  snapshot(options: { reset?: boolean; maxSamples?: number } = {}): InferenceAccuracySummary {
    const summaries: BenchmarkAccuracySummary[] = [];
    let grandTotals: MutableTotals | null = null;

    for (const [benchmarkId, totals] of this.benchmarkTotals.entries()) {
      grandTotals = mergeTotals(grandTotals, totals);
      summaries.push({
        benchmarkId,
        ...calculateRatios(totals)
      });
    }

    const aggregate = grandTotals ?? createEmptyTotals();

    const limitedSamples = options.maxSamples
      ? this.samples.slice(Math.max(0, this.samples.length - options.maxSamples))
      : [...this.samples];

    const snapshot: InferenceAccuracySummary = {
      totals: calculateRatios(aggregate),
      benchmarks: summaries.sort((left, right) => left.benchmarkId.localeCompare(right.benchmarkId)),
      samples: limitedSamples
    };

    if (options.reset) {
      this.reset();
    }

    return snapshot;
  }

  reset(): void {
    this.benchmarkTotals.clear();
    this.samples.length = 0;
  }

  private getOrCreateTotals(benchmarkId: BenchmarkKey): MutableTotals {
    let totals = this.benchmarkTotals.get(benchmarkId);
    if (!totals) {
      totals = createEmptyTotals();
      this.benchmarkTotals.set(benchmarkId, totals);
    }
    return totals;
  }
}

function createEmptyTotals(): MutableTotals {
  return {
    totalEvaluated: 0,
    truePositives: 0,
    falsePositives: 0,
    falseNegatives: 0
  };
}

function mergeTotals(current: MutableTotals | null, additional: MutableTotals): MutableTotals {
  if (!current) {
    return { ...additional };
  }
  current.totalEvaluated += additional.totalEvaluated;
  current.truePositives += additional.truePositives;
  current.falsePositives += additional.falsePositives;
  current.falseNegatives += additional.falseNegatives;
  return current;
}

function calculateRatios(totals: MutableTotals): AccuracyTotals {
  const precisionDenominator = totals.truePositives + totals.falsePositives;
  const recallDenominator = totals.truePositives + totals.falseNegatives;
  const precision = precisionDenominator > 0 ? totals.truePositives / precisionDenominator : null;
  const recall = recallDenominator > 0 ? totals.truePositives / recallDenominator : null;
  const f1Score = precision !== null && recall !== null && precision + recall > 0
    ? (2 * precision * recall) / (precision + recall)
    : null;

  return {
    totalEvaluated: totals.totalEvaluated,
    truePositives: totals.truePositives,
    falsePositives: totals.falsePositives,
    falseNegatives: totals.falseNegatives,
    precision,
    recall,
    f1Score
  };
}
