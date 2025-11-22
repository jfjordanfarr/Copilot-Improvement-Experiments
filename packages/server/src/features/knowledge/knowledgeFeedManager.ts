import { setTimeout as sleepTimeout } from "node:timers/promises";

import {
  ExternalSnapshot,
  ExternalStreamEvent,
  KnowledgeFeed,
  KnowledgeFeedSnapshotSource
} from "@live-documentation/shared";

import { FeedDiagnosticsGateway, type FeedStatusSummary } from "./feedDiagnosticsGateway";
import {
  KnowledgeGraphIngestor,
  SnapshotIngestResult,
  StreamIngestResult
} from "./knowledgeGraphIngestor";

export interface Disposable {
  dispose(): void;
}

export interface KnowledgeFeedManagerLogger {
  info(message: string): void;
  warn(message: string): void;
  error(message: string): void;
}

export interface FeedSnapshotSource {
  label: string;
  load: () => Promise<ExternalSnapshot | null>;
}

export interface FeedStreamSource {
  label: string;
  iterator: () => AsyncIterable<ExternalStreamEvent> | Promise<AsyncIterable<ExternalStreamEvent>>;
}

export interface FeedConfiguration {
  id: string;
  snapshot?: FeedSnapshotSource;
  stream?: FeedStreamSource;
  metadata?: Record<string, unknown>;
}

export interface BackoffOptions {
  initialMs?: number;
  multiplier?: number;
  maxMs?: number;
}

export interface KnowledgeFeedManagerOptions {
  feeds: FeedConfiguration[];
  ingestor: KnowledgeGraphIngestor;
  diagnostics: FeedDiagnosticsGateway;
  logger?: KnowledgeFeedManagerLogger;
  backoff?: BackoffOptions;
  now?: () => Date;
}

interface FeedState {
  config: FeedConfiguration;
  controller: AbortController;
  worker?: Promise<void>;
  initialized: Deferred<void>;
  lastSnapshot: ExternalSnapshot | null;
  descriptor: KnowledgeFeed | null;
  backoff: ExponentialBackoff;
}

interface Deferred<T> {
  resolve(value: T | PromiseLike<T>): void;
  reject(reason?: unknown): void;
  promise: Promise<T>;
  isSettled: boolean;
}

class ExponentialBackoff {
  private readonly initial: number;
  private readonly multiplier: number;
  private readonly max: number;
  private current = 0;

  constructor(options: BackoffOptions | undefined) {
    this.initial = Math.max(1, options?.initialMs ?? 1000);
    this.multiplier = options?.multiplier ?? 5;
    this.max = Math.max(this.initial, options?.maxMs ?? 120_000);
  }

  next(): number {
    if (this.current === 0) {
      this.current = this.initial;
      return this.current;
    }

    this.current = Math.min(this.max, this.current * this.multiplier);
    return this.current;
  }

  reset(): void {
    this.current = 0;
  }
}

function createDeferred<T>(): Deferred<T> {
  let resolve!: (value: T | PromiseLike<T>) => void;
  let reject!: (reason?: unknown) => void;
  let settled = false;

  const promise = new Promise<T>((res, rej) => {
    resolve = value => {
      if (!settled) {
        settled = true;
        res(value);
      }
    };
    reject = reason => {
      if (!settled) {
        settled = true;
        rej(reason instanceof Error ? reason : new Error(String(reason)));
      }
    };
  });

  return {
    resolve,
    reject,
    promise,
    get isSettled() {
      return settled;
    }
  };
}

function describeError(error: unknown): string {
  if (error instanceof Error && typeof error.message === "string") {
    return error.message;
  }
  return String(error);
}

export class KnowledgeFeedManager {
  private readonly feedStates = new Map<string, FeedState>();
  private readonly healthyFeeds = new Map<string, KnowledgeFeed>();
  private readonly listeners = new Set<(summary: FeedStatusSummary | undefined) => void>();
  private readonly logger?: KnowledgeFeedManagerLogger;
  private readonly now: () => Date;

  private started = false;
  private readonly diagnostics: FeedDiagnosticsGateway;
  private readonly ingestor: KnowledgeGraphIngestor;

  constructor(private readonly options: KnowledgeFeedManagerOptions) {
    this.logger = options.logger;
    this.diagnostics = options.diagnostics;
    this.ingestor = options.ingestor;
    this.now = options.now ?? (() => new Date());
  }

  async start(): Promise<void> {
    if (this.started) {
      return;
    }

    this.started = true;

    for (const config of this.options.feeds) {
      if (this.feedStates.has(config.id)) {
        continue;
      }

      const state: FeedState = {
        config,
        controller: new AbortController(),
        initialized: createDeferred<void>(),
        lastSnapshot: null,
        descriptor: null,
        backoff: new ExponentialBackoff(this.options.backoff)
      };

      this.feedStates.set(config.id, state);
      state.worker = this.runFeed(state);
    }

    await Promise.all(
      Array.from(this.feedStates.values()).map(state => state.initialized.promise.catch(() => undefined))
    );

    this.refreshHealthyFeeds();
  }

  async stop(): Promise<void> {
    if (!this.started) {
      return;
    }

    this.started = false;

    for (const state of this.feedStates.values()) {
      state.controller.abort();
    }

    await Promise.all(
      Array.from(this.feedStates.values()).map(async state => {
        try {
          await state.worker;
        } catch {
          // Intentionally ignore worker errors on shutdown.
        }
      })
    );

    this.feedStates.clear();
    this.healthyFeeds.clear();
    this.notifyListeners(undefined);
  }

  getHealthyFeeds(): KnowledgeFeed[] {
    return Array.from(this.healthyFeeds.values()).map(feed => {
      const snapshot = feed.snapshot
        ? {
            label: feed.snapshot.label,
            loadSnapshot: () => feed.snapshot!.loadSnapshot()
          }
        : undefined;

      return {
        id: feed.id,
        snapshot
      } satisfies KnowledgeFeed;
    });
  }

  onStatusChanged(listener: (summary: FeedStatusSummary | undefined) => void): Disposable {
    this.listeners.add(listener);
    return {
      dispose: () => {
        this.listeners.delete(listener);
      }
    };
  }

  private async runFeed(state: FeedState): Promise<void> {
    const signal = state.controller.signal;
    let firstAttempt = true;

    while (!signal.aborted) {
      try {
        await this.bootstrapFeed(state, signal);
        state.backoff.reset();

        if (!state.config.stream) {
          if (!state.initialized.isSettled) {
            state.initialized.resolve();
          }
          return;
        }

        if (!state.initialized.isSettled) {
          state.initialized.resolve();
        }

        await this.consumeStream(state, signal);
        state.backoff.reset();
      } catch (error) {
        if (!state.initialized.isSettled) {
          state.initialized.resolve();
        }

        if (signal.aborted) {
          return;
        }

        const message = describeError(error);
        this.logger?.error?.(`knowledge-feed[${state.config.id}] error: ${message}`);
        this.diagnostics.updateStatus(state.config.id, "degraded", message);
        this.healthyFeeds.delete(state.config.id);
        this.notifyListeners(this.diagnostics.getStatus(state.config.id));

        const delay = state.backoff.next();
        await this.sleep(delay, signal);
      }

      if (firstAttempt) {
        firstAttempt = false;
      }
    }
  }

  private async bootstrapFeed(state: FeedState, signal: AbortSignal): Promise<void> {
    if (signal.aborted) {
      return;
    }

    if (!state.config.snapshot) {
      // No snapshot configured – mark healthy immediately so downstream consumers can see the feed.
      this.markHealthy(state, null);
      return;
    }

    const snapshot = await state.config.snapshot.load();

    if (!snapshot) {
      throw new Error(`Snapshot loader for ${state.config.id} returned no payload.`);
    }

    const result: SnapshotIngestResult = await this.ingestor.ingestSnapshot(state.config.id, snapshot);
    state.lastSnapshot = result.normalizedSnapshot;
    this.markHealthy(state, state.lastSnapshot);
  }

  private async consumeStream(state: FeedState, signal: AbortSignal): Promise<void> {
    if (!state.config.stream) {
      return;
    }

    const iterable = await state.config.stream.iterator();

    for await (const event of iterable) {
      if (signal.aborted) {
        return;
      }

      const result: StreamIngestResult = await this.ingestor.ingestStreamEvent(state.config.id, event);
      this.diagnostics.updateStatus(state.config.id, "healthy", `Applied stream event ${result.normalizedEvent.sequenceId}`);
      this.healthyFeeds.set(state.config.id, this.buildDescriptor(state));
      this.notifyListeners(this.diagnostics.getStatus(state.config.id));
    }

    if (!signal.aborted) {
      throw new Error(`Stream for feed ${state.config.id} ended unexpectedly.`);
    }
  }

  private markHealthy(state: FeedState, snapshot: ExternalSnapshot | null): void {
    state.lastSnapshot = snapshot;
    this.healthyFeeds.set(state.config.id, this.buildDescriptor(state));
    const message = snapshot ? `Snapshot applied (${snapshot.artifacts.length} artifacts)` : "Feed registered";
    this.diagnostics.updateStatus(state.config.id, "healthy", message);
    this.notifyListeners(this.diagnostics.getStatus(state.config.id));
  }

  private refreshHealthyFeeds(): void {
    for (const state of this.feedStates.values()) {
      if (state.lastSnapshot) {
        this.healthyFeeds.set(state.config.id, this.buildDescriptor(state));
      }
    }
    this.notifyListeners(undefined);
  }

  private buildDescriptor(state: FeedState): KnowledgeFeed {
    const snapshotSource: KnowledgeFeedSnapshotSource | undefined = state.lastSnapshot
      ? {
          label: state.config.snapshot?.label ?? state.config.id,
          loadSnapshot: () => Promise.resolve(state.lastSnapshot)
        }
      : state.config.snapshot
      ? {
          label: state.config.snapshot.label,
          loadSnapshot: () => Promise.resolve(null)
        }
      : undefined;

    return {
      id: state.config.id,
      snapshot: snapshotSource
    } satisfies KnowledgeFeed;
  }

  private notifyListeners(summary: FeedStatusSummary | undefined): void {
    for (const listener of this.listeners) {
      try {
        listener(summary);
      } catch (error) {
        this.logger?.warn?.(`knowledge-feed listener failed: ${describeError(error)}`);
      }
    }
  }

  private async sleep(duration: number, signal: AbortSignal): Promise<void> {
    if (duration <= 0) {
      return;
    }

    if (signal.aborted) {
      return;
    }

    try {
      await sleepTimeout(duration, undefined, { signal });
    } catch (error) {
      if ((error as Error).name === "AbortError") {
        return;
      }
      throw error;
    }
  }
}
