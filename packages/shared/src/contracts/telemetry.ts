export const LATENCY_SUMMARY_REQUEST = "linkDiagnostics/telemetry/latencySummary";

export type LatencyChangeKind = "document" | "code";

export interface LatencySample {
  changeEventId: string;
  changeType: LatencyChangeKind;
  diagnosticsEmitted: number;
  queuedAt: string;
  persistedAt: string;
  publishedAt: string;
  durationMs: number;
}

export interface LatencySummary {
  totalChanges: number;
  completedChanges: number;
  inFlightChanges: number;
  queuedChanges: number;
  diagnosticsEmitted: number;
  averageLatencyMs: number | null;
  maxLatencyMs: number | null;
  p95LatencyMs: number | null;
  thresholdMs: number;
  byType: Record<LatencyChangeKind, {
    total: number;
    completed: number;
    averageLatencyMs: number | null;
    maxLatencyMs: number | null;
  }>;
  recentSamples: LatencySample[];
}

export interface LatencySummaryRequest {
  reset?: boolean;
  maxSamples?: number;
}

export interface LatencySummaryResponse {
  summary: LatencySummary;
}
