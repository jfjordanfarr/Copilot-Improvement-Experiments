import fs from "node:fs";
import path from "node:path";

import { GitHubSlugger } from "./githubSlugger";
import {
  computeLineStarts,
  extractReferenceDefinitions,
  parseLinkTarget,
  toLineAndColumn
} from "./markdownShared";

export type SymbolIssueKind = "duplicate-heading" | "missing-anchor";
export type SymbolIssueSeverity = "warn" | "error";
export type SymbolRuleSetting = "off" | SymbolIssueSeverity;

export interface SymbolReferenceIssue {
  kind: SymbolIssueKind;
  severity: SymbolIssueSeverity;
  file: string;
  line: number;
  column: number;
  slug: string;
  heading?: string;
  message: string;
  targetFile?: string;
  target?: string;
}

export interface SymbolAuditOptions {
  workspaceRoot: string;
  files: string[];
  duplicateHeading?: SymbolRuleSetting;
  missingAnchor?: SymbolRuleSetting;
  ignoreSlugPatterns?: RegExp[];
}

const INLINE_LINK = /(!?)\[[^\]]*\]\(([^)]+)\)/g;
const REFERENCE_LINK = /(!?)\[[^\]]*\]\[([^\]]*)\]/g;
const EXTERNAL_SCHEME = /^[a-zA-Z][a-zA-Z0-9+.-]*:/;
const DEFAULT_DUPLICATE_RULE: SymbolRuleSetting = "warn";
const DEFAULT_MISSING_RULE: SymbolRuleSetting = "error";

interface HeadingInfo {
  text: string;
  slug: string;
  base: string;
  duplicateIndex: number;
  line: number;
  column: number;
}

interface AnchorReference {
  slug: string;
  file: string;
  targetFile: string;
  target: string;
  line: number;
  column: number;
}

interface FileAnalysis {
  headings: HeadingInfo[];
  slugs: Set<string>;
  anchors: AnchorReference[];
}

export function findSymbolReferenceAnomalies(options: SymbolAuditOptions): SymbolReferenceIssue[] {
  const ignorePatterns = options.ignoreSlugPatterns ?? [];
  const duplicateSeverity = toSeverity(options.duplicateHeading ?? DEFAULT_DUPLICATE_RULE);
  const missingSeverity = toSeverity(options.missingAnchor ?? DEFAULT_MISSING_RULE);

  const analyses = new Map<string, FileAnalysis>();

  for (const file of options.files) {
    const absolute = normalizePath(file);
    const analysis = analyzeFile(absolute, options.workspaceRoot);
    analyses.set(absolute, analysis);
  }

  const issues: SymbolReferenceIssue[] = [];

  if (duplicateSeverity) {
    for (const [file, analysis] of analyses.entries()) {
      for (const heading of analysis.headings) {
        if (heading.duplicateIndex === 0) {
          continue;
        }

        if (shouldIgnore(heading.slug, ignorePatterns) || shouldIgnore(heading.base, ignorePatterns)) {
          continue;
        }

        issues.push({
          kind: "duplicate-heading",
          severity: duplicateSeverity,
          file,
          line: heading.line,
          column: heading.column,
          slug: heading.slug,
          heading: heading.text,
          message: duplicateHeadingMessage(heading)
        });
      }
    }
  }

  if (missingSeverity) {
    for (const [file, analysis] of analyses.entries()) {
      for (const anchor of analysis.anchors) {
        if (shouldIgnore(anchor.slug, ignorePatterns)) {
          continue;
        }

        const target = analyses.get(anchor.targetFile);
        if (!target) {
          continue;
        }

        if (!target.slugs.has(anchor.slug)) {
          issues.push({
            kind: "missing-anchor",
            severity: missingSeverity,
            file,
            line: anchor.line,
            column: anchor.column,
            slug: anchor.slug,
            target: anchor.target,
            targetFile: anchor.targetFile,
            message: missingAnchorMessage(anchor, options.workspaceRoot)
          });
        }
      }
    }
  }

  return issues.sort(compareIssues);
}

function analyzeFile(filePath: string, workspaceRoot: string): FileAnalysis {
  const content = fs.readFileSync(filePath, "utf8");
  const lineStarts = computeLineStarts(content);
  const slugger = new GitHubSlugger();

  const headings: HeadingInfo[] = [];
  const lines = content.split(/\r?\n/);
  let inFence = false;
  let fenceMarker: string | undefined;

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    const fenceMatch = line.match(/^ {0,3}(```+|~~~+)/);
    if (fenceMatch) {
      const marker = fenceMatch[1][0];
      if (!inFence) {
        inFence = true;
        fenceMarker = marker;
      } else if (fenceMarker === marker) {
        inFence = false;
        fenceMarker = undefined;
      }
      continue;
    }

    if (inFence) {
      continue;
    }

    const atx = line.match(/^ {0,3}(#{1,6})(?:[ \t]+|$)(.*)$/);
    if (atx) {
      const rawText = sanitizeAtxText(atx[2]);
      const column = leadingWhitespaceWidth(line) + 1;
      const slugContext = slugger.slugWithContext(rawText, false);
      headings.push({
        text: rawText,
        slug: slugContext.slug,
        base: slugContext.base,
        duplicateIndex: slugContext.index,
        line: index + 1,
        column
      });
      continue;
    }

    if (index + 1 < lines.length) {
      const underline = lines[index + 1];
      const setext = underline.match(/^ {0,3}(=+|-+)\s*$/);
      if (setext && line.trim().length > 0) {
        const rawText = line.trim();
        const column = leadingWhitespaceWidth(line) + 1;
        const slugContext = slugger.slugWithContext(rawText, false);
        headings.push({
          text: rawText,
          slug: slugContext.slug,
          base: slugContext.base,
          duplicateIndex: slugContext.index,
          line: index + 1,
          column
        });
        index += 1;
      }
    }
  }

  const slugs = new Set(headings.map((heading) => heading.slug));
  const anchors = extractAnchorReferences(content, filePath, workspaceRoot, lineStarts);

  return { headings, slugs, anchors };
}

function extractAnchorReferences(
  content: string,
  filePath: string,
  workspaceRoot: string,
  lineStarts: number[]
): AnchorReference[] {
  const anchors: AnchorReference[] = [];
  const definitions = extractReferenceDefinitions(content);

  for (const match of content.matchAll(INLINE_LINK)) {
    const target = resolveAnchorTarget(match[2], filePath, workspaceRoot);
    if (!target) {
      continue;
    }

    const position = toLineAndColumn(match.index ?? 0, lineStarts);
    anchors.push({
      slug: target.slug,
      file: filePath,
      targetFile: target.file,
      target: target.raw,
      line: position.line,
      column: position.column
    });
  }

  for (const match of content.matchAll(REFERENCE_LINK)) {
    const referenceId = (match[2] || match[0].slice(1, match[0].indexOf("]"))).trim();
    if (referenceId.length === 0) {
      continue;
    }

    const definition = definitions.get(referenceId.toLowerCase());
    if (!definition) {
      continue;
    }

    const target = resolveAnchorTarget(definition.url, filePath, workspaceRoot);
    if (!target) {
      continue;
    }

    const position = toLineAndColumn(match.index ?? 0, lineStarts);
    anchors.push({
      slug: target.slug,
      file: filePath,
      targetFile: target.file,
      target: target.raw,
      line: position.line,
      column: position.column
    });
  }

  return anchors;
}

function resolveAnchorTarget(raw: string, filePath: string, workspaceRoot: string):
  | { file: string; slug: string; raw: string }
  | undefined {
  const parsed = parseLinkTarget(raw);
  if (!parsed) {
    return undefined;
  }

  if (EXTERNAL_SCHEME.test(parsed)) {
    return undefined;
  }

  let slug: string | undefined;
  let targetFile = filePath;
  let rawTarget = parsed;

  if (parsed.startsWith("#")) {
    slug = parsed.slice(1);
  } else {
    const hashIndex = parsed.indexOf("#");
    if (hashIndex === -1) {
      return undefined;
    }

    const pathPart = parsed.slice(0, hashIndex);
    slug = parsed.slice(hashIndex + 1);

    if (EXTERNAL_SCHEME.test(pathPart)) {
      return undefined;
    }

    const resolved = resolvePathTarget(pathPart, filePath, workspaceRoot);
    if (!resolved) {
      return undefined;
    }

    targetFile = resolved;
    rawTarget = parsed;
  }

  const normalizedSlug = normalizeSlug(slug);
  if (normalizedSlug === undefined) {
    return undefined;
  }

  return {
    file: normalizePath(targetFile),
    slug: normalizedSlug,
    raw: rawTarget
  };
}

function resolvePathTarget(target: string, filePath: string, workspaceRoot: string): string | undefined {
  let decoded: string;
  try {
    decoded = decodeURI(target);
  } catch {
    decoded = target;
  }

  if (decoded.startsWith("/")) {
    return path.resolve(workspaceRoot, "." + decoded);
  }

  return path.resolve(path.dirname(filePath), decoded);
}

function normalizeSlug(fragment: string | undefined): string | undefined {
  if (!fragment) {
    return undefined;
  }

  let value = fragment.trim();
  const queryIndex = value.indexOf("?");
  if (queryIndex !== -1) {
    value = value.slice(0, queryIndex);
  }

  if (value.length === 0) {
    return undefined;
  }

  try {
    value = decodeURIComponent(value);
  } catch {
    // ignore decoding errors, use raw value
  }

  return value.toLowerCase();
}

function sanitizeAtxText(text: string): string {
  if (!text) {
    return "";
  }
  return text.replace(/[ \t]+#+\s*$/, "").trim();
}

function leadingWhitespaceWidth(line: string): number {
  let count = 0;
  while (count < line.length) {
    const code = line.charCodeAt(count);
    if (code !== 32 && code !== 9) {
      break;
    }
    count += 1;
  }
  return count;
}

function duplicateHeadingMessage(heading: HeadingInfo): string {
  const suffix = heading.duplicateIndex;
  const renderedSlug = heading.slug || "";
  if (suffix > 0) {
    return `Heading "${heading.text}" duplicates slug "${heading.base}"; link with "#${renderedSlug}"`;
  }
  return `Heading "${heading.text}" produces slug "${renderedSlug}".`;
}

function missingAnchorMessage(anchor: AnchorReference, workspaceRoot: string): string {
  const relative = path.relative(workspaceRoot, anchor.targetFile) || path.basename(anchor.targetFile);
  return `Anchor "#${anchor.slug}" not found in ${normalizePathForMessage(relative)}.`;
}

function normalizePathForMessage(value: string): string {
  return value.replace(/\\/g, "/");
}

function normalizePath(filePath: string): string {
  return path.resolve(filePath);
}

function shouldIgnore(slug: string, patterns: RegExp[]): boolean {
  return patterns.some((pattern) => pattern.test(slug));
}

function toSeverity(setting: SymbolRuleSetting): SymbolIssueSeverity | undefined {
  if (setting === "off") {
    return undefined;
  }
  return setting;
}

function compareIssues(left: SymbolReferenceIssue, right: SymbolReferenceIssue): number {
  if (left.file !== right.file) {
    return left.file.localeCompare(right.file);
  }
  if (left.line !== right.line) {
    return left.line - right.line;
  }
  if (left.column !== right.column) {
    return left.column - right.column;
  }
  return left.slug.localeCompare(right.slug);
}
