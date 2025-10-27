# Drift History Store (Layer 4)

## Source Mapping
- Implementation: [`packages/server/src/telemetry/driftHistoryStore.ts`](../../../packages/server/src/telemetry/driftHistoryStore.ts)
- Collaborators: [`GraphStore`](../../../packages/shared/src/db/graphStore.ts), [`changeProcessor.ts`](../../../packages/server/src/runtime/changeProcessor.ts) (emits records)
- Parent design: [Diagnostics Pipeline Architecture](../../layer-3/diagnostics-pipeline.mdmd.md)

## Exported Symbols

#### DriftHistoryStoreOptions
`DriftHistoryStoreOptions` supplies the backing `GraphStore` and optional clock used when recording drift telemetry.

#### RecordDriftEmissionParams
`RecordDriftEmissionParams` captures the identifiers and optional link metadata stored whenever a diagnostic is emitted.

#### RecordDriftAcknowledgementParams
`RecordDriftAcknowledgementParams` extends the emission payload with the acknowledging actor and notes when users resolve diagnostics.

#### DriftHistoryStore
`DriftHistoryStore` persists drift emission and acknowledgement events, exposes list/summary helpers, and normalises metadata before writing to the graph store.

## Responsibility
Track the lifecycle of documentation drift diagnostics so the language server can report acknowledgement throughput, outstanding issues, and link provenance for auditing.

## Behaviour Notes
- Generates deterministic ISO timestamps via an injectable clock, making tests time-stable.
- Stores optional `linkIds` alongside arbitrary metadata to tie drift events back to inferred relationships.
- Delegates persistence, listing, and summarisation to the shared `GraphStore`, keeping the server runtime free from direct SQL access.

## Evidence
- Integration scenario [`tests/integration/us3/acknowledgeDiagnostics.test.ts`](../../../tests/integration/us3/acknowledgeDiagnostics.test.ts) exercises drift emission and acknowledgement flows end-to-end.
- Unit tests for [`GraphStore`](../../../packages/shared/src/db/graphStore.test.ts) cover the underlying persistence invoked by the store.
