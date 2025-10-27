# Symbol Reference Audit (Layer 4)

## Source Mapping
- Implementation: [`packages/shared/src/tooling/symbolReferences.ts`](../../../packages/shared/src/tooling/symbolReferences.ts)
- Parent design: [SlopCop Workspace Linting](../../layer-3/slopcop.mdmd.md)

## Exported Symbols

#### SymbolIssueKind
`SymbolIssueKind` lists the anomaly categories surfaced by the audit (duplicate-heading, missing-anchor).

#### SymbolIssueSeverity
`SymbolIssueSeverity` defines the severity levels (warn, error) applied to issues.

#### SymbolRuleSetting
`SymbolRuleSetting` encodes user configuration for each rule (off, warn, error).

#### SymbolReferenceIssue
`SymbolReferenceIssue` captures the file, position, slug, and descriptive message for a detected issue.

#### SymbolAuditOptions
`SymbolAuditOptions` configures the audit (workspace root, file list, per-rule severities, slug ignore patterns).

#### findSymbolReferenceAnomalies
`findSymbolReferenceAnomalies` runs the audit across files, returning sorted issues for duplicate headings and missing anchors.

## Responsibility
Analyse markdown documents for consistent heading anchors so diagnostics can warn about duplicate slugs or stale cross-document references before release.

## Evidence
- Invoked by the SlopCop symbol audit command described in [`scripts/slopcop/check-symbols.ts`](../../../scripts/slopcop/check-symbols.ts).
