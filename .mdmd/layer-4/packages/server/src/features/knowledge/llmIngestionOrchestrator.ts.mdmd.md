# packages/server/src/features/knowledge/llmIngestionOrchestrator.ts

## Metadata
- Layer: 4
- Archetype: implementation
- Code Path: packages/server/src/features/knowledge/llmIngestionOrchestrator.ts
- Live Doc ID: LD-implementation-packages-server-src-features-knowledge-llmingestionorchestrator-ts
- Generated At: 2025-11-16T22:35:15.742Z

## Authored
### Purpose
_Pending authored purpose_

### Notes
_Pending notes_

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-16T22:35:15.742Z","inputHash":"1b9792f22957c909"}]} -->
<!-- LIVE-DOC:BEGIN Public Symbols -->
### Public Symbols
#### `LlmIngestionLogger`
- Type: interface
- Source: [source](../../../../../../../packages/server/src/features/knowledge/llmIngestionOrchestrator.ts#L35)

#### `EnqueueOptions`
- Type: interface
- Source: [source](../../../../../../../packages/server/src/features/knowledge/llmIngestionOrchestrator.ts#L41)

#### `LlmIngestionResult`
- Type: interface
- Source: [source](../../../../../../../packages/server/src/features/knowledge/llmIngestionOrchestrator.ts#L45)

#### `LlmIngestionOrchestratorOptions`
- Type: interface
- Source: [source](../../../../../../../packages/server/src/features/knowledge/llmIngestionOrchestrator.ts#L53)

#### `LlmIngestionOrchestrator`
- Type: class
- Source: [source](../../../../../../../packages/server/src/features/knowledge/llmIngestionOrchestrator.ts#L76)
<!-- LIVE-DOC:END Public Symbols -->

<!-- LIVE-DOC:BEGIN Dependencies -->
### Dependencies
- `node:crypto` - `createHash`, `randomUUID`
- `node:fs` - `promises`
- `node:path` - `path`
- `node:url` - `fileURLToPath`
- [`providerGuard.ProviderGuard`](../settings/providerGuard.ts.mdmd.md#providerguard)
- [`relationshipTemplate.PromptArtifactSummary`](../../prompts/llm-ingestion/relationshipTemplate.ts.mdmd.md#promptartifactsummary)
- [`relationshipTemplate.PromptChunkSummary`](../../prompts/llm-ingestion/relationshipTemplate.ts.mdmd.md#promptchunksummary)
- [`relationshipTemplate.RELATIONSHIP_RESPONSE_SCHEMA`](../../prompts/llm-ingestion/relationshipTemplate.ts.mdmd.md#relationship_response_schema)
- [`relationshipTemplate.renderRelationshipExtractionPrompt`](../../prompts/llm-ingestion/relationshipTemplate.ts.mdmd.md#renderrelationshipextractionprompt)
- [`index.CalibratedRelationship`](../../../../shared/src/index.ts.mdmd.md#calibratedrelationship)
- [`index.CalibrationContext`](../../../../shared/src/index.ts.mdmd.md#calibrationcontext)
- [`index.GraphStore`](../../../../shared/src/index.ts.mdmd.md#graphstore)
- [`index.KnowledgeArtifact`](../../../../shared/src/index.ts.mdmd.md#knowledgeartifact)
- [`index.LinkRelationshipKind`](../../../../shared/src/index.ts.mdmd.md#linkrelationshipkind)
- [`index.RawRelationshipCandidate`](../../../../shared/src/index.ts.mdmd.md#rawrelationshipcandidate)
- [`index.RelationshipExtractionBatch`](../../../../shared/src/index.ts.mdmd.md#relationshipextractionbatch)
- [`index.RelationshipExtractionPrompt`](../../../../shared/src/index.ts.mdmd.md#relationshipextractionprompt)
- [`index.RelationshipExtractionRequest`](../../../../shared/src/index.ts.mdmd.md#relationshipextractionrequest)
- [`index.RelationshipExtractor`](../../../../shared/src/index.ts.mdmd.md#relationshipextractor)
- [`index.calibrateConfidence`](../../../../shared/src/index.ts.mdmd.md#calibrateconfidence)
<!-- LIVE-DOC:END Dependencies -->

<!-- LIVE-DOC:BEGIN Observed Evidence -->
### Observed Evidence
#### Vitest Unit Tests
- [llmIngestionOrchestrator.test.ts](./llmIngestionOrchestrator.test.ts.mdmd.md)
<!-- LIVE-DOC:END Observed Evidence -->
