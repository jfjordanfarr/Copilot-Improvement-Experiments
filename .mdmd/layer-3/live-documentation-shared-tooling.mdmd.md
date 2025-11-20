# Live Documentation Shared Tooling

## Metadata
- Layer: 3
- Archetype: component
- Live Doc ID: COMP-shared-tooling

## Authored
### Purpose
Describe the shared tooling that developers and CI rely on: configuration loaders, SQLite graph access, fixture oracles, and reporting helpers that keep Live Documentation actionable.

### Notes
- Configuration helpers centralise feature flags and rule profile settings, feeding both CLI scripts and the extension with consistent defaults.
- Graph store utilities provide transactional access to the snapshot database, enabling audits, diagnostics, and regeneration to share caches.
- Fixture oracles underpin benchmark runs by emitting ground-truth graphs the analyzers must match before we accept changes.
- Symbol and documentation link helpers keep CLI output and extension views aligned, reducing duplicated slug/anchor logic across packages.

### Strategy
- Extend reporting helpers to emit machine-readable summaries so dashboards and prompts can ingest benchmark deltas directly.
- Fold additional language fixture oracles into the shared tooling package as we onboard more benchmark repositories.

## System References
### Components
- [packages/shared/src/config/liveDocumentationConfig.ts](../layer-4/packages/shared/src/config/liveDocumentationConfig.ts.mdmd.md)
- [packages/shared/src/db/graphStore.ts](../layer-4/packages/shared/src/db/graphStore.ts.mdmd.md)
- [packages/shared/src/testing/fixtureOracles/typeScriptFixtureOracle.ts](../layer-4/packages/shared/src/testing/fixtureOracles/typeScriptFixtureOracle.ts.mdmd.md)
- [packages/shared/src/tooling/documentationLinks.ts](../layer-4/packages/shared/src/tooling/documentationLinks.ts.mdmd.md)
- [packages/shared/src/tooling/symbolReferences.ts](../layer-4/packages/shared/src/tooling/symbolReferences.ts.mdmd.md)

## Evidence
- `npm run verify -- --report` relies on these helpers to produce Markdown and JSON summaries; clean runs confirm reporting parity.
- Graph snapshot tests exercise the SQLite wrapper and ensure migrations keep historical data accessible.
