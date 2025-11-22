import {
  GraphStore,
  type InspectSymbolNeighborsResult,
  type InspectSymbolNeighborsSummary,
  type KnowledgeArtifact,
  type LinkRelationshipKind,
  type LinkedArtifactSummary,
  type SymbolNeighborGroup,
  type SymbolNeighborNode
} from "@live-documentation/shared";

import { normalizeFileUri } from "../utils/uri";

export interface InspectSymbolNeighborsOptions {
  graphStore: GraphStore;
  artifactId?: string;
  artifactUri?: string;
  maxDepth?: number;
  maxResults?: number;
  linkKinds?: LinkRelationshipKind[];
}

interface TraversalNode {
  artifactId: string;
  depth: number;
  path: KnowledgeArtifact[];
}

const DEFAULT_MAX_DEPTH = 2;
const DEFAULT_MAX_RESULTS = 50;

export function inspectSymbolNeighbors(
  options: InspectSymbolNeighborsOptions
): InspectSymbolNeighborsResult {
  const origin = resolveOrigin(options);
  if (!origin) {
    return {
      origin: undefined,
      groups: [],
      summary: EMPTY_SUMMARY
    };
  }

  const normalizedOrigin = normalizeArtifact(origin);
  const originId = origin.id;
  const maxDepth = Math.max(1, options.maxDepth ?? DEFAULT_MAX_DEPTH);
  const maxResults = options.maxResults ?? DEFAULT_MAX_RESULTS;
  const allowedKinds = toKindFilter(options.linkKinds);

  const queue: TraversalNode[] = [
    { artifactId: originId, depth: 0, path: [normalizedOrigin] }
  ];
  const visitedDepth = new Map<string, number>([[originId, 0]]);
  const neighbors: SymbolNeighborNode[] = [];
  const neighborById = new Map<string, SymbolNeighborNode>();
  let maxDepthReached = 0;

  while (queue.length && neighbors.length < maxResults) {
    const current = queue.shift()!;
    const linkedArtifacts = options.graphStore.listLinkedArtifacts(current.artifactId);

    for (const link of linkedArtifacts) {
      if (allowedKinds && !allowedKinds.has(link.kind)) {
        continue;
      }

      const target = normalizeArtifact(link.artifact);
      if (target.id === origin.id) {
        continue;
      }

      const nextDepth = current.depth + 1;
      if (nextDepth > maxDepth) {
        continue;
      }

      const nextPath = [...current.path, target];
      const existing = neighborById.get(target.id);

      if (existing) {
        if (existing.depth < nextDepth) {
          continue;
        }

        if (existing.depth === nextDepth) {
          if (link.confidence > existing.confidence) {
            updateNeighbor(existing, link, target, nextPath);
          }
          continue;
        }

        updateNeighbor(existing, link, target, nextPath);
      } else {
        const neighbor: SymbolNeighborNode = {
          artifact: target,
          depth: nextDepth,
          direction: link.direction,
          viaLinkId: link.linkId,
          viaKind: link.kind,
          confidence: link.confidence,
          path: { artifacts: nextPath }
        };

        neighbors.push(neighbor);
        neighborById.set(target.id, neighbor);
      }

      if (!visitedDepth.has(target.id) || visitedDepth.get(target.id)! > nextDepth) {
        visitedDepth.set(target.id, nextDepth);
        if (nextDepth < maxDepth && neighbors.length < maxResults) {
          queue.push({ artifactId: target.id, depth: nextDepth, path: nextPath });
        }
      }

      if (nextDepth > maxDepthReached) {
        maxDepthReached = nextDepth;
      }

      if (neighbors.length >= maxResults) {
        break;
      }
    }
  }

  const groups = buildGroups(neighbors);

  return {
    origin: normalizedOrigin,
    groups,
    summary: {
      totalNeighbors: neighbors.length,
      maxDepthReached
    }
  };
}

function resolveOrigin(options: InspectSymbolNeighborsOptions): KnowledgeArtifact | undefined {
  if (options.artifactId) {
    const artifact = options.graphStore.getArtifactById(options.artifactId);
    if (artifact) {
      return artifact;
    }
  }

  if (options.artifactUri) {
    const normalizedUri = normalizeFileUri(options.artifactUri);
    const normalizedArtifact = options.graphStore.getArtifactByUri(normalizedUri);
    if (normalizedArtifact) {
      return normalizedArtifact;
    }

    if (normalizedUri !== options.artifactUri) {
      const rawArtifact = options.graphStore.getArtifactByUri(options.artifactUri);
      if (rawArtifact) {
        return rawArtifact;
      }
    }
  }

  return undefined;
}

function updateNeighbor(
  neighbor: SymbolNeighborNode,
  link: LinkedArtifactSummary,
  artifact: KnowledgeArtifact,
  path: KnowledgeArtifact[]
): void {
  neighbor.artifact = artifact;
  neighbor.depth = path.length - 1;
  neighbor.direction = link.direction;
  neighbor.viaLinkId = link.linkId;
  neighbor.viaKind = link.kind;
  neighbor.confidence = link.confidence;
  neighbor.path = { artifacts: path };
}

function buildGroups(nodes: SymbolNeighborNode[]): SymbolNeighborGroup[] {
  const grouped = new Map<LinkRelationshipKind, SymbolNeighborNode[]>();

  for (const node of nodes) {
    if (!grouped.has(node.viaKind)) {
      grouped.set(node.viaKind, []);
    }
    grouped.get(node.viaKind)!.push(node);
  }

  const sortedKinds = Array.from(grouped.keys()).sort((a, b) => a.localeCompare(b));

  return sortedKinds.map(kind => {
    const neighbors = grouped
      .get(kind)!
      .slice()
      .sort(compareNeighbors);

    return { kind, neighbors };
  });
}

function compareNeighbors(a: SymbolNeighborNode, b: SymbolNeighborNode): number {
  if (b.confidence !== a.confidence) {
    return b.confidence - a.confidence;
  }

  if (a.depth !== b.depth) {
    return a.depth - b.depth;
  }

  return a.artifact.uri.localeCompare(b.artifact.uri);
}

function toKindFilter(kinds: LinkRelationshipKind[] | undefined): Set<LinkRelationshipKind> | null {
  if (!kinds || kinds.length === 0) {
    return null;
  }

  return new Set(kinds);
}

function normalizeArtifact(artifact: KnowledgeArtifact): KnowledgeArtifact {
  return {
    ...artifact,
    uri: normalizeFileUri(artifact.uri)
  };
}

const EMPTY_SUMMARY: InspectSymbolNeighborsSummary = {
  totalNeighbors: 0,
  maxDepthReached: 0
};
