# packages/server/src/features/knowledge/llmIngestionOrchestrator.ts

## Metadata
- Layer: 4
- Archetype: implementation
- Code Path: packages/server/src/features/knowledge/llmIngestionOrchestrator.ts
- Live Doc ID: LD-implementation-packages-server-src-features-knowledge-llmingestionorchestrator-ts
- Generated At: 2025-11-16T02:09:51.388Z

## Authored
### Purpose
Orchestrates LLM-powered relationship extraction for queued artifacts, calibrating candidates and persisting high-confidence links back into the graph.

### Notes
- Respects provider guard configuration and skips artifacts whose URIs cannot be resolved or read from disk.
- Batches file content into prompt chunks, renders the extraction template, and calibrates results before upserting links and provenance.
- Supports dry-run snapshots and enforces a concurrency cap so ingestion work can be replayed safely.

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-16T02:09:51.388Z","inputHash":"dd7e721a46e4e227"}]} -->
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
- `@copilot-improvement/shared` - `CalibratedRelationship`, `CalibrationContext`, `GraphStore`, `KnowledgeArtifact`, `LinkRelationshipKind`, `RawRelationshipCandidate`, `RelationshipExtractionBatch`, `RelationshipExtractionPrompt`, `RelationshipExtractionRequest`, `RelationshipExtractor`, `calibrateConfidence`
- `node:crypto` - `createHash`, `randomUUID`
- `node:fs` - `fsp`
- `node:path` - `path`
- `node:url` - `fileURLToPath`
- [`providerGuard.ProviderGuard`](../settings/providerGuard.ts.md#providerguard)
- [`relationshipTemplate.PromptArtifactSummary`](../../prompts/llm-ingestion/relationshipTemplate.ts.md#promptartifactsummary)
- [`relationshipTemplate.PromptChunkSummary`](../../prompts/llm-ingestion/relationshipTemplate.ts.md#promptchunksummary)
- [`relationshipTemplate.RELATIONSHIP_RESPONSE_SCHEMA`](../../prompts/llm-ingestion/relationshipTemplate.ts.md#relationship_response_schema)
- [`relationshipTemplate.renderRelationshipExtractionPrompt`](../../prompts/llm-ingestion/relationshipTemplate.ts.md#renderrelationshipextractionprompt)
<!-- LIVE-DOC:END Dependencies -->

<!-- LIVE-DOC:BEGIN Observed Evidence -->
### Observed Evidence
#### Vitest Unit Tests
- [llmIngestionOrchestrator.test.ts](./llmIngestionOrchestrator.test.ts.md)
<!-- LIVE-DOC:END Observed Evidence -->
