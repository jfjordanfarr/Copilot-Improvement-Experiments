# RippleAnalyzer (Layer 4)

## Source Mapping
- Implementation: [`packages/server/src/features/knowledge/rippleAnalyzer.ts`](../../../packages/server/src/features/knowledge/rippleAnalyzer.ts)
- Collaborators: `GraphStore`, `RelationshipHint`, `KnowledgeArtifact`
- Parent design: [Knowledge Graph Ingestion Architecture](../../layer-3/knowledge-graph-ingestion.mdmd.md)
- Spec references: [FR-017](../../../specs/001-link-aware-diagnostics/spec.md#functional-requirements), [T041](../../../specs/001-link-aware-diagnostics/tasks.md)

## Exported Symbols

### `RippleAnalyzerLogger`
Optional logger interface with leveled methods (debug, info, warn, error) to observe traversal behaviour without hard-coding transports.

### `RippleAnalyzerOptions`
Constructor configuration specifying the graph store dependency, default depth/result limits, allowed relationship kinds, and logger.

### `RippleAnalysisRequest`
Per-call overrides enabling callers to adjust depth, result caps, allowed link kinds, target URI, or exclusion set.

### `RippleHint`
Extended relationship hint emitted by the analyzer, enriching shared metadata with traversal depth and hop-by-hop path for diagnostics.

### `RippleAnalyzer`
Breadth-first traversal engine that generates ripple hints from the knowledge graph while enforcing depth/result budgets and exclusion rules.

## Responsibility
Traverse the knowledge graph around a source artifact and emit ranked relationship hints that describe potential ripple impacts. Normalises URIs, filters on allowed link kinds, and applies depth-based confidence scoring so downstream diagnostics can surface actionable impact predictions.

## Algorithm
- Canonicalise source URI through `normalizeFileUri` to stabilise comparisons across schemes/path casing.
- Seed a breadth-first queue with the source artifact and expand via `GraphStore.listLinkedArtifacts`.
- For each linked artifact:
  - Skip disallowed link kinds or excluded identifiers.
  - Enforce depth and max-result limits.
  - Record hop metadata (artifact, relationship kind, direction) so explanations include traversal paths.
  - De-duplicate hints per `(source,target,kind)` using a composite key.
- Halt traversal once `maxResults` is reached to protect latency budgets.

## Confidence Model
- Base strength derives from `KIND_BASE_CONFIDENCE`, favouring strong dependency links over softer references.
- Apply a linear penalty (`DEPTH_PENALTY`) per additional hop; clamp to `[0.1, 0.95]` and round to 3 decimals for deterministic UI.
- Embed computed confidence and human-readable path rationale in each `RippleHint` for diagnostics panes.

## Configuration
- Defaults: depth `3`, results `50`, allowed kinds `{depends_on, implements, documents, references}`.
- Request-level overrides allow callers (e.g., quick pick, diagnostics) to tighten scope without rebuilding the analyzer.
- Supports caller-specified `excludeArtifactIds` to avoid feedback loops when traversing change batches.

## Failure Handling
- Logs a warning and returns empty results when the root artifact lacks a stable `id`.
- Skips traversal edges missing identifiers to avoid populating dangling hints.
- Guards against non-finite confidence values via `clampConfidence` fallback.

## Testing
- Exercised implicitly by integration tests that validate dependency ripple diagnostics (US1/US2 suites).
- Unit coverage gap: Provision a focused suite that stubs `GraphStore` to assert BFS ordering, exclusion handling, and confidence decay curves.

## Follow-ups
- Expose traversal telemetry (node expansion counts, elapsed time) for observability dashboards.
- Extend allowed-kinds filtering to support caller-provided scoring weights when richer link taxonomies are introduced.
