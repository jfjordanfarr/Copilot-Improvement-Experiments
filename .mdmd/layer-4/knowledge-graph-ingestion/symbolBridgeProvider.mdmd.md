# SymbolBridgeProvider (Layer 4)

## Source Mapping
- Implementation: [`packages/server/src/features/knowledge/symbolBridgeProvider.ts`](../../../packages/server/src/features/knowledge/symbolBridgeProvider.ts)
- Parent design: [Knowledge Graph Ingestion Architecture](../../layer-3/knowledge-graph-ingestion.mdmd.md)
- Spec references: [FR-015](../../../specs/001-link-aware-diagnostics/spec.md#functional-requirements), [FR-016](../../../specs/001-link-aware-diagnostics/spec.md#functional-requirements)

## Exported Symbols

#### createSymbolBridgeProvider
`createSymbolBridgeProvider` adapts an LSP `Connection` into a shared `WorkspaceLinkProvider`, issuing `COLLECT_WORKSPACE_SYMBOLS_REQUEST` calls and normalising contributions (seeds, hints, evidences) for the knowledge graph bridge.

## Responsibility
Bridge workspace symbol insights from the VS Code extension into the knowledge graph ingestion pipeline. The provider issues a typed request over the LSP connection, validates the payload with `zod`, and exposes structured contributions that downstream components merge into the graph.

## Behaviour
- Rejects empty seed batches early to avoid unnecessary server round trips.
- Sends `CollectWorkspaceSymbolsParams` derived from the ingestion context (`seeds`, optional `maxSeeds`).
- Validates responses with `CollectWorkspaceSymbolsResultSchema`; malformed payloads surface warnings and throw to ensure ingestion failures are visible.
- Logs summary statistics (files analysed, symbols visited, references resolved) via the optional logger, aiding telemetry correlation.
- Returns `null` when the extension declines to contribute, allowing ingestion to continue with other providers.

## Failure Handling
- Wraps request/parse errors so callers receive actionable warnings, including schema violation details from `zod`.
- Guards against missing contribution payloads, warning operators instead of attempting to dereference `undefined` shapes.

## Observability
- Logger hooks (`info`/`warn`) emit namespaced messages (`[symbol-bridge] ...`) for ease of filtration.
- Request identifiers reuse the shared `COLLECT_WORKSPACE_SYMBOLS_REQUEST` constant to track transport usage across components.

## Follow-ups
- Back off or retry on transient LSP failures once telemetry reveals common failure modes.
- Expand schema to include confidence tiers or diagnostics metadata should the extension surface richer symbol insights.
