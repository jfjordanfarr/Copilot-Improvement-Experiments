# Symbol Bridge Provider

## Metadata
- Layer: 4
- Implementation ID: IMP-215
- Code Path: [`packages/server/src/features/knowledge/symbolBridgeProvider.ts`](../../../packages/server/src/features/knowledge/symbolBridgeProvider.ts)
- Exports: createSymbolBridgeProvider

## Purpose
Request workspace symbol intelligence from the VS Code extension and adapt the response into contributions suitable for knowledge graph ingestion.
- Invoke the `COLLECT_WORKSPACE_SYMBOLS_REQUEST` command over the LSP transport.
- Validate the response payload with shared zod schemas before emitting seeds, hints, and evidences.
- Summarise symbol statistics for telemetry and diagnostics consumers.

## Public Symbols

### createSymbolBridgeProvider
Factory that wraps an LSP connection, skipping empty seed batches, issuing symbol collection requests, validating responses, and returning `WorkspaceLinkContribution` payloads for ingestion.

## Collaborators
- [`packages/server/src/features/knowledge/knowledgeGraphBridge.ts`](../../../packages/server/src/features/knowledge/knowledgeGraphBridge.ts) registers the provider when wiring ingestion services.
- [`packages/extension/src/services/symbolBridge.ts`](../../../packages/extension/src/services/symbolBridge.ts) services the LSP request by traversing workspace symbols inside the extension.
- [`packages/shared/src/contracts/symbols.ts`](../../../packages/shared/src/contracts/symbols.ts) defines the request/response schemas validated via zod.

## Linked Components
- [COMP-005 – Knowledge Graph Ingestion](../../layer-3/knowledge-graph-ingestion.mdmd.md#imp215-symbolbridgeprovider)

## Evidence
- Integration smoke: `npm run graph:snapshot` triggers the provider when the extension contributes symbol data during CLI runs.
- Extension-side unit tests cover `registerSymbolBridge` request handling, indirectly exercising provider schema expectations.
- Manual verification: running the inspect-symbol-neighbours CLI issues symbol bridge requests and logs `[symbol-bridge]` statistics when successful.

## Operational Notes
- Returns `null` when the extension declines to contribute (e.g., feature flag disabled) so other providers continue operating.
- Schema violations or transport errors surface warning logs and throw, ensuring ingestion halts visibly rather than ingesting malformed data.
- Future enhancements include retry/backoff strategies once telemetry reveals transient failure modes.
