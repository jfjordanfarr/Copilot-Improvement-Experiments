# packages/extension/src/shared/artifactSchemas.ts

## Metadata
- Layer: 4
- Archetype: implementation
- Code Path: packages/extension/src/shared/artifactSchemas.ts
- Live Doc ID: LD-implementation-packages-extension-src-shared-artifactschemas-ts
- Generated At: 2025-11-14T18:42:06.260Z

## Authored
### Purpose
Defines the zod schemas and inferred types shared by extension features when validating graph artifacts and link kinds.

### Notes
- Enumerates the supported artifact layers so quick picks, prompts, and bridge services can perform consistent validation.
- Supplies reusable schemas for artifact metadata and relationship kinds that mirror the contracts expected by the language server.

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-14T18:42:06.260Z","inputHash":"c325fceb008073af"}]} -->
<!-- LIVE-DOC:BEGIN Public Symbols -->
### Public Symbols
#### `ArtifactLayerSchema`
- Type: const
- Source: [source](../../../../../../packages/extension/src/shared/artifactSchemas.ts#L3)

#### `ArtifactLayer`
- Type: type
- Source: [source](../../../../../../packages/extension/src/shared/artifactSchemas.ts#L11)

#### `KnowledgeArtifactSchema`
- Type: const
- Source: [source](../../../../../../packages/extension/src/shared/artifactSchemas.ts#L13)

#### `KnowledgeArtifact`
- Type: type
- Source: [source](../../../../../../packages/extension/src/shared/artifactSchemas.ts#L24)

#### `LinkRelationshipKindSchema`
- Type: const
- Source: [source](../../../../../../packages/extension/src/shared/artifactSchemas.ts#L26)

#### `LinkRelationshipKind`
- Type: type
- Source: [source](../../../../../../packages/extension/src/shared/artifactSchemas.ts#L34)
<!-- LIVE-DOC:END Public Symbols -->

<!-- LIVE-DOC:BEGIN Dependencies -->
### Dependencies
- `zod` - `z`
<!-- LIVE-DOC:END Dependencies -->

<!-- LIVE-DOC:BEGIN Observed Evidence -->
### Observed Evidence
#### Vitest Unit Tests
- [inspectSymbolNeighbors.test.ts](../commands/inspectSymbolNeighbors.test.ts.mdmd.md)
- [dependencyQuickPick.test.ts](../diagnostics/dependencyQuickPick.test.ts.mdmd.md)
<!-- LIVE-DOC:END Observed Evidence -->
