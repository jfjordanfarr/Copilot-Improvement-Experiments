# packages/server/src/features/knowledge/schemaValidator.ts

## Metadata
- Layer: 4
- Archetype: implementation
- Code Path: packages/server/src/features/knowledge/schemaValidator.ts
- Live Doc ID: LD-implementation-packages-server-src-features-knowledge-schemavalidator-ts
- Generated At: 2025-11-16T22:35:15.815Z

## Authored
### Purpose
Validates incoming knowledge snapshots and stream events so ingestion rejects malformed artifacts, relationships, or metadata before touching the graph.

### Notes
- Added with the knowledge schema spike documented in [2025-10-17 summary](../../../../../../../AI-Agent-Workspace/ChatHistory/2025/10/Summarized/2025-10-17.SUMMARIZED.md) alongside SpecKit requirements.
- Layer-4 notes refreshed during the Oct 30 metadata audit (see [2025-10-30 summary](../../../../../../../AI-Agent-Workspace/ChatHistory/2025/10/Summarized/2025-10-30.SUMMARIZED.md)) when validation guidance was woven into architecture docs.

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-16T22:35:15.815Z","inputHash":"37f4ca7e0d29222f"}]} -->
<!-- LIVE-DOC:BEGIN Public Symbols -->
### Public Symbols
#### `SchemaViolation`
- Type: interface
- Source: [source](../../../../../../../packages/server/src/features/knowledge/schemaValidator.ts#L11)

#### `SchemaValidationResult`
- Type: interface
- Source: [source](../../../../../../../packages/server/src/features/knowledge/schemaValidator.ts#L16)

#### `validateSnapshot`
- Type: function
- Source: [source](../../../../../../../packages/server/src/features/knowledge/schemaValidator.ts#L44)

#### `validateStreamEvent`
- Type: function
- Source: [source](../../../../../../../packages/server/src/features/knowledge/schemaValidator.ts#L108)

#### `assertValidSnapshot`
- Type: function
- Source: [source](../../../../../../../packages/server/src/features/knowledge/schemaValidator.ts#L184)

#### `assertValidStreamEvent`
- Type: function
- Source: [source](../../../../../../../packages/server/src/features/knowledge/schemaValidator.ts#L191)
<!-- LIVE-DOC:END Public Symbols -->

<!-- LIVE-DOC:BEGIN Dependencies -->
### Dependencies
- [`index.ArtifactLayer`](../../../../shared/src/index.ts.mdmd.md#artifactlayer)
- [`index.ExternalArtifact`](../../../../shared/src/index.ts.mdmd.md#externalartifact)
- [`index.ExternalLink`](../../../../shared/src/index.ts.mdmd.md#externallink)
- [`index.ExternalSnapshot`](../../../../shared/src/index.ts.mdmd.md#externalsnapshot)
- [`index.ExternalStreamEvent`](../../../../shared/src/index.ts.mdmd.md#externalstreamevent)
- [`index.LinkRelationshipKind`](../../../../shared/src/index.ts.mdmd.md#linkrelationshipkind)
- [`index.StreamEventKind`](../../../../shared/src/index.ts.mdmd.md#streameventkind)
<!-- LIVE-DOC:END Dependencies -->

<!-- LIVE-DOC:BEGIN Observed Evidence -->
### Observed Evidence
#### Vitest Unit Tests
- [knowledgeFeedManager.test.ts](./knowledgeFeedManager.test.ts.mdmd.md)
- [knowledgeGraphBridge.test.ts](./knowledgeGraphBridge.test.ts.mdmd.md)
- [knowledgeGraphIngestor.test.ts](./knowledgeGraphIngestor.test.ts.mdmd.md)
<!-- LIVE-DOC:END Observed Evidence -->
