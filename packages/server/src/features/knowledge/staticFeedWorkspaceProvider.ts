import fs from "node:fs";
import { promises as fsp } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

import type {
  ArtifactSeed,
  LinkRelationshipKind,
  WorkspaceLinkContribution,
  WorkspaceLinkProvider,
  WorkspaceLinkProviderContext
} from "@live-documentation/shared";

interface Logger {
  info(message: string): void;
  warn(message: string): void;
  error(message: string): void;
}

export interface StaticFeedWorkspaceProviderOptions {
  rootPath: string;
  logger?: Logger;
}

interface StaticFeedArtifactConfig {
  id?: string;
  path?: string;
  uri?: string;
  layer?: string;
  language?: string;
}

interface StaticFeedLinkConfig {
  id?: string;
  sourceId?: string;
  sourcePath?: string;
  sourceUri?: string;
  targetId?: string;
  targetPath?: string;
  targetUri?: string;
  kind?: LinkRelationshipKind;
  confidence?: number;
}

const ARTIFACT_LAYER_VALUES = new Set([
  "vision",
  "requirements",
  "architecture",
  "implementation",
  "code"
]);

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function isArtifactLayerValue(value: unknown): value is ArtifactSeed["layer"] {
  return typeof value === "string" && ARTIFACT_LAYER_VALUES.has(value);
}

export function createStaticFeedWorkspaceProvider(
  options: StaticFeedWorkspaceProviderOptions
): WorkspaceLinkProvider {
  const { rootPath, logger } = options;

  return {
    id: "workspace-static-feed",
    label: "Static knowledge feed (workspace fallback)",
    async collect(_context: WorkspaceLinkProviderContext): Promise<WorkspaceLinkContribution> {
      const feedDir = path.join(rootPath, "data", "knowledge-feeds");
      let entries: string[] = [];
      try {
        const stats = await fsp.stat(feedDir);
        if (!stats.isDirectory()) {
          return { seeds: [], hints: [], evidences: [] };
        }
        entries = (await fsp.readdir(feedDir))
          .filter(name => name.endsWith(".json"))
          .map(name => path.join(feedDir, name));
      } catch {
        return { seeds: [], hints: [], evidences: [] };
      }

      const seeds: ArtifactSeed[] = [];
      const evidences: Required<WorkspaceLinkContribution>["evidences"] = [];
      const aliasToUri = new Map<string, string>();

      for (const filePath of entries) {
        try {
          const raw = await readJson(filePath);
          const artifacts = Array.isArray(raw.artifacts)
            ? raw.artifacts.filter((item): item is StaticFeedArtifactConfig => isPlainObject(item))
            : [];
          const links = Array.isArray(raw.links)
            ? raw.links.filter((item): item is StaticFeedLinkConfig => isPlainObject(item))
            : [];

          for (const artifact of artifacts) {
            if (!artifact?.layer || !isArtifactLayerValue(artifact.layer)) {
              continue;
            }
            const uri = resolveArtifactUri(rootPath, artifact, logger);
            aliasToUri.set(uri, uri);
            if (artifact.id) aliasToUri.set(artifact.id, uri);
            if (artifact.path) aliasToUri.set(normalisePathKey(artifact.path), uri);

            seeds.push({
              id: undefined,
              uri,
              layer: artifact.layer,
              language: artifact.language
            });
          }

          for (const link of links) {
            const sourceUri = resolveEndpointUri(rootPath, link.sourceId, link.sourcePath, link.sourceUri, aliasToUri);
            const targetUri = resolveEndpointUri(rootPath, link.targetId, link.targetPath, link.targetUri, aliasToUri);
            if (!sourceUri || !targetUri || !link.kind) {
              continue;
            }
            evidences.push({
              sourceUri,
              targetUri,
              kind: link.kind,
              confidence: typeof link.confidence === "number" ? link.confidence : 0.95,
              createdBy: "workspace-static-feed",
              rationale: `Static feed fallback from ${path.relative(rootPath, filePath)}`
            });
          }
        } catch (error) {
          logger?.warn?.(
            `workspace-static-feed: failed to load ${path.relative(rootPath, filePath)}: ${error instanceof Error ? error.message : String(error)}`
          );
        }
      }

      // Deduplicate seeds by URI
      const uniqueSeeds = Array.from(new Map(seeds.map(s => [s.uri, s])).values());
      return { seeds: uniqueSeeds, hints: [], evidences };
    }
  } satisfies WorkspaceLinkProvider;
}

async function readJson(filePath: string): Promise<Record<string, unknown>> {
  const text = await fsp.readFile(filePath, "utf8");
  const obj: unknown = JSON.parse(text);
  if (!isPlainObject(obj)) {
    throw new Error("static feed must be a JSON object");
  }
  return obj;
}

function resolveArtifactUri(rootPath: string, cfg: StaticFeedArtifactConfig, logger?: Logger): string {
  if (typeof cfg.uri === "string" && cfg.uri.length > 0) {
    return cfg.uri;
  }
  if (typeof cfg.path === "string" && cfg.path.length > 0) {
    const absolute = path.isAbsolute(cfg.path) ? cfg.path : path.join(rootPath, cfg.path);
    if (!fs.existsSync(absolute)) {
      logger?.warn?.(`workspace-static-feed: artifact path missing ${absolute}`);
    }
    return pathToFileURL(absolute).toString();
  }
  throw new Error("artifact requires 'uri' or 'path'");
}

function resolveEndpointUri(
  rootPath: string,
  id: string | undefined,
  p: string | undefined,
  uri: string | undefined,
  alias: Map<string, string>
): string | undefined {
  const candidates = [id, uri, p].filter((v): v is string => typeof v === "string" && v.length > 0);
  for (const c of candidates) {
    const normalized = normalisePathKey(c);
    const viaAlias = alias.get(normalized) ?? alias.get(c);
    if (viaAlias) return viaAlias;
    if (c.startsWith("file://")) return c;
  }
  if (p) {
    const absolute = path.isAbsolute(p) ? p : path.join(rootPath, p);
    return pathToFileURL(absolute).toString();
  }
  return uri;
}

function normalisePathKey(candidate: string): string {
  if (candidate.startsWith("file://")) {
    return candidate;
  }
  return path.normalize(candidate).replace(/\\/g, "/");
}
