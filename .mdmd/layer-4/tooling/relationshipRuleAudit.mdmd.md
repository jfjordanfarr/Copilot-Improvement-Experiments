# Relationship Rule Audit

## Metadata
- Layer: 4
- Implementation ID: IMP-402
- Code Path: [`packages/shared/src/rules/relationshipRuleAudit.ts`](../../../packages/shared/src/rules/relationshipRuleAudit.ts)
- Exports: evaluateRelationshipCoverage, formatRelationshipDiagnostics, RelationshipCoverageResult, RelationshipCoverageRuleResult, RelationshipCoverageChain, RelationshipCoverageIssueKind, RelationshipCoverageIssue, RelationshipCoverageDiagnostic, EvaluateRelationshipCoverageOptions

## Purpose
Provides the audit-side utilities that load compiled relationship rules, traverse persisted graph artifacts, and surface structured diagnostics when any configured rule chain lacks a satisfied path from its source artifact to the expected downstream targets.

## Public Symbols

### evaluateRelationshipCoverage
Accepts a `GraphStore` and compiled rules, then checks each rule hop across the graph to determine which artifacts are compliant, partially satisfied, or missing their required relationships.

### formatRelationshipDiagnostics
Transforms the raw coverage findings into human-readable (and JSON-friendly) diagnostics that `graph:audit` can print or emit, including rule IDs, hop descriptions, and offending artifact URIs.

### RelationshipCoverageChain
Describes a satisfied rule traversal, capturing the rule metadata and ordered artifact URIs so audits can visualise which chain satisfied the coverage requirement.

### RelationshipCoverageIssueKind
Enumerates coverage failure types: `step` (missing hop candidates) or `propagation` (declared propagation link absent in the persisted graph).

### RelationshipCoverageResult
Structured result containing per-rule coverage, satisfied chains, and outstanding issues returned by `evaluateRelationshipCoverage`.

### RelationshipCoverageRuleResult
Captures the evaluation outcome for a single rule, including matched chains, outstanding issues, and any warnings raised while traversing the graph.

### EvaluateRelationshipCoverageOptions
Input contract for `evaluateRelationshipCoverage`, bundling the `GraphStore`, compiled rule catalogue, and workspace root used for relative path rendering.

### RelationshipCoverageIssue
Represents a missing hop or propagation edge, tracking the source artifact, expected link kind, and diagnostic messaging metadata.

### RelationshipCoverageDiagnostic
Formatted diagnostic payload with rule ID, hop label, and message text that the audit CLI can present or serialise.

## Collaborators
- `packages/shared/src/rules/relationshipRuleEngine.ts` supplies the compiled rule structures shared between snapshot and audit stages.
- `packages/shared/src/tooling/pathUtils.ts` converts artifact URIs into workspace-relative paths for diagnostic readability.

## Linked Components
- [COMP-011 – Relationship Coverage Auditor](/.mdmd/layer-3/relationship-rule-engine.mdmd.md#comp011-relationship-coverage-auditor)

## Evidence
- Pending unit suites under `packages/shared/src/rules/relationshipRuleAudit.test.ts` verifying gap detection, hop reporting, and JSON serialisation of diagnostics.
- Manual run: `npm run graph:audit -- --workspace . --json` should list rule IDs instead of generic “Layer 4 documents lacking code relationships” once this module is wired in.
