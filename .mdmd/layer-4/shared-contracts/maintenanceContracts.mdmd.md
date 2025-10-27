# Knowledge Maintenance Contracts (Layer 4)

## Source Mapping
- Implementation: [`packages/shared/src/contracts/maintenance.ts`](../../../packages/shared/src/contracts/maintenance.ts)
- Parent design: [Knowledge Graph Ingestion Architecture](../../layer-3/knowledge-graph-ingestion.mdmd.md)

## Exported Symbols

#### RebindReason
`RebindReason` records whether the maintenance workflow is handling a delete or rename event.

#### RebindRequiredArtifact
`RebindRequiredArtifact` identifies the removed artifact (URI + layer) that needs rebinding.

#### RebindImpactedArtifact
`RebindImpactedArtifact` extends the required artifact with relationship direction and kind for each impacted neighbor.

#### RebindRequiredPayload
`RebindRequiredPayload` bundles the removal reason, optional replacement URI, and the impacted artifacts array sent to maintenance handlers.

## Responsibility
Capture the payload shapes the maintenance pipeline uses when rebinding artifacts after deletes or renames so diagnostics and knowledge stores can reconcile stale relationships.

## Evidence
- Consumed by the server-side orphan cleanup utilities documented in [`maintenanceOrphans.mdmd.md`](../language-server-runtime/maintenanceOrphans.mdmd.md).
