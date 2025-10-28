const scheduleTimeout = (handler: () => void, delay: number): unknown => {
  return (globalThis as unknown as { setTimeout(cb: () => void, ms: number): unknown }).setTimeout(
    handler,
    delay
  );
};

const cancelTimeout = (handle: unknown): void => {
  (globalThis as unknown as { clearTimeout(id: unknown): void }).clearTimeout(handle);
};

export interface QueuedChange {
  uri: string;
  languageId?: string;
  version?: number;
}

interface ChangeQueueOptions {
  debounceMs: number;
  onFlush: (changes: QueuedChange[]) => void | Promise<void>;
  onEnqueue?: (change: QueuedChange) => void;
}

export class ChangeQueue {
  private pending = new Map<string, QueuedChange>();
  private timer: unknown = null;
  private debounceMs: number;

  constructor(private readonly options: ChangeQueueOptions) {
    this.debounceMs = Math.max(0, options.debounceMs);
  }

  enqueue(change: QueuedChange): void {
    this.pending.set(change.uri, change);
    this.options.onEnqueue?.(change);
    this.schedule();
  }

  updateDebounceWindow(ms: number | undefined): void {
    const nextWindow = typeof ms === "number" && ms >= 0 ? ms : this.debounceMs;
    this.debounceMs = nextWindow;

    if (this.pending.size === 0) {
      return;
    }

    if (this.timer) {
      cancelTimeout(this.timer);
    }

    this.timer = scheduleTimeout(() => this.flush(), this.debounceMs);
  }

  dispose(): void {
    if (this.timer) {
      cancelTimeout(this.timer);
      this.timer = null;
    }
    this.pending.clear();
  }

  private schedule(): void {
    if (this.timer) {
      cancelTimeout(this.timer);
    }

    this.timer = scheduleTimeout(() => this.flush(), this.debounceMs);
  }

  private flush(): void {
    if (this.pending.size === 0) {
      this.timer = null;
      return;
    }

    const changes = Array.from(this.pending.values());
    this.pending.clear();
    this.timer = null;

    void this.options.onFlush(changes);
  }
}
