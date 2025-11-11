// Live Documentation: .mdmd/layer-4/tooling/documentationLinkBridge.mdmd.md#implementation-surface
import { globSync } from "glob";
import fs from "node:fs";
import path from "node:path";

import { createSlugger } from "./githubSlugger";
import { extractReferenceDefinitions } from "./markdownShared";
import { normalizeWorkspacePath } from "./pathUtils";

const HEADING_PATTERN = /^(#{1,6})\s+(.*)$/;
const CODE_MARKER_PATTERN = /<!--\s*mdmd:code\s+([^>\s]+)\s*-->/i;
const INLINE_LINK_PATTERN = /\[[^\]]+\]\(([^)]+)\)/g;
const REFERENCE_LINK_PATTERN = /\[[^\]]+\]\[([^\]]*)\]/g;
const EXTERNAL_SCHEME_PATTERN = /^[a-zA-Z][a-zA-Z0-9+.-]*:/;

export interface DocumentationRule {
  label: string;
  docGlobs: string[];
  codeGlobs: string[];
}

export const DEFAULT_RULES: DocumentationRule[] = [
  {
    label: "Live Documentation",
    docGlobs: [
      ".mdmd/layer-4/**/*.mdmd.md",
      ".live-documentation/source/**/*.mdmd.md"
    ],
    codeGlobs: [
      "packages/**/*.{ts,tsx,js,jsx,cts,mts,mjs,cjs}",
      "scripts/**/*.{ts,tsx,js,jsx,mjs,cjs}",
      "tests/**/*.{ts,tsx,js,jsx}"
    ]
  }
];

export interface DocumentationAnchorSummary {
  heading: string;
  slug: string;
  level: number;
  startLine: number;
  codePaths: string[];
  backlinks: string[];
}

interface ParsedDocumentationAnchors {
  docPath: string;
  absolutePath: string;
  anchors: DocumentationAnchorSummary[];
}

export interface DocumentationDocumentAnchors extends ParsedDocumentationAnchors {
  rule: DocumentationRule;
}

export interface ResolvedDocumentationTarget {
  rule: DocumentationRule;
  label: string;
  docPath: string;
  docAbsolutePath: string;
  slug: string;
  heading: string;
  hasBacklink: boolean;
}

export type DocumentationTargetMap = Map<string, ResolvedDocumentationTarget>;

export interface ParseDocumentationAnchorsOptions {
  workspaceRoot: string;
  content?: string;
}

export interface DocumentationLinkViolation {
  kind:
    | "missing-code-file"
    | "unsupported-comment-style"
    | "missing-doc-backlink"
    | "missing-breadcrumb"
    | "mismatched-breadcrumb"
    | "rule-mismatch";
  filePath: string;
  docPath: string;
  slug: string;
  label: string;
  expected?: string;
  actual?: string;
  message: string;
}

export interface DocumentationLinkEnforcementResult {
  scannedDocuments: number;
  scannedFiles: number;
  fixedFiles: number;
  violations: DocumentationLinkViolation[];
}

export interface RunDocumentationLinkEnforcementOptions {
  workspaceRoot: string;
  rules?: DocumentationRule[];
  fix?: boolean;
  includeList?: string[];
}

export function parseDocumentationAnchors(
  docPath: string,
  { workspaceRoot, content }: ParseDocumentationAnchorsOptions
): ParsedDocumentationAnchors {
  const absolutePath = path.resolve(workspaceRoot, docPath);
  const raw = content ?? fs.readFileSync(absolutePath, "utf8");
  const lines = raw.split(/\r?\n/);

  const slugger = createSlugger();
  const definitions = extractReferenceDefinitions(raw);

  const anchors: DocumentationAnchorSummary[] = [];
  let currentAnchorIndex = -1;

  lines.forEach((line, index) => {
    const headingMatch = line.match(HEADING_PATTERN);
    if (headingMatch) {
      const [, hashes, headingText] = headingMatch;
      const level = hashes.length;
      const slug = slugger.slug(headingText.trim());
      anchors.push({
        heading: headingText.trim(),
        slug,
        level,
        startLine: index + 1,
        codePaths: [],
        backlinks: []
      });
      currentAnchorIndex = anchors.length - 1;
      return;
    }

    if (currentAnchorIndex === -1) {
      return;
    }

    const markerMatch = line.match(CODE_MARKER_PATTERN);
    if (markerMatch) {
      const codePath = resolveWorkspaceRelativePath(markerMatch[1].trim(), workspaceRoot);
      if (codePath && !anchors[currentAnchorIndex].codePaths.includes(codePath)) {
        anchors[currentAnchorIndex].codePaths.push(codePath);
      }
      return;
    }

    collectInlineBacklinks(
      line,
      absolutePath,
      workspaceRoot,
      definitions,
      anchors[currentAnchorIndex]
    );
  });

  return { docPath: normalizeWorkspacePath(docPath), absolutePath, anchors };
}

export function resolveCodeToDocumentationMap(
  documents: DocumentationDocumentAnchors[],
  targetMap: DocumentationTargetMap = new Map()
): DocumentationTargetMap {
  for (const document of documents) {
    for (const anchor of document.anchors) {
      for (const codePath of anchor.codePaths) {
        const existing = targetMap.get(codePath);
        const hasBacklink = anchor.backlinks.includes(codePath);
        const target: ResolvedDocumentationTarget = {
          rule: document.rule,
          label: document.rule.label,
          docPath: document.docPath,
          docAbsolutePath: document.absolutePath,
          slug: anchor.slug,
          heading: anchor.heading,
          hasBacklink
        };

        if (!existing) {
          targetMap.set(codePath, target);
          continue;
        }

        if (!existing.hasBacklink && hasBacklink) {
          targetMap.set(codePath, target);
        }
      }
    }
  }

  return targetMap;
}

export function formatDocumentationLinkComment(
  filePath: string,
  target: ResolvedDocumentationTarget
): string {
  const extension = path.extname(filePath).toLowerCase();
  const prefix = resolveLineCommentPrefix(extension);
  if (!prefix) {
    throw new Error(`Unsupported documentation comment style for ${extension}`);
  }

  return `${prefix} ${target.label}: ${target.docPath}#${target.slug}`;
}

export function runDocumentationLinkEnforcement(
  options: RunDocumentationLinkEnforcementOptions
): DocumentationLinkEnforcementResult {
  const { workspaceRoot, fix = false, includeList } = options;
  const rules = options.rules?.length ? options.rules : DEFAULT_RULES;

  const documentsByRule = new Map<DocumentationRule, DocumentationDocumentAnchors[]>();
  const codeFilesByRule = new Map<DocumentationRule, Set<string>>();
  const aggregatedTargets: DocumentationTargetMap = new Map();

  for (const rule of rules) {
    const docPaths = collectFiles(workspaceRoot, rule.docGlobs);
    const documents = docPaths.map((docPath) => ({
      ...parseDocumentationAnchors(docPath, { workspaceRoot }),
      rule
    }));
    documentsByRule.set(rule, documents);
    resolveCodeToDocumentationMap(documents, aggregatedTargets);

    const codePaths = collectFiles(workspaceRoot, rule.codeGlobs);
    codeFilesByRule.set(rule, new Set(codePaths));
  }

  const targetFiles = includeList ?? Array.from(aggregatedTargets.keys());

  let scannedFiles = 0;
  let fixedFiles = 0;
  const violations: DocumentationLinkViolation[] = [];

  for (const codePath of targetFiles) {
    const target = aggregatedTargets.get(codePath);
    if (!target) {
      continue;
    }

    const absolutePath = path.resolve(workspaceRoot, codePath);
    if (!fs.existsSync(absolutePath)) {
      violations.push({
        kind: "missing-code-file",
        filePath: codePath,
        docPath: target.docPath,
        slug: target.slug,
        label: target.label,
        message: `Code file missing on disk for documentation section ${target.docPath}#${target.slug}`
      });
      continue;
    }

    const allowedFiles = codeFilesByRule.get(target.rule);
    if (!allowedFiles || !allowedFiles.has(codePath)) {
      violations.push({
        kind: "rule-mismatch",
        filePath: codePath,
        docPath: target.docPath,
        slug: target.slug,
        label: target.label,
        message: `Code path ${codePath} is not covered by rule label "${target.label}" code globs.`
      });
      continue;
    }

    const extension = path.extname(codePath).toLowerCase();
    const prefix = resolveLineCommentPrefix(extension);
    if (!prefix) {
      violations.push({
        kind: "unsupported-comment-style",
        filePath: codePath,
        docPath: target.docPath,
        slug: target.slug,
        label: target.label,
        message: `Unable to infer documentation comment style for ${extension}.`
      });
      continue;
    }

    scannedFiles += 1;

    if (!target.hasBacklink) {
      violations.push({
        kind: "missing-doc-backlink",
        filePath: codePath,
        docPath: target.docPath,
        slug: target.slug,
        label: target.label,
        message: `Documentation section ${target.docPath}#${target.slug} lacks a link back to ${codePath}.`
      });
    }

    const expectedComment = `${prefix} ${target.label}: ${target.docPath}#${target.slug}`;
    const result = ensureDocumentationComment(absolutePath, expectedComment, prefix, target.label, fix);

    if (!result.ok) {
      violations.push({
        kind: result.kind,
        filePath: codePath,
        docPath: target.docPath,
        slug: target.slug,
        label: target.label,
        expected: expectedComment,
        actual: result.actual,
        message: result.message
      });
    }

    if (result.updated) {
      fixedFiles += 1;
    }
  }

  let scannedDocuments = 0;
  for (const documents of documentsByRule.values()) {
    scannedDocuments += documents.length;
  }

  return {
    scannedDocuments,
    scannedFiles,
    fixedFiles,
    violations
  };
}

interface EnsureResult {
  ok: boolean;
  kind: "missing-breadcrumb" | "mismatched-breadcrumb";
  actual?: string;
  message: string;
  updated: boolean;
}

function ensureDocumentationComment(
  absolutePath: string,
  expected: string,
  prefix: string,
  label: string,
  fix: boolean
): EnsureResult {
  const raw = fs.readFileSync(absolutePath, "utf8");
  const hadBom = raw.charCodeAt(0) === 0xfeff;
  const newline = raw.includes("\r\n") ? "\r\n" : "\n";
  const lines = raw.split(/\r?\n/);

  if (hadBom && lines.length > 0) {
    lines[0] = lines[0].slice(1);
  }

  let cursor = 0;
  if (lines[cursor]?.startsWith("#!")) {
    cursor += 1;
  }

  let insertionIndex = lines.length;
  let commentIndex: number | undefined;
  let commentValue: string | undefined;

  for (let index = cursor; index < lines.length; index += 1) {
    const line = lines[index];
    const trimmed = line.trim();

    if (!trimmed) {
      continue;
    }

    if (trimmed.startsWith(prefix)) {
      if (trimmed.startsWith(`${prefix} ${label}:`)) {
        commentIndex = index;
        commentValue = line;
        break;
      }
      continue;
    }

    insertionIndex = index;
    break;
  }

  if (commentIndex === undefined) {
    if (!fix) {
      return {
        ok: false,
        kind: "missing-breadcrumb",
        actual: undefined,
        message: `Missing ${label} comment near the top of the file.`,
        updated: false
      };
    }

    const targetIndex = insertionIndex === lines.length ? lines.length : insertionIndex;
    lines.splice(targetIndex, 0, expected);

    if (hadBom) {
      lines[0] = "\ufeff" + lines[0];
    }

    fs.writeFileSync(absolutePath, lines.join(newline));

    return {
      ok: true,
      kind: "missing-breadcrumb",
      actual: expected,
      message: "",
      updated: true
    };
  }

  const actual = commentValue ?? "";
  if (actual.trim() === expected.trim()) {
    if (hadBom) {
      lines[0] = "\ufeff" + lines[0];
    }
    return {
      ok: true,
      kind: "missing-breadcrumb",
      actual,
      message: "",
      updated: false
    };
  }

  if (!fix) {
    return {
      ok: false,
      kind: "mismatched-breadcrumb",
      actual,
      message: `${label} comment does not match expected target.`,
      updated: false
    };
  }

  lines.splice(commentIndex, 1, expected);

  if (hadBom) {
    lines[0] = "\ufeff" + lines[0];
  }

  fs.writeFileSync(absolutePath, lines.join(newline));

  return {
    ok: true,
    kind: "missing-breadcrumb",
    actual: expected,
    message: "",
    updated: true
  };
}

function collectInlineBacklinks(
  line: string,
  absoluteDocPath: string,
  workspaceRoot: string,
  definitions: Map<string, { index: number; url: string }>,
  anchor: DocumentationAnchorSummary
): void {
  for (const match of line.matchAll(INLINE_LINK_PATTERN)) {
    const index = match.index ?? 0;
    if (index > 0 && line[index - 1] === "!") {
      continue;
    }
    const candidate = match[1];
    const resolved = resolveDocLink(candidate, absoluteDocPath, workspaceRoot);
    if (resolved) {
      pushUnique(anchor.backlinks, resolved);
    }
  }

  for (const match of line.matchAll(REFERENCE_LINK_PATTERN)) {
    const index = match.index ?? 0;
    if (index > 0 && line[index - 1] === "!") {
      continue;
    }
    const referenceId = (match[1] || "").trim().toLowerCase();
    if (!referenceId) {
      continue;
    }

    const definition = definitions.get(referenceId);
    if (!definition) {
      continue;
    }

    const resolved = resolveDocLink(definition.url, absoluteDocPath, workspaceRoot);
    if (resolved) {
      pushUnique(anchor.backlinks, resolved);
    }
  }
}

function resolveDocLink(
  target: string,
  absoluteDocPath: string,
  workspaceRoot: string
): string | undefined {
  let sanitized = target.trim();
  if (!sanitized || sanitized.startsWith("#")) {
    return undefined;
  }

  if (EXTERNAL_SCHEME_PATTERN.test(sanitized)) {
    return undefined;
  }

  sanitized = stripFragmentAndQuery(sanitized);

  let decoded: string;
  try {
    decoded = decodeURI(sanitized);
  } catch {
    decoded = sanitized;
  }

  const docDir = path.dirname(absoluteDocPath);
  const resolvedPath = decoded.startsWith("/")
    ? path.resolve(workspaceRoot, `.${decoded}`)
    : path.resolve(docDir, decoded);
  const relative = path.relative(workspaceRoot, resolvedPath);
  if (!relative || relative.startsWith("..")) {
    return undefined;
  }

  return normalizeWorkspacePath(relative);
}

function resolveWorkspaceRelativePath(candidate: string, workspaceRoot: string): string | undefined {
  const decoded = decodeCandidate(candidate);
  const absolute = path.resolve(workspaceRoot, decoded);
  const relative = path.relative(workspaceRoot, absolute);
  if (!relative || relative.startsWith("..")) {
    return undefined;
  }
  return normalizeWorkspacePath(relative);
}

function decodeCandidate(candidate: string): string {
  let value = candidate.trim();
  if (value.startsWith("./")) {
    value = value.slice(2);
  }
  return value;
}

function collectFiles(workspaceRoot: string, patterns: string[]): string[] {
  const results = new Set<string>();

  for (const pattern of patterns) {
    const matches = globSync(pattern, {
      cwd: workspaceRoot,
      nodir: true,
      dot: false
    });

    for (const match of matches) {
      results.add(normalizeWorkspacePath(match));
    }
  }

  return Array.from(results).sort();
}

function resolveLineCommentPrefix(extension: string): string | undefined {
  switch (extension) {
    case ".ts":
    case ".tsx":
    case ".js":
    case ".jsx":
    case ".cts":
    case ".mts":
    case ".mjs":
    case ".cjs":
      return "//";
    default:
      return undefined;
  }
}

function stripFragmentAndQuery(target: string): string {
  let value = target;
  const hashIndex = value.indexOf("#");
  if (hashIndex !== -1) {
    value = value.slice(0, hashIndex);
  }
  const queryIndex = value.indexOf("?");
  if (queryIndex !== -1) {
    value = value.slice(0, queryIndex);
  }
  return value;
}

function pushUnique(list: string[], value: string): void {
  if (!list.includes(value)) {
    list.push(value);
  }
}
