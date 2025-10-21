# Link-Aware Diagnostics Roadmap (Layer 2)

## Roadmap Streams
1. **T04x – Ripple Observability Foundations** *(in flight)*
   - Lock down cross-file diagnostics for code + documentation via falsifiability suites US1–US5. *(Ref: specs/001-link-aware-diagnostics/spec.md, tests/integration/us1-5)*
   - Harden hysteresis, batching, and acknowledgement flows before expanding to UI polish.
2. **T05x – Knowledge Graph Enrichment**
   - Ingest external feeds (LSIF/SCIP, GitLab KG) with schema validation and resumable checkpoints. *(Ref: specs/001-link-aware-diagnostics/spec.md#functional-requirements)*
   - Surface provenance in diagnostics so users know whether edges are inferred vs. imported.
3. **T06x – Operational UX**
   - Provide lead-friendly dashboards, export CLI, and acknowledgement audit trails. *(Ref: FR-004/FR-005)*
   - Integrate ripple metadata into Copilot prompts and Problems hover tooltips.
4. **T07x – Auto-Repair Tooling**
   - Offer guided workflows to rebind or prune stale links after rename/delete events.
   - Explore safe auto-fix suggestions when diagnostics identify simple drifts (e.g., markdown link updates).

## Verification Strategy
- **Pre-commit guard**: `npm run verify` chaining lint, unit, integration suites. *(Ref: package.json)*
- **Integration coverage**: US1–US5 suites emulate writer, developer, and template-transform flows. *(Ref: tests/integration/us1, us2, us3, us4, us5)*
- **Knowledge feed diffs**: Snapshot JSON fixtures tracked under `tests/integration/fixtures/simple-workspace/data/knowledge-feeds` ensure deterministic graph bootstrapping.
- **Benchmark placeholder**: Introduce curated workspaces with canonical ASTs (per FR-017) before closing T05x.

## Traceability Links
- Vision alignment: [Layer-1 Vision](../layer-1/link-aware-diagnostics-vision.mdmd.md)
- Stakeholder prompts: [User Intent Census](../../AI-Agent-Workspace/Notes/user-intent-census.md)
- Architecture docs: [`Layer-3/diagnostics-pipeline.mdmd.md`](../layer-3/diagnostics-pipeline.mdmd.md), [`Layer-3/extension-surfaces.mdmd.md`](../layer-3/extension-surfaces.mdmd.md), [`Layer-3/language-server-architecture.mdmd.md`](../layer-3/language-server-architecture.mdmd.md)
- Implementation summaries: `Layer-4/extension-diagnostics/docDiagnosticProvider.mdmd.md`, upcoming server module briefs.

## Active Questions / Decisions Needed
- Which knowledge feed should we prioritize for T05x MVP? (Open)
- Do we gate Copilot metadata exposure until acknowledgement UX is complete? (Pending)
- How do we package MDMD artefacts into the extension for future telemetry? (Backlog)
