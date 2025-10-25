# Link Inference Orchestrator (Layer 4)

## Source Mapping
- Implementation: [`packages/shared/src/inference/linkInference.ts`](../../../packages/shared/src/inference/linkInference.ts)
- Tests: [`packages/shared/src/inference/linkInference.test.ts`](../../../packages/shared/src/inference/linkInference.test.ts)
- Collaborators: [`fallbackInference.ts`](../../../packages/shared/src/inference/fallbackInference.ts), workspace providers, knowledge feeds
- Parent design: [Language Server Architecture](./languageServerRuntime.mdmd.md)

## Responsibility
Merge workspace seeds, explicit hints, fallback heuristics, and external knowledge feeds into a unified set of artifacts, links, and provenance traces. Acts as the central inference engine for the language server, powering diagnostics, dependency inspection, and ripple analysis.

## Key Concepts
- **WorkspaceLinkProvider**: Extension points that contribute additional seeds, hints, or evidences derived from workspace analysis.
- **KnowledgeFeed**: External snapshots/streams that inject precomputed relationships (LSIF, SCIP, documentation graphs).
- **LinkAccumulator**: Internal helper that deduplicates artifacts, merges metadata, and keeps the strongest-confidence link per pair.
- **Trace origins**: Every link records provenance (`heuristic`, `workspace-*`, `knowledge-feed`) for transparency and debugging.

## Public API
- `LinkInferenceOrchestrator.run(input): Promise<LinkInferenceRunResult>`
- Types for providers (`WorkspaceLinkProvider`, `WorkspaceLinkContribution`), feeds (`KnowledgeFeed`), and summary/error reporting.

## Internal Flow
1. Normalize seed list and hints, merging additional contributions from workspace providers (with per-provider summaries and error capture).
2. Execute fallback inference to bootstrap artifacts/links using heuristics, hints, and optional LLM assistance.
3. Incorporate workspace evidences by translating collected hints/seeds into canonical artifacts and links.
4. Load knowledge feed snapshots (and streams when implemented), converting them into artifacts/links with feed provenance.
5. Clamp confidences, compute deterministic link IDs, and aggregate traces describing each contribution.
6. Return the merged artifact/link set with provenance summaries and any provider/feed errors.

## Error Handling
- Captures provider and feed failures as `LinkInferenceError` entries without aborting the run.
- Skips unresolvable links (missing artifacts) to keep the resulting graph consistent.
- Confidence clamping guards against invalid provider data; defaults favour mid-confidence rather than throwing.

## Observability Hooks
- Provider/feed summaries expose seed/evidence counts and snapshot metadata for diagnostics surfaces.
- Traces can be persisted alongside graph entries or surfaced via debugging commands to explain link provenance.

## Integration Notes
- Server runtime runs orchestrator after each change event and on demand for dependency inspection.
- Extension tests assert orchestration merges fallback heuristics, workspace evidences, and knowledge feed snapshots without duplicating artifacts.
- When adding new provider kinds or feed sources, update trace origin typing to keep provenance exhaustive.
