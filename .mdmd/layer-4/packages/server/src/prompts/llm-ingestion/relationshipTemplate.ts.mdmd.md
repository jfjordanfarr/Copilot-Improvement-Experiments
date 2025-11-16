# packages/server/src/prompts/llm-ingestion/relationshipTemplate.ts

## Metadata
- Layer: 4
- Archetype: implementation
- Code Path: packages/server/src/prompts/llm-ingestion/relationshipTemplate.ts
- Live Doc ID: LD-implementation-packages-server-src-prompts-llm-ingestion-relationshiptemplate-ts
- Generated At: 2025-11-16T22:35:16.358Z

## Authored
### Purpose
_Pending authored purpose_

### Notes
_Pending notes_

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-16T22:35:16.358Z","inputHash":"c8e83ff629b280c9"}]} -->
<!-- LIVE-DOC:BEGIN Public Symbols -->
### Public Symbols
#### `ConfidenceLabel`
- Type: type
- Source: [source](../../../../../../../packages/server/src/prompts/llm-ingestion/relationshipTemplate.ts#L5)

#### `PromptArtifactSummary`
- Type: interface
- Source: [source](../../../../../../../packages/server/src/prompts/llm-ingestion/relationshipTemplate.ts#L7)

#### `PromptChunkSummary`
- Type: interface
- Source: [source](../../../../../../../packages/server/src/prompts/llm-ingestion/relationshipTemplate.ts#L15)

#### `RelationshipPromptOptions`
- Type: interface
- Source: [source](../../../../../../../packages/server/src/prompts/llm-ingestion/relationshipTemplate.ts#L24)

#### `RenderedRelationshipPrompt`
- Type: interface
- Source: [source](../../../../../../../packages/server/src/prompts/llm-ingestion/relationshipTemplate.ts#L33)

#### `renderRelationshipExtractionPrompt`
- Type: function
- Source: [source](../../../../../../../packages/server/src/prompts/llm-ingestion/relationshipTemplate.ts#L44)

#### `RELATIONSHIP_RESPONSE_SCHEMA`
- Type: const
- Source: [source](../../../../../../../packages/server/src/prompts/llm-ingestion/relationshipTemplate.ts#L126)
<!-- LIVE-DOC:END Public Symbols -->

<!-- LIVE-DOC:BEGIN Dependencies -->
### Dependencies
- `node:crypto` - `createHash`
- [`index.ArtifactLayer`](../../../../shared/src/index.ts.mdmd.md#artifactlayer) (type-only)
- [`index.LinkRelationshipKind`](../../../../shared/src/index.ts.mdmd.md#linkrelationshipkind) (type-only)
<!-- LIVE-DOC:END Dependencies -->

<!-- LIVE-DOC:BEGIN Observed Evidence -->
### Observed Evidence
#### Vitest Unit Tests
- [llmIngestionOrchestrator.test.ts](../../features/knowledge/llmIngestionOrchestrator.test.ts.mdmd.md)
<!-- LIVE-DOC:END Observed Evidence -->
