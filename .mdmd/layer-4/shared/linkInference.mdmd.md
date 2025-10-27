# Link Inference Core (Layer 4)

## Source Mapping
- Implementation: [`packages/shared/src/inference/linkInference.ts`](../../../packages/shared/src/inference/linkInference.ts)
- Parent design: [LLM Ingestion Pipeline](../llm-ingestion/llmIngestionOrchestrator.mdmd.md), [Knowledge Graph Ingestion Architecture](../../layer-3/knowledge-graph-ingestion.mdmd.md)

## Exported Symbols

#### LinkInferenceTraceOrigin
`LinkInferenceTraceOrigin` enumerates the possible sources of a trace entry (workspace providers, knowledge feeds, fallback heuristics/LLM).

#### LinkInferenceTraceEntry
`LinkInferenceTraceEntry` captures per-link provenance (origin, confidence, rationale) for downstream diagnostics and audits.

#### LinkEvidence
`LinkEvidence` allows workspace providers to contribute explicit relationships with optional confidence and author metadata.

#### WorkspaceLinkContribution
`WorkspaceLinkContribution` is the payload workspace providers return, combining seeds, hints, and evidences.

#### WorkspaceLinkProviderContext
`WorkspaceLinkProviderContext` supplies baseline seeds when invoking workspace link providers.

#### WorkspaceProviderSummary
`WorkspaceProviderSummary` aggregates counts for seeds, hints, and evidences a provider contributed during a run.

#### KnowledgeFeedSnapshotSource
`KnowledgeFeedSnapshotSource` defines how to load a one-off snapshot from an external knowledge feed.

#### KnowledgeFeedStreamSource
`KnowledgeFeedStreamSource` defines how to stream incremental updates from a knowledge feed.

#### KnowledgeFeed
`KnowledgeFeed` bundles snapshot and/or stream sources under a stable feed id.

#### KnowledgeFeedSummary
`KnowledgeFeedSummary` reports artifact/link counts produced by a feed during an inference run.

#### LinkInferenceRunInput
`LinkInferenceRunInput` combines seeds, hints, providers, feeds, and optional LLM bridges for a single orchestration pass.

#### LinkInferenceError
`LinkInferenceError` records provider/feed failures without aborting the run.

#### LinkInferenceRunResult
`LinkInferenceRunResult` returns merged artifacts, links, traces, provider summaries, feed summaries, and any errors.

## Responsibility
Orchestrate contributions from fallback inference, workspace providers, and knowledge feeds into a single graph-ready set of artifacts and links, retaining traceability for every relationship.

## Evidence
- Referenced by the server-side orchestrator documented in [`linkInferenceOrchestrator.mdmd.md`](../language-server-runtime/linkInferenceOrchestrator.mdmd.md).
