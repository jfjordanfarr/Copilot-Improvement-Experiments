import crypto from "node:crypto";
import path from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

import {
  ArtifactLayer,
  KnowledgeArtifact,
  LinkRelationship,
  LinkRelationshipKind
} from "../domain/artifacts";
import {
  collectIdentifierUsage,
  extractLocalImportNames,
  hasRuntimeUsage,
  isLikelyTypeDefinitionSpecifier
} from "../language/typeScriptAstUtils";

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
  context: MatchContext;
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

type MatchContext =
  | "text"
  | "import"
  | "include"
  | "directive"
  | "hint"
  | "call"
  | "require"
  | "use";

const FALLBACK_HEURISTIC_AUTHOR = "fallback-heuristic";
const FALLBACK_HINT_AUTHOR = "fallback-hint";
const DEFAULT_LLM_LABEL = "fallback-llm";
const DEFAULT_MIN_CONTENT_FOR_LLM = 64;
const MARKDOWN_LINK = /\[[^\]]+\]\(([^)]+)\)/g;
const MARKDOWN_WIKI_LINK = /\[\[([^\]]+)\]\]/g;
const LINK_DIRECTIVE = /@link\s+([^\s]+)/g;
const MODULE_REFERENCE = /(?:(?:import|export)\s+[^"'`]*?["'`]([^"'`]+)["'`]|require\(\s*["'`]([^"'`]+)["'`]\s*\))/g;
const MODULE_REFERENCE_EXTENSIONS = new Set([
  ".ts",
  ".tsx",
  ".mts",
  ".cts",
  ".js",
  ".jsx",
  ".mjs",
  ".cjs"
]);
const PYTHON_IMPORT_PATTERN = /^\s*import\s+(.+)$/gm;
const PYTHON_FROM_IMPORT_PATTERN = /^\s*from\s+([.\w]+)\s+import\s+(.+)$/gm;
const INCLUDE_DIRECTIVE = /#\s*include\s*(?:"([^"\n]+)"|<([^>\n]+)>)/g;
const TYPESCRIPT_EXTENSIONS = new Set([".ts", ".tsx", ".mts", ".cts"]);
const C_FUNCTION_DEFINITION_PATTERN = /([A-Za-z_][A-Za-z0-9_\s*]*?)\b([A-Za-z_][A-Za-z0-9_]*)\s*\([^;{}]*\)\s*\{/gm;
const C_FUNCTION_CALL_PATTERN = /\b([A-Za-z_][A-Za-z0-9_]*)\s*\(/g;
const C_RESERVED_IDENTIFIERS = new Set([
  "if",
  "else",
  "for",
  "while",
  "switch",
  "return",
  "sizeof",
  "do",
  "case",
  "break",
  "continue",
  "goto"
]);
const RUST_MOD_STATEMENT = /^\s*((?:pub(?:\([^)]*\))?\s+)?)mod\s+([A-Za-z_][A-Za-z0-9_]*)\s*;/gm;
const RUST_USE_STATEMENT = /^\s*((?:pub(?:\([^)]*\))?\s+)?)use\s+([^;]+);/gm;
const RUST_SEGMENT_TRIMMERS = new Set(["crate", "self", "super"]);
const RUST_PATH_REFERENCE = /(?:\bcrate|\$crate|\bself|\bsuper)(?:::[A-Za-z_][A-Za-z0-9_]*!?)+/g;
const JAVA_IMPORT_STATEMENT = /^\s*import\s+([^;]+);/gm;
const RUBY_REQUIRE_RELATIVE_PATTERN = /require_relative\s+["']([^"'\s]+)["']/g;

export async function inferFallbackGraph(
  input: FallbackInferenceInput,
  options: FallbackInferenceOptions = {}
): Promise<FallbackInferenceResult> {
  const nowFactory = options.now ?? (() => new Date());
  const minContentForLLM = options.minContentLengthForLLM ?? DEFAULT_MIN_CONTENT_FOR_LLM;

  const enrichedArtifacts = await enrichArtifacts(input, nowFactory);
  const languageContexts = buildLanguageContexts(enrichedArtifacts);
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

    applyIncludeHeuristics(source, enrichedArtifacts, (match) => {
      addLink(match, source, linkAccumulator, traces, nowFactory, "heuristic", FALLBACK_HEURISTIC_AUTHOR);
    });

    applyDirectiveHeuristics(source, enrichedArtifacts, (match) => {
      addLink(match, source, linkAccumulator, traces, nowFactory, "heuristic", FALLBACK_HEURISTIC_AUTHOR);
    });

    applyCFunctionCallHeuristics(source, languageContexts.c, (match) => {
      addLink(match, source, linkAccumulator, traces, nowFactory, "heuristic", FALLBACK_HEURISTIC_AUTHOR);
    });

    applyRustHeuristics(source, languageContexts.rust, (match) => {
      addLink(match, source, linkAccumulator, traces, nowFactory, "heuristic", FALLBACK_HEURISTIC_AUTHOR);
    });

    applyJavaImportHeuristics(source, languageContexts.java, (match) => {
      addLink(match, source, linkAccumulator, traces, nowFactory, "heuristic", FALLBACK_HEURISTIC_AUTHOR);
    });

    applyRubyRequireHeuristics(source, enrichedArtifacts, (match) => {
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

interface LanguageContexts {
  c: CContext;
  rust: RustContext;
  java: JavaContext;
}

interface CContext {
  functionIndex: Map<string, EnrichedArtifact[]>;
}

interface RustContext {
  moduleIndex: Map<string, EnrichedArtifact[]>;
}

interface JavaContext {
  packageIndex: Map<string, EnrichedArtifact>;
}

interface RustUseTarget {
  moduleName: string;
  origin: "base" | "type";
}

function buildLanguageContexts(artifacts: EnrichedArtifact[]): LanguageContexts {
  return {
    c: buildCContext(artifacts),
    rust: buildRustContext(artifacts),
    java: buildJavaContext(artifacts)
  } satisfies LanguageContexts;
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

  const content = source.content ?? "";
  const extension = path.extname(source.comparablePath).toLowerCase();

  if (extension === ".py") {
    applyPythonImportHeuristics(source, candidates, register);
  }

  if (!MODULE_REFERENCE_EXTENSIONS.has(extension)) {
    return;
  }

  let match: RegExpExecArray | null;
  const typeScriptRuntimeInfo = buildTypeScriptImportRuntimeInfo(source);

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

    const isImportOrExportMatch = Boolean(match[1]);
    if (isImportOrExportMatch && typeScriptRuntimeInfo) {
      const runtimeInfo = typeScriptRuntimeInfo.get(reference);
      if (runtimeInfo && (!runtimeInfo.hasRuntimeUsage || runtimeInfo.isTypeOnly)) {
        continue;
      }
    }

    const candidate = resolveReference(reference, source, candidates, "import", `import ${reference}`);
    if (candidate) {
      register(candidate);
    }
  }

  MODULE_REFERENCE.lastIndex = 0;
}

function applyPythonImportHeuristics(
  source: EnrichedArtifact,
  candidates: EnrichedArtifact[],
  register: (match: MatchCandidate) => void
): void {
  const content = source.content ?? "";
  if (!content.trim()) {
    return;
  }

  const seen = new Set<string>();

  const recordReferences = (references: string[], rationale: string): void => {
    for (const reference of references) {
      if (!reference || seen.has(reference)) {
        continue;
      }

      const candidate = resolveReference(reference, source, candidates, "import", rationale);
      if (candidate) {
        register(candidate);
        seen.add(reference);
      }
    }
  };

  let fromMatch: RegExpExecArray | null;
  while ((fromMatch = PYTHON_FROM_IMPORT_PATTERN.exec(content)) !== null) {
    const modulePart = stripPythonInlineComment(fromMatch[1]);
    const importSpec = stripPythonInlineComment(fromMatch[2]);
    const importedNames = splitPythonImportList(importSpec);
    const references = collectPythonReferenceCandidates(modulePart, importedNames, source);
    recordReferences(references, `python from import ${modulePart || "."}`);
  }
  PYTHON_FROM_IMPORT_PATTERN.lastIndex = 0;

  let importMatch: RegExpExecArray | null;
  while ((importMatch = PYTHON_IMPORT_PATTERN.exec(content)) !== null) {
    const modulesSpec = stripPythonInlineComment(importMatch[1]);
    const modules = splitPythonImportList(modulesSpec);
    for (const moduleSpecifier of modules) {
      const references = collectPythonReferenceCandidates(moduleSpecifier, [], source);
      recordReferences(references, `python import ${moduleSpecifier}`);
    }
  }
  PYTHON_IMPORT_PATTERN.lastIndex = 0;
}

function stripPythonInlineComment(segment: string | undefined): string {
  if (!segment) {
    return "";
  }
  const [withoutComment] = segment.split("#", 1);
  return withoutComment.replace(/[()]/g, " ").trim();
}

function splitPythonImportList(segment: string): string[] {
  if (!segment) {
    return [];
  }

  return segment
    .split(",")
    .map(entry => entry.trim())
    .filter(entry => entry.length > 0)
    .map(entry => entry.replace(/\s+as\s+[\w.]+$/i, ""));
}

function collectPythonReferenceCandidates(
  moduleSpecifier: string | undefined,
  importedNames: string[],
  _source: EnrichedArtifact
): string[] {
  const references = new Set<string>();
  const resolution = resolvePythonModule(moduleSpecifier);

  const push = (value: string): void => {
    if (value.trim().length > 0) {
      references.add(value);
    }
  };

  const modulePath = resolution.pathSegments.length > 0 ? resolution.pathSegments.join("/") : "";

  if (modulePath) {
    push(`${resolution.prefix}${modulePath}`);
    push(modulePath);
    push(`${resolution.prefix}${modulePath}.py`);
    push(`${resolution.prefix}${modulePath}/__init__`);
  }

  const sanitizedNames = importedNames
    .map(name => name.replace(/[()]/g, "").trim())
    .filter(name => name.length > 0 && name !== "*")
    .map(name => name.replace(/\./g, "/"));

  if (!modulePath && sanitizedNames.length === 0) {
    push(resolution.prefix);
  }

  for (const name of sanitizedNames) {
    if (modulePath) {
      push(`${resolution.prefix}${modulePath}/${name}`);
      push(`${modulePath}/${name}`);
    } else {
      push(`${resolution.prefix}${name}`);
      push(name);
    }
  }

  return Array.from(references);
}

function resolvePythonModule(moduleSpecifier: string | undefined): {
  prefix: string;
  pathSegments: string[];
} {
  if (!moduleSpecifier) {
    return { prefix: "./", pathSegments: [] };
  }

  const trimmed = moduleSpecifier.trim();
  if (!trimmed) {
    return { prefix: "./", pathSegments: [] };
  }

  let leadingDots = 0;
  while (leadingDots < trimmed.length && trimmed[leadingDots] === ".") {
    leadingDots += 1;
  }

  const remainder = trimmed.slice(leadingDots).replace(/^\.+/, "");
  const pathSegments = remainder
    .split(".")
    .map(segment => segment.trim())
    .filter(segment => segment.length > 0);

  if (leadingDots === 0) {
    return {
      prefix: "./",
      pathSegments
    };
  }

  if (leadingDots === 1) {
    return {
      prefix: "./",
      pathSegments
    };
  }

  return {
    prefix: "../".repeat(leadingDots - 1),
    pathSegments
  };
}

function applyIncludeHeuristics(
  source: EnrichedArtifact,
  candidates: EnrichedArtifact[],
  register: (match: MatchCandidate) => void
): void {
  if (!isImplementationLayer(source.artifact.layer)) {
    return;
  }

  let match: RegExpExecArray | null;
  const content = source.content ?? "";

  while ((match = INCLUDE_DIRECTIVE.exec(content)) !== null) {
    const localReference = match[1];
    if (!localReference) {
      continue;
    }

    const referenceStart = computeReferenceStart(match, localReference);
    if (referenceStart !== null && isWithinComment(content, referenceStart)) {
      continue;
    }

    const candidate = resolveIncludeReference(localReference, source, candidates);
    if (candidate) {
      register(candidate);
    }
  }

  INCLUDE_DIRECTIVE.lastIndex = 0;
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

function buildCContext(artifacts: EnrichedArtifact[]): CContext {
  const functionIndex = new Map<string, EnrichedArtifact[]>();

  for (const artifact of artifacts) {
    if (!artifact.content || !artifact.comparablePath.endsWith(".c")) {
      continue;
    }

    const stripped = stripCComments(artifact.content);
    let match: RegExpExecArray | null;

    while ((match = C_FUNCTION_DEFINITION_PATTERN.exec(stripped)) !== null) {
      const name = match[2];
      if (!name || C_RESERVED_IDENTIFIERS.has(name)) {
        continue;
      }
      const list = functionIndex.get(name) ?? [];
      list.push(artifact);
      functionIndex.set(name, list);
    }

    C_FUNCTION_DEFINITION_PATTERN.lastIndex = 0;
  }

  return { functionIndex } satisfies CContext;
}

function stripCComments(content: string): string {
  const withoutBlock = content.replace(/\/\*[\s\S]*?\*\//g, " ");
  return withoutBlock.replace(/\/\/.*$/gm, " ");
}

function applyCFunctionCallHeuristics(
  source: EnrichedArtifact,
  context: CContext,
  register: (match: MatchCandidate) => void
): void {
  if (!isImplementationLayer(source.artifact.layer)) {
    return;
  }
  if (!source.content || !source.comparablePath.endsWith(".c")) {
    return;
  }

  const stripped = stripCComments(source.content);
  const recorded = new Set<string>();
  let match: RegExpExecArray | null;

  while ((match = C_FUNCTION_CALL_PATTERN.exec(stripped)) !== null) {
    const name = match[1];
    if (!name || C_RESERVED_IDENTIFIERS.has(name)) {
      continue;
    }

    const targets = context.functionIndex.get(name);
    if (!targets) {
      continue;
    }

    for (const target of targets) {
      if (target.artifact.id === source.artifact.id) {
        continue;
      }
      const key = `${target.artifact.id}|${name}`;
      if (recorded.has(key)) {
        continue;
      }
      recorded.add(key);
      register({
        target,
        confidence: 0.75,
        rationale: `c call ${name}`,
        context: "call"
      });
    }
  }

  C_FUNCTION_CALL_PATTERN.lastIndex = 0;
}

function buildRustContext(artifacts: EnrichedArtifact[]): RustContext {
  const moduleIndex = new Map<string, EnrichedArtifact[]>();

  for (const artifact of artifacts) {
    if (!artifact.comparablePath.endsWith(".rs")) {
      continue;
    }
    const moduleName = inferRustModuleName(artifact.comparablePath);
    if (!moduleName) {
      continue;
    }
    const bucket = moduleIndex.get(moduleName) ?? [];
    bucket.push(artifact);
    moduleIndex.set(moduleName, bucket);
  }

  return { moduleIndex } satisfies RustContext;
}

function inferRustModuleName(comparablePath: string): string | null {
  if (!comparablePath.endsWith(".rs")) {
    return null;
  }

  const normalized = comparablePath.replace(/\\/g, "/");
  if (normalized.endsWith("/mod.rs")) {
    const parent = normalized.slice(0, -"/mod.rs".length);
    const module = path.basename(parent);
    return module || null;
  }

  return path.basename(normalized, ".rs") || null;
}

function applyRustHeuristics(
  source: EnrichedArtifact,
  context: RustContext,
  register: (match: MatchCandidate) => void
): void {
  if (!isImplementationLayer(source.artifact.layer)) {
    return;
  }
  if (!source.content || !source.comparablePath.endsWith(".rs")) {
    return;
  }

  const seenTargets = new Set<string>();
  let match: RegExpExecArray | null;

  while ((match = RUST_MOD_STATEMENT.exec(source.content)) !== null) {
    const visibility = match[1];
    const moduleName = match[2];
    for (const target of resolveRustModuleTargets(moduleName, context, source)) {
      if (seenTargets.has(target.artifact.id)) {
        continue;
      }
      if (
        target.comparablePath.endsWith("/mod.rs") &&
        path.dirname(target.comparablePath) === path.dirname(source.comparablePath)
      ) {
        continue;
      }

      const isPublicMod = Boolean(visibility?.trim());
      const isDirectoryModule = target.comparablePath.endsWith("/mod.rs");
      const isPrivateLeafModule = !isPublicMod && !isDirectoryModule;
      if (
        isPrivateLeafModule &&
        source.basename !== "lib.rs" &&
        !isRustModuleReferenced(source.content ?? "", moduleName)
      ) {
        continue;
      }

      seenTargets.add(target.artifact.id);
      const modContext: MatchContext = source.basename === "main.rs" ? "import" : "use";

      register({
        target,
        confidence: 0.7,
        rationale: `rust mod ${moduleName}`,
        context: modContext
      });
    }
  }
  RUST_MOD_STATEMENT.lastIndex = 0;

  while ((match = RUST_USE_STATEMENT.exec(source.content)) !== null) {
    const visibility = match[1];
    const statement = match[2];
    const targets = parseRustUseTargets(statement, Boolean(visibility?.trim()));
    const baseContext = inferRustUseContext(statement, Boolean(visibility?.trim()));
    for (const { moduleName, origin } of targets) {
      if (isLikelyExternalRustUse(statement, moduleName, source.content ?? "")) {
        continue;
      }

      for (const target of resolveRustModuleTargets(moduleName, context, source)) {
        if (seenTargets.has(target.artifact.id)) {
          continue;
        }

        if (
          target.comparablePath.endsWith("/mod.rs") &&
          path.dirname(target.comparablePath) === path.dirname(source.comparablePath)
        ) {
          continue;
        }

        seenTargets.add(target.artifact.id);
        register({
          target,
          confidence: 0.7,
          rationale: `rust use ${moduleName}`,
          context: deriveRustUseTargetContext(baseContext, origin, target)
        });
      }
    }
  }
  RUST_USE_STATEMENT.lastIndex = 0;

  while ((match = RUST_PATH_REFERENCE.exec(source.content)) !== null) {
    const referenceStart = match.index ?? 0;
    if (isWithinComment(source.content, referenceStart)) {
      continue;
    }

    const moduleName = inferRustModuleFromPath(match[0]);
    if (!moduleName) {
      continue;
    }

    for (const target of resolveRustModuleTargets(moduleName, context, source)) {
      if (seenTargets.has(target.artifact.id)) {
        continue;
      }
      seenTargets.add(target.artifact.id);
      register({
        target,
        confidence: 0.65,
        rationale: `rust path ${match[0]}`,
        context: "use"
      });
    }
  }
  RUST_PATH_REFERENCE.lastIndex = 0;
}

function resolveRustModuleTargets(
  moduleName: string | null,
  context: RustContext,
  source: EnrichedArtifact
): EnrichedArtifact[] {
  if (!moduleName) {
    return [];
  }
  const candidates = context.moduleIndex.get(moduleName);
  if (!candidates) {
    return [];
  }
  return candidates.filter(candidate => {
    if (candidate.artifact.id === source.artifact.id) {
      return false;
    }

    if (
      candidate.comparablePath.endsWith("/mod.rs") &&
      path.dirname(candidate.comparablePath) === path.dirname(source.comparablePath)
    ) {
      return false;
    }

    return true;
  });
}

function parseRustUseTargets(statement: string, isPublic: boolean): RustUseTarget[] {
  const cleaned = statement.split("//", 1)[0]?.trim() ?? "";
  if (!cleaned) {
    return [];
  }

  if (cleaned.includes("{")) {
    const prefix = cleaned.slice(0, cleaned.indexOf("{")).replace(/::\s*$/, "").trim();
    const module = extractRustModuleFromSegments(prefix.split("::"));
    return module ? [{ moduleName: module, origin: "base" }] : [];
  }

  const segments = cleaned.split("::").map(segment => segment.trim()).filter(Boolean);
  if (segments.length === 0) {
    return [];
  }

  const module = extractRustModuleFromSegments(segments);
  const targets: RustUseTarget[] = module ? [{ moduleName: module, origin: "base" }] : [];

  if (isPublic) {
    const typeModule = inferRustModuleFromTypeSegments(segments, module);
    if (typeModule && typeModule !== module) {
      targets.push({ moduleName: typeModule, origin: "type" });
    }
  }

  return targets;
}

function extractRustModuleFromSegments(segments: string[]): string | null {
  const cleaned = segments
    .map(segment => segment.trim())
    .filter(Boolean)
    .map(segment => (segment === "$crate" ? "crate" : segment))
    .map(segment => segment.replace(/[^A-Za-z0-9_]/g, ""))
    .filter(Boolean);
  const trimmed = dropRustContextualSegments(cleaned);
  if (trimmed.length === 0) {
    if (cleaned.includes("crate")) {
      return "lib";
    }
    return null;
  }
  const candidate = trimmed.length === 1 ? trimmed[0] : trimmed[trimmed.length - 2];
  return isLikelyRustModuleName(candidate) ? candidate : null;
}

function inferRustUseContext(statement: string, isPublic: boolean): MatchContext {
  if (isPublic) {
    return "use";
  }

  const cleaned = statement.split("//", 1)[0]?.trim() ?? "";
  if (!cleaned) {
    return "use";
  }

  const symbols = extractRustUseSymbols(cleaned);
  if (symbols.length === 0) {
    return "use";
  }

  return symbols.some(isLikelyRustValueSymbol) ? "import" : "use";
}

function deriveRustUseTargetContext(
  baseContext: MatchContext,
  origin: RustUseTarget["origin"],
  target: EnrichedArtifact
): MatchContext {
  if (origin === "type") {
    return "use";
  }

  if (target.comparablePath.endsWith("/mod.rs")) {
    return "use";
  }

  if (target.basename === "lib.rs") {
    return "use";
  }

  return baseContext;
}

function isRustModuleReferenced(content: string, moduleName: string): boolean {
  if (!content || !moduleName) {
    return false;
  }

  const referencePattern = new RegExp(`\\b${moduleName}\\s*::`, "g");
  return referencePattern.test(content);
}

function isLikelyExternalRustUse(statement: string, moduleName: string, sourceContent: string): boolean {
  const trimmed = statement.trim();
  if (!trimmed) {
    return false;
  }

  if (/^(?:crate|self|super|\$crate)\s*::/.test(trimmed) || trimmed.startsWith("::")) {
    return false;
  }

  const modulePattern = new RegExp(`\\b(?:pub\\s+)?mod\\s+${moduleName}\\b`);
  return !modulePattern.test(sourceContent);
}

function extractRustUseSymbols(statement: string): string[] {
  const braceStart = statement.indexOf("{");
  const braceEnd = statement.lastIndexOf("}");
  const symbols: string[] = [];

  if (braceStart !== -1 && braceEnd !== -1 && braceEnd > braceStart) {
    const inner = statement.slice(braceStart + 1, braceEnd);
    for (const part of inner.split(",")) {
      const symbol = sanitizeRustUseSymbol(part);
      if (symbol) {
        symbols.push(symbol);
      }
    }
    return symbols;
  }

  const symbol = sanitizeRustUseSymbol(statement.slice(statement.lastIndexOf("::") + 2));
  return symbol ? [symbol] : [];
}

function sanitizeRustUseSymbol(raw: string): string | null {
  const cleaned = raw
    .trim()
    .replace(/\bas\s+[A-Za-z_][A-Za-z0-9_]*/, "")
    .replace(/^[*&]/, "")
    .replace(/[,;]$/, "")
    .trim();

  if (!cleaned) {
    return null;
  }

  const segments = cleaned.split("::");
  const symbol = segments[segments.length - 1]?.trim();
  return symbol ?? null;
}

function isLikelyRustValueSymbol(symbol: string): boolean {
  return /^[a-z0-9_]+$/.test(symbol);
}

function dropRustContextualSegments(segments: string[]): string[] {
  let index = 0;
  while (index < segments.length && RUST_SEGMENT_TRIMMERS.has(segments[index])) {
    index += 1;
  }
  return segments.slice(index);
}

function inferRustModuleFromTypeSegments(segments: string[], primaryModule: string | null): string | null {
  const cleaned = segments
    .map(segment => segment.trim())
    .filter(Boolean)
    .map(segment => (segment === "$crate" ? "crate" : segment))
    .map(segment => segment.replace(/[^A-Za-z0-9_]/g, ""))
    .filter(Boolean);
  const trimmed = dropRustContextualSegments(cleaned);
  if (trimmed.length < 2) {
    return null;
  }

  const typeSegment = trimmed[trimmed.length - 1];
  if (!isPascalCaseIdentifier(typeSegment)) {
    return null;
  }

  const candidate = toSnakeCase(typeSegment);
  if (!isLikelyRustModuleName(candidate) || candidate === primaryModule) {
    return null;
  }

  return candidate;
}

function isLikelyRustModuleName(name: string): boolean {
  return /^[a-z0-9_]+$/.test(name);
}

function isPascalCaseIdentifier(value: string): boolean {
  return /^[A-Z][A-Za-z0-9]*$/.test(value);
}

function toSnakeCase(value: string): string {
  return value
    .replace(/([a-z0-9])([A-Z])/g, "$1_$2")
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1_$2")
    .toLowerCase();
}

function inferRustModuleFromPath(path: string): string | null {
  const normalized = path.replace(/^\$crate/, "crate");
  const segments = normalized.split("::");
  return extractRustModuleFromSegments(segments);
}

function buildJavaContext(artifacts: EnrichedArtifact[]): JavaContext {
  const packageIndex = new Map<string, EnrichedArtifact>();

  for (const artifact of artifacts) {
    if (!artifact.content || !artifact.comparablePath.endsWith(".java")) {
      continue;
    }

    const packageName = extractJavaPackage(artifact.content);
    if (!packageName) {
      continue;
    }

    const className = inferJavaClassName(artifact.comparablePath);
    packageIndex.set(`${packageName}.${className}`.toLowerCase(), artifact);
  }

  return { packageIndex } satisfies JavaContext;
}

function extractJavaPackage(content: string): string | null {
  const match = content.match(/\bpackage\s+([^;]+);/);
  return match ? match[1].trim() : null;
}

function inferJavaClassName(comparablePath: string): string {
  const basename = path.basename(comparablePath);
  return basename.endsWith(".java") ? basename.slice(0, -".java".length) : basename;
}

function applyJavaImportHeuristics(
  source: EnrichedArtifact,
  context: JavaContext,
  register: (match: MatchCandidate) => void
): void {
  if (!isImplementationLayer(source.artifact.layer)) {
    return;
  }
  if (!source.content || !source.comparablePath.endsWith(".java")) {
    return;
  }

  const seen = new Set<string>();
  let match: RegExpExecArray | null;

  while ((match = JAVA_IMPORT_STATEMENT.exec(source.content)) !== null) {
    const statement = match[1].trim();
    if (!statement || statement.startsWith("java.")) {
      continue;
    }

  const target = context.packageIndex.get(statement.toLowerCase());
    if (!target || target.artifact.id === source.artifact.id) {
      continue;
    }

    if (seen.has(target.artifact.id)) {
      continue;
    }

    seen.add(target.artifact.id);
    const symbol = statement.slice(statement.lastIndexOf(".") + 1);
    const relation = classifyJavaRelation(symbol, source.content);
    const rationale = relation === "uses" ? `java usage ${symbol}` : `java import ${symbol}`;
    const confidence = relation === "uses" ? 0.8 : 0.7;

    register({
      target,
      confidence,
      rationale,
      context: relation === "uses" ? "use" : "import"
    });
  }

  JAVA_IMPORT_STATEMENT.lastIndex = 0;
}

function classifyJavaRelation(symbol: string, content: string): "imports" | "uses" {
  const escaped = symbol.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const constructorPattern = new RegExp(`new\\s+${escaped}\\b`);
  const genericPattern = new RegExp(`<\\s*${escaped}\\b`);
  const declarationPattern = new RegExp(`\\b${escaped}\\s+[A-Za-z_$][\\w$]*\\s*(=|;|,|\\))`);
  const methodReferencePattern = new RegExp(`\\b${escaped}::`);

  if (
    constructorPattern.test(content) ||
    genericPattern.test(content) ||
    declarationPattern.test(content) ||
    methodReferencePattern.test(content)
  ) {
    return "uses";
  }

  return "imports";
}

function applyRubyRequireHeuristics(
  source: EnrichedArtifact,
  candidates: EnrichedArtifact[],
  register: (match: MatchCandidate) => void
): void {
  if (!isImplementationLayer(source.artifact.layer)) {
    return;
  }
  if (!source.content || !source.comparablePath.endsWith(".rb")) {
    return;
  }

  const sourceDir = path.dirname(source.comparablePath);
  const seen = new Set<string>();
  let match: RegExpExecArray | null;

  while ((match = RUBY_REQUIRE_RELATIVE_PATTERN.exec(source.content)) !== null) {
    const relativeRequire = match[1];
    if (!relativeRequire) {
      continue;
    }

    const candidatePath = normalizePath(path.join(sourceDir, appendRubyExtension(relativeRequire)));
    const target = candidates.find(candidate => candidate.comparablePath === candidatePath);
    if (!target || target.artifact.id === source.artifact.id) {
      continue;
    }

    if (seen.has(target.artifact.id)) {
      continue;
    }

    seen.add(target.artifact.id);
    register({
      target,
      confidence: 0.75,
      rationale: `ruby require_relative ${relativeRequire}`,
      context: "require"
    });
  }

  RUBY_REQUIRE_RELATIVE_PATTERN.lastIndex = 0;
}

function appendRubyExtension(reference: string): string {
  return reference.endsWith(".rb") ? reference : `${reference}.rb`;
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
    rationale: candidate.rationale,
    context: candidate.context
  });
}

function resolveIncludeReference(
  reference: string,
  source: EnrichedArtifact,
  candidates: EnrichedArtifact[]
): MatchCandidate | null {
  const cleaned = cleanupReference(reference);
  if (!cleaned) {
    return null;
  }

  const sourceDir = path.dirname(source.comparablePath);
  const relativeTarget = toComparablePath(path.join(sourceDir, cleaned));
  const directMatch = candidates.find(candidate => candidate.comparablePath === relativeTarget);

  if (directMatch) {
    return {
      target: directMatch,
      confidence: 0.85,
      rationale: `#include ${cleaned} → relative include match`,
      context: "include"
    };
  }

  return resolveReference(cleaned, source, candidates, "include", `#include ${cleaned}`);
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

interface TypeScriptImportRuntimeInfo {
  hasRuntimeUsage: boolean;
  isTypeOnly: boolean;
}

function buildTypeScriptImportRuntimeInfo(
  source: EnrichedArtifact
): Map<string, TypeScriptImportRuntimeInfo> | null {
  if (!source.content) {
    return null;
  }

  const extension = path.extname(source.comparablePath);
  if (!TYPESCRIPT_EXTENSIONS.has(extension)) {
    return null;
  }

  const scriptKind = inferTypeScriptScriptKind(extension);
  if (scriptKind === ts.ScriptKind.Unknown) {
    return null;
  }

  const sourceFile = ts.createSourceFile(
    source.comparablePath,
    source.content,
    ts.ScriptTarget.Latest,
    true,
    scriptKind
  );

  const identifierUsage = collectIdentifierUsage(sourceFile);
  const runtimeInfo = new Map<string, TypeScriptImportRuntimeInfo>();

  const register = (specifier: string, localNames: string[], typeOnly: boolean): void => {
    if (!specifier) {
      return;
    }

    const existing = runtimeInfo.get(specifier) ?? { hasRuntimeUsage: false, isTypeOnly: true };
    const treatAsTypeOnly = typeOnly || isLikelyTypeDefinitionSpecifier(specifier);

    if (treatAsTypeOnly) {
      runtimeInfo.set(specifier, existing);
      return;
    }

    const hasRuntimeBinding = hasRuntimeUsage(identifierUsage, localNames);
    if (hasRuntimeBinding) {
      existing.hasRuntimeUsage = true;
      existing.isTypeOnly = false;
    }

    runtimeInfo.set(specifier, existing);
  };

  const visit = (node: ts.Node): void => {
    if (ts.isImportDeclaration(node) && ts.isStringLiteral(node.moduleSpecifier)) {
      const localNames = extractLocalImportNames(node.importClause);
      const isTypeOnly = node.importClause?.isTypeOnly ?? false;
      register(node.moduleSpecifier.text, localNames, isTypeOnly);
      return;
    }

    if (
      ts.isImportEqualsDeclaration(node) &&
      ts.isExternalModuleReference(node.moduleReference) &&
      node.moduleReference.expression &&
      ts.isStringLiteral(node.moduleReference.expression)
    ) {
      register(node.moduleReference.expression.text, [node.name.text], node.isTypeOnly ?? false);
      return;
    }

    if (ts.isExportDeclaration(node) && node.moduleSpecifier && ts.isStringLiteral(node.moduleSpecifier)) {
      const specifier = node.moduleSpecifier.text;
      const isTypeOnly = Boolean(node.isTypeOnly) ||
        (!!node.exportClause &&
          ts.isNamedExports(node.exportClause) &&
          node.exportClause.elements.length > 0 &&
          node.exportClause.elements.every(element => element.isTypeOnly));
      register(specifier, [], isTypeOnly);
      return;
    }

    ts.forEachChild(node, visit);
  };

  ts.forEachChild(sourceFile, visit);
  return runtimeInfo.size ? runtimeInfo : null;
}

function inferTypeScriptScriptKind(extension: string): ts.ScriptKind {
  switch (extension) {
    case ".ts":
    case ".mts":
    case ".cts":
      return ts.ScriptKind.TS;
    case ".tsx":
      return ts.ScriptKind.TSX;
    default:
      return ts.ScriptKind.Unknown;
  }
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
    const popularExtensions = [".md", ".mdx", ".markdown", ".ts", ".tsx", ".js", ".jsx", ".json", ".py"];
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
  if (isImplementationLayer(sourceLayer) && isImplementationLayer(targetLayer)) {
    switch (context) {
      case "include":
        return "includes";
      case "import":
        return "depends_on";
      case "call":
        return "depends_on";
      case "require":
        return "depends_on";
      case "use":
        return "depends_on";
      default:
        break;
    }
  }

  if (context === "include" && isImplementationLayer(sourceLayer) && isImplementationLayer(targetLayer)) {
    return "includes";
  }

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
