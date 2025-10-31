# Workspace Path Utilities

## Metadata
- Layer: 4
- Implementation ID: IMP-406
- Code Path: [`packages/shared/src/tooling/pathUtils.ts`](../../../packages/shared/src/tooling/pathUtils.ts)
- Exports: toWorkspaceRelativePath, toWorkspaceFileUri, normalizeWorkspacePath

## Purpose
Supplies shared helpers for converting between file URIs, workspace-relative paths, and POSIX-normalised path strings so rule evaluation and diagnostics can present consistent identifiers.

## Public Symbols

### toWorkspaceRelativePath
Converts a file URI into a workspace-relative path with forward slashes, returning `undefined` when the URI lies outside the workspace.

### toWorkspaceFileUri
Resolves a workspace-relative path (or absolute path) into a `file://` URI for downstream tooling.

### normalizeWorkspacePath
Normalises directory separators in a path to POSIX-style for consistent comparisons and output messaging.

## Collaborators
- Used by `packages/shared/src/rules/relationshipRuleEngine.ts` to map artifact seeds into glob match candidates.
- Used by `packages/shared/src/rules/relationshipRuleAudit.ts` to render user-facing diagnostics with stable relative paths.

## Linked Components
- [COMP-010 – Relationship Rule Engine](/.mdmd/layer-3/relationship-rule-engine.mdmd.md#comp010-relationship-rule-engine)
- [COMP-011 – Relationship Coverage Auditor](/.mdmd/layer-3/relationship-rule-engine.mdmd.md#comp011-relationship-coverage-auditor)

## Evidence
- Exercised indirectly by the relationship rule provider unit test and graph CLI flows which assert generated evidence paths.
