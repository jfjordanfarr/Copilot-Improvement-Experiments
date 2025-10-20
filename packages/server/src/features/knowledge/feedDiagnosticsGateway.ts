import { KnowledgeFeedSummary } from "@copilot-improvement/shared";

export type FeedHealthStatus = "healthy" | "degraded" | "blocked";

export interface FeedStatusSummary {
  feedId: string;
  status: FeedHealthStatus;
  observedAt: string;
  message?: string;
  details?: Record<string, unknown>;
  snapshot?: KnowledgeFeedSummary;
}

export interface FeedDiagnosticsGatewayOptions {
  logger?: {
    info(message: string): void;
    warn(message: string): void;
    error(message: string): void;
  };
  onStatusChanged?: (summary: FeedStatusSummary) => void;
}

export class FeedDiagnosticsGateway {
  private readonly statuses = new Map<string, FeedStatusSummary>();

  constructor(private readonly options: FeedDiagnosticsGatewayOptions = {}) {}

  updateStatus(
    feedId: string,
    status: FeedHealthStatus,
    message?: string,
    details?: Record<string, unknown>,
    snapshot?: KnowledgeFeedSummary
  ): FeedStatusSummary {
    const summary: FeedStatusSummary = {
      feedId,
      status,
      message,
      details,
      snapshot,
      observedAt: new Date().toISOString()
    };

    this.statuses.set(feedId, summary);

    const logger = this.options.logger;
    const formatted = formatStatus(summary);

    if (status === "healthy") {
      logger?.info?.(formatted);
    } else if (status === "blocked") {
      logger?.error?.(formatted);
    } else {
      logger?.warn?.(formatted);
    }

    this.options.onStatusChanged?.(summary);

    return summary;
  }

  getStatus(feedId: string): FeedStatusSummary | undefined {
    return this.statuses.get(feedId);
  }

  listStatuses(): FeedStatusSummary[] {
    return Array.from(this.statuses.values());
  }
}

function formatStatus(summary: FeedStatusSummary): string {
  const parts = [`[feed:${summary.feedId}] status=${summary.status}`];
  if (summary.message) {
    parts.push(`message=${summary.message}`);
  }
  if (summary.snapshot?.label) {
    parts.push(`snapshot=${summary.snapshot.label}`);
  }
  return `[knowledge-feed] ${parts.join("; ")}`;
}
