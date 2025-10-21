import type { Connection } from "vscode-languageserver/node";

import type { GraphStore } from "@copilot-improvement/shared";

import { describeError } from "./environment";
import {
  KnowledgeGraphBridgeService,
  type KnowledgeGraphBridgeDisposable
} from "../features/knowledge/knowledgeGraphBridge";
import type { ArtifactWatcher } from "../features/watchers/artifactWatcher";

export interface KnowledgeFeedControllerOptions {
  connection: Connection;
  now?: () => Date;
}

export interface KnowledgeFeedInitializeParams {
  graphStore: GraphStore | null;
  artifactWatcher: ArtifactWatcher | null;
  storageDirectory: string | null;
  workspaceRoot: string | undefined;
}

export class KnowledgeFeedController {
  private service: KnowledgeGraphBridgeService | null = null;
  private statusDisposable: KnowledgeGraphBridgeDisposable | null = null;
  private artifactWatcher: ArtifactWatcher | null = null;

  constructor(private readonly options: KnowledgeFeedControllerOptions) {}

  async initialize({
    graphStore,
    artifactWatcher,
    storageDirectory,
    workspaceRoot
  }: KnowledgeFeedInitializeParams): Promise<void> {
    const { connection } = this.options;

    if (!graphStore || !artifactWatcher) {
      connection.console.warn("knowledge feeds skipped: graph or watcher not initialised");
      await this.dispose();
      this.artifactWatcher = artifactWatcher;
      artifactWatcher?.setKnowledgeFeeds([]);
      return;
    }

    await this.dispose();

    if (!storageDirectory) {
      connection.console.warn("knowledge feeds skipped: storage directory unavailable");
      this.artifactWatcher = artifactWatcher;
      artifactWatcher.setKnowledgeFeeds([]);
      return;
    }

    this.artifactWatcher = artifactWatcher;

    const logger = {
      info: (message: string) => connection.console.info(message),
      warn: (message: string) => connection.console.warn(message),
      error: (message: string) => connection.console.error(message)
    };

    this.service = new KnowledgeGraphBridgeService({
      graphStore,
      storageDirectory,
      workspaceRoot,
      logger,
      backoff: {
        initialMs: 1_000,
        multiplier: 4,
        maxMs: 120_000
      },
      now: this.options.now ?? (() => new Date())
    });

    this.statusDisposable = this.service.onStatusChanged(summary => {
      if (this.service && this.artifactWatcher) {
        this.artifactWatcher.setKnowledgeFeeds(this.service.getHealthyFeeds());
      }

      if (summary) {
        const detail = summary.message ? ` (${summary.message})` : "";
        connection.console.info(
          `[knowledge-feed] status changed: ${summary.feedId} -> ${summary.status}${detail}`
        );
      }
    });

    try {
      const result = await this.service.start();

      if (this.service && this.artifactWatcher) {
        this.artifactWatcher.setKnowledgeFeeds(this.service.getHealthyFeeds());
      }

      if (result.configuredFeeds === 0) {
        connection.console.info(
          "no knowledge feeds discovered; continuing with workspace providers only"
        );
      } else {
        connection.console.info(`initialised ${result.configuredFeeds} knowledge feed(s)`);
      }
    } catch (error) {
      connection.console.error(`knowledge feed initialisation failed: ${describeError(error)}`);
      await this.dispose();
    }
  }

  async dispose(): Promise<void> {
    const { connection } = this.options;

    this.statusDisposable?.dispose();
    this.statusDisposable = null;

    if (this.service) {
      try {
        await this.service.dispose();
      } catch (error) {
        connection.console.error(`failed to stop knowledge graph bridge: ${describeError(error)}`);
      }
    }

    this.service = null;

    if (this.artifactWatcher) {
      this.artifactWatcher.setKnowledgeFeeds([]);
    }
  }
}
