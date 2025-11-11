# packages/server/src/features/knowledge/feedFormatDetector.ts

## Metadata
- Layer: 4
- Archetype: implementation
- Code Path: packages/server/src/features/knowledge/feedFormatDetector.ts
- Live Doc ID: LD-implementation-packages-server-src-features-knowledge-feedformatdetector-ts
- Generated At: 2025-11-10T22:24:00.238Z

## Authored
### Purpose
Infers the format of incoming knowledge feeds (LSIF, SCIP, markdown, etc.) so downstream parsers can be selected automatically.

### Notes
- Looks at file extensions, MIME hints, and magic strings to distinguish supported feed types before ingestion begins.
- Falls back to configured defaults when detection fails, allowing operators to override heuristics.

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-10T22:24:00.238Z","inputHash":"a6c9c89cf2a745fa"}]} -->
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
- Summary: Detect the format of a knowledge feed file by inspecting its content structure

#### `ParseFeedFileOptions`
- Type: interface
- Source: [source](../../../../../../../packages/server/src/features/knowledge/feedFormatDetector.ts#L113)

#### `parseFeedFile`
- Type: function
- Source: [source](../../../../../../../packages/server/src/features/knowledge/feedFormatDetector.ts#L124)
- Summary: Parse a knowledge feed file into ExternalSnapshot format,
automatically detecting LSIF, SCIP, or native ExternalSnapshot formats
<!-- LIVE-DOC:END Public Symbols -->

<!-- LIVE-DOC:BEGIN Dependencies -->
### Dependencies
- `@copilot-improvement/shared` - `ExternalSnapshot`, `LSIFEntry`, `SCIPIndex` (type-only)
- `node:fs` - `fsp`
- [`lsifParser.LSIFParserOptions`](./lsifParser.ts.mdmd.md#lsifparseroptions)
- [`lsifParser.parseLSIF`](./lsifParser.ts.mdmd.md#parselsif)
- [`scipParser.SCIPParserOptions`](./scipParser.ts.mdmd.md#scipparseroptions)
- [`scipParser.parseSCIP`](./scipParser.ts.mdmd.md#parsescip)
<!-- LIVE-DOC:END Dependencies -->

<!-- LIVE-DOC:BEGIN Observed Evidence -->
### Observed Evidence
#### Vitest Unit Tests
- [feedFormatDetector.test.ts](./feedFormatDetector.test.ts.mdmd.md)
- [knowledgeGraphBridge.test.ts](./knowledgeGraphBridge.test.ts.mdmd.md)
<!-- LIVE-DOC:END Observed Evidence -->
