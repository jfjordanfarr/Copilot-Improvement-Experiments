import type { KnowledgeArtifact, LinkRelationshipKind } from "../domain/artifacts";
import type { ArtifactSeed } from "../inference/fallbackInference";
import type { WorkspaceLinkContribution } from "../inference/linkInference";

export const COLLECT_WORKSPACE_SYMBOLS_REQUEST = "linkDiagnostics/symbols/collect";

export interface CollectWorkspaceSymbolsParams {
  seeds: ArtifactSeed[];
  /**
   * Optional hint allowing the client to short-circuit expensive collection when there are many
   * candidate artifacts. Defaults to an implementation-defined limit.
   */
  maxSeeds?: number;
}

export interface CollectWorkspaceSymbolsResultSummary {
  filesAnalyzed: number;
  symbolsVisited: number;
  referencesResolved: number;
  durationMs: number;
}

export interface CollectWorkspaceSymbolsResult {
  contribution: WorkspaceLinkContribution;
  summary?: CollectWorkspaceSymbolsResultSummary;
}

export const INSPECT_SYMBOL_NEIGHBORS_REQUEST = "linkDiagnostics/symbols/inspectNeighbors";

export interface InspectSymbolNeighborsParams {
  /** Artifact identifier to inspect. */
  artifactId?: string;
  /** Optional artifact URI if the identifier is unknown on the client. */
  uri?: string;
  /** Maximum hop depth to traverse (defaults to implementation-defined). */
  maxDepth?: number;
  /** Optional maximum number of neighbor entries to return. */
  maxResults?: number;
  /** Limit traversal to specific link relationship kinds. */
  linkKinds?: LinkRelationshipKind[];
}

export interface SymbolNeighborPath {
  artifacts: KnowledgeArtifact[];
}

export interface SymbolNeighborNode {
  artifact: KnowledgeArtifact;
  depth: number;
  direction: "incoming" | "outgoing";
  viaLinkId: string;
  viaKind: LinkRelationshipKind;
  confidence: number;
  path: SymbolNeighborPath;
}

export interface SymbolNeighborGroup {
  kind: LinkRelationshipKind;
  neighbors: SymbolNeighborNode[];
}

export interface InspectSymbolNeighborsSummary {
  totalNeighbors: number;
  maxDepthReached: number;
}

export interface InspectSymbolNeighborsResult {
  origin?: KnowledgeArtifact;
  groups: SymbolNeighborGroup[];
  summary: InspectSymbolNeighborsSummary;
}

