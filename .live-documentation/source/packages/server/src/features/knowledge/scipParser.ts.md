# packages/server/src/features/knowledge/scipParser.ts

## Metadata
- Layer: 4
- Archetype: implementation
- Code Path: packages/server/src/features/knowledge/scipParser.ts
- Live Doc ID: LD-implementation-packages-server-src-features-knowledge-scipparser-ts
- Generated At: 2025-11-16T02:09:51.426Z

## Authored
### Purpose
Converts SCIP indexes into knowledge feed snapshots so we can ingest Sourcegraph symbol data alongside other artifact sources.

### Notes
- Emits code artifacts with inferred languages and feed metadata while normalising relative paths to `file://` URIs.
- Maps cross-document symbol occurrences into references/depends_on links, tagging payloads with ranges for diagnostics.
- Provides a light wrapper `parseSCIP` so callers can parse JSON indexes without managing parser configuration by hand.

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-16T02:09:51.426Z","inputHash":"fd66b46a9f5a2405"}]} -->
<!-- LIVE-DOC:BEGIN Public Symbols -->
### Public Symbols
#### `SCIPParserOptions`
- Type: interface
- Source: [source](../../../../../../../packages/server/src/features/knowledge/scipParser.ts#L11)

#### `SCIPParser`
- Type: class
- Source: [source](../../../../../../../packages/server/src/features/knowledge/scipParser.ts#L24)

##### `SCIPParser` — Summary
Parses SCIP (SCIP Code Intelligence Protocol) indexes into ExternalSnapshot format.

SCIP is a language-agnostic protocol for code intelligence developed by Sourcegraph.
Documents contain occurrences (symbol usages) and symbols (definitions/declarations).
Reference: Sourcegraph SCIP protocol repository.

#### `parseSCIP`
- Type: function
- Source: [source](../../../../../../../packages/server/src/features/knowledge/scipParser.ts#L202)

##### `parseSCIP` — Summary
Parse SCIP index into an ExternalSnapshot
<!-- LIVE-DOC:END Public Symbols -->

<!-- LIVE-DOC:BEGIN Dependencies -->
### Dependencies
- `@copilot-improvement/shared` - `ExternalArtifact`, `ExternalLink`, `ExternalSnapshot`, `SCIPIndex`, `SCIPOccurrence` (type-only)
- `node:url` - `pathToFileURL`
<!-- LIVE-DOC:END Dependencies -->

<!-- LIVE-DOC:BEGIN Observed Evidence -->
### Observed Evidence
#### Vitest Unit Tests
- [feedFormatDetector.test.ts](./feedFormatDetector.test.ts.md)
- [knowledgeGraphBridge.test.ts](./knowledgeGraphBridge.test.ts.md)
- [scipParser.test.ts](./scipParser.test.ts.md)
<!-- LIVE-DOC:END Observed Evidence -->
