import type { KnowledgeArtifact, LinkRelationshipKind } from "../domain/artifacts";

export const INSPECT_DEPENDENCIES_REQUEST = "linkDiagnostics/dependencies/inspect";

export interface InspectDependenciesParams {
  /**
   * URI of the artifact whose dependents should be inspected. Must be a canonical file URI.
   */
  uri: string;
  /** Optional maximum traversal depth. Defaults to the server configuration. */
  maxDepth?: number;
  /** Optional filter restricting which link kinds are considered. */
  linkKinds?: LinkRelationshipKind[];
}

export interface DependencyGraphEdge {
  dependent: KnowledgeArtifact;
  viaLinkId: string;
  viaKind: LinkRelationshipKind;
  depth: number;
  /**
   * Ordered list of artifacts encountered when traversing from the trigger to the dependent.
   * The final entry is always the dependent artifact.
   */
  path: KnowledgeArtifact[];
}

export interface InspectDependenciesSummary {
  totalDependents: number;
  maxDepthReached: number;
}

export interface InspectDependenciesResult {
  trigger?: KnowledgeArtifact;
  edges: DependencyGraphEdge[];
  summary: InspectDependenciesSummary;
}
