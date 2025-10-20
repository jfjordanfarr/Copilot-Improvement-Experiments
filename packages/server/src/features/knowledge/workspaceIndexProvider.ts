import { Dirent } from "node:fs";
import * as fs from "node:fs/promises";
import * as path from "node:path";
import { pathToFileURL } from "node:url";

import {
  ArtifactSeed,
  RelationshipHint,
  WorkspaceLinkContribution,
  WorkspaceLinkProvider
} from "@copilot-improvement/shared";

interface WorkspaceIndexProviderOptions {
  rootPath: string;
  implementationGlobs?: string[];
  logger?: {
    info(message: string): void;
  };
}

const DEFAULT_EXTENSIONS = new Set([".ts", ".tsx", ".js", ".jsx", ".mjs", ".cts", ".mts"]);

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
      const targets = options.implementationGlobs ?? ["src"];

      for (const target of targets) {
        const absolute = path.resolve(normalizedRoot, target);
        await scanDirectory(absolute, async filePath => {
          if (!DEFAULT_EXTENSIONS.has(path.extname(filePath))) {
            return;
          }

          try {
            const content = await fs.readFile(filePath, "utf8");
            const uri = pathToFileURL(filePath).toString();
            seeds.push({
              uri,
              layer: "code",
              language: inferLanguage(filePath),
              content
            });

            const directiveHints = await extractLinkHints({
              content,
              sourceFile: filePath,
              sourceUri: uri,
              workspaceRoot: normalizedRoot
            });
            hints.push(...directiveHints);
          } catch {
            // Ignore unreadable files; diagnostic logging handled by caller if desired.
          }
        });
      }

      options.logger?.info(
        `[workspace-index] collected ${seeds.length} seed(s) and ${hints.length} hint(s) from ${targets.join(",")}`
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
        await scanDirectory(resolved, onFile);
        return;
      }

      if (entry.isFile()) {
        await onFile(resolved);
      }
    })
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
