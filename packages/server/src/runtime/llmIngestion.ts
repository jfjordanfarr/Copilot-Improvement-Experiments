import type { Connection } from "vscode-languageserver/node";

import {
  type ModelInvoker,
  RelationshipExtractor
} from "@copilot-improvement/shared";

import { LlmIngestionOrchestrator, type LlmIngestionResult } from "../features/knowledge/llmIngestionOrchestrator";
import type { ProviderGuard } from "../features/settings/providerGuard";

export interface LlmIngestionManagerOptions {
  orchestrator: LlmIngestionOrchestrator;
  connection: Connection;
}

export class LlmIngestionManager {
  private readonly orchestrator: LlmIngestionOrchestrator;
  private readonly connection: Connection;
  private isRunning = false;

  constructor(options: LlmIngestionManagerOptions) {
    this.orchestrator = options.orchestrator;
    this.connection = options.connection;
  }

  enqueue(artifactIds: string[], reason?: string): void {
    if (!artifactIds.length) {
      return;
    }

    this.orchestrator.enqueueArtifacts(artifactIds, { reason });
    void this.triggerRun();
  }

  private async triggerRun(): Promise<void> {
    if (this.isRunning) {
      return;
    }

    this.isRunning = true;
    try {
      while (true) {
        const results = await this.orchestrator.runOnce();
        if (results.length === 0) {
          break;
        }
        this.logResults(results);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      this.connection.console.error(`[llm-ingestion] run failed: ${message}`);
    } finally {
      this.isRunning = false;
    }
  }

  private logResults(results: LlmIngestionResult[]): void {
    const stored = results.reduce((sum, item) => sum + item.stored, 0);
    const skipped = results.reduce((sum, item) => sum + item.skipped, 0);
    const messages: string[] = [];
    messages.push(`[llm-ingestion] processed ${results.length} artifact(s)`);
    messages.push(`stored=${stored}`);
    messages.push(`skipped=${skipped}`);
    const failures = results.filter(result => result.error);
    if (failures.length > 0) {
      messages.push(`errors=${failures.length}`);
    }
    this.connection.console.info(messages.join("; "));
    for (const failure of failures) {
      this.connection.console.warn(
        `[llm-ingestion] ${failure.artifactId} failed: ${failure.error ?? "unknown error"}`
      );
    }
  }
}

export interface CreateRelationshipExtractorOptions {
  connection: Connection;
  providerGuard: ProviderGuard;
}

export function createDefaultRelationshipExtractor(
  options: CreateRelationshipExtractorOptions
): RelationshipExtractor {
  const { connection, providerGuard } = options;
  let loggedOnce = false;

  const invokeModel: ModelInvoker = ({ tags }) => {
    const settings = providerGuard.getSettings();
    const providerMode = settings.llmProviderMode ?? "local-only";
    if (!loggedOnce) {
      connection.console.info(
        `[llm-ingestion] model invocation stub active (mode=${providerMode}); returning empty relationships`
      );
      loggedOnce = true;
    }

    const templateId = tags?.["link-aware.template"] ?? "link-aware-diagnostics.llm-ingestion.v1";
    const templateVersion = tags?.["link-aware.version"] ?? "unknown";

    return Promise.resolve({
      response: {
        metadata: {
          templateId,
          templateVersion
        },
        relationships: []
      },
      modelId: providerMode === "prompt" ? "llm-provider-unavailable" : "llm-local-disabled"
    });
  };

  return new RelationshipExtractor({
    invokeModel,
    logger: {
      warn: message => connection.console.warn(`[llm-ingestion] ${message}`),
      error: message => connection.console.error(`[llm-ingestion] ${message}`)
    }
  });
}
