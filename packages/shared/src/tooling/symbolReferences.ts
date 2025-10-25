export interface SymbolReferenceIssue {
  file: string;
  symbol: string;
  reason: string;
}

export interface SymbolAuditOptions {
  workspaceRoot: string;
}

/**
 * Placeholder implementation for future symbol-level linting.
 * Returns an empty list until symbol graph harvesting is wired in.
 */
export function findSymbolReferenceAnomalies(
  _options: SymbolAuditOptions
): SymbolReferenceIssue[] {
  return [];
}
