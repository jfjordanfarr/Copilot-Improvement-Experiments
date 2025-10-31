# Symbol Correctness Validator

## Metadata
- Layer: 4
- Implementation ID: IMP-481
- Code Path: [`packages/server/src/features/diagnostics/symbolCorrectnessValidator.ts`](../../../packages/server/src/features/diagnostics/symbolCorrectnessValidator.ts)
- Exports: generateSymbolCorrectnessDiagnostics, SymbolCorrectnessDiagnosticOptions, SymbolCorrectnessReport, SymbolProfileSummary, SymbolProfileViolation

## Purpose
Evaluates compiled symbol correctness profiles against the persisted workspace graph and live rule execution traces. Produces diagnostics for missing upstream/downstream links, identifier mismatches, and unsatisfied evidence clauses so both the CLI (`graph:audit`) and the VS Code extension can surface actionable guidance.

## Public Symbols

### generateSymbolCorrectnessDiagnostics
Runs profile evaluations for the provided workspace snapshot, returning diagnostics grouped by profile and by offending artifact. Supports both JSON reports and human-readable narratives for Problems panel integration.

### SymbolCorrectnessDiagnosticOptions
Structured options object capturing workspace root, compiled profiles, relationship evidences, and output toggles (JSON summaries, markdown narratives, CI enforcement hints).

### SymbolCorrectnessReport
Aggregated result structure containing per-profile coverage summaries, hop-level failures, identifier mismatch details, and evidence gaps, ready for transport to CLI renderers or telemetry pipelines.

### SymbolProfileSummary
Per-profile aggregation that records how many artifacts were evaluated, counts how many satisfied their requirements, and embeds the associated violations for quick drill-down.

### SymbolProfileViolation
Detailed diagnostic payload for a single profile requirement miss, naming the offending artifact, the expected link direction, and the observed count so CLI and editor surfaces can highlight fixes.

## Collaborators
- `packages/shared/src/rules/symbolCorrectnessProfiles.ts` supplies compiled profile contracts.
- `packages/shared/src/rules/relationshipRuleEngine.ts` exposes the execution traces and inferred link evidences used to satisfy profile requirements.
- `packages/server/src/features/diagnostics/graphAuditRenderers.ts` (planned) will format coverage reports for CLI and editor consumption.

## Linked Components
- [COMP-012 – Symbol Correctness Profile Evaluator](/.mdmd/layer-3/relationship-rule-engine.mdmd.md#comp012-symbol-correctness-profile-evaluator)
- [COMP-011 – Relationship Coverage Auditor](/.mdmd/layer-3/relationship-rule-engine.mdmd.md#comp011-relationship-coverage-auditor)

## Evidence
- Unit tests planned in `packages/server/src/features/diagnostics/__tests__/symbolCorrectnessValidator.test.ts` covering happy path, missing upstream hop, identifier mismatch, and evidence gap cases.
- Integration: `npm run graph:audit -- --profiles --json` should emit combined audit + profile reports with zero findings after documentation harmonisation.
