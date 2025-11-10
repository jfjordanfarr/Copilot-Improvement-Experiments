# Falsifiability Requirements for Live Documentation

## Metadata
- Layer: 2
- Requirement IDs: REQ-F1, REQ-F2, REQ-F3, REQ-F4, REQ-F5, REQ-F6

## Requirements

### REQ-F1 Live Doc Structural Integrity
Guarantee CAP-001: every Live Doc contains the mandated `Metadata`, `Authored`, and `Generated` sections with proper markers so automation can regenerate content safely.

#### REQ-F1 Criteria
- Safe-commit fails when a Live Doc misses required sections, headings, or generated markers.
- HTML comment markers `<!-- BEGIN/END GENERATED SECTION: ... -->` are present and non-overlapping for each generated block.
- Authored subsections (`Description`, `Purpose`, `Notes`) remain editable while generated subsections remain untouched outside automation.

### REQ-F2 Generated Section Determinism
Guarantee CAP-002: regenerated `Public Symbols`, `Dependencies`, and archetype metadata (Evidence/Targets/Consumers) match analyzer output for the current workspace state.

#### REQ-F2 Criteria
- Regeneration CLI produces deterministic hashes for generated blocks; diffs are limited to analyzer changes.
- Benchmarks assert ≥0.9 precision/recall for exported symbols and ≥0.8 for dependencies across supported languages.
- Generated sections include provenance metadata (analyzer name, timestamp) so drift can be audited.

### REQ-F3 Evidence & Coverage Accountability
Guarantee CAP-002 and CAP-003: every implementation Live Doc references tests, benchmarks, or waivers, while test Live Docs declare their targets.

#### REQ-F3 Criteria
- `Observed Evidence` sections list all tests or benchmarks covering the implementation; empty sections require a `<!-- evidence-waived: ... -->` comment and a note in the authored block.
- Test Live Docs populate `Targets` and `Supporting Fixtures`; empty lists must use `_No targets recorded yet_` placeholders and trigger lint warnings.
- Integration tests confirm evidence mapping for unit, integration, and benchmark flows.

### REQ-F4 Live Doc Diagnostics and Exports
Guarantee CAP-003: diagnostics, tree views, CLI exports, and narratives source their data from the Live Doc graph.

#### REQ-F4 Criteria
- Diagnostics providers emit Live Doc links and metadata (generated timestamp, evidence count) in messages.
- CLI exports rebuild narratives exclusively from Live Docs without reaching into bespoke caches.
- Regression tests compare CLI/diagnostic output before and after regeneration to ensure parity.

### REQ-F5 Markdown & Asset Integrity Gate
Guarantee CAP-001 and CAP-004: SlopCop audits remain the first defense, ensuring Live Docs and supporting markdown stay link-accurate and asset-complete.

#### REQ-F5 Criteria
- SlopCop markdown, asset, and symbol audits block safe-commit when Live Docs reference missing files or anchors.
- Markdown lint enforces workspace-relative links and validates header slugs against the configured dialect (GitHub by default); absolute links require explicit waivers.
- Asset audit covers HTML/CSS references introduced by Live Doc consumption surfaces.
- Symbol lint escalates from heading validation to analyzer-backed export verification as language oracles mature.

### REQ-F6 Docstring Bridge Drift Detection
Guarantee CAP-002 and CAP-003: docstring bridges remain truthful by reconciling inline documentation with Live Doc generated summaries.

#### REQ-F6 Criteria
- Docstring bridge CLI compares inline docstrings against generated `Public Symbols` entries and raises drift diagnostics within a single regen cycle.
- Safe-commit fails when drift counts exceed zero, unless waivers are recorded in the authored block.
- Integration fixtures exercise positive/negative drift scenarios across TypeScript, Python, and C# examples.

## Acceptance Criteria and Verification

### REQ-F1 Verification
- Live Doc structure unit tests (`liveDocumentationStructure.test.ts`) validate section ordering, marker placement, and authored block protection.
- Safe-commit logs demonstrate lint failures when markers are missing or edited manually.

### REQ-F2 Verification
- Language-specific benchmark suites (AST accuracy, fallback heuristics) report precision/recall thresholds after regeneration.
- `npm run live-docs:generate -- --verify` compares generated sections against analyzer output hashes.

### REQ-F3 Verification
- Integration suites (`tests/integration/live-docs/evidenceMapping.test.ts`) validate Observed Evidence and Target sections across sample workspaces.
- Coverage reports consumed by the generator (`coverage/extension/`) feed snapshot tests ensuring evidence attribution stays correct.

### REQ-F4 Verification
- Diagnostics integration suites (US1–US5) assert that messages include Live Doc links and metadata.
- CLI snapshot tests (`scripts/live-docs/inspect.test.ts`) confirm narrative output matches Live Doc content.

### REQ-F5 Verification
- Safe-commit transcripts show markdown/asset/symbol lint failures blocking merges when Live Docs drift.
- Asset fixtures under `tests/integration/fixtures/slopcop-assets` cover binary and static resource references consumed by Live Docs.

### REQ-F6 Verification
- Docstring drift integration suites (`tests/integration/live-docs/docstringBridge.test.ts`) fail when Live Docs and inline comments diverge.
- Unit tests for bridge adapters (TypeScript, Python, C#) assert mismatch detection thresholds and waiver handling.
- Safe-commit run with `npm run live-docs:verify-docstrings` reports zero unchecked drifts before completion.

## Linked Components

### COMP-004 SlopCop Tooling
Supports REQ-F1, REQ-F3, and REQ-F5. [SlopCop Architecture](../layer-3/slopcop.mdmd.md)

### COMP-005 Knowledge Graph Ingestion
Supports REQ-F2 and REQ-F6. [Knowledge Graph Ingestion Architecture](../layer-3/knowledge-graph-ingestion.mdmd.md)

### COMP-009 Falsifiability Suites
Supports all falsifiability requirements. [Ripple Falsifiability Suite](../layer-3/falsifiability/ripple-falsifiability-suite.mdmd.md)

## Linked Implementations

### IMP-201 slopcopMarkdownLinks CLI
Supports REQ-F1 and REQ-F5. [SlopCop Markdown Audit](../layer-4/tooling/slopcopMarkdownLinks.mdmd.md)

### IMP-202 slopcopAssetPaths CLI
Supports REQ-F5. [SlopCop Asset Audit](../layer-4/tooling/slopcopAssetPaths.mdmd.md)

### IMP-204 slopcopSymbols CLI
Supports REQ-F5. [SlopCop Symbol References](../layer-4/tooling/slopcopSymbolReferences.mdmd.md)

### IMP-103 changeProcessor
Supports REQ-F2, REQ-F3, and REQ-F4. [Change Processor Runtime](../layer-4/language-server-runtime/changeProcessor.mdmd.md)

### IMP-310 liveDocumentationGenerator
Supports REQ-F1 and REQ-F2. (Documented in forthcoming Layer‑4 Live Documentation generator files.)

### IMP-410 docstringBridgeAdapters
Supports REQ-F6. [Docstring Bridge Schema](../layer-4/tooling/workspaceGraphSnapshot.mdmd.md)

## Evidence
- Safe-to-commit logs (2025-11-08) capture Live Doc structural lint failures resolved after instruction updates.
- Benchmark reports and regeneration diffs stored in `reports/benchmarks` demonstrate analyzer determinism.
- Docstring bridge spikes recorded in `AI-Agent-Workspace/Notes/live-documentation-doc-refactor-plan.md` note outstanding verification work.

## Open Dependencies
- Add integration coverage for rename/move flows impacting Live Docs and ensure waivers propagate downstream.
- Expand knowledge feed bootstrap fixtures with docstring bridge data and evidence mapping.
- Finalise waiver taxonomy (evidence, docstring, asset) before enforcing higher lint severities.

## Implementation Alignment
- [FeedCheckpointStore](../layer-4/knowledge-graph-ingestion/feedCheckpointStore.mdmd.md) and [FeedDiagnosticsGateway](../layer-4/knowledge-graph-ingestion/feedDiagnosticsGateway.mdmd.md) keep analyzer results and docstring bridge state consistent for REQ-F2 and REQ-F6.
- [Dependency Quick Pick](../layer-4/extension-diagnostics/dependencyQuickPick.mdmd.md) consumes Live Doc metadata to satisfy REQ-F4.
- [Fallback Inference](../layer-4/shared/fallbackInference.mdmd.md) and [Link Inference Orchestrator](../layer-4/language-server-runtime/linkInferenceOrchestrator.mdmd.md) supply the analyzer inputs verified by these falsifiability tests.
- SlopCop tooling docs (`slopcopMarkdownLinks.mdmd.md`, `slopcopAssetPaths.mdmd.md`, `slopcopSymbolReferences.mdmd.md`) capture the lint gates enforced by REQ-F1, REQ-F5, and REQ-F6.
