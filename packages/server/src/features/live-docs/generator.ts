import { glob } from "glob";
import { execFile } from "node:child_process";
import { createHash } from "node:crypto";
import * as fs from "node:fs/promises";
import path from "node:path";
import ts from "typescript";

import {
  DEFAULT_LIVE_DOCUMENTATION_CONFIG,
  type LiveDocumentationArchetype,
  type LiveDocumentationConfig,
  normalizeLiveDocumentationConfig
} from "@copilot-improvement/shared/config/liveDocumentationConfig";
import {
  composeLiveDocId,
  extractAuthoredBlock,
  renderLiveDocMarkdown,
  type LiveDocRenderSection
} from "@copilot-improvement/shared/live-docs/markdown";
import type {
  LiveDocGeneratorProvenance,
  LiveDocMetadata,
  LiveDocProvenance
} from "@copilot-improvement/shared/live-docs/schema";
import { slug as githubSlug } from "@copilot-improvement/shared/tooling/githubSlugger";
import {
  normalizeWorkspacePath,
  toWorkspaceFileUri,
  toWorkspaceRelativePath
} from "@copilot-improvement/shared/tooling/pathUtils";

import {
  loadEvidenceSnapshot,
  type EvidenceSnapshot,
  type ImplementationEvidenceItem,
  type TestEvidenceItem,
  type CoverageSummary
} from "./evidenceBridge";

interface GenerateLiveDocsOptions {
  workspaceRoot: string;
  config?: LiveDocumentationConfig;
  dryRun?: boolean;
  changedOnly?: boolean;
  include?: string[];
  logger?: LiveDocGeneratorLogger;
  now?: () => Date;
}

interface LiveDocGeneratorLogger {
  info(message: string): void;
  warn(message: string): void;
  error(message: string): void;
}

interface LiveDocGeneratorResult {
  processed: number;
  written: number;
  skipped: number;
  files: LiveDocWriteRecord[];
}

type LiveDocWriteKind = "created" | "updated" | "unchanged" | "skipped";

interface LiveDocWriteRecord {
  sourcePath: string;
  docPath: string;
  change: LiveDocWriteKind;
}

interface SourceAnalysisResult {
  symbols: PublicSymbolEntry[];
  dependencies: DependencyEntry[];
}

interface PublicSymbolEntry {
  name: string;
  kind: string;
  isDefault?: boolean;
  isTypeOnly?: boolean;
  location?: LocationInfo;
  documentation?: string;
}

interface DependencyEntry {
  specifier: string;
  resolvedPath?: string;
  symbols: string[];
  kind: "import" | "export" | "require";
  isTypeOnly?: boolean;
}

interface LocationInfo {
  line: number;
  character: number;
}

const SUPPORTED_SCRIPT_EXTENSIONS = new Set([
  ".ts",
  ".tsx",
  ".mts",
  ".cts",
  ".js",
  ".jsx",
  ".mjs",
  ".cjs"
]);

const MODULE_RESOLUTION_EXTENSIONS = [
  ".ts",
  ".tsx",
  ".mts",
  ".cts",
  ".js",
  ".jsx",
  ".mjs",
  ".cjs",
  ".json"
];

const DEFAULT_LOGGER: LiveDocGeneratorLogger = {
  info: (message) => console.log(`[live-docs] ${message}`),
  warn: (message) => console.warn(`[live-docs] ${message}`),
  error: (message) => console.error(`[live-docs] ${message}`)
};

export async function generateLiveDocs(
  options: GenerateLiveDocsOptions
): Promise<LiveDocGeneratorResult> {
  const logger = options.logger ?? DEFAULT_LOGGER;
  const normalizedConfig = normalizeLiveDocumentationConfig(options.config);
  const workspaceRoot = path.resolve(options.workspaceRoot);
  const now = options.now ?? (() => new Date());

  const includeSet = new Set<string>((options.include ?? []).map((entry) => normalizeWorkspacePath(entry)));

  const targetFiles = await discoverTargetFiles({
    workspaceRoot,
    config: normalizedConfig,
    include: includeSet,
    changedOnly: options.changedOnly ?? false
  });

  if (targetFiles.length === 0) {
    logger.info("No source files matched Live Documentation globs.");
    return {
      processed: 0,
      written: 0,
      skipped: 0,
      files: []
    };
  }

  const evidenceSnapshot = await loadEvidenceSnapshot({
    workspaceRoot,
    logger
  });

  const results: LiveDocWriteRecord[] = [];
  let written = 0;
  let skipped = 0;

  const liveDocsRootAbsolute = path.resolve(
    workspaceRoot,
    normalizedConfig.root,
    normalizedConfig.baseLayer
  );

  for (const absoluteSourcePath of targetFiles) {
    const relativeSourcePath = toWorkspaceRelativePath(
      toWorkspaceFileUri(workspaceRoot, absoluteSourcePath),
      workspaceRoot
    );

    if (!relativeSourcePath) {
      logger.warn(`Skipping ${absoluteSourcePath} (outside workspace)`);
      results.push({
        sourcePath: absoluteSourcePath,
        docPath: "",
        change: "skipped"
      });
      skipped += 1;
      continue;
    }

    const normalizedSourcePath = normalizeWorkspacePath(relativeSourcePath);
    const archetype = resolveArchetype(normalizedSourcePath, normalizedConfig);
    const liveDocId = composeLiveDocId(archetype, normalizedSourcePath);
    const title = normalizedSourcePath;

    const metadataBase: LiveDocMetadata = {
      layer: 4,
      archetype,
      sourcePath: normalizedSourcePath,
      liveDocId
    };

    const analysis = await analyzeSourceFile(absoluteSourcePath, workspaceRoot);

    const docPaths = resolveLiveDocPaths(workspaceRoot, normalizedConfig, normalizedSourcePath);
    const existingContent = await readFileIfExists(docPaths.absolute);
    const authoredBlock = extractAuthoredBlock(existingContent);
    const previousGeneratedAt = extractGeneratedAt(existingContent);
    const timestampNow = now().toISOString();
    const initialGeneratedAt = previousGeneratedAt ?? timestampNow;

    const sections = buildGeneratedSections({
      analysis,
      archetype,
      docAbsolutePath: docPaths.absolute,
      workspaceRoot,
      sourceRelativePath: normalizedSourcePath,
      evidenceSnapshot,
      liveDocsRootAbsolute
    });

    const renderDocument = (generatedAt: string): string => {
      const provenance = composeProvenance({
        toolVersion: process.env.LIVE_DOCS_GENERATOR_VERSION ?? "0.1.0",
        generatedAt,
        sourceAbsolutePath: absoluteSourcePath,
        analysis
      });

      const metadata: LiveDocMetadata = {
        ...metadataBase,
        generatedAt,
        provenance
      };

      return renderLiveDocMarkdown({
        title,
        metadata,
        authoredBlock,
        sections,
        provenance
      });
    };

    let rendered = renderDocument(initialGeneratedAt);
    let change = classifyChange(existingContent, rendered);

    if (change !== "unchanged" && previousGeneratedAt) {
      if (timestampNow !== initialGeneratedAt) {
        rendered = renderDocument(timestampNow);
        change = classifyChange(existingContent, rendered);
      }
    }

    results.push({
      sourcePath: normalizedSourcePath,
      docPath: docPaths.relative,
      change
    });

    if (change === "unchanged") {
      skipped += 1;
      continue;
    }

    if (options.dryRun) {
      written += 1;
      continue;
    }

    await fs.mkdir(path.dirname(docPaths.absolute), { recursive: true });
    await fs.writeFile(docPaths.absolute, rendered, "utf8");
    written += 1;
  }

  return {
    processed: targetFiles.length,
    written,
    skipped,
    files: results
  };
}

interface DiscoverOptions {
  workspaceRoot: string;
  config: LiveDocumentationConfig;
  include: Set<string>;
  changedOnly: boolean;
}

async function discoverTargetFiles(options: DiscoverOptions): Promise<string[]> {
  const patterns = options.include.size > 0 ? Array.from(options.include) : options.config.glob;
  const absoluteFiles = new Set<string>();

  for (const pattern of patterns) {
    const matches = await glob(pattern, {
      cwd: options.workspaceRoot,
      absolute: true,
      nodir: true,
      dot: false,
      windowsPathsNoEscape: true
    });
    for (const match of matches) {
      absoluteFiles.add(path.resolve(options.workspaceRoot, match));
    }
  }

  let candidates = Array.from(absoluteFiles);

  if (options.changedOnly) {
    const changed = await detectChangedFiles(options.workspaceRoot);
    if (changed.size > 0) {
      candidates = candidates.filter((absolute) => {
        const relative = normalizeWorkspacePath(
          path.relative(options.workspaceRoot, absolute)
        );
        return changed.has(relative);
      });
    }
  }

  candidates.sort();
  return candidates;
}

function resolveArchetype(
  sourcePath: string,
  config: LiveDocumentationConfig
): LiveDocumentationArchetype {
  const overrides = config.archetypeOverrides ?? {};
  for (const [pattern, archetype] of Object.entries(overrides)) {
    if (new RegExp(globPatternToRegExp(pattern)).test(sourcePath)) {
      return archetype;
    }
  }

  if (sourcePath.includes("/__fixtures__/") || /\bfixtures\b/.test(sourcePath)) {
    return "asset";
  }

  if (/\btests?\b|__tests__/i.test(sourcePath)) {
    return "test";
  }

  return "implementation";
}

function globPatternToRegExp(pattern: string): string {
  const escaped = pattern
    .replace(/[.+^${}()|[\]\\]/g, "\\$&")
    .replace(/\*\*/g, "(.+?)")
    .replace(/\*/g, "([^/]*)");
  return `^${escaped}$`;
}

async function analyzeSourceFile(
  absolutePath: string,
  workspaceRoot: string
): Promise<SourceAnalysisResult> {
  const extension = path.extname(absolutePath).toLowerCase();
  if (!SUPPORTED_SCRIPT_EXTENSIONS.has(extension)) {
    return { symbols: [], dependencies: [] };
  }

  const content = await fs.readFile(absolutePath, "utf8");
  const scriptKind = inferScriptKind(extension);
  const sourceFile = ts.createSourceFile(
    absolutePath,
    content,
    ts.ScriptTarget.Latest,
    true,
    scriptKind
  );

  const symbols = collectExportedSymbols(sourceFile);
  const dependencies = await collectDependencies({
    sourceFile,
    absolutePath,
    workspaceRoot
  });

  return {
    symbols: sortSymbolsByLocation(symbols),
    dependencies
  };
}

function collectExportedSymbols(sourceFile: ts.SourceFile): PublicSymbolEntry[] {
  const collected: PublicSymbolEntry[] = [];

  const record = (entry: PublicSymbolEntry): void => {
    if (!entry.name) return;
    collected.push(entry);
  };

  for (const statement of sourceFile.statements) {
    if (ts.isExportAssignment(statement)) {
      const name = resolveExportAssignmentName(statement.expression);
      if (!name) continue;
      record({
        name,
        kind: "default",
        isDefault: true,
        location: getNodeLocation(statement, sourceFile)
      });
      continue;
    }

    if (!hasExportModifier(statement)) {
      continue;
    }

    if (ts.isFunctionDeclaration(statement)) {
      const name = statement.name?.text ?? (hasDefaultModifier(statement) ? "default" : undefined);
      if (!name) continue;
      record({
        name,
        kind: "function",
        isDefault: name === "default",
        documentation: extractJsDocComment(statement),
        location: getNodeLocation(statement.name ?? statement, sourceFile)
      });
      continue;
    }

    if (ts.isClassDeclaration(statement)) {
      const name = statement.name?.text ?? (hasDefaultModifier(statement) ? "default" : undefined);
      if (!name) continue;
      record({
        name,
        kind: "class",
        isDefault: name === "default",
        documentation: extractJsDocComment(statement),
        location: getNodeLocation(statement.name ?? statement, sourceFile)
      });
      continue;
    }

    if (ts.isInterfaceDeclaration(statement)) {
      record({
        name: statement.name.text,
        kind: "interface",
        documentation: extractJsDocComment(statement),
        location: getNodeLocation(statement.name, sourceFile)
      });
      continue;
    }

    if (ts.isTypeAliasDeclaration(statement)) {
      record({
        name: statement.name.text,
        kind: "type",
        documentation: extractJsDocComment(statement),
        location: getNodeLocation(statement.name, sourceFile)
      });
      continue;
    }

    if (ts.isEnumDeclaration(statement)) {
      record({
        name: statement.name.text,
        kind: "enum",
        documentation: extractJsDocComment(statement),
        location: getNodeLocation(statement.name, sourceFile)
      });
      continue;
    }

    if (ts.isModuleDeclaration(statement)) {
      record({
        name: statement.name.getText(sourceFile),
        kind: "namespace",
        documentation: extractJsDocComment(statement),
        location: getNodeLocation(statement.name, sourceFile)
      });
      continue;
    }

    if (ts.isVariableStatement(statement)) {
      const kind = inferVariableKind(statement);
      for (const declaration of statement.declarationList.declarations) {
        const names = collectBindingNames(declaration.name);
        for (const name of names) {
          record({
            name,
            kind,
            documentation: extractJsDocComment(statement),
            location: getNodeLocation(declaration.name, sourceFile)
          });
        }
      }
      continue;
    }

    if (
      ts.isExportDeclaration(statement) &&
      statement.exportClause &&
      ts.isNamedExports(statement.exportClause)
    ) {
      for (const specifier of statement.exportClause.elements) {
        record({
          name: specifier.name.text,
          kind: specifier.isTypeOnly ? "type" : "unknown",
          isTypeOnly: specifier.isTypeOnly,
          location: getNodeLocation(specifier.name, sourceFile)
        });
      }
    }
  }

  return collected;
}

function sortSymbolsByLocation(symbols: PublicSymbolEntry[]): PublicSymbolEntry[] {
  return [...symbols].sort((a, b) => {
    const aLine = a.location?.line ?? Number.MAX_SAFE_INTEGER;
    const bLine = b.location?.line ?? Number.MAX_SAFE_INTEGER;
    if (aLine !== bLine) {
      return aLine - bLine;
    }

    const aChar = a.location?.character ?? Number.MAX_SAFE_INTEGER;
    const bChar = b.location?.character ?? Number.MAX_SAFE_INTEGER;
    if (aChar !== bChar) {
      return aChar - bChar;
    }

    return a.name.localeCompare(b.name);
  });
}

function inferVariableKind(statement: ts.VariableStatement): string {
  const flags = ts.getCombinedNodeFlags(statement.declarationList);
  if (flags & ts.NodeFlags.Const) return "const";
  if (flags & ts.NodeFlags.Let) return "let";
  return "var";
}

function collectBindingNames(binding: ts.BindingName): string[] {
  const names: string[] = [];
  if (ts.isIdentifier(binding)) {
    names.push(binding.text);
    return names;
  }

  if (ts.isObjectBindingPattern(binding) || ts.isArrayBindingPattern(binding)) {
    for (const element of binding.elements) {
      if (ts.isBindingElement(element)) {
        names.push(...collectBindingNames(element.name));
      }
    }
  }

  return names;
}

async function collectDependencies(params: {
  sourceFile: ts.SourceFile;
  absolutePath: string;
  workspaceRoot: string;
}): Promise<DependencyEntry[]> {
  const entries: DependencyEntry[] = [];

  for (const statement of params.sourceFile.statements) {
    if (ts.isImportDeclaration(statement) && ts.isStringLiteral(statement.moduleSpecifier)) {
      const specifier = statement.moduleSpecifier.text;
      const symbols = extractImportNames(statement.importClause);
      const resolvedPath = await resolveDependency(specifier, params.absolutePath, params.workspaceRoot);
      entries.push({
        specifier,
        resolvedPath,
        symbols,
        kind: "import",
        isTypeOnly: statement.importClause?.isTypeOnly
      });
      continue;
    }

    if (ts.isExportDeclaration(statement) && statement.moduleSpecifier && ts.isStringLiteral(statement.moduleSpecifier)) {
      const specifier = statement.moduleSpecifier.text;
      const symbols = statement.exportClause && ts.isNamedExports(statement.exportClause)
        ? statement.exportClause.elements.map((e) => e.name.text)
        : [];
      const resolvedPath = await resolveDependency(specifier, params.absolutePath, params.workspaceRoot);
      entries.push({
        specifier,
        resolvedPath,
        symbols,
        kind: "export"
      });
    }
  }

  entries.sort((a, b) => displayDependencyKey(a).localeCompare(displayDependencyKey(b)));
  return entries;
}

function extractImportNames(importClause: ts.ImportClause | undefined): string[] {
  if (!importClause) {
    return [];
  }

  const names: string[] = [];

  if (importClause.name) {
    names.push(importClause.name.text);
  }

  if (!importClause.namedBindings) {
    return names;
  }

  if (ts.isNamespaceImport(importClause.namedBindings)) {
    names.push(importClause.namedBindings.name.text);
    return names;
  }

  if (ts.isNamedImports(importClause.namedBindings)) {
    for (const element of importClause.namedBindings.elements) {
      names.push(element.name.text);
    }
  }

  return names;
}

async function resolveDependency(
  specifier: string,
  fromFile: string,
  workspaceRoot: string
): Promise<string | undefined> {
  if (!specifier.startsWith(".")) {
    return undefined;
  }

  const base = path.resolve(path.dirname(fromFile), specifier);
  const resolved = await resolveWithExtensions(base);
  if (!resolved) {
    return undefined;
  }

  return normalizeWorkspacePath(path.relative(workspaceRoot, resolved));
}

async function resolveWithExtensions(basePath: string): Promise<string | undefined> {
  const attempts: string[] = [];
  const explicitExt = path.extname(basePath);

  if (explicitExt) {
    attempts.push(basePath);
  } else {
    for (const ext of MODULE_RESOLUTION_EXTENSIONS) {
      attempts.push(`${basePath}${ext}`);
    }
  }

  const indexBase = explicitExt ? basePath.slice(0, basePath.length - explicitExt.length) : basePath;
  for (const ext of MODULE_RESOLUTION_EXTENSIONS) {
    attempts.push(path.join(indexBase, `index${ext}`));
  }

  for (const candidate of attempts) {
    if (await fileExists(candidate)) {
      return candidate;
    }
  }

  return undefined;
}

async function fileExists(candidate: string): Promise<boolean> {
  try {
    const stats = await fs.stat(candidate);
    return stats.isFile();
  } catch {
    return false;
  }
}

function resolveLiveDocPaths(
  workspaceRoot: string,
  config: LiveDocumentationConfig,
  sourcePath: string
): { absolute: string; relative: string } {
  const docRelative = path.join(config.root, config.baseLayer, `${sourcePath}.mdmd.md`);
  const absolute = path.resolve(workspaceRoot, docRelative);
  return {
    absolute,
    relative: normalizeWorkspacePath(docRelative)
  };
}

async function readFileIfExists(filePath: string): Promise<string | undefined> {
  try {
    return await fs.readFile(filePath, "utf8");
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return undefined;
    }
    throw error;
  }
}

function buildGeneratedSections(params: {
  analysis: SourceAnalysisResult;
  archetype: LiveDocumentationArchetype;
  docAbsolutePath: string;
  workspaceRoot: string;
  sourceRelativePath: string;
  evidenceSnapshot: EvidenceSnapshot;
  liveDocsRootAbsolute: string;
}): LiveDocRenderSection[] {
  const docDir = path.dirname(params.docAbsolutePath);
  const sourceAbsolute = path.resolve(params.workspaceRoot, params.sourceRelativePath);

  const symbolLines = renderPublicSymbolLines({
    analysis: params.analysis,
    docDir,
    sourceAbsolute,
    workspaceRoot: params.workspaceRoot,
    sourceRelativePath: params.sourceRelativePath
  });

  const dependencyLines = renderDependencyLines({
    analysis: params.analysis,
    docDir,
    workspaceRoot: params.workspaceRoot,
    liveDocsRootAbsolute: params.liveDocsRootAbsolute
  });

  const sections: LiveDocRenderSection[] = [
    {
      name: "Public Symbols",
      lines: symbolLines.length ? symbolLines : ["_No public symbols detected_"]
    },
    {
      name: "Dependencies",
      lines: dependencyLines.length ? dependencyLines : ["_No dependencies documented yet_"]
    }
  ];

  if (params.archetype === "implementation") {
    const implementationEvidence = params.evidenceSnapshot.implementationEvidence.get(
      params.sourceRelativePath
    );
    const observedEvidenceLines = renderObservedEvidenceLines({
      implementationEvidence,
      docDir,
      liveDocsRootAbsolute: params.liveDocsRootAbsolute
    });

    if (observedEvidenceLines.length > 0) {
      sections.push({
        name: "Observed Evidence",
        lines: observedEvidenceLines
      });
    }
  }

  if (params.archetype === "test") {
    const testEvidence = params.evidenceSnapshot.testEvidence.get(params.sourceRelativePath);
    const targetLines = renderTargetLines({
      testEvidence,
      docDir,
      liveDocsRootAbsolute: params.liveDocsRootAbsolute
    });
    const fixtureLines = renderFixtureLines({
      testEvidence,
      docDir,
      workspaceRoot: params.workspaceRoot
    });

    sections.push({
      name: "Targets",
      lines: targetLines.length ? targetLines : ["_No targets documented yet_"]
    });

    sections.push({
      name: "Supporting Fixtures",
      lines: fixtureLines.length ? fixtureLines : ["_No supporting fixtures documented yet_"]
    });
  }

  return sections;
}

function renderPublicSymbolLines(args: {
  analysis: SourceAnalysisResult;
  docDir: string;
  sourceAbsolute: string;
  workspaceRoot: string;
  sourceRelativePath: string;
}): string[] {
  const lines: string[] = [];
  for (const symbol of args.analysis.symbols) {
    const displayKind = symbol.kind ? symbol.kind : "symbol";
    lines.push(`#### \`${symbol.name}\``);

    const detailLines: string[] = [];

    const typeSuffixParts: string[] = [];
    if (symbol.isDefault) {
      typeSuffixParts.push("default");
    }
    if (symbol.isTypeOnly) {
      typeSuffixParts.push("type-only");
    }
    const typeSuffix = typeSuffixParts.length > 0 ? ` (${typeSuffixParts.join(", ")})` : "";
    detailLines.push(`- Type: ${displayKind}${typeSuffix}`);

    if (symbol.location) {
      const location = formatSourceLink({
        docDir: args.docDir,
        sourceAbsolute: args.sourceAbsolute,
        line: symbol.location.line
      });
      detailLines.push(`- Source: [source](${location})`);
    }

    if (symbol.documentation?.trim()) {
      detailLines.push(`- Summary: ${symbol.documentation.trim()}`);
    }

    if (detailLines.length > 0) {
      lines.push(...detailLines);
    }

    lines.push("");
  }

  if (lines.length > 0 && lines[lines.length - 1] === "") {
    lines.pop();
  }

  return lines;
}

function renderDependencyLines(args: {
  analysis: SourceAnalysisResult;
  docDir: string;
  workspaceRoot: string;
  liveDocsRootAbsolute: string;
}): string[] {
  if (args.analysis.dependencies.length === 0) {
    return [];
  }

  const grouped = new Map<string, { entry: DependencyEntry; symbols: Set<string> }>();

  for (const dependency of args.analysis.dependencies) {
    const key = displayDependencyKey(dependency);
    const bucket = grouped.get(key) ?? { entry: dependency, symbols: new Set<string>() };
    for (const symbol of dependency.symbols) {
      bucket.symbols.add(symbol);
    }
    grouped.set(key, bucket);
  }

  const keys = Array.from(grouped.keys()).sort();
  const lines: string[] = [];

  for (const key of keys) {
    const bucket = grouped.get(key)!;
    const dependency = bucket.entry;
    const qualifierSuffix = formatDependencyQualifier(dependency);

    if (dependency.resolvedPath) {
      const moduleLabel = toModuleLabel(dependency.resolvedPath);
      const docAbsolute = path.resolve(
        args.liveDocsRootAbsolute,
        `${dependency.resolvedPath}.mdmd.md`
      );
      const docRelative = formatRelativePathFromDoc(args.docDir, docAbsolute);
      const symbols = Array.from(bucket.symbols).sort();

      if (symbols.length === 0) {
        lines.push(`- [${formatInlineCode(moduleLabel)}](${docRelative})${qualifierSuffix}`);
        continue;
      }

      for (const symbolName of symbols) {
        const slug = createSymbolSlug(symbolName);
        const fragment = slug ? `#${slug}` : "";
        const label = `${moduleLabel}.${symbolName}`;
        lines.push(`- [${formatInlineCode(label)}](${docRelative}${fragment})${qualifierSuffix}`);
      }
      continue;
    }

    const externalSymbols = Array.from(bucket.symbols)
      .sort()
      .map((name) => formatInlineCode(name));
    const symbolSuffix = externalSymbols.length ? ` - ${externalSymbols.join(", ")}` : "";
    lines.push(`- ${formatInlineCode(dependency.specifier)}${symbolSuffix}${qualifierSuffix}`);
  }

  return lines;
}

function renderObservedEvidenceLines(params: {
  implementationEvidence?: ImplementationEvidenceItem[];
  docDir: string;
  liveDocsRootAbsolute: string;
}): string[] {
  const evidence = params.implementationEvidence;
  if (!evidence || evidence.length === 0) {
    return [];
  }

  const lines: string[] = [];
  const hasAutomatedEvidence = evidence.some((entry) => Boolean(entry.testPath) || Boolean(entry.summary));
  const waiverNotes = Array.from(
    new Set(
      evidence
        .filter((entry) => !entry.testPath && !entry.summary && entry.notes?.trim())
        .map((entry) => entry.notes!.trim())
    )
  );

  if (!hasAutomatedEvidence && waiverNotes.length > 0) {
    lines.push(`<!-- evidence-waived: ${waiverNotes.join(" | ")} -->`);
    lines.push("_No automated evidence found_");
  }

  const groups = new Map<string, { suite: string; entries: ImplementationEvidenceItem[] }>();
  for (const entry of evidence) {
    const suite = entry.suite?.trim() || "Evidence";
    const key = `${suite}||${entry.kind}`;
    const bucket = groups.get(key);
    if (bucket) {
      bucket.entries.push(entry);
    } else {
      groups.set(key, { suite, entries: [entry] });
    }
  }

  const sortedGroupKeys = Array.from(groups.keys()).sort((left, right) => {
    const [leftSuite] = left.split("||");
    const [rightSuite] = right.split("||");
    const suiteComparison = leftSuite.localeCompare(rightSuite);
    if (suiteComparison !== 0) {
      return suiteComparison;
    }
    return left.localeCompare(right);
  });

  const sectionLines: string[] = [];
  for (const key of sortedGroupKeys) {
    const group = groups.get(key)!;
    const entries: string[] = [];

    const tests = group.entries
      .filter((entry) => Boolean(entry.testPath))
      .sort((a, b) => (a.testPath ?? "").localeCompare(b.testPath ?? ""));
    const seenTests = new Set<string>();
    for (const entry of tests) {
      const testPath = entry.testPath!;
      if (seenTests.has(testPath)) {
        continue;
      }
      seenTests.add(testPath);
      const testDocAbsolute = path.resolve(
        params.liveDocsRootAbsolute,
        `${testPath}.mdmd.md`
      );
      const relativeDocPath = formatRelativePathFromDoc(params.docDir, testDocAbsolute);
      entries.push(`- [${formatTargetLabel(testPath)}](${relativeDocPath})`);
    }

    const coverageEntries = group.entries.filter((entry) => !entry.testPath && entry.summary);
    const seenCoverage = new Set<string>();
    for (const entry of coverageEntries) {
      const summary = entry.summary;
      if (!summary) {
        continue;
      }
      const summarySignature = JSON.stringify(summary);
      if (seenCoverage.has(summarySignature)) {
        continue;
      }
      seenCoverage.add(summarySignature);
      entries.push(`- Coverage: ${formatCoverageSummary(summary)}`);
    }

    const waiverEntries = group.entries.filter(
      (entry) => !entry.testPath && !entry.summary && entry.notes?.trim()
    );
    const seenWaivers = new Set<string>();
    for (const entry of waiverEntries) {
      const note = entry.notes!.trim();
      if (!note || seenWaivers.has(note)) {
        continue;
      }
      seenWaivers.add(note);
      entries.push(`- Waiver: ${note}`);
    }

    if (entries.length === 0) {
      continue;
    }

    if (sectionLines.length > 0) {
      sectionLines.push("");
    }
    sectionLines.push(`#### ${group.suite}`);
    sectionLines.push(...entries);
  }

  if (sectionLines.length === 0) {
    return lines;
  }

  if (lines.length > 0) {
    lines.push("");
  }
  lines.push(...sectionLines);
  return lines;
}

function renderTargetLines(params: {
  testEvidence?: TestEvidenceItem;
  docDir: string;
  liveDocsRootAbsolute: string;
}): string[] {
  const evidence = params.testEvidence;
  if (!evidence || evidence.targets.length === 0) {
    return [];
  }

  const seen = new Set<string>();
  const grouped = new Map<string, Array<{ label: string; link: string }>>();

  for (const target of evidence.targets) {
    if (seen.has(target)) {
      continue;
    }
    seen.add(target);

    const docAbsolute = path.resolve(params.liveDocsRootAbsolute, `${target}.mdmd.md`);
    const relative = formatRelativePathFromDoc(params.docDir, docAbsolute);
    const directory = path.dirname(target);
    const bucket = grouped.get(directory) ?? [];
    bucket.push({
      label: formatTargetLabel(target),
      link: relative
    });
    grouped.set(directory, bucket);
  }

  const lines: string[] = [];
  if (evidence.suite.trim().length > 0) {
    lines.push(`#### ${evidence.suite}`);
  }

  const sortedDirectories = Array.from(grouped.keys()).sort();
  for (const directory of sortedDirectories) {
    const entries = grouped.get(directory)!;
    entries.sort((left, right) => left.label.localeCompare(right.label));
    const linkFragments = entries.map((entry) => `[${entry.label}](${entry.link})`);
    const chunks = chunkArray(linkFragments, 6);

    if (chunks.length === 0) {
      continue;
    }

    const directoryLabel = directory === "." ? "." : directory;
    lines.push(`- ${directoryLabel}: ${chunks[0].join(", ")}`);
    for (let index = 1; index < chunks.length; index += 1) {
      lines.push(`  ${chunks[index].join(", ")}`);
    }
  }

  return lines;
}

function formatTargetLabel(targetPath: string): string {
  const baseName = path.basename(targetPath);
  const lower = baseName.toLowerCase();
  if (lower === "index.ts" || lower === "index.tsx") {
    const parent = path.basename(path.dirname(targetPath));
    return `${parent}/${baseName}`;
  }
  return baseName;
}

function chunkArray<T>(source: T[], size: number): T[][] {
  if (size <= 0) {
    return [source.slice()];
  }
  const result: T[][] = [];
  for (let index = 0; index < source.length; index += size) {
    result.push(source.slice(index, index + size));
  }
  return result;
}

function formatCoverageSummary(summary: CoverageSummary): string {
  const parts: string[] = [];

  const append = (label: string, ratio?: { covered?: number; total?: number; percent?: number }) => {
    if (!ratio) {
      return;
    }
    const covered = typeof ratio.covered === "number" ? ratio.covered : 0;
    const total = typeof ratio.total === "number" ? ratio.total : 0;
    const percentValue = typeof ratio.percent === "number"
      ? ratio.percent
      : total === 0
        ? 0
        : (covered / total) * 100;
    const roundedPercent = Number.isFinite(percentValue)
      ? Math.round(percentValue * 10) / 10
      : 0;
    const percentLabel = Number.isInteger(roundedPercent)
      ? `${roundedPercent}%`
      : `${roundedPercent.toFixed(1)}%`;
    parts.push(`${label} ${percentLabel} (${covered}/${total})`);
  };

  append("lines", summary.lines);
  append("statements", summary.statements);
  append("functions", summary.functions);
  append("branches", summary.branches);

  return parts.length > 0 ? parts.join(", ") : "coverage summary unavailable";
}

function renderFixtureLines(params: {
  testEvidence?: TestEvidenceItem;
  docDir: string;
  workspaceRoot: string;
}): string[] {
  const evidence = params.testEvidence;
  if (!evidence || evidence.fixtures.length === 0) {
    return [];
  }
  const seen = new Set<string>();
  const lines: string[] = [];
  for (const fixture of evidence.fixtures) {
    if (seen.has(fixture)) {
      continue;
    }
    seen.add(fixture);
    const absolute = path.resolve(params.workspaceRoot, fixture);
    const relative = formatRelativePathFromDoc(params.docDir, absolute);
    lines.push(`- ${evidence.suite} - [${fixture}](${relative})`);
  }
  return lines;
}

function formatSourceLink(params: { docDir: string; sourceAbsolute: string; line: number }): string {
  const relative = formatRelativePathFromDoc(params.docDir, params.sourceAbsolute);
  return `${relative}#L${params.line}`;
}

function formatRelativePathFromDoc(docDir: string, targetAbsolute: string): string {
  const relative = path.relative(docDir, targetAbsolute).split(path.sep).join("/");
  if (!relative.startsWith(".")) {
    return `./${relative}`;
  }
  return relative;
}

function extractGeneratedAt(existingContent?: string): string | undefined {
  if (!existingContent) {
    return undefined;
  }

  const match = existingContent.match(/^-\s+Generated At:\s*(.+)$/m);
  if (!match) {
    return undefined;
  }

  const value = match[1]?.trim();
  return value && value.length > 0 ? value : undefined;
}

function createSymbolSlug(name: string): string | undefined {
  const candidate = githubSlug(`\`${name}\``);
  return candidate && candidate.length > 0 ? candidate : undefined;
}

function toModuleLabel(workspaceRelativePath: string): string {
  const baseName = path.basename(workspaceRelativePath);
  const withoutExtension = baseName.replace(/\.[^.]+$/, "");
  return withoutExtension || baseName || workspaceRelativePath;
}

function formatInlineCode(value: string): string {
  const sanitized = value.replace(/`/g, "'");
  return `\`${sanitized}\``;
}

function formatDependencyQualifier(dependency: DependencyEntry): string {
  const qualifiers: string[] = [];
  if (dependency.kind === "export") {
    qualifiers.push("re-export");
  }
  if (dependency.isTypeOnly) {
    qualifiers.push("type-only");
  }
  if (!qualifiers.length) {
    return "";
  }
  return ` (${qualifiers.join(", ")})`;
}

function composeProvenance(params: {
  toolVersion: string;
  generatedAt: string;
  sourceAbsolutePath: string;
  analysis: SourceAnalysisResult;
}): LiveDocProvenance {
  const hash = createHash("sha256")
    .update(params.sourceAbsolutePath)
    .update(JSON.stringify(params.analysis.symbols))
    .update(JSON.stringify(params.analysis.dependencies))
    .digest("hex")
    .slice(0, 16);

  const generator: LiveDocGeneratorProvenance = {
    tool: "live-docs-generator",
    version: params.toolVersion,
    generatedAt: params.generatedAt,
    inputHash: hash
  };

  return {
    generators: [generator]
  };
}

function classifyChange(existingContent: string | undefined, rendered: string): LiveDocWriteKind {
  if (!existingContent) {
    return "created";
  }

  return existingContent === rendered ? "unchanged" : "updated";
}

function resolveExportAssignmentName(expression: ts.Expression): string | undefined {
  if (ts.isIdentifier(expression)) {
    return expression.text;
  }
  if (ts.isPropertyAccessExpression(expression)) {
    return expression.getText();
  }
  return "default";
}

function hasExportModifier(node: ts.Node): boolean {
  if (!ts.canHaveModifiers(node)) {
    return false;
  }
  const modifiers = ts.getModifiers(node) ?? [];
  return modifiers.some((modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword);
}

function hasDefaultModifier(node: ts.Node): boolean {
  if (!ts.canHaveModifiers(node)) {
    return false;
  }
  const modifiers = ts.getModifiers(node) ?? [];
  return modifiers.some((modifier) => modifier.kind === ts.SyntaxKind.DefaultKeyword);
}

function getNodeLocation(node: ts.Node, sourceFile: ts.SourceFile): LocationInfo {
  const position = node.getStart(sourceFile);
  const { line, character } = sourceFile.getLineAndCharacterOfPosition(position);
  return {
    line: line + 1,
    character: character + 1
  };
}

function extractJsDocComment(node: ts.Node): string | undefined {
  const doc = ts.getJSDocCommentsAndTags(node);
  if (!doc.length) {
    return undefined;
  }

  const summaries: string[] = [];
  for (const entry of doc) {
    if (ts.isJSDoc(entry)) {
      if (typeof entry.comment === "string") {
        summaries.push(entry.comment.trim());
      }
    }
  }

  const summary = summaries.join(" ").trim();
  return summary || undefined;
}

function inferScriptKind(extension: string): ts.ScriptKind {
  switch (extension) {
    case ".ts":
    case ".mts":
    case ".cts":
      return ts.ScriptKind.TS;
    case ".tsx":
      return ts.ScriptKind.TSX;
    case ".jsx":
      return ts.ScriptKind.JSX;
    case ".js":
    case ".mjs":
    case ".cjs":
      return ts.ScriptKind.JS;
    default:
      return ts.ScriptKind.Unknown;
  }
}

function displayDependencyKey(entry: DependencyEntry): string {
  return entry.resolvedPath ?? entry.specifier;
}

async function detectChangedFiles(workspaceRoot: string): Promise<Set<string>> {
  try {
    const { stdout } = await execFileAsync("git", ["status", "--porcelain"], {
      cwd: workspaceRoot
    });
    const changed = new Set<string>();
    for (const rawLine of stdout.split(/\r?\n/)) {
      const line = rawLine.trim();
      if (!line) {
        continue;
      }
      const entry = parsePorcelainLine(line);
      if (entry) {
        changed.add(entry);
      }
    }
    return changed;
  } catch {
    return new Set<string>();
  }
}

function parsePorcelainLine(line: string): string | undefined {
  if (line.length < 4) {
    return undefined;
  }

  const status = line.slice(0, 2);
  const pathPart = line.slice(3).trim();
  if (!pathPart) {
    return undefined;
  }

  if (status.startsWith("R") || status.startsWith("C")) {
    const arrowIndex = pathPart.indexOf("->");
    if (arrowIndex >= 0) {
      const renamed = pathPart.slice(arrowIndex + 2).trim();
      return renamed ? normalizeWorkspacePath(renamed) : undefined;
    }
  }

  return normalizeWorkspacePath(pathPart);
}

function execFileAsync(
  command: string,
  args: readonly string[],
  options: { cwd: string }
): Promise<{ stdout: string; stderr: string }> {
  return new Promise((resolve, reject) => {
    execFile(command, args, { cwd: options.cwd }, (error, stdout, stderr) => {
      if (error) {
        let message: string;
        if (error instanceof Error) {
          message = error.message;
        } else if (typeof error === "string") {
          message = error;
        } else {
          try {
            message = JSON.stringify(error);
          } catch {
            message = "Unknown error";
          }
        }

        reject(new Error(message));
        return;
      }

      resolve({ stdout: stdout.toString(), stderr: stderr.toString() });
    });
  });
}

// Exported for unit testing
export const __testUtils = {
  collectExportedSymbols,
  collectDependencies,
  inferScriptKind,
  resolveArchetype,
  renderPublicSymbolLines
};

// Maintain backwards compatibility for callers that expect default config resolution
export function withDefaultConfig(config?: LiveDocumentationConfig): LiveDocumentationConfig {
  if (!config) {
    return { ...DEFAULT_LIVE_DOCUMENTATION_CONFIG };
  }
  return normalizeLiveDocumentationConfig(config);
}
