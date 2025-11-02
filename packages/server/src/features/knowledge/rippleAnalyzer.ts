import {
  GraphStore,
  type KnowledgeArtifact,
  type LinkRelationshipKind,
  type LinkedArtifactSummary,
  type RelationshipHint
} from "@copilot-improvement/shared";

import { normalizeFileUri } from "../utils/uri";

export interface RippleAnalyzerLogger {
  debug?(message: string): void;
  info?(message: string): void;
  warn?(message: string): void;
  error?(message: string): void;
}

export interface RippleAnalyzerOptions {
  graphStore: GraphStore;
  maxDepth?: number;
  maxResults?: number;
  allowedKinds?: LinkRelationshipKind[];
  logger?: RippleAnalyzerLogger;
}

export interface RippleAnalysisRequest {
  sourceUri?: string;
  maxDepth?: number;
  maxResults?: number;
  allowedKinds?: LinkRelationshipKind[];
  excludeArtifactIds?: Iterable<string>;
}

export type RippleHint = RelationshipHint & {
  depth: number;
  path: string[];
};

interface QueueItem {
  artifact: KnowledgeArtifact;
  depth: number;
  path: PathSegment[];
}

interface PathSegment {
  artifact: KnowledgeArtifact;
  kind: LinkRelationshipKind;
  direction: LinkedArtifactSummary["direction"];
}

const DEFAULT_MAX_DEPTH = 3;
const DEFAULT_MAX_RESULTS = 50;
const DEFAULT_ALLOWED_KINDS: LinkRelationshipKind[] = [
  "depends_on",
  "implements",
  "documents",
  "references",
  "includes"
];
const DEPTH_PENALTY = 0.18;
const MIN_CONFIDENCE = 0.1;
const MAX_CONFIDENCE = 0.95;

const KIND_BASE_CONFIDENCE: Record<LinkRelationshipKind, number> = {
  depends_on: 0.9,
  implements: 0.85,
  documents: 0.8,
  references: 0.65,
  includes: 0.88
};

export class RippleAnalyzer {
  private readonly graphStore: GraphStore;
  private readonly logger?: RippleAnalyzerLogger;
  private readonly defaultMaxDepth: number;
  private readonly defaultMaxResults: number;
  private readonly defaultAllowedKinds: Set<LinkRelationshipKind>;

  constructor(options: RippleAnalyzerOptions) {
    this.graphStore = options.graphStore;
    this.logger = options.logger;
    this.defaultMaxDepth = Math.max(1, options.maxDepth ?? DEFAULT_MAX_DEPTH);
    this.defaultMaxResults = Math.max(1, options.maxResults ?? DEFAULT_MAX_RESULTS);
    this.defaultAllowedKinds = new Set(options.allowedKinds ?? DEFAULT_ALLOWED_KINDS);
  }

  generateHintsForArtifact(
    artifact: KnowledgeArtifact,
    request: RippleAnalysisRequest = {}
  ): RippleHint[] {
    const sourceUri = normalizeFileUri(request.sourceUri ?? artifact.uri);
    const maxDepth = Math.max(1, request.maxDepth ?? this.defaultMaxDepth);
    const maxResults = Math.max(1, request.maxResults ?? this.defaultMaxResults);
    const allowedKindsInput: LinkRelationshipKind[] = request.allowedKinds
      ? [...request.allowedKinds]
      : Array.from(this.defaultAllowedKinds);
    const allowedKinds = new Set<LinkRelationshipKind>(allowedKindsInput);

    const excluded = new Set<string>();
    for (const identifier of request.excludeArtifactIds ?? []) {
      excluded.add(identifier);
    }

    if (!artifact.id) {
      this.logger?.warn?.(
        `ripple analysis skipped for ${sourceUri} because artifact is missing identifier`
      );
      return [];
    }

    const canonicalRoot: KnowledgeArtifact = {
      ...artifact,
      uri: sourceUri
    };

    return this.traverseRippleGraph({
      root: canonicalRoot,
      maxDepth,
      maxResults,
      allowedKinds,
      excluded
    });
  }

  private traverseRippleGraph(config: {
    root: KnowledgeArtifact;
    maxDepth: number;
    maxResults: number;
    allowedKinds: Set<LinkRelationshipKind>;
    excluded: Set<string>;
  }): RippleHint[] {
    const queue: QueueItem[] = [
      {
        artifact: config.root,
        depth: 0,
        path: []
      }
    ];

    const visitedArtifacts = new Set<string>(config.excluded);
    visitedArtifacts.add(config.root.id);

    const hintMap = new Map<string, RippleHint>();
    const hints: RippleHint[] = [];

    while (queue.length > 0) {
      const current = queue.shift()!;
      const neighbors = this.graphStore.listLinkedArtifacts(current.artifact.id);

      for (const neighbor of neighbors) {
        if (!config.allowedKinds.has(neighbor.kind)) {
          continue;
        }

        const target = neighbor.artifact;
        if (!target?.id) {
          continue;
        }

        if (config.excluded.has(target.id)) {
          continue;
        }

        const depth = current.depth + 1;
        if (depth > config.maxDepth) {
          continue;
        }

        const normalizedTarget: KnowledgeArtifact = {
          ...target,
          uri: normalizeFileUri(target.uri)
        };

        if (normalizedTarget.uri === config.root.uri) {
          continue;
        }

        const path = [
          ...current.path,
          { artifact: normalizedTarget, kind: neighbor.kind, direction: neighbor.direction }
        ];
        const hopPath = path.map(segment => segment.artifact.uri);

        const hintKey = composeHintKey(config.root.uri, normalizedTarget.uri, neighbor.kind);
        if (!hintMap.has(hintKey)) {
          const hint: RippleHint = {
            sourceUri: config.root.uri,
            targetUri: normalizedTarget.uri,
            kind: neighbor.kind,
            confidence: this.computeConfidence(neighbor.kind, depth),
            rationale: this.describePath(depth, path),
            depth,
            path: hopPath
          };

          hintMap.set(hintKey, hint);
          hints.push(hint);

          if (hints.length >= config.maxResults) {
            return hints;
          }
        }

        if (!visitedArtifacts.has(normalizedTarget.id)) {
          visitedArtifacts.add(normalizedTarget.id);
          queue.push({ artifact: normalizedTarget, depth, path });
        }
      }
    }

    return hints;
  }

  private computeConfidence(kind: LinkRelationshipKind, depth: number): number {
    const base = KIND_BASE_CONFIDENCE[kind] ?? KIND_BASE_CONFIDENCE.references;
    const adjusted = base - DEPTH_PENALTY * (depth - 1);
    return clampConfidence(adjusted);
  }

  private describePath(depth: number, path: PathSegment[]): string {
    if (path.length === 0) {
      return `graph-ripple depth=${depth}`;
    }

    const segments = path
      .map(segment => {
        const directionLabel = segment.direction === "incoming" ? "incoming" : "outgoing";
        return `${segment.artifact.uri}(${directionLabel} ${segment.kind})`;
      })
      .join(" -> ");

    return `graph-ripple depth=${depth} via=${segments}`;
  }
}

function composeHintKey(
  sourceUri: string,
  targetUri: string,
  kind: LinkRelationshipKind
): string {
  return `${sourceUri}|${targetUri}|${kind}`;
}

function clampConfidence(value: number): number {
  if (!Number.isFinite(value)) {
    return MIN_CONFIDENCE;
  }

  const bounded = Math.min(MAX_CONFIDENCE, Math.max(MIN_CONFIDENCE, value));
  return Math.round(bounded * 1000) / 1000;
}
