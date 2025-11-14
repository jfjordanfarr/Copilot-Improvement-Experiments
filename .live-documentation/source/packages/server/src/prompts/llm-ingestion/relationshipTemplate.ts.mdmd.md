# packages/server/src/prompts/llm-ingestion/relationshipTemplate.ts

## Metadata
- Layer: 4
- Archetype: implementation
- Code Path: packages/server/src/prompts/llm-ingestion/relationshipTemplate.ts
- Live Doc ID: LD-implementation-packages-server-src-prompts-llm-ingestion-relationshiptemplate-ts
- Generated At: 2025-11-14T18:42:06.593Z

## Authored
### Purpose
Renders the deterministic prompt fed to relationship-extraction models and exposes the JSON schema used to validate their responses.

### Notes
- Builds a markdown-style prompt describing the root artifact, known neighbors, allowed relationship kinds, and evidence chunks, then hashes the content to version issued requests.
- Accepts optional clock and template-version overrides so tests can produce stable outputs while production calls record issuance timestamps.
- Provides `RELATIONSHIP_RESPONSE_SCHEMA` so orchestrators can verify LLM output matches the expected metadata and relationship payload format before ingesting.

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-14T18:42:06.593Z","inputHash":"d76b9d1b54b58f97"}]} -->
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
- `@copilot-improvement/shared` - `ArtifactLayer`, `LinkRelationshipKind` (type-only)
- `node:crypto` - `createHash`
<!-- LIVE-DOC:END Dependencies -->

<!-- LIVE-DOC:BEGIN Observed Evidence -->
### Observed Evidence
#### Vitest Unit Tests
- [llmIngestionOrchestrator.test.ts](../../features/knowledge/llmIngestionOrchestrator.test.ts.mdmd.md)
<!-- LIVE-DOC:END Observed Evidence -->
