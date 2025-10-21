import { promises as fs } from "node:fs";
import path from "node:path";
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

import { buildFileReferenceHints } from "./pathReferenceDetector";
import type { QueuedChange } from "../changeEvents/changeQueue";
import { normalizeFileUri } from "../utils/uri";

export type ArtifactCategory = "document" | "code";

export interface DocumentStore {
  get(uri: string): TextDocument | undefined;
}

export interface ArtifactWatcherLogger {
  info(message: string): void;
  warn(message: string): void;
  error(message: string): void;
}

export interface ArtifactWatcherOptions {
  documents: DocumentStore;
  graphStore: GraphStore;
  orchestrator: LinkInferenceOrchestrator;
  logger?: ArtifactWatcherLogger;
  workspaceProviders?: WorkspaceLinkProvider[];
  knowledgeFeeds?: KnowledgeFeed[];
  llmBridgeProvider?: () => FallbackLLMBridge | undefined;
  minContentLengthForLLM?: number;
  now?: () => Date;
}

export interface TrackedArtifactChange {
  uri: string;
  layer: ArtifactLayer;
  category: ArtifactCategory;
  change: QueuedChange;
  previousArtifact?: KnowledgeArtifact;
  nextArtifact?: KnowledgeArtifact;
  hints: RelationshipHint[];
  content?: string;
  contentLength: number;
}

export type DocumentTrackedArtifactChange = TrackedArtifactChange & { category: "document" };
export type CodeTrackedArtifactChange = TrackedArtifactChange & { category: "code" };

export interface SkippedArtifactChange {
  change: QueuedChange;
  reason: string;
}

export interface ArtifactWatcherResult {
  processed: TrackedArtifactChange[];
  skipped: SkippedArtifactChange[];
  inference?: LinkInferenceRunResult;
  orchestratorError?: unknown;
}

const DEFAULT_DOCUMENT_LAYER: ArtifactLayer = "requirements";
const DOCUMENT_LANGUAGES = new Set(["markdown", "mdx", "yaml", "yml"]);
const CODE_LANGUAGES = new Set([
  "typescript",
  "javascript",
  "typescriptreact",
  "javascriptreact",
  "ts",
  "js"
]);
const DOCUMENT_EXTENSIONS = new Set([".md", ".mdx", ".markdown", ".yaml", ".yml"]);
const CODE_EXTENSIONS = new Set([".ts", ".tsx", ".js", ".jsx", ".mjs", ".cts", ".mts"]);
const EXISTING_LINK_CONFIDENCE = 0.9;

export class ArtifactWatcher {
  private workspaceProviders: WorkspaceLinkProvider[];
  private knowledgeFeeds: KnowledgeFeed[];
  private readonly orchestrator: LinkInferenceOrchestrator;
  private readonly graphStore: GraphStore;
  private readonly documents: DocumentStore;
  private readonly logger?: ArtifactWatcherLogger;
  private llmBridgeProvider?: () => FallbackLLMBridge | undefined;
  private minContentLengthForLLM?: number;
  private nowFactory?: () => Date;

  constructor(options: ArtifactWatcherOptions) {
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

  async processChanges(changes: QueuedChange[]): Promise<ArtifactWatcherResult> {
    const tracked = this.extractTrackedChanges(changes);

    if (tracked.length === 0) {
      return { processed: [], skipped: [], inference: undefined };
    }

    const processed: TrackedArtifactChange[] = [];
    const skipped: SkippedArtifactChange[] = [];

    for (const entry of tracked) {
      const prepared = await this.prepareChange(entry.change, entry.category);
      if (!prepared) {
        skipped.push({ change: entry.change, reason: "content-unavailable" });
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
      `artifact watcher prepared ${seeds.length} seed(s) and ${hints.length} hint(s) before provider contributions`
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
        `artifact watcher inference produced ${inference.links.length} link(s) from ${inference.providerSummaries.reduce(
          (sum, summary) => sum + summary.seedCount,
          0
        )} provider seed(s) and ${inference.traces.length} trace(s)`
      );
      this.applyInferenceArtifacts(processed, inference);
      this.logger?.info(
        `artifact watcher reconciled ${processed.length} artifact(s); ${inference.links.length} link(s), ${inference.errors.length} error(s)`
      );
    } catch (error) {
      orchestratorError = error;
      this.logger?.error(`artifact watcher failed to run inference: ${describeError(error)}`);
    }

    return { processed, skipped, inference, orchestratorError };
  }

  private extractTrackedChanges(
    changes: QueuedChange[]
  ): Array<{ change: QueuedChange; category: ArtifactCategory }> {
    const tracked: Array<{ change: QueuedChange; category: ArtifactCategory }> = [];

    for (const change of changes) {
      const category = classifyChange(change);
      if (!category) {
        continue;
      }

      tracked.push({ change, category });
    }

    return tracked;
  }

  private async prepareChange(
    change: QueuedChange,
    category: ArtifactCategory
  ): Promise<TrackedArtifactChange | null> {
    const canonicalUri = normalizeFileUri(change.uri);
    const existing =
      this.graphStore.getArtifactByUri(canonicalUri) ?? this.graphStore.getArtifactByUri(change.uri);
    const layer = deriveLayer(canonicalUri, category, existing?.layer);
    const content = await this.loadContent(change.uri);
    const hints = existing ? this.buildHints(canonicalUri, existing) : [];
    if (content) {
      const referenceHints = buildFileReferenceHints({
        sourceUri: canonicalUri,
        content,
        category
      });
      if (referenceHints.length > 0) {
        hints.push(...referenceHints);
      }
    }

    return {
      uri: canonicalUri,
      change,
      category,
      layer,
      previousArtifact: existing ? { ...existing, uri: normalizeFileUri(existing.uri) } : undefined,
      hints,
      content,
      contentLength: content?.length ?? 0
    };
  }

  private prepareSeeds(changes: TrackedArtifactChange[]): ArtifactSeed[] {
    const seedsByUri = new Map<string, ArtifactSeed>();

    for (const artifact of this.graphStore.listArtifacts()) {
      const canonicalUri = normalizeFileUri(artifact.uri);
      seedsByUri.set(canonicalUri, toSeed({ ...artifact, uri: canonicalUri }));
    }

    for (const change of changes) {
      const existingMetadata = change.previousArtifact;
      const document = this.documents.get(change.uri);
      const content = document?.getText() ?? change.content;
      const canonicalUri = normalizeFileUri(change.uri);
      const seed: ArtifactSeed = {
        id: existingMetadata?.id,
        uri: canonicalUri,
        layer: change.layer,
        language: change.change.languageId ?? document?.languageId ?? existingMetadata?.language,
        owner: existingMetadata?.owner,
        hash: existingMetadata?.hash,
        metadata: cloneMetadata(existingMetadata?.metadata),
        lastSynchronizedAt: existingMetadata?.lastSynchronizedAt,
        content
      };

      seedsByUri.set(canonicalUri, seed);
    }

    return Array.from(seedsByUri.values());
  }

  private buildHints(uri: string, artifact: KnowledgeArtifact): RelationshipHint[] {
    const related = this.graphStore.listLinkedArtifacts(artifact.id);
    const canonicalUri = normalizeFileUri(uri);
    return related.map(link =>
      toRelationshipHint(canonicalUri, {
        ...link,
        artifact: { ...link.artifact, uri: normalizeFileUri(link.artifact.uri) }
      })
    );
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
      return await fs.readFile(filePath, "utf8");
    } catch {
      return undefined;
    }
  }

  private applyInferenceArtifacts(
    processed: TrackedArtifactChange[],
    inference: LinkInferenceRunResult
  ): void {
    const byUri = new Map<string, KnowledgeArtifact>();
    for (const artifact of inference.artifacts) {
      const canonical = { ...artifact, uri: normalizeFileUri(artifact.uri) };
      byUri.set(canonical.uri, canonical);
    }

    for (const change of processed) {
      change.nextArtifact = byUri.get(normalizeFileUri(change.uri));
    }
  }
}

function classifyChange(change: QueuedChange): ArtifactCategory | undefined {
  const language = change.languageId?.toLowerCase();
  if (language && DOCUMENT_LANGUAGES.has(language)) {
    return "document";
  }

  if (language && CODE_LANGUAGES.has(language)) {
    return "code";
  }

  const lowerUri = change.uri.toLowerCase();
  if (DOCUMENT_EXTENSIONS.has(path.extname(lowerUri))) {
    return "document";
  }

  if (CODE_EXTENSIONS.has(path.extname(lowerUri))) {
    return "code";
  }

  return undefined;
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

function deriveLayer(
  uri: string,
  category: ArtifactCategory,
  existing?: ArtifactLayer
): ArtifactLayer {
  if (existing) {
    return existing;
  }

  if (category === "code") {
    return "code";
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

  return DEFAULT_DOCUMENT_LAYER;
}

function describeError(error: unknown): string {
  if (error instanceof Error) {
    return `${error.name}: ${error.message}`;
  }

  return String(error);
}
