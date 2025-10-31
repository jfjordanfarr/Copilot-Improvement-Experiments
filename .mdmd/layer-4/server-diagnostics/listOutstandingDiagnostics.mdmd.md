# List Outstanding Diagnostics Utilities

## Metadata
- Layer: 4
- Implementation ID: IMP-106
- Code Path: [`packages/server/src/features/diagnostics/listOutstandingDiagnostics.ts`](../../../packages/server/src/features/diagnostics/listOutstandingDiagnostics.ts)
- Exports: buildOutstandingDiagnosticsResult, mapOutstandingDiagnostic

## Purpose
Translate persisted diagnostic records into LSP-friendly summaries so CLI tools, extension commands, and telemetry dashboards can review unresolved ripple alerts consistently.

## Public Symbols

### buildOutstandingDiagnosticsResult
Aggregates graph records into the `ListOutstandingDiagnosticsResult` response shape, normalising timestamps and optional LLM assessments.

### mapOutstandingDiagnostic
Transforms a single `DiagnosticRecord` into a summary, resolving artifact metadata while tolerating missing or deleted files.

## Responsibilities
- Read diagnostics and related artifacts from `GraphStore`, populating summaries with trigger/target URIs, acknowledgement metadata, and assessments.
- Handle missing artifacts gracefully by returning `undefined` handles instead of throwing so downstream tooling can render partial data.
- Keep summary evolution centralised, allowing tests to lock field coverage and clients to remain backward compatible.

## Collaborators
- [`packages/shared/src/db/graphStore.ts`](../../../packages/shared/src/db/graphStore.ts) supplies diagnostic persistence APIs.
- Extension acknowledgement command ([Acknowledge Diagnostics Command](../../../packages/extension/src/commands/acknowledgeDiagnostic.ts)) renders the summaries to users.
- Drift history and acknowledgement services enrich persisted records consumed here.

## Linked Components
- [COMP-001 – Diagnostics Pipeline](../../layer-3/diagnostics-pipeline.mdmd.md)
- [COMP-003 – Language Server Runtime](../../layer-3/language-server-architecture.mdmd.md)

## Evidence
- Unit tests: [`packages/server/src/features/diagnostics/listOutstandingDiagnostics.test.ts`](../../../packages/server/src/features/diagnostics/listOutstandingDiagnostics.test.ts) verify summary coverage and missing artifact handling.
- Integration flows: acknowledgement workflows and CLI commands rely on these summaries during US3 scenarios.

## Operational Notes
- Optional `now` factory keeps payload generation deterministic during tests and scripts.
- Future enhancements include pagination helpers and acknowledgement history enrichment once UI requirements surface.
