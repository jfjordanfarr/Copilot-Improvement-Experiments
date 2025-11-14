# packages/server/src/features/knowledge/lsifParser.ts

## Metadata
- Layer: 4
- Archetype: implementation
- Code Path: packages/server/src/features/knowledge/lsifParser.ts
- Live Doc ID: LD-implementation-packages-server-src-features-knowledge-lsifparser-ts
- Generated At: 2025-11-14T18:42:06.434Z

## Authored
### Purpose
Transforms LSIF dumps into external knowledge snapshots so the ingestion pipeline can treat LSIF output like any other feed.

### Notes
- Indexes LSIF vertices and edges to collect document artifacts and cross-file definition/reference relationships.
- Normalises URIs relative to the workspace, stamps metadata, and skips malformed lines instead of failing the whole snapshot.
- Exposes a convenience `parseLSIF` helper so other modules do not need to manage parser lifecycle.

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-14T18:42:06.434Z","inputHash":"147aadc593554696"}]} -->
<!-- LIVE-DOC:BEGIN Public Symbols -->
### Public Symbols
#### `LSIFParserOptions`
- Type: interface
- Source: [source](../../../../../../../packages/server/src/features/knowledge/lsifParser.ts#L13)

#### `LSIFParser`
- Type: class
- Source: [source](../../../../../../../packages/server/src/features/knowledge/lsifParser.ts#L27)

##### `LSIFParser` — Summary
Parses LSIF (Language Server Index Format) dumps into ExternalSnapshot format.

LSIF is a newline-delimited JSON format where each line is a vertex or edge.
We extract documents as artifacts and definition/reference relationships as links.

##### `LSIFParser` — Links
- `https` — ://microsoft.github.io/language-server-protocol/specifications/lsif/0.6.0/specification/

#### `parseLSIF`
- Type: function
- Source: [source](../../../../../../../packages/server/src/features/knowledge/lsifParser.ts#L283)

##### `parseLSIF` — Summary
Parse LSIF content into an ExternalSnapshot
<!-- LIVE-DOC:END Public Symbols -->

<!-- LIVE-DOC:BEGIN Dependencies -->
### Dependencies
- `@copilot-improvement/shared` - `ExternalArtifact`, `ExternalLink`, `ExternalSnapshot`, `LSIFDocument`, `LSIFEntry`, `LSIFRange`, `ParsedLSIFIndex` (type-only)
- `node:url` - `fileURLToPath`, `pathToFileURL`
<!-- LIVE-DOC:END Dependencies -->

<!-- LIVE-DOC:BEGIN Observed Evidence -->
### Observed Evidence
#### Vitest Unit Tests
- [feedFormatDetector.test.ts](./feedFormatDetector.test.ts.mdmd.md)
- [knowledgeGraphBridge.test.ts](./knowledgeGraphBridge.test.ts.mdmd.md)
- [lsifParser.test.ts](./lsifParser.test.ts.mdmd.md)
<!-- LIVE-DOC:END Observed Evidence -->
