# Falsifiability Requirements for Link-Aware Diagnostics

## Metadata
- Layer: 2
- Requirement IDs: REQ-F1, REQ-F2, REQ-F3, REQ-F4, REQ-F5

## Requirements

### REQ-F1 Broken Documentation Links Surface Diagnostics
Layer 2 guarantee: when markdown links drift, the workspace emits actionable documentation diagnostics with ripple metadata and quick actions so writers and developers stay aligned with CAP-001 and CAP-003.

#### REQ-F1 Criteria
- Emit `doc-drift` diagnostics whenever a markdown relative link becomes invalid.
- Include relationship kind, depth, path, and confidence metadata with an “Open linked documentation” quick action.
- Propagate ripple context to downstream code artefacts referencing the broken target.

### REQ-F2 Guarding Against False Positive Relationships
Ensure CAP-001 remains trustworthy by preventing noisy diagnostics when identifiers collide without real dependencies.

#### REQ-F2 Criteria
- Avoid creating graph relationships or ripple diagnostics for unrelated files when edits touch scoped identifiers.
- Preserve zero-diagnostic state for sibling files when no explicit dependency exists, even under debounce or hysteresis.
- Validate heuristics (for example, `pathReferenceDetector`) via tests so inferred references require concrete evidence.

### REQ-F3 Transform and Metaprogramming Ripple Detection
Guarantee CAP-002 by modelling template-driven pipelines inside the knowledge graph.

#### REQ-F3 Criteria
- Represent transform pipelines (template to script to generated artefact) inside bootstrap and runtime inference.
- Trigger `code-ripple` diagnostics on generated outputs and intermediary scripts when upstream templates change, carrying depth and path metadata.
- Respect existing noise suppression budgets and hysteresis while adding pipeline dependencies.

### REQ-F4 Documentation Integrity Gate (SlopCop)
Serve CAP-004 by treating documentation integrity as a pre-commit invariant.

#### REQ-F4 Criteria
- SlopCop markdown and MDMD lint must exit non-zero when any link target is missing.
- Honour repository ignore patterns (for example, `slopcop.config.json`) to avoid false positives from generated artefacts.
- Fail `npm run safe:commit` when SlopCop reports findings.
- Extend the same guarantees to asset references (HTML or CSS) so static resources stay aligned.

### REQ-F5 Symbol Integrity
Advance CAP-004 and CAP-005 by keeping documentation symbols in sync with code exports.

#### REQ-F5 Criteria
- Stage zero (shipped): validate markdown headings referenced via anchors and flag duplicate slugs.
- Stage one (planned): ensure Layer 4 docs reference only symbols present in the knowledge graph or explicitly ignored.
- Stage two (planned): rely on language-backed harvesting via compilers or graph imports; report “unsupported” when optional extractors are disabled.
- Stage three (planned): make the symbol audit CLI return exit code 3 on missing or ambiguous symbols and integrate that gate into `npm run safe:commit`.

## Acceptance Criteria and Verification

### REQ-F1 Verification
- Integration suite [US3 – Markdown Link Drift](../../tests/integration/us3/markdownLinkDrift.test.ts) stays green.
- Unit coverage for [`pathReferenceDetector`](../../packages/server/src/features/watchers/pathReferenceDetector.ts) validates link detection heuristics.

### REQ-F2 Verification
- [US4 – Scope Collision](../../tests/integration/us4/scopeCollision.test.ts) ensures no spurious diagnostics emerge.
- [`rippleAnalyzer.test.ts`](../../packages/server/src/features/knowledge/rippleAnalyzer.test.ts) confirms noise suppression and hysteresis behaviour.

### REQ-F3 Verification
- [US5 – Transform Ripple](../../tests/integration/us5/transformRipple.test.ts) exercises template and generated artefact flows.
- [`knowledgeFeedManager.test.ts`](../../packages/server/src/features/knowledge/knowledgeFeedManager.test.ts) covers ingestion alignment.

### REQ-F4 Verification
- [`markdownLinks.test.ts`](../../packages/shared/src/tooling/markdownLinks.test.ts), [`assetPaths.test.ts`](../../packages/shared/src/tooling/assetPaths.test.ts), and [`slopcopAssetCli.test.ts`](../../packages/shared/src/tooling/slopcopAssetCli.test.ts) cover lint logic.
- `npm run slopcop:markdown`, `npm run slopcop:assets`, and `npm run slopcop:symbols` execute within the safe-to-commit pipeline.

### REQ-F5 Verification
- [`githubSlugger.test.ts`](../../packages/shared/src/tooling/githubSlugger.test.ts), [`symbolReferences.test.ts`](../../packages/shared/src/tooling/symbolReferences.test.ts), and [`slopcopSymbolsCli.test.ts`](../../packages/shared/src/tooling/slopcopSymbolsCli.test.ts) enforce stage zero.
- [`tests/integration/fixtures/slopcop-symbols`](/tests/integration/fixtures/slopcop-symbols) keeps curated fixtures ready for higher stages.

## Linked Components

### COMP-004 SlopCop Tooling
Supports REQ-F4 and REQ-F5. [SlopCop Architecture](../layer-3/slopcop.mdmd.md)

### COMP-005 Knowledge Graph Ingestion
Supports REQ-F1 and REQ-F3. [Knowledge Graph Ingestion Architecture](../layer-3/knowledge-graph-ingestion.mdmd.md)

### COMP-009 Falsifiability Suites
Supports all falsifiability requirements. [Ripple Falsifiability Suite](../layer-3/falsifiability/ripple-falsifiability-suite.mdmd.md)

## Linked Implementations

### IMP-201 slopcopMarkdownLinks CLI
Supports REQ-F4. [SlopCop Markdown Audit](../layer-4/tooling/slopcopMarkdownLinks.mdmd.md)

### IMP-202 slopcopAssetPaths CLI
Supports REQ-F4. [SlopCop Asset Audit](../layer-4/tooling/slopcopAssetPaths.mdmd.md)

### IMP-204 slopcopSymbols CLI
Supports REQ-F5. [SlopCop Symbol References](../layer-4/tooling/slopcopSymbolReferences.mdmd.md)

### IMP-103 changeProcessor
Supports REQ-F1 to REQ-F3. [Change Processor Runtime](../layer-4/language-server-runtime/changeProcessor.mdmd.md)

## Evidence
- Safe-to-commit logs stored under `AI-Agent-Workspace/ChatHistory/2025-10-29.md` document SlopCop failures gating commits.
- Graph snapshot fixtures in `data/graph-snapshots` confirm pipeline determinism while exercising symbol harvesting.
- Adoption telemetry for lint stages recorded in `AI-Agent-Workspace/Notes/user-intent-census.md` and roadmap updates.

## Open Dependencies
- Add integration coverage for file rename or move workflows inside the VS Code harness.
- Expand knowledge feed bootstrap fixtures as new pipelines join the coverage set.
- Finalise symbol audit policy decisions (orphan heading tolerance, opt-out mechanisms) before enforcing stages beyond S0.

## Implementation Alignment
- [FeedCheckpointStore](../layer-4/knowledge-graph-ingestion/feedCheckpointStore.mdmd.md) and [FeedDiagnosticsGateway](../layer-4/knowledge-graph-ingestion/feedDiagnosticsGateway.mdmd.md) keep F1 and F3 feeds observable and recoverable.
- [Dependency Quick Pick](../layer-4/extension-diagnostics/dependencyQuickPick.mdmd.md) maintains ripple trustworthiness while meeting F2 noise guarantees.
- [Fallback Inference](../layer-4/shared/fallbackInference.mdmd.md) and [Link Inference Orchestrator](../layer-4/language-server-runtime/linkInferenceOrchestrator.mdmd.md) supply the inference layer exercised by the falsifiability suites.
- SlopCop tooling docs (`slopcopMarkdownLinks.mdmd.md`, `slopcopAssetPaths.mdmd.md`, `slopcopSymbolReferences.mdmd.md`) capture the lint gate enforced by REQ-F4 and REQ-F5.
