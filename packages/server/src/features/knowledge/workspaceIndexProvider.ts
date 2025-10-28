import { Dirent } from "node:fs";
import * as fs from "node:fs/promises";
import * as path from "node:path";
import { pathToFileURL } from "node:url";
import ts from "typescript";

import {
  ArtifactSeed,
  RelationshipHint,
  WorkspaceLinkContribution,
  WorkspaceLinkProvider
} from "@copilot-improvement/shared";

interface WorkspaceIndexProviderOptions {
  rootPath: string;
  implementationGlobs?: string[];
  documentationGlobs?: string[];
  scriptGlobs?: string[];
  logger?: {
    info(message: string): void;
  };
}

export const DEFAULT_CODE_EXTENSIONS = new Set([
  ".ts",
  ".tsx",
  ".js",
  ".jsx",
  ".mjs",
  ".cts",
  ".mts",
  ".cs"
]);
export const DEFAULT_DOC_EXTENSIONS = new Set([".md", ".mdx", ".markdown", ".txt", ".yaml", ".yml"]);

export type ExportedSymbolKind =
  | "class"
  | "function"
  | "variable"
  | "enum"
  | "interface"
  | "type"
  | "namespace"
  | "default"
  | "unknown";

export interface ExportedSymbolMetadata {
  name: string;
  kind: ExportedSymbolKind;
  isDefault?: boolean;
  isTypeOnly?: boolean;
}

export interface DocumentSymbolReferenceMetadata {
  symbol: string;
  context?: string;
}

/**
 * Lightweight workspace indexer that seeds implementation artifacts so markdown linkage heuristics
 * have viable candidates. Intended primarily for integration and dogfooding scenarios.
 */
export function createWorkspaceIndexProvider(options: WorkspaceIndexProviderOptions): WorkspaceLinkProvider {
  const normalizedRoot = path.resolve(options.rootPath);

  return {
    id: "workspace-index",
    label: "Workspace Implementation Index",
    async collect(): Promise<WorkspaceLinkContribution> {
      const seeds: ArtifactSeed[] = [];
      const hints: RelationshipHint[] = [];
      const implTargets = options.implementationGlobs ?? ["src"];
      const docTargets = options.documentationGlobs ?? ["docs", "specs", "templates", "config", ".mdmd", "README.md"];
      const scriptTargets = options.scriptGlobs ?? ["scripts"];

      // Implementation/code
      for (const target of implTargets) {
        const absolute = path.resolve(normalizedRoot, target);
        await scanDirectory(absolute, async (filePath) => {
          if (shouldSkipPath(filePath)) return;
          const ext = path.extname(filePath).toLowerCase();
          if (!DEFAULT_CODE_EXTENSIONS.has(ext)) return;

          try {
            if (await isLikelyBinaryFile(filePath)) return;
            const content = await fs.readFile(filePath, "utf8");
            const uri = pathToFileURL(filePath).toString();

            const exportedSymbols = extractExportedSymbols(filePath, content);
            const metadata: Record<string, unknown> | undefined = exportedSymbols.length
              ? { exportedSymbols }
              : undefined;

            seeds.push({
              uri,
              layer: "code",
              language: inferLanguage(filePath),
              content,
              metadata
            });

            const directiveHints = await extractLinkHints({
              content,
              sourceFile: filePath,
              sourceUri: uri,
              workspaceRoot: normalizedRoot
            });
            hints.push(...directiveHints);

            const pathHints = await extractPathReferenceHints({
              content,
              sourceFile: filePath,
              sourceUri: uri,
              workspaceRoot: normalizedRoot
            });
            hints.push(...pathHints);
          } catch {
            // ignore
          }
        });
      }

      // Documentation/templates (as requirements layer)
      for (const target of docTargets) {
        const absolute = path.resolve(normalizedRoot, target);
        await scanDirectory(absolute, async (filePath) => {
          if (shouldSkipPath(filePath)) return;
          const ext = path.extname(filePath).toLowerCase();
          if (!DEFAULT_DOC_EXTENSIONS.has(ext) && !looksLikeDocsPath(filePath)) return;

          try {
            if (await isLikelyBinaryFile(filePath)) return;
            const content = await fs.readFile(filePath, "utf8");
            const uri = pathToFileURL(filePath).toString();

            const symbolReferences = extractDocumentSymbolReferences(content);
            const metadata: Record<string, unknown> | undefined = symbolReferences.length
              ? { symbolReferences }
              : undefined;

            seeds.push({
              uri,
              layer: "requirements",
              language: inferDocLanguage(filePath),
              content,
              metadata
            });

            const directiveHints = await extractLinkHints({
              content,
              sourceFile: filePath,
              sourceUri: uri,
              workspaceRoot: normalizedRoot
            });
            hints.push(...directiveHints);
          } catch {
            // ignore
          }
        });
      }

      // Scripts (outside src) as code
      for (const target of scriptTargets) {
        const absolute = path.resolve(normalizedRoot, target);
        await scanDirectory(absolute, async (filePath) => {
          if (shouldSkipPath(filePath)) return;
          const ext = path.extname(filePath).toLowerCase();
          if (!DEFAULT_CODE_EXTENSIONS.has(ext)) return;

          try {
            if (await isLikelyBinaryFile(filePath)) return;
            const content = await fs.readFile(filePath, "utf8");
            const uri = pathToFileURL(filePath).toString();

            const exportedSymbols = extractExportedSymbols(filePath, content);
            const metadata: Record<string, unknown> | undefined = exportedSymbols.length
              ? { exportedSymbols }
              : undefined;

            seeds.push({
              uri,
              layer: "code",
              language: inferLanguage(filePath),
              content,
              metadata
            });

            const pathHints = await extractPathReferenceHints({
              content,
              sourceFile: filePath,
              sourceUri: uri,
              workspaceRoot: normalizedRoot
            });
            hints.push(...pathHints);
          } catch {
            // ignore
          }
        });
      }

      const allTargets = [...implTargets, ...docTargets, ...scriptTargets];
      options.logger?.info(
        `[workspace-index] collected ${seeds.length} seed(s) and ${hints.length} hint(s) from ${allTargets.join(",")}`
      );
      return { seeds, hints };
    }
  };
}

async function scanDirectory(root: string, onFile: (filePath: string) => Promise<void>): Promise<void> {
  let entries: Dirent[];
  try {
    entries = await fs.readdir(root, { withFileTypes: true });
  } catch {
    return;
  }

  await Promise.all(
    entries.map(async entry => {
      const resolved = path.join(root, entry.name);
      if (entry.isDirectory()) {
        if (shouldSkipDir(entry.name)) return;
        await scanDirectory(resolved, onFile);
        return;
      }

      if (entry.isFile()) {
        await onFile(resolved);
      }
    })
  );
}

function shouldSkipDir(name: string): boolean {
  const lower = name.toLowerCase();
  return (
    lower === ".git" ||
    lower === "node_modules" ||
    lower === "dist" ||
    lower === "out" ||
    lower === "build" ||
    lower === "coverage" ||
    lower === ".vscode" ||
    lower === ".idea" ||
    lower === ".history" ||
    lower === ".vscode-test"
  );
}

function shouldSkipPath(filePath: string): boolean {
  const normalized = filePath.replace(/\\/g, "/").toLowerCase();
  return (
    /\/\.git\//.test(normalized) ||
    /\/node_modules\//.test(normalized) ||
    /\/(dist|out|build|coverage)\//.test(normalized) ||
    /\/\.vscode(?:-test)?\//.test(normalized)
  );
}

function inferLanguage(filePath: string): string | undefined {
  const extension = path.extname(filePath).toLowerCase();
  switch (extension) {
    case ".ts":
    case ".tsx":
    case ".mts":
    case ".cts":
      return "typescript";
    case ".js":
    case ".jsx":
    case ".mjs":
      return "javascript";
    case ".cs":
      return "csharp";
    default:
      return undefined;
  }
}

function inferDocLanguage(filePath: string): string | undefined {
  const extension = path.extname(filePath).toLowerCase();
  switch (extension) {
    case ".md":
    case ".mdx":
    case ".markdown":
      return "markdown";
    case ".yml":
    case ".yaml":
      return "yaml";
    case ".txt":
      return "text";
    default:
      return undefined;
  }
}

const LINK_DIRECTIVE = /@link\s+([^\s]+)/g;

interface LinkHintContext {
  content: string;
  sourceFile: string;
  sourceUri: string;
  workspaceRoot: string;
}

async function extractLinkHints(context: LinkHintContext): Promise<RelationshipHint[]> {
  const matches: RelationshipHint[] = [];
  let directive: RegExpExecArray | null;

  while ((directive = LINK_DIRECTIVE.exec(context.content)) !== null) {
    const rawReference = directive[1]?.trim();
    if (!rawReference || isExternalReference(rawReference)) {
      continue;
    }

    const targetPath = await resolveReferencePath(rawReference, context);
    if (!targetPath) {
      continue;
    }

    const targetUri = pathToFileURL(targetPath).toString();
    matches.push({
      sourceUri: targetUri,
      targetUri: context.sourceUri,
      kind: "documents",
      confidence: 0.9,
      rationale: `@link ${rawReference} directive`
    });
  }

  LINK_DIRECTIVE.lastIndex = 0;
  return matches;
}

async function extractPathReferenceHints(context: LinkHintContext): Promise<RelationshipHint[]> {
  // Heuristic: string-literal paths like './templates/x', '../docs/y', '/absolute/z', or containing
  // key folders (docs, templates) or known extensions (.md, .hbs, .json).
  const PATH_LIKE = /["'`]([^"'`\n]*\/(?:[^"'`\n]+))["'`]/g;
  const candidates: RelationshipHint[] = [];
  let match: RegExpExecArray | null;

  while ((match = PATH_LIKE.exec(context.content)) !== null) {
    const ref = (match[1] ?? "").trim();
    if (!ref || isExternalReference(ref)) continue;
    // Throttle obvious non-paths: require slash and filter out common URL-like prefixes handled elsewhere
    if (!ref.includes("/")) continue;

    // Light relevance filter to cut false positives
    const lowered = ref.toLowerCase();
    const looksRelevant =
      lowered.startsWith("./") ||
      lowered.startsWith("../") ||
      lowered.startsWith("/") ||
      lowered.includes("docs/") ||
      lowered.includes("templates/") ||
      /\.(md|mdx|markdown|hbs|ejs|njk|liquid|json|yaml|yml|txt)$/i.test(lowered);
    if (!looksRelevant) continue;

    const targetPath = await resolveReferencePath(ref, context);
    if (!targetPath) continue;

    const targetUri = pathToFileURL(targetPath).toString();
    candidates.push({
      sourceUri: targetUri,
      targetUri: context.sourceUri,
      kind: "documents",
      confidence: 0.75,
      rationale: `string path reference ${ref}`
    });
  }

  PATH_LIKE.lastIndex = 0;

  const resolveHints = await extractPathFunctionHints(context);
  candidates.push(...resolveHints);

  return candidates;
}

function isExternalReference(reference: string): boolean {
  return /^(https?:)?\/\//i.test(reference);
}

async function resolveReferencePath(reference: string, context: LinkHintContext): Promise<string | undefined> {
  const normalized = reference.replace(/\\/g, "/");
  const candidates = new Set<string>();
  candidates.add(path.resolve(path.dirname(context.sourceFile), normalized));
  candidates.add(path.resolve(context.workspaceRoot, normalized.replace(/^\.\//, "")));

  if (!path.extname(normalized)) {
    const extensions = [".md", ".markdown", ".mdx", ".txt"];
    for (const ext of extensions) {
      candidates.add(path.resolve(path.dirname(context.sourceFile), `${normalized}${ext}`));
      candidates.add(path.resolve(context.workspaceRoot, `${normalized}${ext}`));
    }
  }

  for (const candidate of candidates) {
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

async function isLikelyBinaryFile(filePath: string): Promise<boolean> {
  try {
    const fh = await fs.open(filePath, "r");
    const { size } = await fh.stat();
    const sampleSize = Math.min(size, 2048);
    const buf = Buffer.alloc(sampleSize);
    await fh.read(buf, 0, sampleSize, 0);
    await fh.close();

    // Contains NUL byte → binary
    if (buf.includes(0)) return true;

    // If too many non-printable characters, treat as binary
    let nonPrintable = 0;
    for (let i = 0; i < sampleSize; i++) {
      const c = buf[i];
      // allow tab(9), lf(10), cr(13), common whitespace, and printable ASCII 32-126
      const printable = c === 9 || c === 10 || c === 13 || (c >= 32 && c <= 126);
      if (!printable) nonPrintable++;
    }
    return nonPrintable / sampleSize > 0.2;
  } catch {
    return false;
  }
}

function looksLikeDocsPath(filePath: string): boolean {
  const normalized = filePath.replace(/\\/g, "/").toLowerCase();
  return (
    normalized.includes("/docs/") ||
    normalized.includes("/specs/") ||
    normalized.includes("/templates/") ||
    normalized.includes("/config/") ||
    normalized.includes("/.mdmd/") ||
    normalized.endsWith("readme.md")
  );
}

async function extractPathFunctionHints(context: LinkHintContext): Promise<RelationshipHint[]> {
  const hints: RelationshipHint[] = [];
  const FUNCTION_PATTERN = /\b(?:path\.)?(resolve|join)\s*\(/gi;
  let match: RegExpExecArray | null;

  while ((match = FUNCTION_PATTERN.exec(context.content)) !== null) {
    const openParenIndex = match.index + match[0].lastIndexOf("(");
    const closeParenIndex = findMatchingParen(context.content, openParenIndex);
    if (closeParenIndex === -1) {
      continue;
    }

    const argsSegment = context.content.slice(openParenIndex + 1, closeParenIndex);
    const literalMatches = Array.from(argsSegment.matchAll(/["'`]([^"'`]+)["'`]/g)).map(value => value[1].trim());
    if (!literalMatches.length) {
      continue;
    }

    const joined = literalMatches.join("/");
    const candidateRefs = new Set<string>();
    if (joined) {
      candidateRefs.add(joined);
    }

    if (literalMatches.length > 1) {
      candidateRefs.add(`${literalMatches[0]}/${literalMatches.slice(1).join("/")}`);
    }

    for (const ref of candidateRefs) {
      const targetPath = await resolveReferencePath(ref, context);
      if (!targetPath) {
        continue;
      }

      const targetUri = pathToFileURL(targetPath).toString();
      hints.push({
        sourceUri: targetUri,
        targetUri: context.sourceUri,
        kind: "documents",
        confidence: 0.7,
        rationale: `${match[1]} string reference ${ref}`
      });
    }
  }

  return hints;
}

function extractExportedSymbols(filePath: string, content: string): ExportedSymbolMetadata[] {
  const extension = path.extname(filePath).toLowerCase();
  if (!DEFAULT_CODE_EXTENSIONS.has(extension)) {
    return [];
  }

  if (extension === ".cs") {
    return [];
  }

  const scriptKind = inferScriptKind(extension);
  const sourceFile = ts.createSourceFile(filePath, content, ts.ScriptTarget.Latest, true, scriptKind);
  const collected = new Map<string, ExportedSymbolMetadata>();

  const record = (entry: ExportedSymbolMetadata): void => {
    if (!entry.name) {
      return;
    }
    collected.set(entry.name, entry);
  };

  for (const statement of sourceFile.statements) {
    if (ts.isExportAssignment(statement)) {
      const name = resolveExportAssignmentName(statement);
      if (name) {
        record({
          name,
          kind: "default",
          isDefault: true
        });
      }
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
        isDefault: name === "default"
      });
      continue;
    }

    if (ts.isClassDeclaration(statement)) {
      const name = statement.name?.text ?? (hasDefaultModifier(statement) ? "default" : undefined);
      if (!name) continue;
      record({
        name,
        kind: "class",
        isDefault: name === "default"
      });
      continue;
    }

    if (ts.isInterfaceDeclaration(statement)) {
      const name = statement.name.text;
      record({
        name,
        kind: "interface"
      });
      continue;
    }

    if (ts.isTypeAliasDeclaration(statement)) {
      const name = statement.name.text;
      record({
        name,
        kind: "type"
      });
      continue;
    }

    if (ts.isEnumDeclaration(statement)) {
      const name = statement.name.text;
      record({
        name,
        kind: "enum"
      });
      continue;
    }

    if (ts.isModuleDeclaration(statement)) {
      const name = statement.name.getText(sourceFile);
      if (name) {
        record({
          name,
          kind: "namespace"
        });
      }
      continue;
    }

    if (ts.isVariableStatement(statement)) {
      const kind = inferVariableKind(statement);
      const names = collectBindingNames(statement.declarationList);
      for (const name of names) {
        record({
          name,
          kind
        });
      }
      continue;
    }

    if (
      ts.isExportDeclaration(statement) &&
      !statement.moduleSpecifier &&
      statement.exportClause &&
      ts.isNamedExports(statement.exportClause)
    ) {
      for (const specifier of statement.exportClause.elements) {
        const name = specifier.name.text;
        record({
          name,
          kind: specifier.isTypeOnly ? "type" : "unknown",
          isTypeOnly: specifier.isTypeOnly
        });
      }
    }
  }

  return Array.from(collected.values());
}

function resolveExportAssignmentName(statement: ts.ExportAssignment): string | undefined {
  if (ts.isIdentifier(statement.expression)) {
    return statement.expression.text;
  }

  if (ts.isPropertyAccessExpression(statement.expression)) {
    return statement.expression.getText();
  }

  return "default";
}

function hasExportModifier(node: ts.Node): boolean {
  if (!ts.canHaveModifiers(node)) {
    return false;
  }

  const modifiers = ts.getModifiers(node) ?? [];
  return modifiers.some(modifier => modifier.kind === ts.SyntaxKind.ExportKeyword);
}

function hasDefaultModifier(node: ts.Node): boolean {
  if (!ts.canHaveModifiers(node)) {
    return false;
  }

  const modifiers = ts.getModifiers(node) ?? [];
  return modifiers.some(modifier => modifier.kind === ts.SyntaxKind.DefaultKeyword);
}

function inferVariableKind(statement: ts.VariableStatement): ExportedSymbolKind {
  const flags = ts.getCombinedNodeFlags(statement.declarationList);
  if (flags & ts.NodeFlags.Const) return "variable";
  if (flags & ts.NodeFlags.Let) return "variable";
  return "variable";
}

function collectBindingNames(list: ts.VariableDeclarationList): string[] {
  const names: string[] = [];
  for (const declaration of list.declarations) {
    collectNamesFromBinding(declaration.name, names);
  }
  return names;
}

function collectNamesFromBinding(binding: ts.BindingName, output: string[]): void {
  if (ts.isIdentifier(binding)) {
    output.push(binding.text);
    return;
  }

  if (ts.isObjectBindingPattern(binding) || ts.isArrayBindingPattern(binding)) {
    for (const element of binding.elements) {
      if (ts.isBindingElement(element)) {
        collectNamesFromBinding(element.name, output);
      }
    }
  }
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
    case ".mjs":
    case ".js":
      return ts.ScriptKind.JS;
    default:
      return ts.ScriptKind.Unknown;
  }
}

const SYMBOL_REFERENCE_PATTERN = /`([^`]+)`/g;

function extractDocumentSymbolReferences(content: string): DocumentSymbolReferenceMetadata[] {
  const references = new Map<string, DocumentSymbolReferenceMetadata>();
  let match: RegExpExecArray | null;

  while ((match = SYMBOL_REFERENCE_PATTERN.exec(content)) !== null) {
    const snippet = (match[1] ?? "").trim();
    if (!snippet || !looksLikeSymbolIdentifier(snippet)) {
      continue;
    }

    references.set(snippet, {
      symbol: snippet,
      context: "inline-code"
    });
  }

  return Array.from(references.values());
}

function looksLikeSymbolIdentifier(candidate: string): boolean {
  return /^[A-Za-z_$][A-Za-z0-9_$]*(?:\.[A-Za-z_$][A-Za-z0-9_$]*)*$/.test(candidate);
}

function findMatchingParen(source: string, openIndex: number): number {
  let depth = 0;
  for (let i = openIndex; i < source.length; i++) {
    const char = source[i];
    if (char === "(") {
      depth++;
    } else if (char === ")") {
      depth--;
      if (depth === 0) {
        return i;
      }
    }
  }
  return -1;
}
