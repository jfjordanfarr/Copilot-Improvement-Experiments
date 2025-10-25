# Link-Aware Diagnostics Roadmap (Layer 2)

## Roadmap Streams
1. **T04x – Ripple Observability Foundations** *(in flight)*
   - Lock down cross-file diagnostics for code + documentation via falsifiability suites US1–US5 ([spec](../../specs/001-link-aware-diagnostics/spec.md), [tests/integration/us1-5](../../tests/integration)).
   - Harden hysteresis, batching, and acknowledgement flows before expanding to UI polish.
2. **T05x – Knowledge Graph Enrichment**
   - Ingest external feeds (LSIF/SCIP, GitLab KG) with schema validation and resumable checkpoints ([functional requirements](../../specs/001-link-aware-diagnostics/spec.md#functional-requirements)).
   - Surface provenance in diagnostics so users know whether edges are inferred vs. imported.
3. **T06x – Operational UX**
   - Provide lead-friendly dashboards, export CLI, and acknowledgement audit trails (see [FR-004/FR-005](../../specs/001-link-aware-diagnostics/spec.md#functional-requirements)).
   - Integrate ripple metadata into Copilot prompts and Problems hover tooltips.
4. **T07x – Auto-Repair Tooling**
   - Offer guided workflows to rebind or prune stale links after rename/delete events.
   - Explore safe auto-fix suggestions when diagnostics identify simple drifts (e.g., markdown link updates).

## Verification Strategy
- **Pre-commit guard**: [`npm run verify`](../../package.json) chaining lint, unit, integration suites.
- **Integration coverage**: US1–US5 suites emulate writer, developer, and template-transform flows ([us1](../../tests/integration/us1/codeImpact.test.ts), [us2](../../tests/integration/us2/markdownDrift.test.ts), [us3](../../tests/integration/us3/markdownLinkDrift.test.ts), [us4](../../tests/integration/us4/scopeCollision.test.ts), [us5](../../tests/integration/us5/transformRipple.test.ts)).
- **Knowledge feed diffs**: Snapshot JSON fixtures tracked under [`tests/integration/fixtures/simple-workspace/data/knowledge-feeds`](../../tests/integration/fixtures/simple-workspace/data/knowledge-feeds) ensure deterministic graph bootstrapping.
- **Benchmark placeholder**: Introduce curated workspaces with canonical ASTs (per FR-017) before closing T05x.

## Traceability Links
- Vision alignment: [Layer-1 Vision](../layer-1/link-aware-diagnostics-vision.mdmd.md)
- Stakeholder prompts: [User Intent Census](../../AI-Agent-Workspace/Notes/user-intent-census.md)
- Architecture docs: [`Layer-3/diagnostics-pipeline.mdmd.md`](../layer-3/diagnostics-pipeline.mdmd.md), [`Layer-3/extension-surfaces.mdmd.md`](../layer-3/extension-surfaces.mdmd.md), [`Layer-3/language-server-architecture.mdmd.md`](../layer-3/language-server-architecture.mdmd.md)
- Implementation summaries: [Layer-4/extension-diagnostics/docDiagnosticProvider.mdmd.md](../layer-4/extension-diagnostics/docDiagnosticProvider.mdmd.md), [Link Inference Orchestrator](../layer-4/language-server-runtime/linkInferenceOrchestrator.mdmd.md), [Knowledge Feed Manager](../layer-4/knowledge-graph-ingestion/knowledgeFeedManager.mdmd.md).

## Active Questions / Decisions Needed
- Which knowledge feed should we prioritize for T05x MVP? (Open)
- Do we gate Copilot metadata exposure until acknowledgement UX is complete? (Pending)
- How do we package MDMD artefacts into the extension for future telemetry? (Backlog)

## Implementation Anchors
- [FeedFormatDetector](../layer-4/knowledge-graph-ingestion/feedFormatDetector.mdmd.md), [SCIPParser](../layer-4/knowledge-graph-ingestion/scipParser.mdmd.md), and [LSIFParser](../layer-4/knowledge-graph-ingestion/lsifParser.mdmd.md) deliver T05x ingestion milestones.
- [Diagnostics Tree View](../layer-4/extension-views/diagnosticsTree.mdmd.md) and [Override Link Command](../layer-4/extension-commands/overrideLink.mdmd.md) represent T04x/T06x UX deliverables already shipping.
- [Fallback Inference](../layer-4/shared/fallbackInference.mdmd.md) and [Link Inference Orchestrator](../layer-4/language-server-runtime/linkInferenceOrchestrator.mdmd.md) underwrite T07x auto-repair planning by exposing confident relationship traces.
