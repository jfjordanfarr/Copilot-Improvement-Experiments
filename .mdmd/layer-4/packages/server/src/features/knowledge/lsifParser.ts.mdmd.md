# packages/server/src/features/knowledge/lsifParser.ts

## Metadata
- Layer: 4
- Archetype: implementation
- Code Path: packages/server/src/features/knowledge/lsifParser.ts
- Live Doc ID: LD-implementation-packages-server-src-features-knowledge-lsifparser-ts
- Generated At: 2025-11-16T22:35:15.769Z

## Authored
### Purpose
_Pending authored purpose_

### Notes
_Pending notes_

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-16T22:35:15.769Z","inputHash":"cf4738cf82b8c2c2"}]} -->
<!-- LIVE-DOC:BEGIN Public Symbols -->
### Public Symbols
#### `LSIFParserOptions`
- Type: interface
- Source: [source](../../../../../../../packages/server/src/features/knowledge/lsifParser.ts#L13)

#### `LSIFParser`
- Type: class
- Source: [source](../../../../../../../packages/server/src/features/knowledge/lsifParser.ts#L26)

##### `LSIFParser` — Summary
Parses LSIF (Language Server Index Format) dumps into ExternalSnapshot format.

LSIF is a newline-delimited JSON format where each line is a vertex or edge.
We extract documents as artifacts and definition/reference relationships as links.
Reference: LSIF specification (Language Server Index Format).

#### `parseLSIF`
- Type: function
- Source: [source](../../../../../../../packages/server/src/features/knowledge/lsifParser.ts#L282)

##### `parseLSIF` — Summary
Parse LSIF content into an ExternalSnapshot
<!-- LIVE-DOC:END Public Symbols -->

<!-- LIVE-DOC:BEGIN Dependencies -->
### Dependencies
- `node:url` - `fileURLToPath`, `pathToFileURL`
- [`index.ExternalArtifact`](../../../../shared/src/index.ts.mdmd.md#externalartifact) (type-only)
- [`index.ExternalLink`](../../../../shared/src/index.ts.mdmd.md#externallink) (type-only)
- [`index.ExternalSnapshot`](../../../../shared/src/index.ts.mdmd.md#externalsnapshot) (type-only)
- [`index.LSIFDocument`](../../../../shared/src/index.ts.mdmd.md#lsifdocument) (type-only)
- [`index.LSIFEntry`](../../../../shared/src/index.ts.mdmd.md#lsifentry) (type-only)
- [`index.LSIFRange`](../../../../shared/src/index.ts.mdmd.md#lsifrange) (type-only)
- [`index.ParsedLSIFIndex`](../../../../shared/src/index.ts.mdmd.md#parsedlsifindex) (type-only)
<!-- LIVE-DOC:END Dependencies -->

<!-- LIVE-DOC:BEGIN Observed Evidence -->
### Observed Evidence
#### Vitest Unit Tests
- [feedFormatDetector.test.ts](./feedFormatDetector.test.ts.mdmd.md)
- [knowledgeGraphBridge.test.ts](./knowledgeGraphBridge.test.ts.mdmd.md)
- [lsifParser.test.ts](./lsifParser.test.ts.mdmd.md)
<!-- LIVE-DOC:END Observed Evidence -->
