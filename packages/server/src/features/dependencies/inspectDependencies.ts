import {
  GraphStore,
  type DependencyGraphEdge,
  type InspectDependenciesResult,
  type InspectDependenciesSummary,
  type KnowledgeArtifact,
  type LinkRelationshipKind
} from "@copilot-improvement/shared";

import { buildCodeImpactGraph, type CodeImpactEdge } from "./buildCodeGraph";
import { normalizeFileUri } from "../utils/uri";

export interface InspectDependenciesOptions {
  graphStore: GraphStore;
  uri: string;
  maxDepth?: number;
  linkKinds?: LinkRelationshipKind[];
}

export function inspectDependencies(
  options: InspectDependenciesOptions
): InspectDependenciesResult {
  const canonicalUri = normalizeFileUri(options.uri);

  const triggerArtifact =
    options.graphStore.getArtifactByUri(canonicalUri) ??
    options.graphStore.getArtifactByUri(options.uri);

  if (!triggerArtifact) {
    return {
      trigger: undefined,
      edges: [] as DependencyGraphEdge[],
      summary: EMPTY_SUMMARY
    };
  }

  const impactEdges = buildCodeImpactGraph(options.graphStore, [triggerArtifact], {
    maxDepth: options.maxDepth,
    linkKinds: options.linkKinds
  });

  const normalizedEdges: DependencyGraphEdge[] = impactEdges.map(edge => ({
    dependent: normalizeArtifact(edge.dependent),
    viaKind: edge.viaKind,
    viaLinkId: edge.viaLinkId,
    depth: edge.depth,
    path: edge.path.map(normalizeArtifact)
  }));

  return {
    trigger: normalizeArtifact(triggerArtifact),
    edges: normalizedEdges,
    summary: createSummary(impactEdges)
  };
}

function normalizeArtifact(artifact: KnowledgeArtifact): KnowledgeArtifact {
  return {
    ...artifact,
    uri: normalizeFileUri(artifact.uri)
  };
}

function createSummary(edges: CodeImpactEdge[]): InspectDependenciesSummary {
  let maxDepth = 0;
  for (const edge of edges) {
    if (edge.depth > maxDepth) {
      maxDepth = edge.depth;
    }
  }

  return {
    totalDependents: edges.length,
    maxDepthReached: maxDepth
  };
}

const EMPTY_SUMMARY: InspectDependenciesSummary = {
  totalDependents: 0,
  maxDepthReached: 0
};
