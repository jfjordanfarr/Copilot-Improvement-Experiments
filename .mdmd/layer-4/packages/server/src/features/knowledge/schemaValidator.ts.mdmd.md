# packages/server/src/features/knowledge/schemaValidator.ts

## Metadata
- Layer: 4
- Archetype: implementation
- Code Path: packages/server/src/features/knowledge/schemaValidator.ts
- Live Doc ID: LD-implementation-packages-server-src-features-knowledge-schemavalidator-ts
- Generated At: 2025-11-16T22:35:15.815Z

## Authored
### Purpose
_Pending authored purpose_

### Notes
_Pending notes_

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
