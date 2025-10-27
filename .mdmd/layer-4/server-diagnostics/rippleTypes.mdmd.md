# rippleTypes (Layer 4)

## Source Mapping
- Implementation: [`packages/server/src/features/diagnostics/rippleTypes.ts`](../../../packages/server/src/features/diagnostics/rippleTypes.ts)
- Downstream consumers: [`publishCodeDiagnostics`](./publishCodeDiagnostics.mdmd.md), [`publishDocDiagnostics`](./publishDocDiagnostics.mdmd.md), [`noiseFilter`](./noiseFilter.mdmd.md)
- Shared contract: [`RelationshipHint`](../../../packages/shared/src/inference/linkInference.ts)

## Exported Symbols

### `RippleHint`
Extends the shared RelationshipHint contract with optional depth and path metadata so diagnostics retain ripple provenance (distance from the trigger artifact and intermediate hops).

### `RippleImpact`
Package-local data shape coupling a target KnowledgeArtifact with its RippleHint, allowing diagnostics pipelines to route emissions and render contextual metadata.

## Purpose
Provides the minimal TypeScript surface that ties shared knowledge graph hints to server-side diagnostics workflows. By centralising the ripple metadata extension, downstream publishers can evolve depth/path handling without duplicating structural definitions.

## Behaviour Notes
- Depth remains optional to support legacy inference results; downstream code defaults to 1 when omitted.
- Path captures intermediate artifact URIs, enabling future UI affordances such as hop-by-hop visualisations.

## Follow-ups
- Consider promoting `RippleImpact` to the shared contracts package if extension-side tooling needs to consume the same shape.
