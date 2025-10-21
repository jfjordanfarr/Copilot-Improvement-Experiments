import { createHash } from "node:crypto";
import fs from "node:fs";
import { promises as fsp } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

import {
  GraphStore,
  KnowledgeGraphBridge as SharedKnowledgeGraphBridge,
  type ArtifactLayer,
  type ExternalArtifact,
  type ExternalLink,
  type ExternalSnapshot,
  type KnowledgeFeed,
  type LinkRelationshipKind
} from "@copilot-improvement/shared";

import { FileFeedCheckpointStore } from "./feedCheckpointStore";
import {
  FeedDiagnosticsGateway,
  type FeedDiagnosticsGatewayOptions,
  type FeedStatusSummary
} from "./feedDiagnosticsGateway";
import {
  KnowledgeFeedManager,
  type BackoffOptions,
  type Disposable as FeedDisposable,
  type FeedConfiguration
} from "./knowledgeFeedManager";
import {
  KnowledgeGraphIngestor,
  type KnowledgeGraphIngestorLogger
} from "./knowledgeGraphIngestor";

export interface KnowledgeGraphBridgeLogger {
  info(message: string): void;
  warn(message: string): void;
  error(message: string): void;
}

export interface KnowledgeGraphBridgeServiceOptions {
  graphStore: GraphStore;
  storageDirectory: string;
  workspaceRoot?: string | null;
  logger?: KnowledgeGraphBridgeLogger;
  now?: () => Date;
  backoff?: BackoffOptions;
  feedConfigurations?: FeedConfiguration[];
  diagnosticsGateway?: FeedDiagnosticsGateway;
  bridgeFactory?: (store: GraphStore) => SharedKnowledgeGraphBridge;
  checkpointStoreFactory?: (checkpointDir: string) => FileFeedCheckpointStore;
}

export interface KnowledgeGraphBridgeStartResult {
  configuredFeeds: number;
}

export interface KnowledgeGraphBridgeDisposable {
  dispose(): void;
}

export class KnowledgeGraphBridgeService {
  private readonly logger?: KnowledgeGraphBridgeLogger;
  private readonly diagnostics: FeedDiagnosticsGateway;
  private feedManager: KnowledgeFeedManager | null = null;
  private feedStatusDisposable: FeedDisposable | null = null;
  private ingestor: KnowledgeGraphIngestor | null = null;
  private readonly listeners = new Set<(summary: FeedStatusSummary | undefined) => void>();
  private started = false;
  private configuredFeeds = 0;

  constructor(private readonly options: KnowledgeGraphBridgeServiceOptions) {
    this.logger = options.logger;
    this.diagnostics =
      options.diagnosticsGateway ??
      new FeedDiagnosticsGateway(createDiagnosticsGatewayLoggerOptions(this.logger));
  }

  async start(): Promise<KnowledgeGraphBridgeStartResult> {
    if (this.started) {
      return { configuredFeeds: this.configuredFeeds };
    }

    this.started = true;

    const workspaceRoot = this.options.workspaceRoot;
    if (!workspaceRoot) {
      this.logWarn("knowledge graph ingestion skipped: workspace root unavailable");
      this.notify(undefined);
      return { configuredFeeds: 0 };
    }

    const feedConfigurations =
      this.options.feedConfigurations ??
      (await discoverStaticFeedConfigurations(workspaceRoot, this.logger));

    this.configuredFeeds = feedConfigurations.length;

    if (feedConfigurations.length === 0) {
      this.logInfo("no knowledge feeds discovered; continuing with workspace providers only");
      this.notify(undefined);
      return { configuredFeeds: 0 };
    }

    const checkpointDirectory = path.join(this.options.storageDirectory, "knowledge-feeds");
    await ensureDirectory(checkpointDirectory);

    const bridgeFactory = this.options.bridgeFactory ??
      ((store: GraphStore) => new SharedKnowledgeGraphBridge(store));
    const checkpointStoreFactory =
      this.options.checkpointStoreFactory ?? ((dir: string) => new FileFeedCheckpointStore(dir));

    this.ingestor = new KnowledgeGraphIngestor({
      graphStore: this.options.graphStore,
      bridge: bridgeFactory(this.options.graphStore),
      checkpoints: checkpointStoreFactory(checkpointDirectory),
      diagnostics: this.diagnostics,
      logger: this.createChildLogger("knowledge-ingestor"),
      now: this.options.now
    });

    this.feedManager = new KnowledgeFeedManager({
      feeds: feedConfigurations,
      ingestor: this.ingestor,
      diagnostics: this.diagnostics,
      logger: this.createChildLogger("knowledge-feed"),
      backoff: this.options.backoff,
      now: this.options.now
    });

    this.feedStatusDisposable = this.feedManager.onStatusChanged(summary => {
      this.notify(summary);
    });

    await this.feedManager.start();
    this.notify(undefined);

    return { configuredFeeds: feedConfigurations.length };
  }

  async dispose(): Promise<void> {
    this.feedStatusDisposable?.dispose();
    this.feedStatusDisposable = null;

    if (this.feedManager) {
      try {
        await this.feedManager.stop();
      } catch (error) {
        this.logError(`failed to stop knowledge feed manager: ${describeError(error)}`);
      }
    }

    this.feedManager = null;
    this.ingestor = null;
    this.started = false;
    this.configuredFeeds = 0;

    this.notify(undefined);
  }

  getHealthyFeeds(): KnowledgeFeed[] {
    return this.feedManager?.getHealthyFeeds() ?? [];
  }

  onStatusChanged(
    listener: (summary: FeedStatusSummary | undefined) => void
  ): KnowledgeGraphBridgeDisposable {
    this.listeners.add(listener);
    return {
      dispose: () => {
        this.listeners.delete(listener);
      }
    } satisfies KnowledgeGraphBridgeDisposable;
  }

  private notify(summary: FeedStatusSummary | undefined): void {
    for (const listener of this.listeners) {
      try {
        listener(summary);
      } catch (error) {
        this.logWarn(`knowledge graph bridge listener failed: ${describeError(error)}`);
      }
    }
  }

  private createChildLogger(prefix: string): KnowledgeGraphBridgeLogger & KnowledgeGraphIngestorLogger {
    return {
      info: (message: string) => this.logInfo(`[${prefix}] ${message}`),
      warn: (message: string) => this.logWarn(`[${prefix}] ${message}`),
      error: (message: string) => this.logError(`[${prefix}] ${message}`)
    };
  }

  private logInfo(message: string): void {
    if (this.logger) {
      this.logger.info(message);
    } else {
      console.info(message);
    }
  }

  private logWarn(message: string): void {
    if (this.logger) {
      this.logger.warn(message);
    } else {
      console.warn(message);
    }
  }

  private logError(message: string): void {
    if (this.logger) {
      this.logger.error(message);
    } else {
      console.error(message);
    }
  }
}

async function ensureDirectory(directory: string): Promise<void> {
  await fsp.mkdir(directory, { recursive: true });
}

async function discoverStaticFeedConfigurations(
  workspaceRoot: string,
  logger?: KnowledgeGraphBridgeLogger
): Promise<FeedConfiguration[]> {
  const staticFeedDir = path.join(workspaceRoot, "data", "knowledge-feeds");

  try {
    const stats = await fsp.stat(staticFeedDir);
    if (!stats.isDirectory()) {
      return [];
    }
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
      logger?.error?.(
        `failed to inspect knowledge feed directory ${staticFeedDir}: ${describeError(error)}`
      );
    }
    return [];
  }

  const entries = await fsp.readdir(staticFeedDir, { withFileTypes: true });
  const descriptors: StaticFeedDescriptor[] = [];

  for (const entry of entries) {
    if (!entry.isFile() || !entry.name.endsWith(".json")) {
      continue;
    }

    const filePath = path.join(staticFeedDir, entry.name);

    try {
      const raw = await readStaticFeedFile(filePath);
      const id = typeof raw.id === "string" && raw.id.length > 0 ? raw.id : deriveFeedId(entry.name);
      const label = typeof raw.label === "string" && raw.label.length > 0 ? raw.label : id;
      const metadata = isPlainObject(raw.metadata) ? raw.metadata : undefined;

      descriptors.push({ id, label, filePath, metadata });
    } catch (error) {
      logger?.error?.(`failed to parse knowledge feed ${entry.name}: ${describeError(error)}`);
    }
  }

  return descriptors.map(descriptor => createStaticFeedConfiguration(descriptor, workspaceRoot, logger));
}

interface StaticFeedDescriptor {
  id: string;
  label: string;
  filePath: string;
  metadata?: Record<string, unknown>;
}

interface StaticFeedArtifactConfig {
  id?: string;
  path?: string;
  uri?: string;
  layer?: ArtifactLayer;
  language?: string;
  owner?: string;
  metadata?: Record<string, unknown>;
}

interface StaticFeedLinkConfig {
  id?: string;
  sourceId?: string;
  sourcePath?: string;
  sourceUri?: string;
  targetId?: string;
  targetPath?: string;
  targetUri?: string;
  kind?: LinkRelationshipKind;
  confidence?: number;
  createdAt?: string;
  createdBy?: string;
  metadata?: Record<string, unknown>;
}

const ARTIFACT_LAYER_VALUES = new Set([
  "vision",
  "requirements",
  "architecture",
  "implementation",
  "code"
]);

const LINK_KIND_VALUES = new Set(["documents", "implements", "depends_on", "references"]);

function createStaticFeedConfiguration(
  descriptor: StaticFeedDescriptor,
  workspaceRoot: string,
  logger?: KnowledgeGraphBridgeLogger
): FeedConfiguration {
  const relativeFile = path.relative(workspaceRoot, descriptor.filePath);
  const metadata = {
    ...(descriptor.metadata ?? {}),
    source: "static-json",
    file: relativeFile
  } satisfies Record<string, unknown>;

  return {
    id: descriptor.id,
    metadata,
    snapshot: {
      label: descriptor.label,
      load: async () => readStaticFeedSnapshot(descriptor, workspaceRoot, logger)
    }
  } satisfies FeedConfiguration;
}

async function readStaticFeedSnapshot(
  descriptor: StaticFeedDescriptor,
  workspaceRoot: string,
  logger?: KnowledgeGraphBridgeLogger
): Promise<ExternalSnapshot | null> {
  const raw = await readStaticFeedFile(descriptor.filePath);

  const artifactsConfig = Array.isArray(raw.artifacts)
    ? raw.artifacts.filter(isStaticFeedArtifactConfig)
    : [];
  const linksConfig = Array.isArray(raw.links) ? raw.links.filter(isStaticFeedLinkConfig) : [];

  const artifacts: ExternalArtifact[] = [];
  const artifactAliasMap = new Map<string, { uri: string; id?: string }>();

  for (const artifactConfig of artifactsConfig) {
    if (!artifactConfig) {
      continue;
    }

    if (!isArtifactLayerValue(artifactConfig.layer)) {
      throw new Error("artifact layer must be specified for knowledge feed snapshot");
    }
    const layer = artifactConfig.layer;
    const uri = resolveArtifactUri(workspaceRoot, artifactConfig, logger);

    const artifactId = deriveStaticArtifactId(descriptor.id, artifactConfig.id, uri);

    const artifact: ExternalArtifact = {
      id: artifactId,
      uri,
      layer,
      language: typeof artifactConfig.language === "string" ? artifactConfig.language : undefined,
      owner: typeof artifactConfig.owner === "string" ? artifactConfig.owner : undefined,
      metadata: isPlainObject(artifactConfig.metadata) ? artifactConfig.metadata : undefined
    };

    artifacts.push(artifact);

    artifactAliasMap.set(uri, { uri, id: artifactId });
    artifactAliasMap.set(artifactId, { uri, id: artifactId });

    if (typeof artifactConfig.id === "string" && artifactConfig.id.length > 0) {
      artifactAliasMap.set(artifactConfig.id, { uri, id: artifactId });
    }

    if (typeof artifactConfig.path === "string" && artifactConfig.path.length > 0) {
      artifactAliasMap.set(normalisePathKey(artifactConfig.path), { uri, id: artifactId });
    }
  }

  const links: ExternalLink[] = [];

  for (const linkConfig of linksConfig) {
    if (!linkConfig) {
      continue;
    }

    if (!isLinkRelationshipKindValue(linkConfig.kind)) {
      throw new Error("link kind must be specified for knowledge feed snapshot");
    }
    const kind = linkConfig.kind;

    const sourceId = resolveLinkEndpoint(
      linkConfig.sourceId,
      linkConfig.sourcePath,
      linkConfig.sourceUri,
      artifactAliasMap,
      workspaceRoot,
      logger
    );
    const targetId = resolveLinkEndpoint(
      linkConfig.targetId,
      linkConfig.targetPath,
      linkConfig.targetUri,
      artifactAliasMap,
      workspaceRoot,
      logger
    );

    const link: ExternalLink = {
      id: typeof linkConfig.id === "string" ? linkConfig.id : undefined,
      sourceId,
      targetId,
      kind,
      confidence: typeof linkConfig.confidence === "number" ? linkConfig.confidence : undefined,
      createdAt: typeof linkConfig.createdAt === "string" ? linkConfig.createdAt : undefined,
      createdBy: typeof linkConfig.createdBy === "string" ? linkConfig.createdBy : undefined,
      metadata: isPlainObject(linkConfig.metadata) ? linkConfig.metadata : undefined
    };

    links.push(link);
  }

  const snapshotId = typeof raw.id === "string" && raw.id.length > 0 ? raw.id : descriptor.id;
  const createdAt = typeof raw.createdAt === "string" ? raw.createdAt : new Date().toISOString();

  const metadata = isPlainObject(raw.metadata) ? raw.metadata : undefined;

  return {
    id: snapshotId,
    label: descriptor.label,
    createdAt,
    artifacts,
    links,
    metadata
  } satisfies ExternalSnapshot;
}

async function readStaticFeedFile(filePath: string): Promise<Record<string, unknown>> {
  const contents = await fsp.readFile(filePath, "utf8");
  const parsed: unknown = JSON.parse(contents);
  if (!isPlainObject(parsed)) {
    throw new Error("knowledge feed configuration must be a JSON object");
  }
  return parsed;
}

function deriveFeedId(fileName: string): string {
  return fileName.replace(/\.json$/i, "");
}

function deriveStaticArtifactId(feedId: string, configuredId: string | undefined, uri: string): string {
  if (configuredId && configuredId.length > 0) {
    return configuredId;
  }

  const hash = createHash("sha1").update(`${feedId}:${uri}`).digest("hex").slice(0, 12);
  return `static-${feedId}-${hash}`;
}

function resolveArtifactUri(
  workspaceRoot: string,
  artifactConfig: StaticFeedArtifactConfig,
  logger?: KnowledgeGraphBridgeLogger
): string {
  if (typeof artifactConfig.uri === "string" && artifactConfig.uri.length > 0) {
    return artifactConfig.uri;
  }

  if (typeof artifactConfig.path !== "string" || artifactConfig.path.length === 0) {
    throw new Error("artifact configuration must include either 'uri' or 'path'");
  }

  const candidatePath = path.isAbsolute(artifactConfig.path)
    ? artifactConfig.path
    : path.join(workspaceRoot, artifactConfig.path);

  if (!fs.existsSync(candidatePath)) {
    if (logger) {
      logger.warn(`knowledge feed artifact path missing: ${candidatePath}`);
    } else {
      console.warn(`knowledge feed artifact path missing: ${candidatePath}`);
    }
  }

  return pathToFileURL(candidatePath).toString();
}

function resolveLinkEndpoint(
  id: string | undefined,
  pathCandidate: string | undefined,
  uriCandidate: string | undefined,
  aliasMap: Map<string, { uri: string; id?: string }>,
  workspaceRoot: string,
  logger?: KnowledgeGraphBridgeLogger
): string {
  const aliases = [id, uriCandidate, pathCandidate].filter(
    (candidate): candidate is string => typeof candidate === "string" && candidate.length > 0
  );

  for (const alias of aliases) {
    const normalised = normalisePathKey(alias);
    const entry = aliasMap.get(normalised) ?? aliasMap.get(alias);
    if (entry) {
      return entry.id ?? entry.uri;
    }

    if (alias.startsWith("file://")) {
      return alias;
    }
  }

  if (pathCandidate) {
    const absolutePath = path.isAbsolute(pathCandidate)
      ? pathCandidate
      : path.join(workspaceRoot, pathCandidate);
    const uri = pathToFileURL(absolutePath).toString();
    if (!fs.existsSync(absolutePath)) {
      if (logger) {
        logger.warn(`knowledge feed link path missing: ${absolutePath}`);
      } else {
        console.warn(`knowledge feed link path missing: ${absolutePath}`);
      }
    }
    return uri;
  }

  if (uriCandidate) {
    return uriCandidate;
  }

  if (id) {
    return id;
  }

  throw new Error("link endpoint must specify an artifact reference");
}

function isStaticFeedArtifactConfig(candidate: unknown): candidate is StaticFeedArtifactConfig {
  return isPlainObject(candidate);
}

function isStaticFeedLinkConfig(candidate: unknown): candidate is StaticFeedLinkConfig {
  return isPlainObject(candidate);
}

function isArtifactLayerValue(value: unknown): value is ArtifactLayer {
  return typeof value === "string" && ARTIFACT_LAYER_VALUES.has(value);
}

function isLinkRelationshipKindValue(value: unknown): value is LinkRelationshipKind {
  return typeof value === "string" && LINK_KIND_VALUES.has(value);
}

function normalisePathKey(candidate: string): string {
  if (candidate.startsWith("file://")) {
    return candidate;
  }
  return path.normalize(candidate).replace(/\\/g, "/");
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function describeError(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return String(error);
}

function createDiagnosticsGatewayLoggerOptions(
  logger: KnowledgeGraphBridgeLogger | undefined
): FeedDiagnosticsGatewayOptions {
  if (!logger) {
    return {};
  }

  return {
    logger: {
      info: message => logger.info(message),
      warn: message => logger.warn(message),
      error: message => logger.error(message)
    }
  } satisfies FeedDiagnosticsGatewayOptions;
}
