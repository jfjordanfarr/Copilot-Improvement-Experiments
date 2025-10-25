import fs from "node:fs";
import path from "node:path";

export interface MarkdownLinkIssue {
  file: string;
  line: number;
  column: number;
  raw: string;
  target: string;
}

export interface MarkdownLinkAuditOptions {
  workspaceRoot: string;
  ignoreTargetPatterns?: RegExp[];
}

const INLINE_LINK = /(!?)\[[^\]]*\]\(([^)]+)\)/g;
const REFERENCE_LINK = /(!?)\[[^\]]*\]\[([^\]]*)\]/g;
const DEFINITION = /^\s*\[([^\]]+)\]:\s*(.+)$/;

const EXTERNAL_SCHEME = /^[a-zA-Z][a-zA-Z0-9+.-]*:/;

interface ReferenceDefinition {
  index: number;
  url: string;
}

export function findBrokenMarkdownLinks(
  filePath: string,
  options: MarkdownLinkAuditOptions
): MarkdownLinkIssue[] {
  const content = fs.readFileSync(filePath, "utf8");
  const definitions = extractDefinitions(content);
  const lineStarts = computeLineStarts(content);
  const ignorePatterns = options.ignoreTargetPatterns ?? [];

  const issues: MarkdownLinkIssue[] = [];

  // Inline links and images
  for (const match of content.matchAll(INLINE_LINK)) {
    const raw = match[0];
    const target = parseLinkTarget(match[2]);
    if (!target) {
      continue;
    }

    if (isLocalPath(target)) {
      if (shouldIgnoreTarget(target, ignorePatterns)) {
        continue;
      }

      const resolved = resolveTarget(target, filePath, options.workspaceRoot);
      if (!resolved) {
        continue;
      }

      if (!fs.existsSync(resolved)) {
        issues.push(makeIssue(filePath, match.index ?? 0, raw, target, lineStarts));
      }
    }
  }

  // Reference style links and images
  for (const match of content.matchAll(REFERENCE_LINK)) {
    const referenceId = (match[2] || match[0].slice(1, match[0].indexOf("]"))).trim();
    if (referenceId.length === 0) {
      continue;
    }

    const def = definitions.get(referenceId.toLowerCase());
    if (!def) {
      if (shouldIgnoreTarget(referenceId, ignorePatterns)) {
        continue;
      }
      // Missing definition is effectively broken
      issues.push(makeIssue(filePath, match.index ?? 0, match[0], referenceId, lineStarts));
      continue;
    }

    const target = parseLinkTarget(def.url);
    if (!target || !isLocalPath(target)) {
      continue;
    }

    if (shouldIgnoreTarget(target, ignorePatterns)) {
      continue;
    }

    const resolved = resolveTarget(target, filePath, options.workspaceRoot);
    if (!resolved) {
      continue;
    }

    if (!fs.existsSync(resolved)) {
      issues.push(makeIssue(filePath, def.index, match[0], target, lineStarts));
    }
  }

  return issues;
}

function extractDefinitions(content: string): Map<string, ReferenceDefinition> {
  const map = new Map<string, ReferenceDefinition>();
  const lines = content.split(/\r?\n/);
  let offset = 0;

  for (const line of lines) {
    const definitionMatch = line.match(DEFINITION);
    if (definitionMatch) {
      const identifier = definitionMatch[1].trim().toLowerCase();
      const rawTarget = definitionMatch[2].trim();
      map.set(identifier, {
        index: offset,
        url: rawTarget
      });
    }

    offset += line.length + 1; // include newline
  }

  return map;
}

function computeLineStarts(content: string): number[] {
  const starts = [0];
  for (let index = 0; index < content.length; index += 1) {
    const char = content.charCodeAt(index);
    if (char === 10) {
      starts.push(index + 1);
    }
  }
  return starts;
}

function makeIssue(
  file: string,
  index: number,
  raw: string,
  target: string,
  lineStarts: number[]
): MarkdownLinkIssue {
  const position = getPosition(index, lineStarts);
  return {
    file,
    line: position.line,
    column: position.column,
    raw,
    target
  };
}

function getPosition(index: number, lineStarts: number[]) {
  let low = 0;
  let high = lineStarts.length - 1;

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    const start = lineStarts[mid];
    const nextStart = mid + 1 < lineStarts.length ? lineStarts[mid + 1] : Number.POSITIVE_INFINITY;

    if (index < start) {
      high = mid - 1;
    } else if (index >= nextStart) {
      low = mid + 1;
    } else {
      return {
        line: mid + 1,
        column: index - start + 1
      };
    }
  }

  return { line: 1, column: index + 1 };
}

function parseLinkTarget(raw: string): string | undefined {
  if (!raw) {
    return undefined;
  }

  let target = raw.trim();

  if (target.startsWith("<") && target.endsWith(">")) {
    target = target.slice(1, -1).trim();
  }

  const spaceIndex = target.indexOf(" ");
  if (spaceIndex !== -1) {
    target = target.slice(0, spaceIndex);
  }

  const quoteIndex = target.indexOf('"');
  if (quoteIndex !== -1) {
    target = target.slice(0, quoteIndex);
  }

  const singleQuoteIndex = target.indexOf("'");
  if (singleQuoteIndex !== -1) {
    target = target.slice(0, singleQuoteIndex);
  }

  target = target.trim();

  if (target.length === 0) {
    return undefined;
  }

  return target;
}

function isLocalPath(target: string): boolean {
  if (EXTERNAL_SCHEME.test(target)) {
    return false;
  }

  if (target.startsWith("#")) {
    return false;
  }

  return true;
}

function shouldIgnoreTarget(target: string, patterns: RegExp[]): boolean {
  return patterns.some((pattern) => pattern.test(target));
}

function resolveTarget(target: string, filePath: string, workspaceRoot: string): string | undefined {
  const sanitized = stripFragmentAndQuery(target);
  if (!sanitized) {
    return undefined;
  }

  let decoded: string;
  try {
    decoded = decodeURI(sanitized);
  } catch {
    decoded = sanitized;
  }

  if (decoded.startsWith("/")) {
    return path.resolve(workspaceRoot, "." + decoded);
  }

  const directory = path.dirname(filePath);
  return path.resolve(directory, decoded);
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
