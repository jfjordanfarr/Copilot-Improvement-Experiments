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

