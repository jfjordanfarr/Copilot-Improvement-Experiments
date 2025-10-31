import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

import type {
  RelationshipResolver,
  RelationshipResolverOptions,
  RelationshipResolverResult
} from "./relationshipRuleTypes";
import {
  extractReferenceDefinitions,
  parseLinkTarget
} from "../tooling/markdownShared";

const INLINE_LINK = /\[[^\]]*\]\(([^)]+)\)/g;
const REFERENCE_LINK = /\[[^\]]*\]\[([^\]]*)\]/g;

interface MarkdownLinkContext {
  workspaceRoot: string;
  sourceFilePath: string;
  content: string;
}

export function createBuiltInResolvers(): Map<string, RelationshipResolver> {
  const resolvers = new Map<string, RelationshipResolver>();
  resolvers.set("markdown-links", markdownLinksResolver);
  resolvers.set("mdmd-code-paths", mdmdCodePathsResolver);
  return resolvers;
}

const markdownLinksResolver: RelationshipResolver = {
  id: "markdown-links",
  resolve(options: RelationshipResolverOptions): RelationshipResolverResult[] {
    const content = options.source.content;
    const sourcePath = toFilePath(options.source.uri);
    if (!content || !sourcePath) {
      return [];
    }

    const linkTargets = collectMarkdownLinkTargets({
      workspaceRoot: options.workspaceRoot,
      sourceFilePath: sourcePath,
      content
    });

    if (!linkTargets.size) {
      return [];
    }

    const results: RelationshipResolverResult[] = [];
    const seen = new Set<string>();

    for (const candidate of options.candidateTargets) {
      const candidateUri = normalizeUri(candidate.uri, options.workspaceRoot);
      if (!candidateUri) {
        continue;
      }

      if (!linkTargets.has(candidateUri) || seen.has(candidateUri)) {
        continue;
      }

      seen.add(candidateUri);
      results.push({
        target: candidate,
        rationale: `markdown link to ${candidateUri}`
      });
    }

    return results;
  }
};

const mdmdCodePathsResolver: RelationshipResolver = {
  id: "mdmd-code-paths",
  resolve(options: RelationshipResolverOptions): RelationshipResolverResult[] {
    const mdmd = readMdmdMetadata(options.source.metadata);
    if (!mdmd?.codePaths?.length) {
      return [];
    }

    const targets = new Set<string>();
    for (const candidate of mdmd.codePaths) {
      if (typeof candidate !== "string" || !candidate.trim()) {
        continue;
      }

      const resolved = normalisePathReference(candidate.trim(), options.workspaceRoot, undefined);
      if (!resolved) {
        continue;
      }

      const uri = pathToFileURL(resolved).toString();
      const normalised = normalizeUri(uri, options.workspaceRoot);
      if (normalised) {
        targets.add(normalised);
      }
    }

    if (!targets.size) {
      return [];
    }

    const results: RelationshipResolverResult[] = [];
    const seen = new Set<string>();

    for (const candidate of options.candidateTargets) {
      const candidateUri = normalizeUri(candidate.uri, options.workspaceRoot);
      if (!candidateUri || !targets.has(candidateUri) || seen.has(candidateUri)) {
        continue;
      }

      seen.add(candidateUri);
      results.push({
        target: candidate,
        rationale: "MDMD code path metadata"
      });
    }

    return results;
  }
};

function collectMarkdownLinkTargets(context: MarkdownLinkContext): Set<string> {
  const targets = new Set<string>();
  const definitions = extractReferenceDefinitions(context.content);

  for (const match of context.content.matchAll(INLINE_LINK)) {
    const target = parseLinkTarget(match[1]);
    const resolved = resolveMarkdownTarget(target, context);
    if (resolved) {
      targets.add(resolved);
    }
  }

  for (const match of context.content.matchAll(REFERENCE_LINK)) {
    const rawIdentifier = (match[1] || match[0].slice(1, match[0].indexOf("]"))).trim();
    const identifier = rawIdentifier.toLowerCase();
    if (!identifier) {
      continue;
    }

    const definition = definitions.get(identifier);
    if (!definition) {
      continue;
    }

    const target = parseLinkTarget(definition.url);
    const resolved = resolveMarkdownTarget(target, context);
    if (resolved) {
      targets.add(resolved);
    }
  }

  return targets;
}

function resolveMarkdownTarget(target: string | undefined, context: MarkdownLinkContext): string | undefined {
  if (!target) {
    return undefined;
  }

  const resolvedPath = normalisePathReference(target, context.workspaceRoot, context.sourceFilePath);
  if (!resolvedPath) {
    return undefined;
  }

  const uri = pathToFileURL(resolvedPath).toString();
  return normalizeUri(uri, context.workspaceRoot);
}

function normalisePathReference(
  reference: string,
  workspaceRoot: string,
  sourceFilePath: string | undefined
): string | undefined {
  const trimmed = reference.trim();
  if (!trimmed) {
    return undefined;
  }

  const withoutFragment = stripFragment(trimmed);
  if (!withoutFragment) {
    return undefined;
  }

  const decoded = safeDecodeUri(withoutFragment);
  if (!decoded) {
    return undefined;
  }

  if (decoded.startsWith("/")) {
    return path.resolve(workspaceRoot, "." + decoded);
  }

  if (decoded.startsWith("file://")) {
    return toFilePath(decoded);
  }

  if (sourceFilePath) {
    const relative = path.resolve(path.dirname(sourceFilePath), decoded);
    if (fs.existsSync(relative)) {
      return relative;
    }
  }

  return path.resolve(workspaceRoot, decoded);
}

function stripFragment(value: string): string {
  const hashIndex = value.indexOf("#");
  if (hashIndex !== -1) {
    return value.slice(0, hashIndex);
  }
  return value;
}

function safeDecodeUri(value: string): string | undefined {
  if (!value) {
    return undefined;
  }

  try {
    return decodeURI(value);
  } catch {
    return value;
  }
}

function toFilePath(uri: string): string | undefined {
  try {
    return fileURLToPath(uri);
  } catch {
    return undefined;
  }
}

function normalizeUri(uri: string, workspaceRoot: string): string | undefined {
  if (!uri) {
    return undefined;
  }

  if (!uri.startsWith("file://")) {
    return uri;
  }

  const filePath = toFilePath(uri);
  if (!filePath) {
    return undefined;
  }

  const absolute = path.resolve(filePath);
  const relative = relativize(absolute, workspaceRoot);
  if (relative) {
    return relative;
  }

  return pathToFileURL(absolute).toString();
}

function relativize(filePath: string, workspaceRoot: string): string | undefined {
  const relative = path.relative(workspaceRoot, filePath);
  if (!relative || relative.startsWith("..")) {
    return undefined;
  }

  return relative.split(path.sep).join("/");
}

function readMdmdMetadata(metadata: Record<string, unknown> | undefined):
  | { codePaths?: unknown[] }
  | undefined {
  if (!metadata || typeof metadata !== "object") {
    return undefined;
  }

  const mdmd = (metadata as { mdmd?: unknown }).mdmd;
  if (!mdmd || typeof mdmd !== "object") {
    return undefined;
  }

  return mdmd as { codePaths?: unknown[] };
}
