# Symbol Bridge Service (Layer 4)

## Source Mapping
- Implementation: [`packages/extension/src/services/symbolBridge.ts`](../../../packages/extension/src/services/symbolBridge.ts)
- Tests: [`packages/extension/src/services/symbolBridge.test.ts`](../../../packages/extension/src/services/symbolBridge.test.ts)
- Parent design: [Diagnostics Pipeline Architecture](../../layer-3/diagnostics-pipeline.mdmd.md), [Extension Surfaces Architecture](../../layer-3/extension-surfaces.mdmd.md)
- Spec references: [FR-006](../../../specs/001-link-aware-diagnostics/spec.md#functional-requirements), [T035](../../../specs/001-link-aware-diagnostics/tasks.md)

## Responsibility
Collects workspace symbols and reference relationships via built-in VS Code providers, converting them into seeds, evidences, and hints that enrich the server’s knowledge graph. Acts as the extension-side counterpart to the server’s symbol bridge provider, making sure inferred links stay aligned with current code usage.

## Behaviour
- Validates incoming `COLLECT_WORKSPACE_SYMBOLS_REQUEST` payloads with a `zod` schema before processing.
- Filters seeds to avoid duplicates and unsupported languages (`ts`, `js`, `tsx`, `jsx`) while honouring the requested limit.
- Opens each candidate document, extracts top-level symbols, and asks VS Code for reference locations.
- Emits `depends_on` evidences/hints for each unique (reference → definition) pair, throttled by `MAX_REFERENCES_PER_SYMBOL` and `MAX_TOTAL_REFERENCES` safeguards.
- Collects unseen reference URIs as additional seeds so the server can recurse during the next inference run.

## Implementation Notes
- Uses `normalizeUri`+`isWorkspaceFile` helpers to avoid emitting references for non-workspace or `node_modules` files.
- Builds a `processedPairs` set to prevent duplicate edges when symbols appear in multiple files.
- Keeps lightweight telemetry (`SymbolBridgeSummary`) describing files, symbols, and resolved references to support future observability.
- Confidence scores (`0.92` for evidence, `0.85` for hints) align with ripple heuristics so downstream diagnostics convey relative trust.

## Failure Handling
- If documents or symbol providers throw, the analyzer logs a warning and continues with the remaining seeds.
- Cancellation tokens short-circuit long traversals (integration harness sets tight budgets when closing).

## Testing
- Unit suite verifies seed filtering, reference harvesting, and cancellation behaviour by stubbing VS Code commands.
- Integration coverage (US1/US5) ensures emitted hints appear in ripple diagnostics end-to-end once persisted by the server bridge.

## Follow-ups
- Expand `SUPPORTED_LANGUAGES` once non-JS/TS pipelines land (tracked in backlog T052).
- Instrument summary metrics through VS Code telemetry once consent instrumentation is available.
