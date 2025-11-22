import { createHash, randomUUID } from "node:crypto";
import { promises as fsp } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  GraphStore,
  calibrateConfidence,
  type CalibrationContext,
  type CalibratedRelationship,
  type KnowledgeArtifact,
  type RawRelationshipCandidate,
  type RelationshipExtractionPrompt,
  type RelationshipExtractionRequest,
  RelationshipExtractor,
  type RelationshipExtractionBatch,
  type LinkRelationshipKind
} from "@live-documentation/shared";

import {
  RELATIONSHIP_RESPONSE_SCHEMA,
  renderRelationshipExtractionPrompt,
  type PromptArtifactSummary,
  type PromptChunkSummary
} from "../../prompts/llm-ingestion/relationshipTemplate";
import { ProviderGuard } from "../settings/providerGuard";

const ALLOWED_RELATIONSHIP_KINDS: LinkRelationshipKind[] = [
  "depends_on",
  "implements",
  "documents",
  "references"
];

export interface LlmIngestionLogger {
  info(message: string): void;
  warn(message: string): void;
  error(message: string): void;
}

export interface EnqueueOptions {
  reason?: string;
}

export interface LlmIngestionResult {
  artifactId: string;
  stored: number;
  skipped: number;
  dryRunSnapshotPath?: string;
  error?: string;
}

export interface LlmIngestionOrchestratorOptions {
  graphStore: GraphStore;
  providerGuard: ProviderGuard;
  relationshipExtractor: RelationshipExtractor;
  storageDirectory: string;
  logger?: LlmIngestionLogger;
  calibrate?: (candidates: RawRelationshipCandidate[], context: CalibrationContext) => CalibratedRelationship[];
  maxChunkCharacters?: number;
  maxConcurrentJobs?: number;
  fileReader?: (absolutePath: string) => Promise<string>;
  now?: () => Date;
}

interface QueueItem {
  artifactId: string;
  reason?: string;
}

interface ProcessOptions {
  dryRun: boolean;
  snapshotDirectory?: string;
}

export class LlmIngestionOrchestrator {
  private readonly queue: Map<string, QueueItem> = new Map();
  private readonly logger?: LlmIngestionLogger;
  private readonly maxChunkCharacters: number;
  private readonly maxConcurrentJobs: number;
  private readonly fileReader: (absolutePath: string) => Promise<string>;
  private readonly calibrate: (candidates: RawRelationshipCandidate[], context: CalibrationContext) => CalibratedRelationship[];
  private readonly now: () => Date;

  constructor(private readonly options: LlmIngestionOrchestratorOptions) {
    this.logger = options.logger;
    this.maxChunkCharacters = options.maxChunkCharacters ?? 1600;
    this.maxConcurrentJobs = Math.max(1, options.maxConcurrentJobs ?? 1);
    this.fileReader = options.fileReader ?? (filePath => fsp.readFile(filePath, "utf8"));
    this.calibrate = options.calibrate ?? calibrateConfidence;
    this.now = options.now ?? (() => new Date());
  }

  enqueueArtifacts(artifactIds: string[], options: EnqueueOptions = {}): void {
    for (const artifactId of artifactIds) {
      this.queue.set(artifactId, { artifactId, reason: options.reason });
    }
  }

  async runOnce(): Promise<LlmIngestionResult[]> {
    return this.processQueued({ dryRun: false });
  }

  async runDryRun(snapshotDirectory: string): Promise<LlmIngestionResult[]> {
    return this.processQueued({ dryRun: true, snapshotDirectory });
  }

  private async processQueued(processOptions: ProcessOptions): Promise<LlmIngestionResult[]> {
    const items = Array.from(this.queue.values()).slice(0, this.maxConcurrentJobs);
    const results: LlmIngestionResult[] = [];

    if (items.length === 0) {
      return results;
    }

    for (const item of items) {
      this.queue.delete(item.artifactId);
      const result = await this.processArtifact(item, processOptions).catch(error => {
        this.logger?.error?.(
          `LLM ingestion failed for ${item.artifactId}: ${describeError(error)}`
        );
        return {
          artifactId: item.artifactId,
          stored: 0,
          skipped: 0,
          error: describeError(error)
        } satisfies LlmIngestionResult;
      });
      results.push(result);
    }

    return results;
  }

  private async processArtifact(item: QueueItem, processOptions: ProcessOptions): Promise<LlmIngestionResult> {
    const settings = this.options.providerGuard.getSettings();
    if (settings.llmProviderMode === "disabled") {
      this.logger?.warn?.(
        `Skipping LLM ingestion for ${item.artifactId} because llmProviderMode is disabled.`
      );
      return { artifactId: item.artifactId, stored: 0, skipped: 0 };
    }

    const artifact = this.options.graphStore.getArtifactById(item.artifactId);
    if (!artifact) {
      this.logger?.warn?.(`Artifact ${item.artifactId} not found; skipping.`);
      return { artifactId: item.artifactId, stored: 0, skipped: 0 };
    }

    const filePath = resolveFilePath(artifact.uri);
    if (!filePath) {
      this.logger?.warn?.(`Artifact ${artifact.id} has unsupported URI ${artifact.uri}`);
      return { artifactId: item.artifactId, stored: 0, skipped: 0 };
    }

    let content: string;
    try {
      content = await this.fileReader(filePath);
    } catch (error) {
      this.logger?.warn?.(
        `Unable to read artifact ${artifact.id} from ${filePath}: ${describeError(error)}`
      );
      return { artifactId: item.artifactId, stored: 0, skipped: 0 };
    }

    const chunks = createChunks(content, this.maxChunkCharacters);
    const known = this.collectKnownArtifacts(artifact);

    const prompt = renderRelationshipExtractionPrompt({
      rootArtifact: toPromptArtifactSummary(artifact, filePath),
      knownArtifacts: known.summaries,
      chunks,
      allowedRelationshipKinds: ALLOWED_RELATIONSHIP_KINDS
    });

    const extraction = await this.options.relationshipExtractor.extractRelationships({
      prompt,
      schema: RELATIONSHIP_RESPONSE_SCHEMA,
      tags: {
        "link-aware.artifactId": artifact.id,
        "link-aware.reason": item.reason ?? "unspecified"
      }
    } satisfies RelationshipExtractionRequest);

    const calibration = this.calibrate(extraction.relationships, {
      existingLinks: known.linkKeys,
      corroboratedLinks: known.linkKeys
    });

    if (processOptions.dryRun) {
      const snapshotPath = await this.writeDryRunSnapshot(
        processOptions.snapshotDirectory ?? this.options.storageDirectory,
        artifact,
        prompt,
        extraction,
        calibration
      );

      return {
        artifactId: artifact.id,
        stored: 0,
        skipped: calibration.length,
        dryRunSnapshotPath: snapshotPath
      } satisfies LlmIngestionResult;
    }

    let stored = 0;
    let skipped = 0;

    for (const relationship of calibration) {
      const persisted = this.persistRelationship(artifact, relationship, extraction);
      if (persisted) {
        stored += 1;
      } else {
        skipped += 1;
      }
    }

    return { artifactId: artifact.id, stored, skipped } satisfies LlmIngestionResult;
  }

  private persistRelationship(
    artifact: KnowledgeArtifact,
    relationship: CalibratedRelationship,
    extraction: RelationshipExtractionBatch
  ): boolean {
    if (!relationship.diagnosticsEligible) {
      this.logger?.info?.(
        `Skipping relationship ${relationship.sourceId} -> ${relationship.targetId} (${relationship.relationship}) due to low confidence`
      );
      return false;
    }

    const targetArtifact = this.options.graphStore.getArtifactById(relationship.targetId);
    const sourceArtifact = this.options.graphStore.getArtifactById(relationship.sourceId);

    if (!targetArtifact || !sourceArtifact) {
      this.logger?.warn?.(
        `Skipping relationship ${relationship.sourceId} -> ${relationship.targetId}: missing artifacts`
      );
      return false;
    }

    const tentativeId = `llm-${randomUUID()}`;
    this.options.graphStore.upsertLink({
      id: tentativeId,
      sourceId: relationship.sourceId,
      targetId: relationship.targetId,
      kind: relationship.relationship,
      confidence: relationship.calibratedConfidence,
      createdAt: this.now().toISOString(),
      createdBy: "llm-ingestion"
    });

    const storedLink = this.options.graphStore.getLink(
      relationship.sourceId,
      relationship.targetId,
      relationship.relationship
    );

    if (!storedLink) {
      this.logger?.warn?.(
        `Failed to retrieve link after upsert for ${relationship.sourceId} -> ${relationship.targetId}`
      );
      return false;
    }

    this.options.graphStore.storeLlmEdgeProvenance({
      linkId: storedLink.id,
      templateId: extraction.prompt.templateId,
      templateVersion: extraction.prompt.templateVersion,
      promptHash: extraction.promptHash,
      modelId: extraction.modelId ?? "unknown",
      issuedAt: extraction.issuedAt,
      createdAt: this.now().toISOString(),
      confidenceTier: relationship.confidenceTier,
      calibratedConfidence: relationship.calibratedConfidence,
      rawConfidence: relationship.confidence,
      diagnosticsEligible: relationship.diagnosticsEligible,
      shadowed: relationship.shadowed,
      supportingChunks: relationship.supportingChunks,
      rationale: relationship.rationale,
      promotionCriteria: relationship.promotionCriteria
    });

    return true;
  }

  private async writeDryRunSnapshot(
    baseDirectory: string,
    artifact: KnowledgeArtifact,
    prompt: RelationshipExtractionPrompt,
    extraction: RelationshipExtractionBatch,
    calibration: CalibratedRelationship[]
  ): Promise<string> {
    const directory = path.join(baseDirectory, "llm-ingestion-snapshots");
    await fsp.mkdir(directory, { recursive: true });

    const timestamp = this.now().toISOString().replace(/[:.]/g, "-");
    const fileName = `${sanitizeFileName(artifact.id)}-${timestamp}.json`;
    const fullPath = path.join(directory, fileName);

    const snapshot = {
      metadata: {
        templateId: prompt.templateId,
        templateVersion: prompt.templateVersion,
        promptHash: prompt.promptHash,
        modelId: extraction.modelId ?? "unknown",
        issuedAt: extraction.issuedAt
      },
      relationships: calibration.map(rel => ({
        sourceId: rel.sourceId,
        targetId: rel.targetId,
        relationship: rel.relationship,
        confidence: rel.calibratedConfidence,
        confidenceLabel: rel.rawConfidenceLabel ?? rel.confidenceTier,
        confidenceTier: rel.confidenceTier,
        diagnosticsEligible: rel.diagnosticsEligible,
        // Shadowed edges already exist in the graph with stronger evidence; we surface them for auditing but do not enable diagnostics.
        shadowed: rel.shadowed,
        supportingChunks: rel.supportingChunks,
        promotionCriteria: rel.promotionCriteria,
        rationale: rel.rationale
      }))
    };

    await fsp.writeFile(fullPath, JSON.stringify(snapshot, null, 2));
    return fullPath;
  }

  private collectKnownArtifacts(artifact: KnowledgeArtifact): {
    summaries: PromptArtifactSummary[];
    linkKeys: Set<string>;
  } {
    const summaries: PromptArtifactSummary[] = [];
    const linkKeys = new Set<string>();

    const neighbors = this.options.graphStore.listLinkedArtifacts(artifact.id);

    for (const neighbor of neighbors) {
      const summary: PromptArtifactSummary = {
        id: neighbor.artifact.id,
        uri: neighbor.artifact.uri,
        layer: neighbor.artifact.layer,
        title: path.basename(resolveFilePath(neighbor.artifact.uri) ?? neighbor.artifact.uri)
      };
      summaries.push(summary);

      const outgoingKey = createLinkKey(artifact.id, neighbor.artifact.id, neighbor.kind);
      const incomingKey = createLinkKey(neighbor.artifact.id, artifact.id, neighbor.kind);
      linkKeys.add(outgoingKey);
      linkKeys.add(incomingKey);
    }

    return { summaries, linkKeys };
  }
}

function createChunks(content: string, maxCharacters: number): PromptChunkSummary[] {
  if (content.length === 0) {
    return [
      {
        id: "chunk-0",
        startLine: 1,
        endLine: 1,
        hash: createHash("sha1").update("\n").digest("hex").slice(0, 12),
        text: ""
      }
    ];
  }

  const lines = content.split(/\r?\n/);
  const chunks: PromptChunkSummary[] = [];

  let currentText: string[] = [];
  let startLine = 1;

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    const prospective = [...currentText, line].join("\n");

    if (prospective.length > maxCharacters && currentText.length > 0) {
      const chunkText = currentText.join("\n");
      chunks.push(makeChunk(chunks.length, startLine, index, chunkText));
      currentText = [line];
      startLine = index + 1;
    } else {
      currentText.push(line);
    }
  }

  if (currentText.length > 0) {
    const chunkText = currentText.join("\n");
    chunks.push(makeChunk(chunks.length, startLine, lines.length, chunkText));
  }

  return chunks;
}

function makeChunk(index: number, startLine: number, endLine: number, text: string): PromptChunkSummary {
  const hash = createHash("sha1").update(text).digest("hex").slice(0, 12);
  return {
    id: `chunk-${index + 1}`,
    startLine,
    endLine,
    hash,
    text
  } satisfies PromptChunkSummary;
}

function toPromptArtifactSummary(artifact: KnowledgeArtifact, filePath: string): PromptArtifactSummary {
  return {
    id: artifact.id,
    uri: artifact.uri,
    layer: artifact.layer,
    title: path.basename(filePath)
  } satisfies PromptArtifactSummary;
}

function resolveFilePath(uri: string): string | null {
  if (uri.startsWith("file://")) {
    try {
      return fileURLToPath(uri);
    } catch {
      return null;
    }
  }

  if (path.isAbsolute(uri)) {
    return uri;
  }

  return null;
}

function createLinkKey(sourceId: string, targetId: string, kind: LinkRelationshipKind): string {
  return `${sourceId}::${targetId}::${kind}`;
}

function sanitizeFileName(value: string): string {
  return value.replace(/[^a-zA-Z0-9-]+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
}

function describeError(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return String(error);
}
