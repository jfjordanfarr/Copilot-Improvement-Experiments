import { glob } from "glob";
import { execFile } from "node:child_process";
import * as fs from "node:fs/promises";
import path from "node:path";
import ts from "typescript";

import type { LiveDocumentationConfig, LiveDocumentationArchetype } from "@copilot-improvement/shared/config/liveDocumentationConfig";
import { slug as githubSlug } from "@copilot-improvement/shared/tooling/githubSlugger";
import { normalizeWorkspacePath } from "@copilot-improvement/shared/tooling/pathUtils";

export interface SourceAnalysisResult {
  symbols: PublicSymbolEntry[];
  dependencies: DependencyEntry[];
}

export interface PublicSymbolEntry {
  name: string;
  kind: string;
  isDefault?: boolean;
  isTypeOnly?: boolean;
  location?: LocationInfo;
  documentation?: string;
}

export interface DependencyEntry {
  specifier: string;
  resolvedPath?: string;
  symbols: string[];
  kind: "import" | "export" | "require";
  isTypeOnly?: boolean;
}

export interface LocationInfo {
  line: number;
  character: number;
}

export const SUPPORTED_SCRIPT_EXTENSIONS = new Set([
  ".ts",
  ".tsx",
  ".mts",
  ".cts",
  ".js",
  ".jsx",
  ".mjs",
  ".cjs"
]);

export const MODULE_RESOLUTION_EXTENSIONS = [
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

interface DiscoverOptions {
  workspaceRoot: string;
  config: LiveDocumentationConfig;
  include: Set<string>;
  changedOnly: boolean;
}

export async function discoverTargetFiles(options: DiscoverOptions): Promise<string[]> {
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

export function resolveArchetype(
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

export function hasMeaningfulAuthoredContent(authoredBlock?: string): boolean {
  if (!authoredBlock) {
    return false;
  }

  const normalized = authoredBlock.replace(/\r?\n/g, "\n").trim();
  if (!normalized) {
    return false;
  }

  const sanitized = normalized
    .replace(/###\s+Purpose/gi, "")
    .replace(/###\s+Notes/gi, "")
    .replace(/_Pending authored purpose_/gi, "")
    .replace(/_Pending notes_/gi, "")
    .replace(/_Pending purpose_/gi, "")
    .replace(/_Pending_/gi, "")
    .replace(/\s+/g, "");

  return sanitized.length > 0;
}

export async function directoryExists(candidate: string): Promise<boolean> {
  try {
    const stats = await fs.stat(candidate);
    return stats.isDirectory();
  } catch {
    return false;
  }
}

export async function cleanupEmptyParents(startDir: string, stopDir: string): Promise<void> {
  const stop = path.resolve(stopDir);
  let current = path.resolve(startDir);

  while (current.startsWith(stop) && current !== stop) {
    try {
      const entries = await fs.readdir(current);
      if (entries.length > 0) {
        break;
      }
      await fs.rmdir(current);
      current = path.dirname(current);
    } catch {
      break;
    }
  }
}

function globPatternToRegExp(pattern: string): string {
  const escaped = pattern
    .replace(/[.+^${}()|[\]\\]/g, "\\$&")
    .replace(/\*\*/g, "(.+?)")
    .replace(/\*/g, "([^/]*)");
  return `^${escaped}$`;
}

export async function analyzeSourceFile(
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

export function inferScriptKind(extension: string): ts.ScriptKind {
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

export function collectExportedSymbols(sourceFile: ts.SourceFile): PublicSymbolEntry[] {
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

export async function collectDependencies(params: {
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

    if (
      ts.isExportDeclaration(statement) &&
      statement.moduleSpecifier &&
      ts.isStringLiteral(statement.moduleSpecifier)
    ) {
      const specifier = statement.moduleSpecifier.text;
      const symbols =
        statement.exportClause && ts.isNamedExports(statement.exportClause)
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

export async function resolveDependency(
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

export function renderPublicSymbolLines(args: {
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

export function renderDependencyLines(args: {
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

export function formatSourceLink(params: { docDir: string; sourceAbsolute: string; line: number }): string {
  const relative = formatRelativePathFromDoc(params.docDir, params.sourceAbsolute);
  return `${relative}#L${params.line}`;
}

export function formatRelativePathFromDoc(docDir: string, targetAbsolute: string): string {
  const relative = path.relative(docDir, targetAbsolute).split(path.sep).join("/");
  if (!relative.startsWith(".")) {
    return `./${relative}`;
  }
  return relative;
}

export function createSymbolSlug(name: string): string | undefined {
  const candidate = githubSlug(`\`${name}\``);
  return candidate && candidate.length > 0 ? candidate : undefined;
}

export function toModuleLabel(workspaceRelativePath: string): string {
  const baseName = path.basename(workspaceRelativePath);
  const withoutExtension = baseName.replace(/\.[^.]+$/, "");
  return withoutExtension || baseName || workspaceRelativePath;
}

export function formatInlineCode(value: string): string {
  const sanitized = value.replace(/`/g, "'");
  return `\`${sanitized}\``;
}

export function formatDependencyQualifier(dependency: DependencyEntry): string {
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

export function resolveExportAssignmentName(expression: ts.Expression): string | undefined {
  if (ts.isIdentifier(expression)) {
    return expression.text;
  }
  if (ts.isPropertyAccessExpression(expression)) {
    return expression.getText();
  }
  return "default";
}

export function hasExportModifier(node: ts.Node): boolean {
  if (!ts.canHaveModifiers(node)) {
    return false;
  }
  const modifiers = ts.getModifiers(node) ?? [];
  return modifiers.some((modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword);
}

export function hasDefaultModifier(node: ts.Node): boolean {
  if (!ts.canHaveModifiers(node)) {
    return false;
  }
  const modifiers = ts.getModifiers(node) ?? [];
  return modifiers.some((modifier) => modifier.kind === ts.SyntaxKind.DefaultKeyword);
}

export function getNodeLocation(node: ts.Node, sourceFile: ts.SourceFile): LocationInfo {
  const position = node.getStart(sourceFile);
  const { line, character } = sourceFile.getLineAndCharacterOfPosition(position);
  return {
    line: line + 1,
    character: character + 1
  };
}

export function extractJsDocComment(node: ts.Node): string | undefined {
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

export function displayDependencyKey(entry: DependencyEntry): string {
  return entry.resolvedPath ?? entry.specifier;
}

export async function detectChangedFiles(workspaceRoot: string): Promise<Set<string>> {
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

export function parsePorcelainLine(line: string): string | undefined {
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

export function execFileAsync(
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
