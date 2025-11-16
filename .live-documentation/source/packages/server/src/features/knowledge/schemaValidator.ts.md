# packages/server/src/features/knowledge/schemaValidator.ts

## Metadata
- Layer: 4
- Archetype: implementation
- Code Path: packages/server/src/features/knowledge/schemaValidator.ts
- Live Doc ID: LD-implementation-packages-server-src-features-knowledge-schemavalidator-ts
- Generated At: 2025-11-16T02:09:51.416Z

## Authored
### Purpose
Guards the knowledge ingestion boundary by validating snapshots and stream events before they reach the graph bridge.

### Notes
- Enforces allow-lists for artifact layers, link kinds, and stream event types while checking required fields and ISO timestamps.
- Returns structured `SchemaViolation` details for linting flows and exposes assert helpers used inside ingestion services.
- Accepts partial payloads for removals and merges artifact ID bookkeeping so cross-reference checks produce actionable errors.

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-16T02:09:51.416Z","inputHash":"00bbe10ba3a8e20e"}]} -->
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
- `@copilot-improvement/shared` - `ArtifactLayer`, `ExternalArtifact`, `ExternalLink`, `ExternalSnapshot`, `ExternalStreamEvent`, `LinkRelationshipKind`, `StreamEventKind`
<!-- LIVE-DOC:END Dependencies -->

<!-- LIVE-DOC:BEGIN Observed Evidence -->
### Observed Evidence
#### Vitest Unit Tests
- [knowledgeFeedManager.test.ts](./knowledgeFeedManager.test.ts.md)
- [knowledgeGraphBridge.test.ts](./knowledgeGraphBridge.test.ts.md)
- [knowledgeGraphIngestor.test.ts](./knowledgeGraphIngestor.test.ts.md)
<!-- LIVE-DOC:END Observed Evidence -->
