import { promises as fs } from "node:fs";
import { fileURLToPath } from "node:url";
import { TextDocument } from "vscode-languageserver-textdocument";

import {
  ArtifactLayer,
  GraphStore,
  KnowledgeArtifact,
  LinkedArtifactSummary,
  LinkInferenceOrchestrator,
  LinkInferenceRunResult,
  type ArtifactSeed,
  type FallbackLLMBridge,
  type KnowledgeFeed,
  type RelationshipHint,
  type WorkspaceLinkProvider
} from "@copilot-improvement/shared";

import type { QueuedChange } from "../changeEvents/changeQueue";

export interface DocumentStore {
  get(uri: string): TextDocument | undefined;
}

export interface MarkdownWatcherLogger {
  info(message: string): void;
  warn(message: string): void;
  error(message: string): void;
}

export interface MarkdownWatcherOptions {
  documents: DocumentStore;
  graphStore: GraphStore;
  orchestrator: LinkInferenceOrchestrator;
  logger?: MarkdownWatcherLogger;
  workspaceProviders?: WorkspaceLinkProvider[];
  knowledgeFeeds?: KnowledgeFeed[];
  llmBridgeProvider?: () => FallbackLLMBridge | undefined;
  minContentLengthForLLM?: number;
  now?: () => Date;
}

export interface MarkdownDocumentChange {
  uri: string;
  layer: ArtifactLayer;
  change: QueuedChange;
  previousArtifact?: KnowledgeArtifact;
  nextArtifact?: KnowledgeArtifact;
  hints: RelationshipHint[];
  content?: string;
  contentLength: number;
}

export interface MarkdownSkippedChange {
  change: QueuedChange;
  reason: string;
}

export interface MarkdownWatcherResult {
  processed: MarkdownDocumentChange[];
  skipped: MarkdownSkippedChange[];
  inference?: LinkInferenceRunResult;
  orchestratorError?: unknown;
}

const DEFAULT_LAYER: ArtifactLayer = "requirements";
const EXISTING_LINK_CONFIDENCE = 0.9;

export class MarkdownWatcher {
  private workspaceProviders: WorkspaceLinkProvider[];
  private knowledgeFeeds: KnowledgeFeed[];
  private readonly orchestrator: LinkInferenceOrchestrator;
  private readonly graphStore: GraphStore;
  private readonly documents: DocumentStore;
  private readonly logger?: MarkdownWatcherLogger;
  private llmBridgeProvider?: () => FallbackLLMBridge | undefined;
  private minContentLengthForLLM?: number;
  private nowFactory?: () => Date;

  constructor(options: MarkdownWatcherOptions) {
    this.documents = options.documents;
    this.graphStore = options.graphStore;
    this.orchestrator = options.orchestrator;
    this.logger = options.logger;
    this.workspaceProviders = options.workspaceProviders ?? [];
    this.knowledgeFeeds = options.knowledgeFeeds ?? [];
    this.llmBridgeProvider = options.llmBridgeProvider;
    this.minContentLengthForLLM = options.minContentLengthForLLM;
    this.nowFactory = options.now;
  }

  setWorkspaceProviders(providers: WorkspaceLinkProvider[]): void {
    this.workspaceProviders = providers;
  }

  setKnowledgeFeeds(feeds: KnowledgeFeed[]): void {
    this.knowledgeFeeds = feeds;
  }

  setLLMBridgeProvider(provider: (() => FallbackLLMBridge | undefined) | undefined): void {
    this.llmBridgeProvider = provider;
  }

  setMinContentLengthForLLM(value: number | undefined): void {
    this.minContentLengthForLLM = value;
  }

  setNowFactory(factory: (() => Date) | undefined): void {
    this.nowFactory = factory;
  }

  async processChanges(changes: QueuedChange[]): Promise<MarkdownWatcherResult> {
    const markdownChanges = changes.filter(change => this.isMarkdownChange(change));

    if (markdownChanges.length === 0) {
      return { processed: [], skipped: [], inference: undefined };
    }

    const processed: MarkdownDocumentChange[] = [];
    const skipped: MarkdownSkippedChange[] = [];

    for (const change of markdownChanges) {
      const prepared = await this.prepareChange(change);
      if (!prepared) {
        skipped.push({ change, reason: "content-unavailable" });
        continue;
      }

      processed.push(prepared);
    }

    if (processed.length === 0) {
      return { processed: [], skipped, inference: undefined };
    }

    const seeds = this.prepareSeeds(processed);
    const hints = processed.flatMap(item => item.hints);
    this.logger?.info(
      `markdown watcher prepared ${seeds.length} seed(s) and ${hints.length} hint(s) before provider contributions`
    );

    let inference: LinkInferenceRunResult | undefined;
    let orchestratorError: unknown;

    try {
      inference = await this.orchestrator.run({
        seeds,
        hints,
        contentProvider: uri => this.loadContent(uri),
        workspaceProviders: this.workspaceProviders,
        knowledgeFeeds: this.knowledgeFeeds,
        llm: this.llmBridgeProvider?.(),
        minContentLengthForLLM: this.minContentLengthForLLM,
        now: this.nowFactory
      });

      this.logger?.info(
        `markdown watcher inference produced ${inference.links.length} link(s) from ${inference.providerSummaries.reduce(
          (sum, summary) => sum + summary.seedCount,
          0
        )} provider seed(s) and ${inference.traces.length} trace(s)`
      );
      this.applyInferenceArtifacts(processed, inference);
      this.logger?.info(
        `markdown watcher reconciled ${processed.length} document(s); ` +
          `${inference.links.length} link(s), ${inference.errors.length} error(s)`
      );
    } catch (error) {
      orchestratorError = error;
      this.logger?.error(`markdown watcher failed to run inference: ${describeError(error)}`);
    }

    return { processed, skipped, inference, orchestratorError };
  }

  private async prepareChange(change: QueuedChange): Promise<MarkdownDocumentChange | null> {
    const existing = this.graphStore.getArtifactByUri(change.uri);
    const layer = deriveLayer(change.uri, existing?.layer);
    const content = await this.loadContent(change.uri);
    const hints = existing ? this.buildHints(change.uri, existing) : [];

    return {
      uri: change.uri,
      change,
      layer,
      previousArtifact: existing,
      hints,
      content,
      contentLength: content?.length ?? 0
    };
  }

  private prepareSeeds(changes: MarkdownDocumentChange[]): ArtifactSeed[] {
    const seedsByUri = new Map<string, ArtifactSeed>();

    for (const artifact of this.graphStore.listArtifacts()) {
      seedsByUri.set(artifact.uri, toSeed(artifact));
    }

    for (const change of changes) {
      const existingMetadata = change.previousArtifact;
      const document = this.documents.get(change.uri);
      const content = document?.getText() ?? change.content;
      const seed: ArtifactSeed = {
        id: existingMetadata?.id,
        uri: change.uri,
        layer: change.layer,
        language: change.change.languageId ?? document?.languageId ?? existingMetadata?.language,
        owner: existingMetadata?.owner,
        hash: existingMetadata?.hash,
        metadata: cloneMetadata(existingMetadata?.metadata),
        lastSynchronizedAt: existingMetadata?.lastSynchronizedAt,
        content
      };

      seedsByUri.set(change.uri, seed);
    }

    return Array.from(seedsByUri.values());
  }

  private buildHints(uri: string, artifact: KnowledgeArtifact): RelationshipHint[] {
    const related = this.graphStore.listLinkedArtifacts(artifact.id);
    return related.map(link => toRelationshipHint(uri, link));
  }

  private async loadContent(uri: string): Promise<string | undefined> {
    const document = this.documents.get(uri);
    if (document) {
      return document.getText();
    }

    if (!uri.startsWith("file://")) {
      return undefined;
    }

    try {
      const filePath = fileURLToPath(uri);
      const buffer = await fs.readFile(filePath, "utf8");
      return buffer;
    } catch {
      return undefined;
    }
  }

  private applyInferenceArtifacts(
    processed: MarkdownDocumentChange[],
    inference: LinkInferenceRunResult
  ): void {
    const byUri = new Map<string, KnowledgeArtifact>();
    for (const artifact of inference.artifacts) {
      byUri.set(normalizeUri(artifact.uri), artifact);
    }

    for (const change of processed) {
      change.nextArtifact = byUri.get(normalizeUri(change.uri));
    }
  }

  private isMarkdownChange(change: QueuedChange): boolean {
    const language = change.languageId?.toLowerCase();
    if (language && (language === "markdown" || language === "mdx")) {
      return true;
    }

    const uri = change.uri.toLowerCase();
    return uri.endsWith(".md") || uri.endsWith(".mdx") || uri.endsWith(".markdown");
  }
}

function toSeed(artifact: KnowledgeArtifact): ArtifactSeed {
  return {
    id: artifact.id,
    uri: artifact.uri,
    layer: artifact.layer,
    language: artifact.language,
    owner: artifact.owner,
    hash: artifact.hash,
    metadata: cloneMetadata(artifact.metadata),
    lastSynchronizedAt: artifact.lastSynchronizedAt
  };
}

function cloneMetadata(source: Record<string, unknown> | undefined): Record<string, unknown> | undefined {
  if (!source) {
    return undefined;
  }

  return { ...source };
}

function toRelationshipHint(uri: string, link: LinkedArtifactSummary): RelationshipHint {
  if (link.direction === "outgoing") {
    return {
      sourceUri: uri,
      targetUri: link.artifact.uri,
      kind: link.kind,
      confidence: EXISTING_LINK_CONFIDENCE,
      rationale: "existing-link"
    };
  }

  return {
    sourceUri: link.artifact.uri,
    targetUri: uri,
    kind: link.kind,
    confidence: EXISTING_LINK_CONFIDENCE,
    rationale: "existing-link"
  };
}

function deriveLayer(uri: string, existing?: ArtifactLayer): ArtifactLayer {
  if (existing) {
    return existing;
  }

  const normalised = uri.toLowerCase();
  if (normalised.includes("vision")) {
    return "vision";
  }

  if (normalised.includes("architecture") || normalised.includes("adr") || normalised.includes("design")) {
    return "architecture";
  }

  if (normalised.includes("implementation") || normalised.includes("runbook")) {
    return "implementation";
  }

  return DEFAULT_LAYER;
}

function normalizeUri(uri: string): string {
  return uri.trim();
}

function describeError(error: unknown): string {
  if (error instanceof Error) {
    return `${error.name}: ${error.message}`;
  }

  return String(error);
}