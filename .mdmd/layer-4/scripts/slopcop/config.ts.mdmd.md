# scripts/slopcop/config.ts

## Metadata
- Layer: 4
- Archetype: implementation
- Code Path: scripts/slopcop/config.ts
- Live Doc ID: LD-implementation-scripts-slopcop-config-ts
- Generated At: 2025-11-16T22:34:14.139Z

## Authored
### Purpose
Centralises SlopCop configuration parsing so the markdown, asset, and symbol audits all respect the same include/ignore globs, target overrides, and severity settings drawn from `slopcop.config.json`.

### Notes
- Added during the SlopCop CLI extraction (late Oct 2025) to keep the three audits in sync after we split them into dedicated scripts (`2025-10-25.SUMMARIZED.md`).
- Normalises string inputs (`includeGlobs`, `ignoreTargets`, severity levels) and supports per-section overrides, which the integration fixtures assert against when simulating misconfigured repos.
- `CONFIG_FILE_NAME` remains fixed so `npm run slopcop:*` commands and `safe-to-commit.mjs` can rely on workspace-relative resolution, with `--config` allowing targeted regression tests.

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-16T22:34:14.139Z","inputHash":"94a5527508e962ce"}]} -->
<!-- LIVE-DOC:BEGIN Public Symbols -->
### Public Symbols
#### `SeveritySetting`
- Type: type
- Source: [source](../../../../scripts/slopcop/config.ts#L4)

#### `SlopcopConfigSection`
- Type: interface
- Source: [source](../../../../scripts/slopcop/config.ts#L6)

#### `SlopcopSymbolConfig`
- Type: interface
- Source: [source](../../../../scripts/slopcop/config.ts#L13)

#### `SlopcopConfig`
- Type: interface
- Source: [source](../../../../scripts/slopcop/config.ts#L19)

#### `CONFIG_FILE_NAME`
- Type: const
- Source: [source](../../../../scripts/slopcop/config.ts#L29)

#### `loadSlopcopConfig`
- Type: function
- Source: [source](../../../../scripts/slopcop/config.ts#L33)

#### `resolveIgnoreGlobs`
- Type: function
- Source: [source](../../../../scripts/slopcop/config.ts#L56)

#### `resolveIncludeGlobs`
- Type: function
- Source: [source](../../../../scripts/slopcop/config.ts#L66)

#### `compileIgnorePatterns`
- Type: function
- Source: [source](../../../../scripts/slopcop/config.ts#L78)

#### `resolveRootDirectories`
- Type: function
- Source: [source](../../../../scripts/slopcop/config.ts#L103)
<!-- LIVE-DOC:END Public Symbols -->

<!-- LIVE-DOC:BEGIN Dependencies -->
### Dependencies
- `node:fs` - `fs`
- `node:path` - `path`
<!-- LIVE-DOC:END Dependencies -->
