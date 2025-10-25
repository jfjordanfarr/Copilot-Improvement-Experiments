# Falsifiability Requirements for Link-Aware Diagnostics

## Context
Layer-2 requirements clarifying the falsifiability goals supporting spec [`001-link-aware-diagnostics`](../../specs/001-link-aware-diagnostics/spec.md). Derived from ongoing implementation gaps and aligned with Layer-3 architecture ([`.mdmd/layer-3/falsifiability/ripple-falsifiability-suite.mdmd.md`](../layer-3/falsifiability/ripple-falsifiability-suite.mdmd.md)).

## Requirement Set F1: Broken Documentation Links Surface Diagnostics
- **F1.1**: When a markdown document contains a relative link to another document or code artifact, and that target becomes invalid (file rename, move, or link text edit), the system must emit a documentation diagnostic (`code: doc-drift`) attached to the referencing document.
- **F1.2**: Diagnostics produced under F1.1 must include ripple metadata (relationship kind, depth, path, confidence) and support the “Open linked documentation” quick action.
- **F1.3**: Ripple propagation should inform downstream code artifacts linked to the broken target, ensuring developers receive context when implementation references stale docs.

## Requirement Set F2: Guarding Against False Positive Relationships
- **F2.1**: Editing a local variable whose identifier matches other identifiers in different scopes must not introduce new graph relationships nor trigger ripple diagnostics on unrelated files.
- **F2.2**: The system should preserve zero-diagnostic state for sibling files when no explicit dependency exists, even after repeated edits that trigger debounce or hysteresis logic.
- **F2.3**: Any heuristics (e.g., `pathReferenceDetector`) providing `references` hints must be validated via tests to ensure they do not create cross-file relationships without concrete evidence.

## Requirement Set F3: Transform / Metaprogramming Ripple Detection
- **F3.1**: Knowledge graph bootstrap or runtime inference must represent transform pipelines (template → transform script → generated artifact) so ripple analysis can traverse multiple hops.
- **F3.2**: Editing a template or transform definition must trigger `code-ripple` diagnostics on the generated output and intermediary transform script, reflecting depth and path metadata.
- **F3.3**: Diagnostics from F3 must remain within the existing noise suppression budget and respect hysteresis, demonstrating that the system can integrate pipeline-style dependencies without destabilizing emission controls.

## Verification Mapping
- F1: Covered by integration suite [US3 – Markdown Link Drift](../../tests/integration/us3/markdownLinkDrift.test.ts) plus unit coverage for [`pathReferenceDetector`](../../packages/server/src/features/watchers/pathReferenceDetector.ts).
- F2: Covered by [US4 – Scoped Identifier Guard](../../tests/integration/us4/scopeCollision.test.ts) and ripple analyzer unit tests ([`rippleAnalyzer.test.ts`](../../packages/server/src/features/knowledge/rippleAnalyzer.test.ts)).
- F3: Covered by [US5 – Transform Ripple](../../tests/integration/us5/transformRipple.test.ts) with additional ingestion validation in [`knowledgeFeedManager.test.ts`](../../packages/server/src/features/knowledge/knowledgeFeedManager.test.ts).

## Open Dependencies
- Need tests to simulate file rename/move operations within VS Code integration harness.
- Requires fixture-specific knowledge feed bootstrap files.
- May introduce auxiliary scripts for template execution; ensure they run within Node-based harness without external tooling.

## Implementation Alignment
- [FeedCheckpointStore](../layer-4/knowledge-graph-ingestion/feedCheckpointStore.mdmd.md) and [FeedDiagnosticsGateway](../layer-4/knowledge-graph-ingestion/feedDiagnosticsGateway.mdmd.md) ensure F1/F3 feeds stay recoverable and observable.
- [Dependency Quick Pick](../layer-4/extension-diagnostics/dependencyQuickPick.mdmd.md) verifies ripple explanations remain trustworthy while meeting F2 noise guarantees.
- [Fallback Inference](../layer-4/shared/fallbackInference.mdmd.md) and [Link Inference Orchestrator](../layer-4/language-server-runtime/linkInferenceOrchestrator.mdmd.md) provide the inference layer these falsifiability suites stress.
