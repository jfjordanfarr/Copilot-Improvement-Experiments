import type { LinkRelationshipKind } from "../../domain/artifacts";

export type ConfidenceTier = "high" | "medium" | "low";

export interface RelationshipExtractionPrompt {
  templateId: string;
  templateVersion: string;
  promptText: string;
  promptHash: string;
  issuedAt: string;
}

export interface ModelInvocationRequest {
  prompt: string;
  schema?: unknown;
  tags?: Record<string, string>;
}

export interface ModelUsage {
  promptTokens?: number;
  completionTokens?: number;
  totalTokens?: number;
}

export interface ModelInvocationResult {
  response: string | object;
  modelId?: string;
  usage?: ModelUsage;
}

export type ModelInvoker = (request: ModelInvocationRequest) => Promise<ModelInvocationResult>;

export interface RelationshipExtractionRequest {
  prompt: RelationshipExtractionPrompt;
  schema?: unknown;
  tags?: Record<string, string>;
}

export interface RawRelationshipCandidate {
  sourceId: string;
  targetId: string;
  relationship: LinkRelationshipKind;
  confidence?: number;
  confidenceLabel?: string;
  rationale?: string;
  supportingChunks?: string[];
}

export interface RelationshipExtractionBatch {
  prompt: RelationshipExtractionPrompt;
  promptHash: string;
  modelId?: string;
  issuedAt: string;
  relationships: RawRelationshipCandidate[];
  responseText: string;
  usage?: ModelUsage;
}

export interface RelationshipExtractorOptions {
  invokeModel: ModelInvoker;
  logger?: RelationshipExtractorLogger;
}

export interface RelationshipExtractorLogger {
  warn(message: string): void;
  error(message: string): void;
}

export class RelationshipExtractorError extends Error {
  constructor(message: string, public readonly details?: unknown) {
    super(message);
  }
}

export class RelationshipExtractor {
  private readonly invokeModel: ModelInvoker;
  private readonly logger?: RelationshipExtractorLogger;

  constructor(options: RelationshipExtractorOptions) {
    this.invokeModel = options.invokeModel;
    this.logger = options.logger;
  }

  async extractRelationships(
    request: RelationshipExtractionRequest
  ): Promise<RelationshipExtractionBatch> {
    const { prompt, schema, tags } = request;

    const result = await this.invokeModel({
      prompt: prompt.promptText,
      schema,
      tags: {
        ...tags,
        "link-aware.template": prompt.templateId,
        "link-aware.version": prompt.templateVersion,
        "link-aware.prompt-hash": prompt.promptHash
      }
    });

    const rawText = typeof result.response === "string" ? result.response : JSON.stringify(result.response);

    let parsed: unknown;
    try {
      parsed = typeof result.response === "string" ? JSON.parse(result.response) : result.response;
    } catch (error) {
      this.logger?.warn?.("model response was not valid JSON");
      throw new RelationshipExtractorError("Model response was not valid JSON", {
        cause: error,
        response: rawText
      });
    }

    const validation = validateExtractionPayload(parsed);
    if (!validation.ok) {
      this.logger?.warn?.(`model response failed validation: ${validation.reason}`);
      throw new RelationshipExtractorError("Model response failed validation", {
        reason: validation.reason,
        response: rawText
      });
    }

    return {
      prompt,
      promptHash: prompt.promptHash,
      modelId: result.modelId,
      issuedAt: prompt.issuedAt,
      relationships: validation.payload.relationships,
      responseText: rawText,
      usage: result.usage
    } satisfies RelationshipExtractionBatch;
  }
}

interface ValidatorSuccess {
  ok: true;
  payload: { relationships: RawRelationshipCandidate[] };
}

interface ValidatorFailure {
  ok: false;
  reason: string;
}

function validateExtractionPayload(value: unknown): ValidatorSuccess | ValidatorFailure {
  if (typeof value !== "object" || value === null) {
    return { ok: false, reason: "response must be a JSON object" };
  }

  const record = value as Record<string, unknown>;
  const relationships = record.relationships;

  if (!Array.isArray(relationships)) {
    return { ok: false, reason: "response.relationships must be an array" };
  }

  const parsed: RawRelationshipCandidate[] = [];

  for (const [index, entry] of relationships.entries()) {
    if (typeof entry !== "object" || entry === null) {
      return { ok: false, reason: `relationship[${index}] must be an object` };
    }

    const candidate = entry as Record<string, unknown>;
    const sourceId = candidate.sourceId;
    const targetId = candidate.targetId;
    const relationship = candidate.relationship;

    if (typeof sourceId !== "string" || sourceId.length === 0) {
      return { ok: false, reason: `relationship[${index}].sourceId must be a non-empty string` };
    }

    if (typeof targetId !== "string" || targetId.length === 0) {
      return { ok: false, reason: `relationship[${index}].targetId must be a non-empty string` };
    }

    if (typeof relationship !== "string") {
      return { ok: false, reason: `relationship[${index}].relationship must be a string` };
    }

    const normalizedRelationship = relationship as LinkRelationshipKind;

    const confidence = toOptionalNumber(candidate.confidence);
    const confidenceLabel = typeof candidate.confidenceLabel === "string" ? candidate.confidenceLabel : undefined;
    const rationale = typeof candidate.rationale === "string" ? candidate.rationale : undefined;
    const supportingChunks = Array.isArray(candidate.supportingChunks)
      ? candidate.supportingChunks.filter((chunkId): chunkId is string => typeof chunkId === "string")
      : undefined;

    parsed.push({
      sourceId,
      targetId,
      relationship: normalizedRelationship,
      confidence,
      confidenceLabel,
      rationale,
      supportingChunks
    });
  }

  return { ok: true, payload: { relationships: parsed } } satisfies ValidatorSuccess;
}

function toOptionalNumber(value: unknown): number | undefined {
  if (typeof value !== "number") {
    return undefined;
  }

  if (!Number.isFinite(value)) {
    return undefined;
  }

  return Math.max(0, Math.min(1, value));
}
