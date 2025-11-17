# packages/shared/src/live-docs/core.ts

## Metadata
- Layer: 4
- Archetype: implementation
- Code Path: packages/shared/src/live-docs/core.ts
- Live Doc ID: LD-implementation-packages-shared-src-live-docs-core-ts
- Generated At: 2025-11-16T23:18:49.372Z

## Authored
### Purpose
Implements the shared Live Docs extraction engine—scanning source trees, collecting exports/dependencies, and emitting structured metadata consumed by generators and analytics.[AI-Agent-Workspace/ChatHistory/2025/11/Summarized/2025-11-10.SUMMARIZED.md#turn-12-stage-0-complete-with-config--staging-tree-lines-2021-2160]

### Notes
- Refactored out of the server generator so adapters and CLI tooling could reuse a single discovery pipeline across packages.[AI-Agent-Workspace/ChatHistory/2025/11/Summarized/2025-11-10.SUMMARIZED.md#turn-12-stage-0-complete-with-config--staging-tree-lines-2021-2160]
- Extended on Nov 12 to power adapter registries and polyglot fixture generation, adding hooks the co-activation analytics now depend on.[AI-Agent-Workspace/ChatHistory/2025/11/Summarized/2025-11-12.SUMMARIZED.md#turn-08-stand-up-co-activation-infrastructure-lines-1101-1220]
- Enriched with docstring extraction work that guarantees Live Docs capture structured JSDoc output for downstream evidence.[AI-Agent-Workspace/ChatHistory/2025/11/Summarized/2025-11-14.SUMMARIZED.md#turn-14-instructions-drift--legacy-layer-4-cleanup-lines-1321-1400]

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-16T23:18:49.372Z","inputHash":"8b70e36e3d921338"}]} -->
<!-- LIVE-DOC:BEGIN Public Symbols -->
### Public Symbols
#### `SourceAnalysisResult`
- Type: interface
- Source: [source](../../../../../../packages/shared/src/live-docs/core.ts#L15)

#### `PublicSymbolEntry`
- Type: interface
- Source: [source](../../../../../../packages/shared/src/live-docs/core.ts#L21)

#### `DependencyEntry`
- Type: interface
- Source: [source](../../../../../../packages/shared/src/live-docs/core.ts#L30)

#### `ReExportedSymbolInfo`
- Type: interface
- Source: [source](../../../../../../packages/shared/src/live-docs/core.ts#L40)

#### `LocationInfo`
- Type: interface
- Source: [source](../../../../../../packages/shared/src/live-docs/core.ts#L48)

#### `SymbolDocumentationField`
- Type: type
- Source: [source](../../../../../../packages/shared/src/live-docs/core.ts#L53)

#### `SymbolDocumentationParameter`
- Type: interface
- Source: [source](../../../../../../packages/shared/src/live-docs/core.ts#L65)

#### `SymbolDocumentationException`
- Type: interface
- Source: [source](../../../../../../packages/shared/src/live-docs/core.ts#L70)

#### `SymbolDocumentationExample`
- Type: interface
- Source: [source](../../../../../../packages/shared/src/live-docs/core.ts#L75)

#### `SymbolDocumentationLinkKind`
- Type: type
- Source: [source](../../../../../../packages/shared/src/live-docs/core.ts#L81)

#### `SymbolDocumentationLink`
- Type: interface
- Source: [source](../../../../../../packages/shared/src/live-docs/core.ts#L83)

#### `SymbolDocumentation`
- Type: interface
- Source: [source](../../../../../../packages/shared/src/live-docs/core.ts#L89)

#### `SUPPORTED_SCRIPT_EXTENSIONS`
- Type: const
- Source: [source](../../../../../../packages/shared/src/live-docs/core.ts#L104)

#### `MODULE_RESOLUTION_EXTENSIONS`
- Type: const
- Source: [source](../../../../../../packages/shared/src/live-docs/core.ts#L115)

#### `discoverTargetFiles`
- Type: function
- Source: [source](../../../../../../packages/shared/src/live-docs/core.ts#L166)

##### `discoverTargetFiles` — Summary
Locates workspace files that should receive Live Documentation generation.

##### `discoverTargetFiles` — Remarks
When `options.changedOnly` is `true`, the discovery set is intersected with
files currently marked as changed in git, allowing quick iterations that only
regenerate touched artifacts.

##### `discoverTargetFiles` — Parameters
- `options.changedOnly`: When `true`, restricts results to files with local modifications.
- `options.config`: Live Documentation configuration describing default globs and overrides.
- `options.include`: Optional override set limiting discovery to pre-selected relative paths.
- `options.workspaceRoot`: Absolute path to the repository root the CLI is operating in.

##### `discoverTargetFiles` — Returns
A sorted array of absolute, workspace-resolved file paths ready for analysis.

##### `discoverTargetFiles` — Examples
```ts
const files = await discoverTargetFiles({
  workspaceRoot,
  config,
  include: new Set(["packages/server/src/index.ts"]),
  changedOnly: false
});
```

##### `discoverTargetFiles` — Links
- `detectChangedFiles` — *

#### `resolveArchetype`
- Type: function
- Source: [source](../../../../../../packages/shared/src/live-docs/core.ts#L220)

##### `resolveArchetype` — Summary
Determines which Live Documentation archetype applies to a given source file.

##### `resolveArchetype` — Remarks
Explicit `archetypeOverrides` from the configuration take precedence. When no
overrides match, common fixture and test naming conventions are used as a
fallback before defaulting to the `implementation` archetype.

##### `resolveArchetype` — Parameters
- `config`: Live Documentation configuration containing archetype overrides.
- `sourcePath`: Workspace-relative source path using forward slashes.

##### `resolveArchetype` — Returns
The archetype that should be reflected in the generated markdown metadata.

##### `resolveArchetype` — Examples
```ts
const archetype = resolveArchetype("packages/app/src/main.test.ts", config);
// archetype === "test"
```

#### `hasMeaningfulAuthoredContent`
- Type: function
- Source: [source](../../../../../../packages/shared/src/live-docs/core.ts#L249)

##### `hasMeaningfulAuthoredContent` — Summary
Checks whether an authored markdown block carries information beyond the default placeholders.

##### `hasMeaningfulAuthoredContent` — Parameters
- `authoredBlock`: Raw markdown captured between the `## Authored` markers.

##### `hasMeaningfulAuthoredContent` — Returns
`true` when the block contains substantive content, otherwise `false`.

#### `directoryExists`
- Type: function
- Source: [source](../../../../../../packages/shared/src/live-docs/core.ts#L271)

#### `cleanupEmptyParents`
- Type: function
- Source: [source](../../../../../../packages/shared/src/live-docs/core.ts#L291)

##### `cleanupEmptyParents` — Summary
Recursively removes empty directories from `startDir` up to (but excluding) `stopDir`.

##### `cleanupEmptyParents` — Remarks
The walk stops as soon as a directory contains any entries or when the
`stopDir` boundary is reached, preventing accidental deletion outside the Live
Doc mirror.

##### `cleanupEmptyParents` — Parameters
- `startDir`: Directory that was just emptied (for example, a deleted Live Doc path).
- `stopDir`: Absolute directory boundary that must remain intact.

#### `analyzeSourceFile`
- Type: function
- Source: [source](../../../../../../packages/shared/src/live-docs/core.ts#L338)

##### `analyzeSourceFile` — Summary
Produces symbol and dependency analysis for a single source artifact.

##### `analyzeSourceFile` — Remarks
Language-specific adapters run before falling back to the built-in
TypeScript/JavaScript parser. This lets polyglot fixtures supply rich metadata
without requiring the TypeScript compiler to understand those languages.

##### `analyzeSourceFile` — Parameters
- `absolutePath`: Absolute filesystem path to the source file under inspection.
- `workspaceRoot`: Workspace root used to normalise relative dependency paths.

##### `analyzeSourceFile` — Returns
Analyzer output describing exported symbols and detected dependencies.

##### `analyzeSourceFile` — Examples
```ts
const analysis = await analyzeSourceFile(srcPath, workspaceRoot);
if (analysis.symbols.length === 0) {
  console.warn("No exports detected");
}
```

#### `inferScriptKind`
- Type: function
- Source: [source](../../../../../../packages/shared/src/live-docs/core.ts#L395)

##### `inferScriptKind` — Summary
Maps a file extension to the TypeScript compiler script kind used for parsing.

##### `inferScriptKind` — Parameters
- `extension`: Lowercase file extension including the leading dot.

##### `inferScriptKind` — Returns
The matching `ts.ScriptKind`, defaulting to `Unknown` for unsupported types.

#### `collectExportedSymbols`
- Type: function
- Source: [source](../../../../../../packages/shared/src/live-docs/core.ts#L421)

##### `collectExportedSymbols` — Summary
Scans a TypeScript source file for exported declarations and captures their metadata.

##### `collectExportedSymbols` — Parameters
- `sourceFile`: Parsed TypeScript source file produced by the compiler host.

##### `collectExportedSymbols` — Returns
A location-sorted list of exported symbols suitable for Live Doc rendering.

#### `collectDependencies`
- Type: function
- Source: [source](../../../../../../packages/shared/src/live-docs/core.ts#L608)

##### `collectDependencies` — Summary
Enumerates import and export dependencies declared within a TypeScript source file.

##### `collectDependencies` — Remarks
Relative specifiers are resolved against the workspace using Node-style extension
fallbacks so the resulting Live Docs can point to concrete files when possible.

##### `collectDependencies` — Parameters
- `params.absolutePath`: Absolute path to the origin file, used for resolution.
- `params.sourceFile`: Parsed source file that acts as the dependency origin.
- `params.workspaceRoot`: Workspace root for normalising resolved paths.

##### `collectDependencies` — Returns
A sorted list of dependency entries describing specifiers and imported symbols.

##### `collectDependencies` — Links
- `resolveDependency` — *

#### `resolveDependency`
- Type: function
- Source: [source](../../../../../../packages/shared/src/live-docs/core.ts#L887)

##### `resolveDependency` — Summary
Resolves a relative module specifier to a workspace-relative file path.

##### `resolveDependency` — Parameters
- `fromFile`: Absolute path to the file containing the specifier.
- `specifier`: Module specifier as written in the source file (for example, "./utils").
- `workspaceRoot`: Workspace root used to convert to a relative path.

##### `resolveDependency` — Returns
The normalised relative path when resolution succeeds, otherwise `undefined`.

##### `resolveDependency` — Links
- `collectDependencies` — *

#### `renderPublicSymbolLines`
- Type: function
- Source: [source](../../../../../../packages/shared/src/live-docs/core.ts#L999)

##### `renderPublicSymbolLines` — Summary
Renders the markdown lines that populate the `Public Symbols` section for a Live Doc.

##### `renderPublicSymbolLines` — Remarks
The output includes symbol metadata (type, location, qualifiers) followed by
deterministic `#####` subsections per documented field (summary, remarks,
parameters, returns, etc.). This structure keeps docstring bridges stable and
individually addressable across languages.

##### `renderPublicSymbolLines` — Parameters
- `args.analysis`: Analyzer output describing exported symbols and dependencies.
- `args.docDir`: Absolute directory path of the Live Doc being written.
- `args.sourceAbsolute`: Absolute path to the source file backing this Live Doc.
- `args.sourceRelativePath`: Workspace-relative source path (unused here but
preserved for parity with other render helpers).
- `args.workspaceRoot`: Workspace root, used to resolve relative links.

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

##### `renderPublicSymbolLines` — Links
- `renderDependencyLines`

#### `renderDependencyLines`
- Type: function
- Source: [source](../../../../../../packages/shared/src/live-docs/core.ts#L1216)

##### `renderDependencyLines` — Summary
Renders the markdown bullet list for a Live Doc's `Dependencies` section.

##### `renderDependencyLines` — Remarks
Module specifiers that resolve inside the workspace are linked directly to
their Live Doc counterparts, while external dependencies are emitted as inline
code with optional symbol suffixes.

##### `renderDependencyLines` — Parameters
- `args.analysis`: Analyzer output describing imported and re-exported modules.
- `args.docDir`: Directory containing the Live Doc being written.
- `args.liveDocsRootAbsolute`: Absolute path to the Live Docs mirror root.
- `args.workspaceRoot`: Workspace root used to compute relative links.

##### `renderDependencyLines` — Returns
Markdown lines suitable for the `Dependencies` section, or an empty array when none exist.

##### `renderDependencyLines` — Links
- `renderPublicSymbolLines` — *

#### `renderReExportedAnchorLines`
- Type: function
- Source: [source](../../../../../../packages/shared/src/live-docs/core.ts#L1294)

#### `formatSourceLink`
- Type: function
- Source: [source](../../../../../../packages/shared/src/live-docs/core.ts#L1343)

#### `formatRelativePathFromDoc`
- Type: function
- Source: [source](../../../../../../packages/shared/src/live-docs/core.ts#L1348)

#### `createSymbolSlug`
- Type: function
- Source: [source](../../../../../../packages/shared/src/live-docs/core.ts#L1356)

#### `toModuleLabel`
- Type: function
- Source: [source](../../../../../../packages/shared/src/live-docs/core.ts#L1361)

#### `formatInlineCode`
- Type: function
- Source: [source](../../../../../../packages/shared/src/live-docs/core.ts#L1367)

#### `formatDependencyQualifier`
- Type: function
- Source: [source](../../../../../../packages/shared/src/live-docs/core.ts#L1372)

#### `resolveExportAssignmentName`
- Type: function
- Source: [source](../../../../../../packages/shared/src/live-docs/core.ts#L1386)

#### `hasExportModifier`
- Type: function
- Source: [source](../../../../../../packages/shared/src/live-docs/core.ts#L1396)

#### `hasDefaultModifier`
- Type: function
- Source: [source](../../../../../../packages/shared/src/live-docs/core.ts#L1404)

#### `getNodeLocation`
- Type: function
- Source: [source](../../../../../../packages/shared/src/live-docs/core.ts#L1412)

#### `extractJsDocDocumentation`
- Type: function
- Source: [source](../../../../../../packages/shared/src/live-docs/core.ts#L1421)

#### `displayDependencyKey`
- Type: function
- Source: [source](../../../../../../packages/shared/src/live-docs/core.ts#L1743)

#### `detectChangedFiles`
- Type: function
- Source: [source](../../../../../../packages/shared/src/live-docs/core.ts#L1747)

#### `parsePorcelainLine`
- Type: function
- Source: [source](../../../../../../packages/shared/src/live-docs/core.ts#L1769)

#### `execFileAsync`
- Type: function
- Source: [source](../../../../../../packages/shared/src/live-docs/core.ts#L1791)
<!-- LIVE-DOC:END Public Symbols -->

<!-- LIVE-DOC:BEGIN Dependencies -->
### Dependencies
- `glob` - `glob`
- `node:child_process` - `execFile`
- `node:fs/promises` - `fs`
- `node:path` - `path`
- [`liveDocumentationConfig.LiveDocumentationArchetype`](../config/liveDocumentationConfig.ts.mdmd.md#livedocumentationarchetype)
- [`liveDocumentationConfig.LiveDocumentationConfig`](../config/liveDocumentationConfig.ts.mdmd.md#livedocumentationconfig)
- [`index.analyzeWithLanguageAdapters`](./adapters/index.ts.mdmd.md#analyzewithlanguageadapters)
- [`githubSlugger.slug`](../tooling/githubSlugger.ts.mdmd.md#slug)
- [`pathUtils.normalizeWorkspacePath`](../tooling/pathUtils.ts.mdmd.md#normalizeworkspacepath)
- `typescript` - `ts`
<!-- LIVE-DOC:END Dependencies -->

<!-- LIVE-DOC:BEGIN Observed Evidence -->
### Observed Evidence
#### Vitest Unit Tests
- [generator.test.ts](../../../server/src/features/live-docs/generator.test.ts.mdmd.md)
- [renderPublicSymbolLines.test.ts](../../../server/src/features/live-docs/renderPublicSymbolLines.test.ts.mdmd.md)
- [generator.test.ts](../../../server/src/features/live-docs/system/generator.test.ts.mdmd.md)
- [c.docstring.test.ts](./adapters/c.docstring.test.ts.mdmd.md)
- [python.docstring.test.ts](./adapters/python.docstring.test.ts.mdmd.md)
- [ruby.docstring.test.ts](./adapters/ruby.docstring.test.ts.mdmd.md)
- [rust.docstring.test.ts](./adapters/rust.docstring.test.ts.mdmd.md)
- [core.docstring.test.ts](./core.docstring.test.ts.mdmd.md)
<!-- LIVE-DOC:END Observed Evidence -->
