export interface HysteresisControllerOptions {
  /** Optional factory used to obtain the current time; primarily surfaced for tests. */
  now?: () => Date;
  /** Maximum number of active hysteresis entries to retain before trimming oldest items. */
  maxEntries?: number;
  /** Multiplier applied to the configured window when pruning stale entries. */
  pruneMultiplier?: number;
}

interface HysteresisRecord {
  triggerUri: string;
  targetUri: string;
  changeEventId?: string;
  emittedAt: number;
}

const DEFAULT_MAX_ENTRIES = 500;
const DEFAULT_PRUNE_MULTIPLIER = 4;

/**
 * Maintains short-lived suppression windows that prevent reciprocal diagnostics from ricocheting
 * between linked artifacts while an earlier alert is still active. The controller is intentionally
 * lightweight and in-memory; acknowledgement workflows will clear entries explicitly once they
 * land, and periodic pruning keeps the working set bounded.
 */
export class HysteresisController {
  private readonly nowFactory: () => Date;
  private readonly maxEntries: number;
  private readonly pruneMultiplier: number;
  private readonly records = new Map<string, HysteresisRecord>();

  constructor(options: HysteresisControllerOptions = {}) {
    this.nowFactory = options.now ?? (() => new Date());
    this.maxEntries = options.maxEntries ?? DEFAULT_MAX_ENTRIES;
    this.pruneMultiplier = options.pruneMultiplier ?? DEFAULT_PRUNE_MULTIPLIER;
  }

  /** Indicates whether an emission from {@code triggerUri} to {@code targetUri} should be muted. */
  shouldSuppress(triggerUri: string, targetUri: string, windowMs: number): boolean {
    const now = this.nowFactory().getTime();
    this.prune(now, windowMs);

    const reverseKey = this.composeKey(targetUri, triggerUri);
    const reverse = this.records.get(reverseKey);
    if (!reverse) {
      return false;
    }

    return now - reverse.emittedAt <= windowMs;
  }

  /**
   * Registers an emitted diagnostic so reciprocal emissions can be suppressed until the hysteresis
   * window lapses or an acknowledgement clears the pair.
   */
  recordEmission(triggerUri: string, targetUri: string, changeEventId?: string): void {
    const now = this.nowFactory().getTime();
    const key = this.composeKey(triggerUri, targetUri);

    this.records.set(key, {
      triggerUri,
      targetUri,
      changeEventId,
      emittedAt: now
    });

    if (this.records.size > this.maxEntries) {
      this.trimOldest();
    }
  }

  /** Clears any stored suppression for the provided artifact pair. */
  acknowledge(triggerUri: string, targetUri: string): void {
    this.records.delete(this.composeKey(triggerUri, targetUri));
    this.records.delete(this.composeKey(targetUri, triggerUri));
  }

  /** Removes all tracked entries. Primarily used in tests. */
  reset(): void {
    this.records.clear();
  }

  /** Exposed for observability and testing. */
  getActiveCount(): number {
    return this.records.size;
  }

  private prune(now: number, windowMs: number): void {
    if (this.records.size === 0) {
      return;
    }

    const expiryWindow = windowMs * this.pruneMultiplier;
    for (const [key, record] of this.records) {
      if (now - record.emittedAt > expiryWindow) {
        this.records.delete(key);
      }
    }
  }

  private trimOldest(): void {
    let oldestKey: string | undefined;
    let oldestTimestamp = Number.POSITIVE_INFINITY;

    for (const [key, record] of this.records) {
      if (record.emittedAt < oldestTimestamp) {
        oldestTimestamp = record.emittedAt;
        oldestKey = key;
      }
    }

    if (oldestKey) {
      this.records.delete(oldestKey);
    }
  }

  private composeKey(triggerUri: string, targetUri: string): string {
    return `${triggerUri}-->${targetUri}`;
  }
}
