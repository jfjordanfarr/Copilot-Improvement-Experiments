# Schema Validator

## Metadata
- Layer: 4
- Implementation ID: IMP-207
- Code Path: [`packages/server/src/features/knowledge/schemaValidator.ts`](../../../packages/server/src/features/knowledge/schemaValidator.ts)
- Exports: validateSnapshot, validateStreamEvent, assertValidSnapshot, assertValidStreamEvent, SchemaViolation, SchemaValidationResult

## Purpose
Guarantee that snapshots and stream events respect the knowledge-graph contract before ingestion mutates the workspace cache, preventing malformed artifacts or links from degrading ripple analysis.

## Public Symbols

### validateSnapshot
Non-throwing validator that inspects snapshot structure, artifact fields, and link references, returning a `SchemaValidationResult` with collected violations.

### validateStreamEvent
Non-throwing validator for stream events, ensuring permitted kinds, required identifiers, and embedded artifact/link payloads are structurally sound.

### assertValidSnapshot
Throws when `validateSnapshot` reports issues, aggregating violations into a readable error string so callers can surface actionable diagnostics.

### assertValidStreamEvent
Throws when `validateStreamEvent` fails, allowing ingestion pipelines to halt before applying invalid deltas.

### SchemaViolation
Structure containing a JSON path and message, used to accumulate validation failures for reporting and diagnostics.

### SchemaValidationResult
Outcome wrapper (`valid`, `issues`) shared across snapshot and stream validators so callers can inspect issues without exceptions.

## Responsibilities
- Enforce allowed artifact layers, link kinds, and stream event types using the shared contract enums.
- Validate nested structures (artifacts, links) and ensure references point to known artifact IDs before ingestion.
- Provide assertion wrappers that surface combined error messages for operator-facing diagnostics.

## Collaborators
- [`packages/server/src/features/knowledge/knowledgeGraphIngestor.ts`](../../../packages/server/src/features/knowledge/knowledgeGraphIngestor.ts) calls the validators before persisting artifacts or links.
- [`packages/server/src/features/knowledge/feedDiagnosticsGateway.ts`](../../../packages/server/src/features/knowledge/feedDiagnosticsGateway.ts) receives rendered violation summaries to update diagnostics.
- [`@copilot-improvement/shared`](../../../packages/shared/src/contracts) supplies shared enums for layers, link kinds, and stream events.

## Linked Components
- [COMP-005 – Knowledge Graph Ingestion](../../layer-3/knowledge-graph-ingestion.mdmd.md#imp207-schemavalidator)

## Evidence
- Unit tests: [`packages/server/src/features/knowledge/knowledgeGraphIngestor.test.ts`](../../../packages/server/src/features/knowledge/knowledgeGraphIngestor.test.ts) exercise validation paths by asserting degraded status when schema violations occur.
- Integration coverage: US5 ingestion suites trigger schema assertions and checkpoint persistence through `KnowledgeGraphIngestor`.
- Manual smoke: corrupting `data/knowledge-feeds/bootstrap.json` causes documented schema errors during `npm run graph:snapshot`, visible via feed diagnostics.

## Operational Notes
- Validation functions avoid throwing to support pipeline reuse in CLI tooling; assertion wrappers add strictness where required.
- Allowed layers include `vision` through `code`, aligning with MDMD layering to keep documentation parity intact.
- Extendable architecture: update allowed constants and add validation branches when new artifact metadata becomes first-class.
