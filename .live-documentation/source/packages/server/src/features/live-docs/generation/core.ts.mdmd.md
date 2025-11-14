# packages/server/src/features/live-docs/generation/core.ts

## Metadata
- Layer: 4
- Archetype: implementation
- Code Path: packages/server/src/features/live-docs/generation/core.ts
- Live Doc ID: LD-implementation-packages-server-src-features-live-docs-generation-core-ts
- Generated At: 2025-11-14T20:58:02.911Z

## Authored
### Purpose
_Pending authored purpose_

### Notes
_Pending notes_

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-14T20:58:02.911Z","inputHash":"a16ffd6b1cdfde1f"}]} -->
<!-- LIVE-DOC:BEGIN Public Symbols -->
### Public Symbols
#### `SourceAnalysisResult`
- Type: interface
- Source: [source](../../../../../../../../packages/server/src/features/live-docs/generation/core.ts#L13)

#### `PublicSymbolEntry`
- Type: interface
- Source: [source](../../../../../../../../packages/server/src/features/live-docs/generation/core.ts#L18)

#### `DependencyEntry`
- Type: interface
- Source: [source](../../../../../../../../packages/server/src/features/live-docs/generation/core.ts#L27)

#### `LocationInfo`
- Type: interface
- Source: [source](../../../../../../../../packages/server/src/features/live-docs/generation/core.ts#L35)

#### `SymbolDocumentationField`
- Type: type
- Source: [source](../../../../../../../../packages/server/src/features/live-docs/generation/core.ts#L40)

#### `SymbolDocumentationParameter`
- Type: interface
- Source: [source](../../../../../../../../packages/server/src/features/live-docs/generation/core.ts#L52)

#### `SymbolDocumentationException`
- Type: interface
- Source: [source](../../../../../../../../packages/server/src/features/live-docs/generation/core.ts#L57)

#### `SymbolDocumentationExample`
- Type: interface
- Source: [source](../../../../../../../../packages/server/src/features/live-docs/generation/core.ts#L62)

#### `SymbolDocumentationLinkKind`
- Type: type
- Source: [source](../../../../../../../../packages/server/src/features/live-docs/generation/core.ts#L68)

#### `SymbolDocumentationLink`
- Type: interface
- Source: [source](../../../../../../../../packages/server/src/features/live-docs/generation/core.ts#L70)

#### `SymbolDocumentation`
- Type: interface
- Source: [source](../../../../../../../../packages/server/src/features/live-docs/generation/core.ts#L76)

#### `SUPPORTED_SCRIPT_EXTENSIONS`
- Type: const
- Source: [source](../../../../../../../../packages/server/src/features/live-docs/generation/core.ts#L91)

#### `MODULE_RESOLUTION_EXTENSIONS`
- Type: const
- Source: [source](../../../../../../../../packages/server/src/features/live-docs/generation/core.ts#L102)

#### `discoverTargetFiles`
- Type: function
- Source: [source](../../../../../../../../packages/server/src/features/live-docs/generation/core.ts#L126)

#### `resolveArchetype`
- Type: function
- Source: [source](../../../../../../../../packages/server/src/features/live-docs/generation/core.ts#L161)

#### `hasMeaningfulAuthoredContent`
- Type: function
- Source: [source](../../../../../../../../packages/server/src/features/live-docs/generation/core.ts#L183)

#### `directoryExists`
- Type: function
- Source: [source](../../../../../../../../packages/server/src/features/live-docs/generation/core.ts#L205)

#### `cleanupEmptyParents`
- Type: function
- Source: [source](../../../../../../../../packages/server/src/features/live-docs/generation/core.ts#L214)

#### `analyzeSourceFile`
- Type: function
- Source: [source](../../../../../../../../packages/server/src/features/live-docs/generation/core.ts#L240)

#### `inferScriptKind`
- Type: function
- Source: [source](../../../../../../../../packages/server/src/features/live-docs/generation/core.ts#L282)

#### `collectExportedSymbols`
- Type: function
- Source: [source](../../../../../../../../packages/server/src/features/live-docs/generation/core.ts#L301)

#### `collectDependencies`
- Type: function
- Source: [source](../../../../../../../../packages/server/src/features/live-docs/generation/core.ts#L470)

#### `resolveDependency`
- Type: function
- Source: [source](../../../../../../../../packages/server/src/features/live-docs/generation/core.ts#L545)

#### `renderPublicSymbolLines`
- Type: function
- Source: [source](../../../../../../../../packages/server/src/features/live-docs/generation/core.ts#L627)

##### `renderPublicSymbolLines` — Summary
Renders the markdown lines that populate the `Public Symbols` section for a Live Doc.

##### `renderPublicSymbolLines` — Remarks
The output includes symbol metadata (type, location, qualifiers) followed by
deterministic `#####` subsections per documented field (summary, remarks,
parameters, returns, etc.). This structure keeps docstring bridges stable and
individually addressable across languages.

##### `renderPublicSymbolLines` — Parameters
- `args.analysis`: - Analyzer output describing exported symbols and dependencies.
- `args.docDir`: - Absolute directory path of the Live Doc being written.
- `args.sourceAbsolute`: - Absolute path to the source file backing this Live Doc.
- `args.sourceRelativePath`: - Workspace-relative source path (unused here but
preserved for parity with other render helpers).
- `args.workspaceRoot`: - Workspace root, used to resolve relative links.

##### `renderPublicSymbolLines` — Returns
An array of markdown lines ready to insert beneath the `Public Symbols` heading.

##### `renderPublicSymbolLines` — Examples
```ts
const lines = renderPublicSymbolLines({
  analysis,
  docDir,
  sourceAbsolute,
  workspaceRoot,
  sourceRelativePath
});
```

#### `renderDependencyLines`
- Type: function
- Source: [source](../../../../../../../../packages/server/src/features/live-docs/generation/core.ts#L827)

#### `formatSourceLink`
- Type: function
- Source: [source](../../../../../../../../packages/server/src/features/live-docs/generation/core.ts#L889)

#### `formatRelativePathFromDoc`
- Type: function
- Source: [source](../../../../../../../../packages/server/src/features/live-docs/generation/core.ts#L894)

#### `createSymbolSlug`
- Type: function
- Source: [source](../../../../../../../../packages/server/src/features/live-docs/generation/core.ts#L902)

#### `toModuleLabel`
- Type: function
- Source: [source](../../../../../../../../packages/server/src/features/live-docs/generation/core.ts#L907)

#### `formatInlineCode`
- Type: function
- Source: [source](../../../../../../../../packages/server/src/features/live-docs/generation/core.ts#L913)

#### `formatDependencyQualifier`
- Type: function
- Source: [source](../../../../../../../../packages/server/src/features/live-docs/generation/core.ts#L918)

#### `resolveExportAssignmentName`
- Type: function
- Source: [source](../../../../../../../../packages/server/src/features/live-docs/generation/core.ts#L932)

#### `hasExportModifier`
- Type: function
- Source: [source](../../../../../../../../packages/server/src/features/live-docs/generation/core.ts#L942)

#### `hasDefaultModifier`
- Type: function
- Source: [source](../../../../../../../../packages/server/src/features/live-docs/generation/core.ts#L950)

#### `getNodeLocation`
- Type: function
- Source: [source](../../../../../../../../packages/server/src/features/live-docs/generation/core.ts#L958)

#### `extractJsDocDocumentation`
- Type: function
- Source: [source](../../../../../../../../packages/server/src/features/live-docs/generation/core.ts#L967)

#### `displayDependencyKey`
- Type: function
- Source: [source](../../../../../../../../packages/server/src/features/live-docs/generation/core.ts#L1241)

#### `detectChangedFiles`
- Type: function
- Source: [source](../../../../../../../../packages/server/src/features/live-docs/generation/core.ts#L1245)

#### `parsePorcelainLine`
- Type: function
- Source: [source](../../../../../../../../packages/server/src/features/live-docs/generation/core.ts#L1267)

#### `execFileAsync`
- Type: function
- Source: [source](../../../../../../../../packages/server/src/features/live-docs/generation/core.ts#L1289)
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
- [`index.analyzeWithLanguageAdapters`](./adapters/index.ts.mdmd.md#analyzewithlanguageadapters)
- `typescript` - `ts`
<!-- LIVE-DOC:END Dependencies -->

<!-- LIVE-DOC:BEGIN Observed Evidence -->
### Observed Evidence
#### Vitest Unit Tests
- [python.docstring.test.ts](./adapters/python.docstring.test.ts.mdmd.md)
- [generator.test.ts](../generator.test.ts.mdmd.md)
- [renderPublicSymbolLines.test.ts](../renderPublicSymbolLines.test.ts.mdmd.md)
- [generator.test.ts](../system/generator.test.ts.mdmd.md)
<!-- LIVE-DOC:END Observed Evidence -->
