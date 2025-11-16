# packages/server/src/features/knowledge/feedFormatDetector.ts

## Metadata
- Layer: 4
- Archetype: implementation
- Code Path: packages/server/src/features/knowledge/feedFormatDetector.ts
- Live Doc ID: LD-implementation-packages-server-src-features-knowledge-feedformatdetector-ts
- Generated At: 2025-11-16T22:35:15.543Z

## Authored
### Purpose
_Pending authored purpose_

### Notes
_Pending notes_

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-16T22:35:15.543Z","inputHash":"ad64be32d0b49dd1"}]} -->
<!-- LIVE-DOC:BEGIN Public Symbols -->
### Public Symbols
#### `FeedFormat`
- Type: type
- Source: [source](../../../../../../../packages/server/src/features/knowledge/feedFormatDetector.ts#L8)

#### `FormatDetectionResult`
- Type: interface
- Source: [source](../../../../../../../packages/server/src/features/knowledge/feedFormatDetector.ts#L10)

#### `detectFormat`
- Type: function
- Source: [source](../../../../../../../packages/server/src/features/knowledge/feedFormatDetector.ts#L18)

##### `detectFormat` — Summary
Detect the format of a knowledge feed file by inspecting its content structure

#### `ParseFeedFileOptions`
- Type: interface
- Source: [source](../../../../../../../packages/server/src/features/knowledge/feedFormatDetector.ts#L113)

#### `parseFeedFile`
- Type: function
- Source: [source](../../../../../../../packages/server/src/features/knowledge/feedFormatDetector.ts#L124)

##### `parseFeedFile` — Summary
Parse a knowledge feed file into ExternalSnapshot format,
automatically detecting LSIF, SCIP, or native ExternalSnapshot formats
<!-- LIVE-DOC:END Public Symbols -->

<!-- LIVE-DOC:BEGIN Dependencies -->
### Dependencies
- `node:fs` - `promises`
- [`lsifParser.LSIFParserOptions`](./lsifParser.ts.mdmd.md#lsifparseroptions)
- [`lsifParser.parseLSIF`](./lsifParser.ts.mdmd.md#parselsif)
- [`scipParser.SCIPParserOptions`](./scipParser.ts.mdmd.md#scipparseroptions)
- [`scipParser.parseSCIP`](./scipParser.ts.mdmd.md#parsescip)
- [`index.ExternalSnapshot`](../../../../shared/src/index.ts.mdmd.md#externalsnapshot) (type-only)
- [`index.LSIFEntry`](../../../../shared/src/index.ts.mdmd.md#lsifentry) (type-only)
- [`index.SCIPIndex`](../../../../shared/src/index.ts.mdmd.md#scipindex) (type-only)
<!-- LIVE-DOC:END Dependencies -->

<!-- LIVE-DOC:BEGIN Observed Evidence -->
### Observed Evidence
#### Vitest Unit Tests
- [feedFormatDetector.test.ts](./feedFormatDetector.test.ts.mdmd.md)
- [knowledgeGraphBridge.test.ts](./knowledgeGraphBridge.test.ts.mdmd.md)
<!-- LIVE-DOC:END Observed Evidence -->
