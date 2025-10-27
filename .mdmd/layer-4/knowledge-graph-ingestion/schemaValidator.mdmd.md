# SchemaValidator (Layer 4)

## Source Mapping
- Implementation: [`packages/server/src/features/knowledge/schemaValidator.ts`](../../../packages/server/src/features/knowledge/schemaValidator.ts)
- Consumers: [`knowledgeGraphIngestor.ts`](../../../packages/server/src/features/knowledge/knowledgeGraphIngestor.ts), [`knowledgeFeedManager.ts`](../../../packages/server/src/features/knowledge/knowledgeFeedManager.ts)
- Shared contracts: [`packages/shared/src/contracts`](../../../packages/shared/src/contracts)
- Parent design: [Knowledge Graph Ingestion Architecture](../../layer-3/knowledge-graph-ingestion.mdmd.md)

## Exported Symbols

### `SchemaViolation`
Describes a single schema failure (JSON path + error message). Aggregated to render actionable diagnostics.

### `SchemaValidationResult`
Wrapper for the validation outcome (boolean flag plus collected SchemaViolation entries).

### `validateSnapshot`
Non-throwing validator that inspects snapshot artifacts/links and returns a `SchemaValidationResult`.

### `validateStreamEvent`
Non-throwing validator for stream events, ensuring kind-specific payload requirements are satisfied.

### `assertValidSnapshot`
Throws when `validateSnapshot` uncovers issues, formatting violations into a multi-line error string.

### `assertValidStreamEvent`
Throws when `validateStreamEvent` detects problems, enabling ingestion callers to short-circuit with context.

## Responsibility
Enforce the structural contract for incoming knowledge snapshots and stream events before they mutate the graph. Guards against malformed artifacts/links so ingestion can safely accept external intelligence from LSIF, SCIP, or future feeds.

## Internal Flow
1. For snapshots, verify top-level fields (`label`, `createdAt`, `artifacts`, `links`) and iterate artifacts/links, accumulating violations.
2. Track artifact IDs encountered so link validation can ensure `sourceId`/`targetId` refer to known artifacts.
3. For stream events, validate the event envelope, ensure the `kind` belongs to the allowed list, and inspect nested artifact/link payloads when present.
4. Assertion helpers raise a combined error message when validation fails, enabling callers to short-circuit ingestion with actionable diagnostics.

## Error Handling
- Validation functions never throw; they return a list of issues. Assertion wrappers throw a formatted error summarizing all violations at once.
- Non-fatal metadata mismatches (e.g., optional fields omitted) are ignored so feeds can be sparse while staying compliant.

## Observability Hooks
- Violations are rendered as multi-line strings enumerating the offending paths, making it straightforward to bubble them through `FeedDiagnosticsGateway` for operator visibility.

## Integration Notes
- `KnowledgeGraphIngestor` calls assertion helpers before hitting persistence; failed assertions push degraded status updates through the diagnostics gateway.
- Allowed layers and link kinds align with shared contract enums, ensuring external feeds cannot introduce unsupported relationship types without a deliberate contract update.
- Extending validation (e.g., enforcing artifact ownership) requires updating both the allowed constants and targeted checks herein.
