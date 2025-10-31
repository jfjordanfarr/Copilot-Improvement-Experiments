# Symbol Bridge Service

## Metadata
- Layer: 4
- Implementation ID: IMP-110
- Code Path: [`packages/extension/src/services/symbolBridge.ts`](../../../packages/extension/src/services/symbolBridge.ts)
- Exports: registerSymbolBridge, SymbolBridgeAnalyzer

## Purpose
Collect workspace symbols and references so the language server can enrich ripple inference with real usage data while respecting consent guardrails.

## Public Symbols

### registerSymbolBridge
Registers the symbol bridge request handler on the language client, routing collection requests into the analyzer pipeline and returning a disposable for activation teardown.

### SymbolBridgeAnalyzer
Processes seeds into evidences and hints by traversing symbols, references, and relationships, enforcing limits that keep collection deterministic.

## Responsibilities
- Validate `COLLECT_WORKSPACE_SYMBOLS_REQUEST` payloads and filter unsupported languages before harvesting.
- Open candidate documents, extract top-level symbols, and query VS Code for reference locations.
- Emit `depends_on` evidences/hints with calibrated confidences (`0.92`/`0.85`) while throttling per-symbol and overall reference counts.
- Collect unseen reference URIs as new seeds so subsequent runs can deepen coverage without duplication.

## Collaborators
- [`packages/shared/src/contracts/symbols.ts`](../../../packages/shared/src/contracts/symbols.ts) defines request/response schemas.
- Shared helpers like `normalizeUri` and `isWorkspaceFile` prevent non-workspace leakage.
- Language server `SymbolBridgeProvider` persists collected edges into the graph.

## Linked Components
- [COMP-001 – Diagnostics Pipeline](../../layer-3/diagnostics-pipeline.mdmd.md)
- [COMP-002 – Extension Surfaces](../../layer-3/extension-surfaces.mdmd.md)
- [COMP-006 – LLM Ingestion Pipeline](../../layer-3/llm-ingestion-pipeline.mdmd.md)

## Evidence
- Unit tests: [`packages/extension/src/services/symbolBridge.test.ts`](../../../packages/extension/src/services/symbolBridge.test.ts) cover seed filtering, harvesting, and cancellation.
- Integration suites US1 and US5 rely on harvested hints to assert ripple accuracy end-to-end.

## Operational Notes
- Maintains `processedPairs` to avoid duplicate edges when symbols appear across files.
- Telemetry summary (`SymbolBridgeSummary`) keeps future observability hooks ready without impacting current consent posture.
- Cancellation tokens ensure long-running traversals halt quickly when the extension deactivates.
