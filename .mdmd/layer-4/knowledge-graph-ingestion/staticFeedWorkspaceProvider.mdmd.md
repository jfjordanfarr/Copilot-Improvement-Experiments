# Static Feed Workspace Provider

## Metadata
- Layer: 4
- Implementation ID: IMP-210
- Code Path: [`packages/server/src/features/knowledge/staticFeedWorkspaceProvider.ts`](../../../packages/server/src/features/knowledge/staticFeedWorkspaceProvider.ts)
- Exports: StaticFeedWorkspaceProviderOptions, createStaticFeedWorkspaceProvider

## Purpose
Provide a resilient workspace provider that seeds the knowledge graph with static JSON fixtures when external feeds are unavailable or still stabilising.
- Load `data/knowledge-feeds/*.json` descriptors and normalise them into artifact seeds plus evidences.
- Offer a deterministic baseline of graph edges so ripple diagnostics stay informative during outages.
- Supply the link inference orchestrator with workspace-scoped contributions under the `workspace-static-feed` provider ID.

## Public Symbols

### StaticFeedWorkspaceProviderOptions
Configuration contract containing the workspace root and optional logger hooks used to emit warnings for missing files or unresolvable artifact paths.

### createStaticFeedWorkspaceProvider
Factory that returns an implementation of the workspace provider contract, parsing JSON fixtures, deduplicating artifacts, and emitting evidences with default confidences when unspecified.

## Collaborators
- [`packages/server/src/features/knowledge/knowledgeGraphBridge.ts`](../../../packages/server/src/features/knowledge/knowledgeGraphBridge.ts) activates the provider during bridge startup when static feeds are available.
- [`packages/server/src/features/watchers/artifactWatcher.ts`](../../../packages/server/src/features/watchers/artifactWatcher.ts) consumes the emitted artifact seeds to enrich ripple diagnostics.
- [`packages/server/src/features/knowledge/feedDiagnosticsGateway.ts`](../../../packages/server/src/features/knowledge/feedDiagnosticsGateway.ts) surfaces warnings produced by the optional logger to operators.

## Linked Components
- [COMP-005 – Knowledge Graph Ingestion](../../layer-3/knowledge-graph-ingestion.mdmd.md#imp210-staticfeedworkspaceprovider)

## Evidence
- Exercised via [`packages/server/src/features/knowledge/knowledgeGraphBridge.test.ts`](../../../packages/server/src/features/knowledge/knowledgeGraphBridge.test.ts), which loads static JSON feeds to verify baseline seed generation.
- Integration coverage: US5 ingestion suites rely on static fixtures to confirm deterministic graph snapshots when feeds degrade.
- Manual smoke: running `npm run graph:snapshot` in a workspace with `data/knowledge-feeds/bootstrap.json` ensures the provider contributes artifacts even without live feeds.

## Operational Notes
- Missing directories yield empty contributions without logging noise, enabling optional adoption.
- Artifact URI resolution prefers explicit `uri`, then filesystem `path`, and finally warns when neither resolves.
- Confidence defaults to `0.95` for evidences to highlight their fallback nature while keeping them actionable.
