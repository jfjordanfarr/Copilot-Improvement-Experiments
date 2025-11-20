import {
	InferenceAccuracyTracker as SharedInferenceAccuracyTracker
} from "@copilot-improvement/shared/telemetry/inferenceAccuracy";
import type {
	AccuracySample as SharedAccuracySample,
	AccuracyTotals as SharedAccuracyTotals,
	BenchmarkAccuracySummary as SharedBenchmarkAccuracySummary,
	InferenceAccuracySummary as SharedInferenceAccuracySummary,
	InferenceAccuracyTrackerOptions as SharedInferenceAccuracyTrackerOptions,
	InferenceOutcome as SharedInferenceOutcome,
	RecordOutcomeOptions as SharedRecordOutcomeOptions
} from "@copilot-improvement/shared/telemetry/inferenceAccuracy";

export type AccuracySample = SharedAccuracySample;
export type AccuracyTotals = SharedAccuracyTotals;
export type BenchmarkAccuracySummary = SharedBenchmarkAccuracySummary;
export type InferenceAccuracySummary = SharedInferenceAccuracySummary;
export type InferenceAccuracyTrackerOptions = SharedInferenceAccuracyTrackerOptions;
export type InferenceOutcome = SharedInferenceOutcome;
export type RecordOutcomeOptions = SharedRecordOutcomeOptions;

export class InferenceAccuracyTracker extends SharedInferenceAccuracyTracker {}