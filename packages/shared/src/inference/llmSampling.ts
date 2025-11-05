export interface SamplingPromptVariant {
  id: string;
  prompt: string;
  temperature?: number;
  metadata?: Record<string, unknown>;
}

export interface SamplingEdge {
  source: string;
  target: string;
  relation: string;
}

export interface SamplingVote {
  variantId: string;
  edges: SamplingEdge[];
  confidence?: number;
  rationale?: string;
  metadata?: Record<string, unknown>;
}

export interface SamplingRequest {
  sessionId: string;
  variants: SamplingPromptVariant[];
  acceptanceThreshold?: number;
  maxVotes?: number;
  telemetry?: SamplingTelemetryOptions;
  collectVotes?: SamplingVoteCollector;
  metadata?: Record<string, unknown>;
}

export type SamplingVoteCollector = (
  request: SamplingRequest
) => SamplingVote[] | Promise<SamplingVote[]>;

export interface AggregatedVote {
  edge: SamplingEdge;
  support: number;
  averageConfidence: number | null;
}

export interface SamplingEvaluation {
  accepted: AggregatedVote[];
  pending: AggregatedVote[];
  rejected: AggregatedVote[];
}

export interface SamplingResult {
  request: SamplingRequest;
  votes: SamplingVote[];
  evaluation: SamplingEvaluation;
  startedAt: Date;
  completedAt: Date;
}

export interface SamplingTelemetryOptions {
  enabled?: boolean;
  sink?: SamplingTelemetrySink;
}

export interface SamplingTelemetry {
  sessionId: string;
  acceptedEdges: number;
  pendingEdges: number;
  rejectedEdges: number;
  totalVotes: number;
  durationMs: number;
  metadata?: Record<string, unknown>;
}

export type SamplingTelemetrySink = (
  payload: SamplingTelemetry
) => void | Promise<void>;

export function aggregateVotes(votes: SamplingVote[]): AggregatedVote[] {
  const aggregates = new Map<string, {
    edge: SamplingEdge;
    support: number;
    confidenceSum: number;
    confidenceCount: number;
  }>();

  for (const vote of votes) {
    for (const edge of vote.edges) {
      const key = edgeKey(edge);
      const entry = aggregates.get(key) ?? {
        edge,
        support: 0,
        confidenceSum: 0,
        confidenceCount: 0
      };

      entry.support += 1;
      if (typeof vote.confidence === "number") {
        entry.confidenceSum += vote.confidence;
        entry.confidenceCount += 1;
      }

      aggregates.set(key, entry);
    }
  }

  return Array.from(aggregates.values())
    .map(({ edge, support, confidenceCount, confidenceSum }) => ({
      edge,
      support,
      averageConfidence:
        confidenceCount > 0 ? Number(confidenceSum / confidenceCount) : null
    }))
    .sort((left, right) => {
      if (right.support !== left.support) {
        return right.support - left.support;
      }
      if (left.edge.source !== right.edge.source) {
        return left.edge.source.localeCompare(right.edge.source);
      }
      if (left.edge.target !== right.edge.target) {
        return left.edge.target.localeCompare(right.edge.target);
      }
      return left.edge.relation.localeCompare(right.edge.relation);
    });
}

export function scoreSamples(
  votes: SamplingVote[],
  request: SamplingRequest
): SamplingEvaluation {
  const aggregated = aggregateVotes(votes);
  const totalVotes = votes.length > 0 ? votes.length : 1;
  const threshold = request.acceptanceThreshold ?? 0;

  const accepted: AggregatedVote[] = [];
  const pending: AggregatedVote[] = [];

  for (const entry of aggregated) {
    const supportRatio = entry.support / totalVotes;
    if (threshold > 0 && supportRatio >= threshold) {
      accepted.push(entry);
    } else {
      pending.push(entry);
    }
  }

  return {
    accepted,
    pending,
    rejected: []
  };
}

export async function runSamplingSession(
  request: SamplingRequest
): Promise<SamplingResult> {
  const startedAt = new Date();
  const votes = request.collectVotes
    ? await Promise.resolve(request.collectVotes(request))
    : [];

  const evaluation = scoreSamples(votes, request);
  const completedAt = new Date();
  const result: SamplingResult = {
    request,
    votes,
    evaluation,
    startedAt,
    completedAt
  };

  await emitSamplingTelemetry(result).catch(() => {
    // Ignore telemetry sink failures; callers can hook their own logging.
  });

  return result;
}

export async function emitSamplingTelemetry(
  result: SamplingResult
): Promise<void> {
  const telemetry = result.request.telemetry;
  if (!telemetry?.enabled || typeof telemetry.sink !== "function") {
    return;
  }

  const payload: SamplingTelemetry = {
    sessionId: result.request.sessionId,
    acceptedEdges: result.evaluation.accepted.length,
    pendingEdges: result.evaluation.pending.length,
    rejectedEdges: result.evaluation.rejected.length,
    totalVotes: result.votes.length,
    durationMs: result.completedAt.getTime() - result.startedAt.getTime(),
    metadata: result.request.metadata
  };

  await telemetry.sink(payload);
}

function edgeKey(edge: SamplingEdge): string {
  return `${edge.source}->${edge.target}#${edge.relation}`;
}
