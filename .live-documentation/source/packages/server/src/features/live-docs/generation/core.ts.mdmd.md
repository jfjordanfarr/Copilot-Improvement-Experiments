# packages/server/src/features/live-docs/generation/core.ts

## Metadata
- Layer: 4
- Archetype: implementation
- Code Path: packages/server/src/features/live-docs/generation/core.ts
- Live Doc ID: LD-implementation-packages-server-src-features-live-docs-generation-core-ts
- Generated At: 2025-11-11T05:12:47.205Z

## Authored
### Purpose
_Pending authored purpose_

### Notes
_Pending notes_

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-11T05:12:47.205Z","inputHash":"110390f6aa654615"}]} -->
<!-- LIVE-DOC:BEGIN Public Symbols -->
### Public Symbols
#### `SourceAnalysisResult`
- Type: interface
- Source: [source](../../../../../../../../packages/server/src/features/live-docs/generation/core.ts#L11)

#### `PublicSymbolEntry`
- Type: interface
- Source: [source](../../../../../../../../packages/server/src/features/live-docs/generation/core.ts#L16)

#### `DependencyEntry`
- Type: interface
- Source: [source](../../../../../../../../packages/server/src/features/live-docs/generation/core.ts#L25)

#### `LocationInfo`
- Type: interface
- Source: [source](../../../../../../../../packages/server/src/features/live-docs/generation/core.ts#L33)

#### `SUPPORTED_SCRIPT_EXTENSIONS`
- Type: const
- Source: [source](../../../../../../../../packages/server/src/features/live-docs/generation/core.ts#L38)

#### `MODULE_RESOLUTION_EXTENSIONS`
- Type: const
- Source: [source](../../../../../../../../packages/server/src/features/live-docs/generation/core.ts#L49)

#### `discoverTargetFiles`
- Type: function
- Source: [source](../../../../../../../../packages/server/src/features/live-docs/generation/core.ts#L68)

#### `resolveArchetype`
- Type: function
- Source: [source](../../../../../../../../packages/server/src/features/live-docs/generation/core.ts#L103)

#### `hasMeaningfulAuthoredContent`
- Type: function
- Source: [source](../../../../../../../../packages/server/src/features/live-docs/generation/core.ts#L125)

#### `directoryExists`
- Type: function
- Source: [source](../../../../../../../../packages/server/src/features/live-docs/generation/core.ts#L147)

#### `cleanupEmptyParents`
- Type: function
- Source: [source](../../../../../../../../packages/server/src/features/live-docs/generation/core.ts#L156)

#### `analyzeSourceFile`
- Type: function
- Source: [source](../../../../../../../../packages/server/src/features/live-docs/generation/core.ts#L182)

#### `inferScriptKind`
- Type: function
- Source: [source](../../../../../../../../packages/server/src/features/live-docs/generation/core.ts#L214)

#### `collectExportedSymbols`
- Type: function
- Source: [source](../../../../../../../../packages/server/src/features/live-docs/generation/core.ts#L233)

#### `collectDependencies`
- Type: function
- Source: [source](../../../../../../../../packages/server/src/features/live-docs/generation/core.ts#L402)

#### `resolveDependency`
- Type: function
- Source: [source](../../../../../../../../packages/server/src/features/live-docs/generation/core.ts#L477)

#### `renderPublicSymbolLines`
- Type: function
- Source: [source](../../../../../../../../packages/server/src/features/live-docs/generation/core.ts#L530)

#### `renderDependencyLines`
- Type: function
- Source: [source](../../../../../../../../packages/server/src/features/live-docs/generation/core.ts#L581)

#### `formatSourceLink`
- Type: function
- Source: [source](../../../../../../../../packages/server/src/features/live-docs/generation/core.ts#L643)

#### `formatRelativePathFromDoc`
- Type: function
- Source: [source](../../../../../../../../packages/server/src/features/live-docs/generation/core.ts#L648)

#### `createSymbolSlug`
- Type: function
- Source: [source](../../../../../../../../packages/server/src/features/live-docs/generation/core.ts#L656)

#### `toModuleLabel`
- Type: function
- Source: [source](../../../../../../../../packages/server/src/features/live-docs/generation/core.ts#L661)

#### `formatInlineCode`
- Type: function
- Source: [source](../../../../../../../../packages/server/src/features/live-docs/generation/core.ts#L667)

#### `formatDependencyQualifier`
- Type: function
- Source: [source](../../../../../../../../packages/server/src/features/live-docs/generation/core.ts#L672)

#### `resolveExportAssignmentName`
- Type: function
- Source: [source](../../../../../../../../packages/server/src/features/live-docs/generation/core.ts#L686)

#### `hasExportModifier`
- Type: function
- Source: [source](../../../../../../../../packages/server/src/features/live-docs/generation/core.ts#L696)

#### `hasDefaultModifier`
- Type: function
- Source: [source](../../../../../../../../packages/server/src/features/live-docs/generation/core.ts#L704)

#### `getNodeLocation`
- Type: function
- Source: [source](../../../../../../../../packages/server/src/features/live-docs/generation/core.ts#L712)

#### `extractJsDocComment`
- Type: function
- Source: [source](../../../../../../../../packages/server/src/features/live-docs/generation/core.ts#L721)

#### `displayDependencyKey`
- Type: function
- Source: [source](../../../../../../../../packages/server/src/features/live-docs/generation/core.ts#L740)

#### `detectChangedFiles`
- Type: function
- Source: [source](../../../../../../../../packages/server/src/features/live-docs/generation/core.ts#L744)

#### `parsePorcelainLine`
- Type: function
- Source: [source](../../../../../../../../packages/server/src/features/live-docs/generation/core.ts#L766)

#### `execFileAsync`
- Type: function
- Source: [source](../../../../../../../../packages/server/src/features/live-docs/generation/core.ts#L788)
<!-- LIVE-DOC:END Public Symbols -->

<!-- LIVE-DOC:BEGIN Dependencies -->
### Dependencies
- `@copilot-improvement/shared/config/liveDocumentationConfig` - `LiveDocumentationArchetype`, `LiveDocumentationConfig` (type-only)
- `@copilot-improvement/shared/tooling/githubSlugger` - `githubSlug`
- `@copilot-improvement/shared/tooling/pathUtils` - `normalizeWorkspacePath`
- `glob` - `glob`
- `node:child_process` - `execFile`
- `node:fs/promises` - `fs`
- `node:path` - `path`
- `typescript` - `ts`
<!-- LIVE-DOC:END Dependencies -->

<!-- LIVE-DOC:BEGIN Observed Evidence -->
### Observed Evidence
#### Vitest Unit Tests
- [generator.test.ts](../generator.test.ts.mdmd.md)
- [renderPublicSymbolLines.test.ts](../renderPublicSymbolLines.test.ts.mdmd.md)
- [generator.test.ts](../system/generator.test.ts.mdmd.md)
<!-- LIVE-DOC:END Observed Evidence -->
