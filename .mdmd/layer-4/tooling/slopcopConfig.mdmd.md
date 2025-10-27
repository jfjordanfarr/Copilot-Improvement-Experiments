
## Source Mapping
- Implementation: [`scripts/slopcop/config.ts`](../../../scripts/slopcop/config.ts)
- Parent design: [SlopCop Workspace Linting](../../layer-3/slopcop.mdmd.md)

## Exported Symbols

#### SeveritySetting
`SeveritySetting` enumerates rule severities (off, warn, error).

#### SlopcopConfigSection
`SlopcopConfigSection` defines shared include/ignore/root options for markdown and asset audits.

#### SlopcopSymbolConfig
`SlopcopSymbolConfig` extends the section schema with symbol-specific toggles and severity overrides.

#### SlopcopConfig
`SlopcopConfig` is the root configuration shape loaded from slopcop.config.json.

#### CONFIG_FILE_NAME
`CONFIG_FILE_NAME` exposes the canonical config filename (slopcop.config.json).

#### loadSlopcopConfig
`loadSlopcopConfig` reads and normalises configuration from disk, throwing descriptive errors for invalid schemas.

#### resolveIgnoreGlobs
`resolveIgnoreGlobs` merges default ignore globs with global and section-specific entries.

#### resolveIncludeGlobs
`resolveIncludeGlobs` selects section-specific include globs or falls back to defaults.

#### compileIgnorePatterns
`compileIgnorePatterns` compiles global + section regex patterns into RegExp objects, validating inputs.

#### resolveRootDirectories
`resolveRootDirectories` merges global and section root directories for asset resolution.

## Responsibility
Load and normalise SlopCop configuration so auditing scripts share consistent include/exclude semantics across markdown, assets, and symbol analyzers.

## Evidence
- Consumed by SlopCop commands in [`scripts/slopcop/check-markdown-links.ts`](../../../scripts/slopcop/check-markdown-links.ts) and [`check-symbols.ts`](../../../scripts/slopcop/check-symbols.ts).
