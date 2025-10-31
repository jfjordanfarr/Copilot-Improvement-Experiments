# Ripple Analyzer

## Metadata
- Layer: 4
- Implementation ID: IMP-117
- Code Path: [`packages/server/src/features/knowledge/rippleAnalyzer.ts`](../../../packages/server/src/features/knowledge/rippleAnalyzer.ts)
- Exports: RippleAnalyzerLogger, RippleAnalyzerOptions, RippleAnalysisRequest, RippleHint, RippleAnalyzer

## Purpose
Traverse the knowledge graph around a source artifact and emit ranked ripple hints so diagnostics can explain downstream impact.
- Canonicalise artifact URIs and expand relationship paths subject to depth/result budgets.
- Score hints by relationship kind and hop count to surface the most relevant ripple paths.
- Provide a reusable traversal engine shared by diagnostics publishers, quick picks, and CLI tooling.

## Public Symbols

### RippleAnalyzerLogger
Optional logger contract (debug/info/warn/error) that records traversal progress and anomalies without binding to a concrete transport.

### RippleAnalyzerOptions
Constructor parameters covering the graph store dependency, default depth/result limits, allowed relationship kinds, and logger hooks.

### RippleAnalysisRequest
Per-invocation overrides that adjust traversal depth, result caps, allowed kinds, starting URI, or exclusion sets for fine-grained queries.

### RippleHint
Extended relationship hint emitted for each discovered path; carries the target artifact, relationship kind, hop depth, derived confidence, and path rationale.

### RippleAnalyzer
Breadth-first traversal engine that walks relationships, enforces budgets, deduplicates results, and returns ordered ripple hints ready for diagnostics consumption.

## Collaborators
- [`packages/shared/src/db/graphStore.ts`](../../../packages/shared/src/db/graphStore.ts) supplies linked artifact queries used for traversal expansion.
- [`packages/server/src/runtime/changeProcessor.ts`](../../../packages/server/src/runtime/changeProcessor.ts) invokes the analyzer when assembling diagnostics payloads.
- [`packages/server/src/features/watchers/artifactWatcher.ts`](../../../packages/server/src/features/watchers/artifactWatcher.ts) provides source artifact metadata that seeds ripple analysis.

## Linked Components
- [COMP-001 – Diagnostics Pipeline](../../layer-3/diagnostics-pipeline.mdmd.md#imp117-rippleanalyzer)

## Evidence
- Integration suites (US1 code impact, US2 markdown drift) assert ripple outputs by comparing diagnostics to expected downstream artifacts.
- Manual smoke: running `npm run graph:audit` after code edits surfaces ripple analyses summarised in CLI output.
- Planned follow-up: add dedicated unit tests stubbing `GraphStore` to validate BFS ordering, exclusion handling, and confidence decay.

## Operational Notes
- Confidence scoring clamps to `[0.1, 0.95]` and rounds to three decimals for deterministic UI snapshots.
- Traversal skips edges missing identifiers, preferring omission over emitting low-quality hints.
- Budget defaults (`depth=3`, `maxResults=50`) balance coverage with latency; callers can tighten or widen via request overrides.
