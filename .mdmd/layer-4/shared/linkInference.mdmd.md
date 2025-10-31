# Link Inference Core

## Metadata
- Layer: 4
- Code Path: [`packages/shared/src/inference/linkInference.ts`](../../../packages/shared/src/inference/linkInference.ts)
- Exports: LinkInferenceTraceOrigin, LinkInferenceTraceEntry, LinkEvidence, WorkspaceLinkContribution, WorkspaceLinkProviderContext, WorkspaceLinkProvider, WorkspaceProviderSummary, KnowledgeFeedSnapshotSource, KnowledgeFeedStreamSource, KnowledgeFeed, KnowledgeFeedSummary, LinkInferenceRunInput, LinkInferenceError, LinkInferenceRunResult, LinkInferenceOrchestrator
- Parent design: [LLM Ingestion Pipeline](../llm-ingestion/llmIngestionOrchestrator.mdmd.md), [Knowledge Graph Ingestion Architecture](../../layer-3/knowledge-graph-ingestion.mdmd.md)

## Purpose
Orchestrate contributions from fallback inference, workspace providers, and knowledge feeds into a single graph-ready set of artifacts and links, retaining traceability for every relationship.

## Public Symbols

### LinkInferenceTraceOrigin
Enumerates the possible sources of a trace entry (workspace providers, knowledge feeds, fallback heuristics/LLM).

### LinkInferenceTraceEntry
Captures per-link provenance (origin, confidence, rationale) for downstream diagnostics and audits.

### LinkEvidence
Allows workspace providers to contribute explicit relationships with optional confidence and author metadata.

### WorkspaceLinkContribution
Payload workspace providers return, combining seeds, hints, and evidences.

### WorkspaceLinkProviderContext
Supplies baseline seeds and workspace metadata when invoking providers.

### WorkspaceLinkProvider
Interface that providers implement to contribute artifacts, hints, and evidences during orchestration passes.

### WorkspaceProviderSummary
Aggregates counts for seeds, hints, evidences, and errors contributed by each provider.

### KnowledgeFeedSnapshotSource
Defines how to load a one-off snapshot from an external knowledge feed.

### KnowledgeFeedStreamSource
Defines how to stream incremental updates from a knowledge feed.

### KnowledgeFeed
Bundles snapshot and/or stream sources under a stable feed id.

### KnowledgeFeedSummary
Reports artifact/link counts produced by a feed during an inference run.

### LinkInferenceRunInput
Combines seeds, hints, providers, feeds, and optional LLM bridges for a single orchestration pass.

### LinkInferenceError
Records provider/feed failures without aborting the run.

### LinkInferenceRunResult
Returns merged artifacts, links, traces, provider summaries, feed summaries, and any errors.

### LinkInferenceOrchestrator
High-level orchestrator that coordinates providers, feeds, fallback inference, and telemetry to produce graph-ready outputs.

## Evidence
- Referenced by the server-side orchestrator documented in [`linkInferenceOrchestrator.mdmd.md`](../language-server-runtime/linkInferenceOrchestrator.mdmd.md).
