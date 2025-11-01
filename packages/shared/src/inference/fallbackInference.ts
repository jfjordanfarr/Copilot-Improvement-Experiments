import crypto from "node:crypto";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  ArtifactLayer,
  KnowledgeArtifact,
  LinkRelationship,
  LinkRelationshipKind
} from "../domain/artifacts";

export interface ArtifactSeed {
  id?: string;
  uri: string;
  layer: ArtifactLayer;
  language?: string;
  owner?: string;
  hash?: string;
  metadata?: Record<string, unknown>;
  lastSynchronizedAt?: string;
  content?: string;
}

export interface RelationshipHint {
  sourceUri: string;
  targetUri: string;
  kind?: LinkRelationshipKind;
  confidence?: number;
  rationale?: string;
}

export interface FallbackInferenceInput {
  seeds: ArtifactSeed[];
  contentProvider?: (uri: string) => Promise<string | undefined>;
  hints?: RelationshipHint[];
}

export interface FallbackInferenceOptions {
  now?: () => Date;
  llm?: FallbackLLMBridge;
  minContentLengthForLLM?: number;
}

export interface FallbackInferenceResult {
  artifacts: KnowledgeArtifact[];
  links: LinkRelationship[];
  traces: InferenceTraceEntry[];
}

export type TraceOrigin = "heuristic" | "llm" | "hint";

export interface InferenceTraceEntry {
  sourceUri: string;
  targetUri: string;
  kind: LinkRelationshipKind;
  origin: TraceOrigin;
  confidence: number;
  rationale: string;
}

export interface KnowledgeArtifactSummary {
  id: string;
  uri: string;
  layer: ArtifactLayer;
}

export interface LLMRelationshipRequest {
  source: KnowledgeArtifact;
  content: string;
  candidateArtifacts: KnowledgeArtifactSummary[];
}

export interface LLMRelationshipSuggestion {
  targetUri: string;
  kind: LinkRelationshipKind;
  confidence?: number;
  rationale?: string;
}

export interface FallbackLLMBridge {
  label?: string;
  suggest(request: LLMRelationshipRequest): Promise<LLMRelationshipSuggestion[]>;
}

interface EnrichedArtifact {
  artifact: KnowledgeArtifact;
  seed: ArtifactSeed;
  content?: string;
  comparablePath: string;
  stem: string;
  basename: string;
}

interface MatchCandidate {
  target: EnrichedArtifact;
  confidence: number;
  rationale: string;
  context: MatchContext;
}

type MatchContext = "text" | "import" | "directive" | "hint";

const FALLBACK_HEURISTIC_AUTHOR = "fallback-heuristic";
const FALLBACK_HINT_AUTHOR = "fallback-hint";
const DEFAULT_LLM_LABEL = "fallback-llm";
const DEFAULT_MIN_CONTENT_FOR_LLM = 64;
const MARKDOWN_LINK = /\[[^\]]+\]\(([^)]+)\)/g;
const MARKDOWN_WIKI_LINK = /\[\[([^\]]+)\]\]/g;
const LINK_DIRECTIVE = /@link\s+([^\s]+)/g;
const MODULE_REFERENCE = /(?:(?:import|export)\s+[^"'`]*?["'`]([^"'`]+)["'`]|require\(\s*["'`]([^"'`]+)["'`]\s*\))/g;

export async function inferFallbackGraph(
  input: FallbackInferenceInput,
  options: FallbackInferenceOptions = {}
): Promise<FallbackInferenceResult> {
  const nowFactory = options.now ?? (() => new Date());
  const minContentForLLM = options.minContentLengthForLLM ?? DEFAULT_MIN_CONTENT_FOR_LLM;

  const enrichedArtifacts = await enrichArtifacts(input, nowFactory);
  const linkAccumulator = new Map<string, LinkRelationship>();
  const traces: InferenceTraceEntry[] = [];

  for (const source of enrichedArtifacts) {
    if (!source.content || !source.content.trim()) {
      continue;
    }

    applyMarkdownHeuristics(source, enrichedArtifacts, (match) => {
      addLink(match, source, linkAccumulator, traces, nowFactory, "heuristic", FALLBACK_HEURISTIC_AUTHOR);
    });

    applyImportHeuristics(source, enrichedArtifacts, (match) => {
      addLink(match, source, linkAccumulator, traces, nowFactory, "heuristic", FALLBACK_HEURISTIC_AUTHOR);
    });

    applyDirectiveHeuristics(source, enrichedArtifacts, (match) => {
      addLink(match, source, linkAccumulator, traces, nowFactory, "heuristic", FALLBACK_HEURISTIC_AUTHOR);
    });

    if (options.llm && source.content.length >= minContentForLLM) {
      await applyLLMSuggestions(
        source,
        enrichedArtifacts,
        linkAccumulator,
        traces,
        nowFactory,
        options.llm
      );
    }
  }

  if (input.hints?.length) {
    applyExplicitHints(input.hints, enrichedArtifacts, linkAccumulator, traces, nowFactory);
  }

  return {
    artifacts: enrichedArtifacts.map((item) => item.artifact),
    links: Array.from(linkAccumulator.values()),
    traces
  };
}

async function enrichArtifacts(
  input: FallbackInferenceInput,
  nowFactory: () => Date
): Promise<EnrichedArtifact[]> {
  const seenUris = new Map<string, number>();
  const artifacts: EnrichedArtifact[] = [];

  for (const seed of input.seeds) {
    const normalizedUri = seed.uri.trim();
    if (!normalizedUri) {
      continue;
    }

    const ordinal = seenUris.get(normalizedUri) ?? 0;
    seenUris.set(normalizedUri, ordinal + 1);

    const artifact: KnowledgeArtifact = {
      id: seed.id ?? createDeterministicArtifactId(normalizedUri, ordinal),
      uri: normalizedUri,
      layer: seed.layer,
      language: seed.language,
      owner: seed.owner,
      hash: seed.hash,
      metadata: seed.metadata,
      lastSynchronizedAt: seed.hash ? nowFactory().toISOString() : seed.lastSynchronizedAt
    };

    const content = seed.content ?? (await loadContent(normalizedUri, input.contentProvider));
    const comparablePath = toComparablePath(normalizedUri);
    const basename = path.basename(comparablePath);
    const stem = basename.includes(".") ? basename.slice(0, basename.lastIndexOf(".")) : basename;

    artifacts.push({ artifact, seed, content: content ?? undefined, comparablePath, basename, stem });
  }

  return artifacts;
}

async function loadContent(
  uri: string,
  provider?: (uri: string) => Promise<string | undefined>
): Promise<string | undefined> {
  if (!provider) {
    return undefined;
  }

  try {
    const content = await provider(uri);
    return typeof content === "string" ? content : undefined;
  } catch {
    return undefined;
  }
}

function applyMarkdownHeuristics(
  source: EnrichedArtifact,
  candidates: EnrichedArtifact[],
  register: (match: MatchCandidate) => void
): void {
  if (!isDocumentLayer(source.artifact.layer)) {
    return;
  }

  let match: RegExpExecArray | null;

  while ((match = MARKDOWN_LINK.exec(source.content ?? "")) !== null) {
    const reference = cleanupReference(match[1]);
    if (!reference) {
      continue;
    }

    const candidate = resolveReference(reference, source, candidates, "text", `markdown link ${match[0]}`);
    if (candidate) {
      register(candidate);
    }
  }

  MARKDOWN_LINK.lastIndex = 0;

  while ((match = MARKDOWN_WIKI_LINK.exec(source.content ?? "")) !== null) {
    const reference = cleanupReference(match[1]);
    if (!reference) {
      continue;
    }

    const candidate = resolveReference(reference, source, candidates, "text", `wiki link [[${match[1]}]]`);
    if (candidate) {
      register(candidate);
    }
  }

  MARKDOWN_WIKI_LINK.lastIndex = 0;
}

function applyImportHeuristics(
  source: EnrichedArtifact,
  candidates: EnrichedArtifact[],
  register: (match: MatchCandidate) => void
): void {
  if (!isImplementationLayer(source.artifact.layer)) {
    return;
  }

  let match: RegExpExecArray | null;
  const content = source.content ?? "";

  while ((match = MODULE_REFERENCE.exec(content)) !== null) {
    const rawReference = match[1] ?? match[2] ?? "";
    const referenceStart = computeReferenceStart(match, rawReference);
    if (referenceStart !== null && isWithinComment(content, referenceStart)) {
      continue;
    }

    const reference = cleanupReference(rawReference);
    if (!reference) {
      continue;
    }

    const candidate = resolveReference(reference, source, candidates, "import", `import ${reference}`);
    if (candidate) {
      register(candidate);
    }
  }

  MODULE_REFERENCE.lastIndex = 0;
}

function applyDirectiveHeuristics(
  source: EnrichedArtifact,
  candidates: EnrichedArtifact[],
  register: (match: MatchCandidate) => void
): void {
  let match: RegExpExecArray | null;

  while ((match = LINK_DIRECTIVE.exec(source.content ?? "")) !== null) {
    const reference = cleanupReference(match[1]);
    if (!reference) {
      continue;
    }

    const candidate = resolveReference(reference, source, candidates, "directive", `@link ${reference}`);
    if (candidate) {
      register(candidate);
    }
  }

  LINK_DIRECTIVE.lastIndex = 0;
}

async function applyLLMSuggestions(
  source: EnrichedArtifact,
  candidates: EnrichedArtifact[],
  accumulator: Map<string, LinkRelationship>,
  traces: InferenceTraceEntry[],
  nowFactory: () => Date,
  bridge: FallbackLLMBridge
): Promise<void> {
  const suggestions = await bridge.suggest({
    source: source.artifact,
    content: source.content ?? "",
    candidateArtifacts: candidates
      .filter((candidate) => candidate.artifact.id !== source.artifact.id)
      .map((candidate) => ({
        id: candidate.artifact.id,
        uri: candidate.artifact.uri,
        layer: candidate.artifact.layer
      }))
  });

  if (!suggestions?.length) {
    return;
  }

  const label = bridge.label ?? DEFAULT_LLM_LABEL;

  for (const suggestion of suggestions) {
    const target = candidates.find((candidate) =>
      candidate.artifact.uri === suggestion.targetUri || candidate.artifact.id === suggestion.targetUri
    );

    if (!target) {
      continue;
    }

    const confidence = clampConfidence(suggestion.confidence ?? 0.7);
    const rationale = suggestion.rationale ?? "LLM fallback suggestion";
    const match: MatchCandidate = {
      target,
      confidence,
      rationale,
      context: "directive"
    };

    addLink(match, source, accumulator, traces, nowFactory, "llm", label);
  }
}

function applyExplicitHints(
  hints: RelationshipHint[],
  candidates: EnrichedArtifact[],
  accumulator: Map<string, LinkRelationship>,
  traces: InferenceTraceEntry[],
  nowFactory: () => Date
): void {
  for (const hint of hints) {
    const source = candidates.find((candidate) => candidate.artifact.uri === hint.sourceUri);
    const target = candidates.find((candidate) => candidate.artifact.uri === hint.targetUri);

    if (!source || !target) {
      continue;
    }

    const match: MatchCandidate = {
      target,
      confidence: clampConfidence(hint.confidence ?? 0.6),
      rationale: hint.rationale ?? "Explicit fallback hint",
      context: "hint"
    };

    addLink(match, source, accumulator, traces, nowFactory, "hint", FALLBACK_HINT_AUTHOR);
  }
}

function addLink(
  candidate: MatchCandidate,
  source: EnrichedArtifact,
  accumulator: Map<string, LinkRelationship>,
  traces: InferenceTraceEntry[],
  nowFactory: () => Date,
  origin: TraceOrigin,
  createdBy: string
): void {
  if (candidate.target.artifact.id === source.artifact.id) {
    return;
  }

  const kind = inferLinkKind(source.artifact.layer, candidate.target.artifact.layer, candidate.context);
  const key = `${source.artifact.id}|${candidate.target.artifact.id}|${kind}`;
  const createdAt = nowFactory().toISOString();
  const linkId = computeLinkId(source.artifact.id, candidate.target.artifact.id, kind);
  const normalizedConfidence = clampConfidence(candidate.confidence);

  const existing = accumulator.get(key);
  if (!existing || existing.confidence < normalizedConfidence) {
    accumulator.set(key, {
      id: existing?.id ?? linkId,
      sourceId: source.artifact.id,
      targetId: candidate.target.artifact.id,
      kind,
      confidence: normalizedConfidence,
      createdAt,
      createdBy
    });
  }

  traces.push({
    sourceUri: source.artifact.uri,
    targetUri: candidate.target.artifact.uri,
    kind,
    origin,
    confidence: normalizedConfidence,
    rationale: candidate.rationale
  });
}

function resolveReference(
  reference: string,
  source: EnrichedArtifact,
  candidates: EnrichedArtifact[],
  context: MatchContext,
  rationale: string
): MatchCandidate | null {
  const normalizedReference = reference.replace(/"|'/g, "").trim();
  if (!normalizedReference || isExternalLink(normalizedReference)) {
    return null;
  }

  const sourceDir = path.dirname(source.comparablePath);
  const anchorStripped = normalizedReference.split("#")[0];
  const referenceVariants = buildReferenceVariants(anchorStripped, sourceDir);

  let bestMatch: MatchCandidate | null = null;

  for (const variant of referenceVariants) {
    for (const candidate of candidates) {
      if (candidate.artifact.id === source.artifact.id) {
        continue;
      }

      const matchScore = evaluateVariantMatch(variant, anchorStripped, candidate);
      if (!matchScore) {
        continue;
      }

      if (!bestMatch || matchScore.confidence > bestMatch.confidence) {
        bestMatch = {
          target: candidate,
          confidence: matchScore.confidence,
          rationale: `${rationale} → ${matchScore.rationale}`,
          context
        };
      }
    }
  }

  return bestMatch;
}

function evaluateVariantMatch(
  variant: string,
  rawReference: string,
  candidate: EnrichedArtifact
): { confidence: number; rationale: string } | null {
  if (variant === candidate.comparablePath) {
    return { confidence: 0.8, rationale: `exact path match ${variant}` };
  }

  if (candidate.basename === variant) {
    return { confidence: 0.7, rationale: `basename match ${variant}` };
  }

  if (candidate.stem === variant) {
    return { confidence: 0.6, rationale: `stem match ${variant}` };
  }

  const trimmedReference = rawReference.replace(/\.\//g, "");
  if (candidate.basename === trimmedReference) {
    return { confidence: 0.55, rationale: `relative basename match ${trimmedReference}` };
  }

  if (candidate.stem === trimmedReference) {
    return { confidence: 0.5, rationale: `relative stem match ${trimmedReference}` };
  }

  return null;
}

function buildReferenceVariants(reference: string, sourceDir: string): string[] {
  const variants = new Set<string>();
  const cleaned = reference.replace(/\\/g, "/");

  if (!cleaned) {
    return [];
  }

  variants.add(toComparablePath(cleaned));

  const extension = path.extname(cleaned).toLowerCase();
  if ([".js", ".mjs", ".cjs"].includes(extension)) {
    const replacements = extension === ".mjs"
      ? [".mts", ".ts"]
      : extension === ".cjs"
        ? [".cts", ".ts"]
        : [".ts", ".tsx"];

    for (const replacement of replacements) {
      const swapped = cleaned.slice(0, -extension.length) + replacement;
      variants.add(toComparablePath(swapped));
      variants.add(toComparablePath(path.join(sourceDir, swapped)));
    }
  }

  if (cleaned.startsWith(".")) {
    variants.add(toComparablePath(path.join(sourceDir, cleaned)));
  }

  if (!path.extname(cleaned)) {
    const popularExtensions = [".md", ".mdx", ".markdown", ".ts", ".tsx", ".js", ".jsx", ".json"];
    for (const extension of popularExtensions) {
      variants.add(toComparablePath(`${cleaned}${extension}`));
      variants.add(toComparablePath(path.join(sourceDir, `${cleaned}${extension}`)));
    }
  }

  variants.add(cleaned.toLowerCase());
  variants.add(path.basename(cleaned).toLowerCase());
  variants.add(stem(cleaned));

  return Array.from(variants);
}

function isDocumentLayer(layer: ArtifactLayer): boolean {
  return layer === "vision" || layer === "requirements" || layer === "architecture";
}

function isImplementationLayer(layer: ArtifactLayer): boolean {
  return layer === "implementation" || layer === "code";
}

function cleanupReference(reference: string | undefined): string {
  return (reference ?? "").trim();
}

function isExternalLink(value: string): boolean {
  return /^https?:\/\//i.test(value);
}

function createDeterministicArtifactId(uri: string, ordinal: number): string {
  const hash = crypto.createHash("sha1").update(`${uri}|${ordinal}`).digest("hex").slice(0, 12);
  return `fallback-artifact-${hash}`;
}

function computeLinkId(sourceId: string, targetId: string, kind: LinkRelationshipKind): string {
  const key = `${sourceId}|${targetId}|${kind}`;
  const hash = crypto.createHash("sha1").update(key).digest("hex").slice(0, 12);
  return `fallback-link-${hash}`;
}

function toComparablePath(uri: string): string {
  try {
    if (uri.startsWith("file://")) {
      return normalizePath(fileURLToPath(uri));
    }
  } catch {
    // no-op: fall through to generic normalisation
  }

  return normalizePath(uri);
}

function normalizePath(raw: string): string {
  return path.normalize(raw).replace(/\\/g, "/").toLowerCase();
}

function stem(value: string): string {
  const basename = path.basename(value).toLowerCase();
  const extension = path.extname(basename);
  return extension ? basename.slice(0, basename.length - extension.length) : basename;
}

function computeReferenceStart(match: RegExpExecArray, rawReference: string): number | null {
  if (!match[0]) {
    return null;
  }

  const offset = match[0].indexOf(rawReference);
  if (offset < 0) {
    return match.index ?? null;
  }

  return (match.index ?? 0) + offset;
}

function isWithinComment(content: string, index: number): boolean {
  let inBlockComment = false;
  let inLineComment = false;

  for (let i = 0; i < index; i++) {
    const char = content[i];
    const next = content[i + 1];

    if (inLineComment) {
      if (char === "\n") {
        inLineComment = false;
      }
      continue;
    }

    if (inBlockComment) {
      if (char === "*" && next === "/") {
        inBlockComment = false;
        i++;
      }
      continue;
    }

    if (char === "/" && next === "*") {
      inBlockComment = true;
      i++;
      continue;
    }

    if (char === "/" && next === "/") {
      inLineComment = true;
      i++;
      continue;
    }
  }

  return inBlockComment || inLineComment;
}

function clampConfidence(confidence: number): number {
  if (Number.isNaN(confidence)) {
    return 0.5;
  }
  return Math.max(0, Math.min(1, confidence));
}

function inferLinkKind(
  sourceLayer: ArtifactLayer,
  targetLayer: ArtifactLayer,
  context: MatchContext
): LinkRelationshipKind {
  if (context === "import" && isImplementationLayer(sourceLayer) && isImplementationLayer(targetLayer)) {
    return "depends_on";
  }

  if (sourceLayer === "vision" || sourceLayer === "requirements") {
    return "documents";
  }

  if (sourceLayer === "architecture" && (targetLayer === "implementation" || targetLayer === "code")) {
    return "implements";
  }

  if ((sourceLayer === "implementation" || sourceLayer === "code") && targetLayer === "architecture") {
    return "implements";
  }

  return "references";
}
