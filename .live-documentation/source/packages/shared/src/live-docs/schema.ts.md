# packages/shared/src/live-docs/schema.ts

## Metadata
- Layer: 4
- Archetype: implementation
- Code Path: packages/shared/src/live-docs/schema.ts
- Live Doc ID: LD-implementation-packages-shared-src-live-docs-schema-ts
- Generated At: 2025-11-16T16:08:45.879Z

## Authored
### Purpose
Define the canonical metadata schema for Live Documentation files, including provenance payloads and normalization helpers shared by the generator and ingest pipelines.

### Notes
`normalizeLiveDocMetadata` trims and canonicalises paths, ids, and timestamps, defaulting to layer 4 while accepting richer archetype/enricher data from configuration. Provenance normalization discards malformed generator entries, harmonises optional docstring status records, and guarantees consumers never see empty structures—stabilising the JSON embedded alongside rendered markdown.

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-16T16:08:45.879Z","inputHash":"3cbccef2392e0369"}]} -->
<!-- LIVE-DOC:BEGIN Public Symbols -->
### Public Symbols
#### `LiveDocLayer`
- Type: type
- Source: [source](../../../../../../packages/shared/src/live-docs/schema.ts#L5)

#### `LiveDocDocstringProvenance`
- Type: interface
- Source: [source](../../../../../../packages/shared/src/live-docs/schema.ts#L7)

#### `LiveDocGeneratorProvenance`
- Type: interface
- Source: [source](../../../../../../packages/shared/src/live-docs/schema.ts#L13)

#### `LiveDocProvenance`
- Type: interface
- Source: [source](../../../../../../packages/shared/src/live-docs/schema.ts#L21)

#### `LiveDocMetadata`
- Type: interface
- Source: [source](../../../../../../packages/shared/src/live-docs/schema.ts#L26)

#### `LiveDocMetadataInput`
- Type: type
- Source: [source](../../../../../../packages/shared/src/live-docs/schema.ts#L41)

#### `DEFAULT_LIVE_DOC_LAYER`
- Type: const
- Source: [source](../../../../../../packages/shared/src/live-docs/schema.ts#L46)

#### `normalizeLiveDocMetadata`
- Type: function
- Source: [source](../../../../../../packages/shared/src/live-docs/schema.ts#L48)
<!-- LIVE-DOC:END Public Symbols -->

<!-- LIVE-DOC:BEGIN Dependencies -->
### Dependencies
- [`liveDocumentationConfig.LiveDocumentationArchetype`](../config/liveDocumentationConfig.ts.md#livedocumentationarchetype) (type-only)
<!-- LIVE-DOC:END Dependencies -->

<!-- LIVE-DOC:BEGIN Observed Evidence -->
### Observed Evidence
#### Vitest Unit Tests
- [generator.test.ts](../../../server/src/features/live-docs/generator.test.ts.md)
- [renderPublicSymbolLines.test.ts](../../../server/src/features/live-docs/renderPublicSymbolLines.test.ts.md)
- [generator.test.ts](../../../server/src/features/live-docs/system/generator.test.ts.md)
- [generator.test.ts](./generator.test.ts.md)
- [schema.test.ts](./schema.test.ts.md)
<!-- LIVE-DOC:END Observed Evidence -->
