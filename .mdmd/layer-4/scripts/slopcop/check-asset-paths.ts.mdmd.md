# scripts/slopcop/check-asset-paths.ts

## Metadata
- Layer: 4
- Archetype: implementation
- Code Path: scripts/slopcop/check-asset-paths.ts
- Live Doc ID: LD-implementation-scripts-slopcop-check-asset-paths-ts
- Generated At: 2025-11-19T15:01:36.000Z

## Authored
### Purpose
Audits HTML/CSS assets for broken relative references (images, scripts, styles) so docs and Live Doc exports never ship dead resource links.

### Notes
- Introduced alongside the SlopCop rollout to give `npm run slopcop:assets` parity with the markdown and symbol audits during the Stage‑0 cleanup push (`2025-10-31.md`).
- Honors `rootDirectories` from `slopcop.config.json`, letting tests point at fixture-specific asset trees while production runs stay locked to the workspace root.
- Integration suite `tests/integration/slopcop/assetsAudit.test.ts` exercises the `--json` output and ensures ignore patterns (for example ChatHistory, dist folders) stay in sync with maintainer expectations.

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-19T15:01:36.000Z","inputHash":"ca6726be7c10a8b7"}]} -->
<!-- LIVE-DOC:BEGIN Public Symbols -->
### Public Symbols
_No public symbols detected_
<!-- LIVE-DOC:END Public Symbols -->

<!-- LIVE-DOC:BEGIN Dependencies -->
### Dependencies
- `glob` - `globSync`
- `node:fs` - `fs`
- `node:path` - `path`
- `node:process` - `process`
- [`assetPaths.AssetReferenceIssue`](../../packages/shared/src/tooling/assetPaths.ts.mdmd.md#symbol-assetreferenceissue)
- [`assetPaths.findBrokenAssetReferences`](../../packages/shared/src/tooling/assetPaths.ts.mdmd.md#symbol-findbrokenassetreferences)
- [`config.compileIgnorePatterns`](./config.ts.mdmd.md#symbol-compileignorepatterns)
- [`config.loadSlopcopConfig`](./config.ts.mdmd.md#symbol-loadslopcopconfig)
- [`config.resolveIgnoreGlobs`](./config.ts.mdmd.md#symbol-resolveignoreglobs)
- [`config.resolveIncludeGlobs`](./config.ts.mdmd.md#symbol-resolveincludeglobs)
- [`config.resolveRootDirectories`](./config.ts.mdmd.md#symbol-resolverootdirectories)
<!-- LIVE-DOC:END Dependencies -->
