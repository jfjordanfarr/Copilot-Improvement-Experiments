# packages/server/src/features/diagnostics/listOutstandingDiagnostics.ts

## Metadata
- Layer: 4
- Archetype: implementation
- Code Path: packages/server/src/features/diagnostics/listOutstandingDiagnostics.ts
- Live Doc ID: LD-implementation-packages-server-src-features-diagnostics-listoutstandingdiagnostics-ts
- Generated At: 2025-11-16T02:09:51.262Z

## Authored
### Purpose
Transforms raw `DiagnosticRecord`s from the graph store into summaries suitable for UI surfaces and CLI exports, enriching them with artifact metadata and generation timestamps.

### Notes
- `buildOutstandingDiagnosticsResult` injects `generatedAt` via an overridable clock to keep tests deterministic while surfacing real timings in production.
- `mapOutstandingDiagnostic` joins each record with its trigger/target `KnowledgeArtifact` so downstream consumers can render file paths and languages without extra lookups.
- Preserves `llmAssessment` data when present, allowing future surfaces to display assistance metadata alongside diagnostic details.

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-16T02:09:51.262Z","inputHash":"4cf5b0b4ab969d0d"}]} -->
<!-- LIVE-DOC:BEGIN Public Symbols -->
### Public Symbols
#### `buildOutstandingDiagnosticsResult`
- Type: function
- Source: [source](../../../../../../../packages/server/src/features/diagnostics/listOutstandingDiagnostics.ts#L9)

#### `mapOutstandingDiagnostic`
- Type: function
- Source: [source](../../../../../../../packages/server/src/features/diagnostics/listOutstandingDiagnostics.ts#L22)
<!-- LIVE-DOC:END Public Symbols -->

<!-- LIVE-DOC:BEGIN Dependencies -->
### Dependencies
- `@copilot-improvement/shared` - `DiagnosticRecord`, `GraphStore`, `KnowledgeArtifact`, `ListOutstandingDiagnosticsResult`, `OutstandingDiagnosticSummary`
<!-- LIVE-DOC:END Dependencies -->

<!-- LIVE-DOC:BEGIN Observed Evidence -->
### Observed Evidence
#### Vitest Unit Tests
- [listOutstandingDiagnostics.test.ts](./listOutstandingDiagnostics.test.ts.md)
<!-- LIVE-DOC:END Observed Evidence -->
