# packages/server/src/features/knowledge/scipParser.ts

## Metadata
- Layer: 4
- Archetype: implementation
- Code Path: packages/server/src/features/knowledge/scipParser.ts
- Live Doc ID: LD-implementation-packages-server-src-features-knowledge-scipparser-ts
- Generated At: 2025-11-10T22:24:00.360Z

## Authored
### Purpose
Converts SCIP indexes into knowledge feed snapshots so we can ingest Sourcegraph symbol data alongside other artifact sources.

### Notes
- Emits code artifacts with inferred languages and feed metadata while normalising relative paths to `file://` URIs.
- Maps cross-document symbol occurrences into references/depends_on links, tagging payloads with ranges for diagnostics.
- Provides a light wrapper `parseSCIP` so callers can parse JSON indexes without managing parser configuration by hand.

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-10T22:24:00.360Z","inputHash":"e21976c03ee78a6d"}]} -->
<!-- LIVE-DOC:BEGIN Public Symbols -->
### Public Symbols
#### `SCIPParserOptions`
- Type: interface
- Source: [source](../../../../../../../packages/server/src/features/knowledge/scipParser.ts#L11)

#### `SCIPParser`
- Type: class
- Source: [source](../../../../../../../packages/server/src/features/knowledge/scipParser.ts#L25)
- Summary: Parses SCIP (SCIP Code Intelligence Protocol) indexes into ExternalSnapshot format.

SCIP is a language-agnostic protocol for code intelligence developed by Sourcegraph.
Documents contain occurrences (symbol usages) and symbols (definitions/declarations).

#### `parseSCIP`
- Type: function
- Source: [source](../../../../../../../packages/server/src/features/knowledge/scipParser.ts#L203)
- Summary: Parse SCIP index into an ExternalSnapshot
<!-- LIVE-DOC:END Public Symbols -->

<!-- LIVE-DOC:BEGIN Dependencies -->
### Dependencies
- `@copilot-improvement/shared` - `ExternalArtifact`, `ExternalLink`, `ExternalSnapshot`, `SCIPIndex`, `SCIPOccurrence` (type-only)
- `node:url` - `pathToFileURL`
<!-- LIVE-DOC:END Dependencies -->

<!-- LIVE-DOC:BEGIN Observed Evidence -->
### Observed Evidence
#### Vitest Unit Tests
- [feedFormatDetector.test.ts](./feedFormatDetector.test.ts.mdmd.md)
- [knowledgeGraphBridge.test.ts](./knowledgeGraphBridge.test.ts.mdmd.md)
- [scipParser.test.ts](./scipParser.test.ts.mdmd.md)
<!-- LIVE-DOC:END Observed Evidence -->
