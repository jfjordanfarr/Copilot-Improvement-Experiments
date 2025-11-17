import path from "node:path";

import type { LiveDocumentationConfig } from "../config/liveDocumentationConfig";
import { LIVE_DOCUMENTATION_FILE_EXTENSION } from "../config/liveDocumentationConfig";
import { normalizeWorkspacePath } from "../tooling/pathUtils";

export interface ParsedLiveDoc {
  sourcePath: string;
  archetype: string;
  publicSymbols: string[];
  dependencies: string[];
  docPath: string;
}

const DEFAULT_ARCHETYPE = "implementation";

export function parseLiveDocMarkdown(
  content: string,
  docAbsolutePath: string,
  workspaceRoot: string,
  config: LiveDocumentationConfig
): ParsedLiveDoc | undefined {
  const metadataPathMatch = content.match(/-\s+Code Path:\s+(.+)/);
  if (!metadataPathMatch) {
    return undefined;
  }

  const rawSourcePath = metadataPathMatch[1].trim();
  if (!rawSourcePath) {
    return undefined;
  }

  const archetypeMatch = content.match(/-\s+Archetype:\s+(\w+)/);
  const archetype = archetypeMatch ? archetypeMatch[1].toLowerCase() : DEFAULT_ARCHETYPE;

  const publicSymbolsSection = extractSection(content, "Public Symbols");
  const dependenciesSection = extractSection(content, "Dependencies");

  const docDir = path.dirname(docAbsolutePath);

  const publicSymbols = Array.from(parseSymbolSection(publicSymbolsSection));
  const dependencies = Array.from(
    parseDependencySection(dependenciesSection, docDir, workspaceRoot, config)
  );

  return {
    sourcePath: normalizeWorkspacePath(rawSourcePath),
    archetype,
    publicSymbols,
    dependencies,
    docPath: normalizeWorkspacePath(path.relative(workspaceRoot, docAbsolutePath))
  };
}

function extractSection(content: string, section: string): string {
  const begin = `<!-- LIVE-DOC:BEGIN ${section} -->`;
  const end = `<!-- LIVE-DOC:END ${section} -->`;
  const startIndex = content.indexOf(begin);
  const endIndex = content.indexOf(end);
  if (startIndex === -1 || endIndex === -1 || endIndex <= startIndex) {
    return "";
  }
  return content.slice(startIndex + begin.length, endIndex).trim();
}

function parseSymbolSection(section: string): Set<string> {
  const symbols = new Set<string>();
  const lines = section.split(/\r?\n/);
  for (const line of lines) {
    const bulletMatch = line.match(/-\s+`([^`]+)`/);
    if (bulletMatch) {
      symbols.add(bulletMatch[1]);
      continue;
    }

    const headingMatch = line.match(/^####\s+`([^`]+)`/);
    if (headingMatch) {
      symbols.add(headingMatch[1]);
    }
  }
  return symbols;
}

function parseDependencySection(
  section: string,
  docDir: string,
  workspaceRoot: string,
  config: LiveDocumentationConfig
): Set<string> {
  const dependencies = new Set<string>();
  const lines = section.split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed.startsWith("- ")) {
      continue;
    }

    const remainder = trimmed.slice(2).trim();
    if (!remainder || remainder.startsWith("_")) {
      continue;
    }

    const linkMatch = remainder.match(/^\[([^\]]+)\]\(([^)]+)\)/);
    if (linkMatch) {
      const [, label, target] = linkMatch;
      const resolvedTarget = resolveDependencyTarget(target, docDir, workspaceRoot, config);
      if (resolvedTarget) {
        dependencies.add(resolvedTarget);
        continue;
      }

      const sanitisedLabel = stripInlineCode(label);
      if (sanitisedLabel) {
        dependencies.add(sanitisedLabel);
      }
      continue;
    }

    const [firstToken] = remainder.split(/\s+/);
    if (!firstToken) {
      continue;
    }

    const sanitizedToken = stripInlineCode(firstToken);
    if (!sanitizedToken) {
      continue;
    }

    if (sanitizedToken.startsWith(".")) {
      const resolved = resolveDependencyTarget(sanitizedToken, docDir, workspaceRoot, config);
      if (resolved) {
        dependencies.add(resolved);
      }
      continue;
    }

    dependencies.add(sanitizedToken);
  }

  return dependencies;
}

function resolveDependencyTarget(
  rawTarget: string,
  docDir: string,
  workspaceRoot: string,
  config: LiveDocumentationConfig
): string | undefined {
  const target = rawTarget.trim();
  if (!target || /^[a-z]+:\/\//i.test(target)) {
    return undefined;
  }

  const pathComponent = target.split("#", 1)[0];
  if (!pathComponent) {
    return undefined;
  }

  const absolute = path.resolve(docDir, pathComponent);
  const workspaceResolved = path.resolve(workspaceRoot);
  const absoluteResolved = path.resolve(absolute);
  if (
    absoluteResolved !== workspaceResolved &&
    !absoluteResolved.startsWith(`${workspaceResolved}${path.sep}`)
  ) {
    return undefined;
  }

  const relative = path.relative(workspaceRoot, absoluteResolved);
  if (!relative) {
    return undefined;
  }

  const normalizedRelative = normalizeWorkspacePath(relative);
  const liveDocsPrefix = normalizeWorkspacePath(path.join(config.root, config.baseLayer));

  if (normalizedRelative === liveDocsPrefix) {
    return undefined;
  }

  if (normalizedRelative.startsWith(`${liveDocsPrefix}/`)) {
    const withoutPrefix = normalizedRelative.slice(liveDocsPrefix.length + 1);
    if (!withoutPrefix.endsWith(LIVE_DOCUMENTATION_FILE_EXTENSION)) {
      return undefined;
    }
    return withoutPrefix.slice(0, -LIVE_DOCUMENTATION_FILE_EXTENSION.length);
  }

  return normalizedRelative;
}

function stripInlineCode(token: string): string {
  let value = token.trim();
  while (value.startsWith("`")) {
    value = value.slice(1);
  }
  while (value.endsWith("`")) {
    value = value.slice(0, -1);
  }
  return value.trim();
}
