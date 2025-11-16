# packages/extension/src/diagnostics/dependencyQuickPick.ts

## Metadata
- Layer: 4
- Archetype: implementation
- Code Path: packages/extension/src/diagnostics/dependencyQuickPick.ts
- Live Doc ID: LD-implementation-packages-extension-src-diagnostics-dependencyquickpick-ts
- Generated At: 2025-11-16T02:09:51.043Z

## Authored
### Purpose
Presents a quick pick that lists downstream artifacts dependent on the current file so maintainers can inspect ripple impacts quickly.

### Notes
- Resolves the target from the current editor or supplied URI, then asks the language server for dependency edges.
- Validates and formats the response into descriptive quick pick entries that capture relationship kind, traversal depth, and transitive paths.
- Opens the selected dependent artifact in the editor while surfacing informative messages when data is missing or errors occur.

#### ParsedEdge
Type alias exported for test consumption and dependency formatting helpers. Mirrors the validator schema so callers can rely on strongly typed edge payloads.

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-16T02:09:51.043Z","inputHash":"caaf40d4fb4039b1"}]} -->
<!-- LIVE-DOC:BEGIN Public Symbols -->
### Public Symbols
#### `registerDependencyQuickPick`
- Type: function
- Source: [source](../../../../../../packages/extension/src/diagnostics/dependencyQuickPick.ts#L20)

#### `DependencyQuickPickController`
- Type: class
- Source: [source](../../../../../../packages/extension/src/diagnostics/dependencyQuickPick.ts#L31)

#### `describeEdgePath`
- Type: function
- Source: [source](../../../../../../packages/extension/src/diagnostics/dependencyQuickPick.ts#L159)

#### `InspectDependenciesResultValidator`
- Type: const
- Source: [source](../../../../../../packages/extension/src/diagnostics/dependencyQuickPick.ts#L176)
<!-- LIVE-DOC:END Public Symbols -->

<!-- LIVE-DOC:BEGIN Dependencies -->
### Dependencies
- `@copilot-improvement/shared` - `INSPECT_DEPENDENCIES_REQUEST`, `InspectDependenciesParams`
- [`artifactSchemas.KnowledgeArtifactSchema`](../shared/artifactSchemas.ts.md#knowledgeartifactschema)
- [`artifactSchemas.LinkRelationshipKindSchema`](../shared/artifactSchemas.ts.md#linkrelationshipkindschema)
- `vscode` - `vscode`
- `vscode-languageclient/node` - `LanguageClient`
- `zod` - `z`
<!-- LIVE-DOC:END Dependencies -->

<!-- LIVE-DOC:BEGIN Observed Evidence -->
### Observed Evidence
#### Vitest Unit Tests
- [dependencyQuickPick.test.ts](./dependencyQuickPick.test.ts.md)
<!-- LIVE-DOC:END Observed Evidence -->
