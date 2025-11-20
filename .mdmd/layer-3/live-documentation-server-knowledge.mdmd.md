# Live Documentation Server Knowledge

## Metadata
- Layer: 3
- Archetype: component
- Live Doc ID: COMP-server-knowledge

## Authored
### Purpose
Summarise the ingestion and analysis pipeline that feeds the Live Documentation graph—from static LSIF/SCIP snapshots to LLM-assisted extractors and ripple analyzers.

### Notes
- Knowledge feeds and orchestrators treat Live Doc projections as first-class inputs, combining deterministic analyzers with LLM hints to maintain coverage across languages.
- Schema validators normalise payloads into the workspace graph, guaranteeing Stage‑0 mirrors and diagnostics share the same canonical links.
- Ripple analyzers compute depth and confidence metadata that powers doc drift warnings and dependency exploration surfaces.
- Feed descriptors propagate back to the extension so change notifications can prioritise artifacts with fresh evidence or observed drift.

### Strategy
- Expand feed checkpoints with per-language telemetry to monitor analyzer reliability as we grow the benchmark suites.
- Align LLM ingestion dry-run fixtures with production calibration metrics, making it easy to promote new providers without regressions.

## System References
### Components
- [packages/server/src/runtime/knowledgeFeeds.ts](../layer-4/packages/server/src/runtime/knowledgeFeeds.ts.mdmd.md)
- [packages/server/src/features/knowledge/knowledgeFeedManager.ts](../layer-4/packages/server/src/features/knowledge/knowledgeFeedManager.ts.mdmd.md)
- [packages/server/src/features/knowledge/knowledgeGraphIngestor.ts](../layer-4/packages/server/src/features/knowledge/knowledgeGraphIngestor.ts.mdmd.md)
- [packages/server/src/features/knowledge/rippleAnalyzer.ts](../layer-4/packages/server/src/features/knowledge/rippleAnalyzer.ts.mdmd.md)
- [packages/server/src/features/knowledge/schemaValidator.ts](../layer-4/packages/server/src/features/knowledge/schemaValidator.ts.mdmd.md)

## Evidence
- Live Doc benchmark precision/recall reports (`reports/benchmarks/ast/ast-accuracy.json`) track analyzer quality for every ingestible feed.
- Integration fixtures under `tests/integration/fixtures/knowledge-feeds` validate schema enforcement and checkpoint behaviour across sample payloads.
