# packages/shared/src/tooling/assetPaths.test.ts

## Metadata
- Layer: 4
- Archetype: test
- Code Path: packages/shared/src/tooling/assetPaths.test.ts
- Live Doc ID: LD-test-packages-shared-src-tooling-assetpaths-test-ts
- Generated At: 2025-11-16T02:09:52.081Z

## Authored
### Purpose
Exercises the asset path auditor end-to-end, ensuring it catches missing resources while ignoring valid or intentionally waived references.

### Notes
- Builds temporary workspaces to cover HTML, CSS, and absolute-path scenarios, confirming only unresolved targets raise issues and that attribute metadata (line, column, attr name) is preserved.
- Validates support for configurable asset roots and ignore patterns, including hashed filenames and externally hosted resources that should not trigger diagnostics.
- Keeps fixtures lightweight by writing files directly in tests, giving fast feedback on regex extraction and path resolution logic.

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-16T02:09:52.081Z","inputHash":"20128627ba52330d"}]} -->
<!-- LIVE-DOC:BEGIN Public Symbols -->
### Public Symbols
_No public symbols detected_
<!-- LIVE-DOC:END Public Symbols -->

<!-- LIVE-DOC:BEGIN Dependencies -->
### Dependencies
- `node:fs` - `fs`
- `node:os` - `os`
- `node:path` - `path`
- [`assetPaths.findBrokenAssetReferences`](./assetPaths.ts.md#findbrokenassetreferences)
- `vitest` - `describe`, `expect`, `it`
<!-- LIVE-DOC:END Dependencies -->

<!-- LIVE-DOC:BEGIN Targets -->
### Targets
#### Vitest Unit Tests
- packages/shared/src/tooling: [assetPaths.ts](./assetPaths.ts.md)
<!-- LIVE-DOC:END Targets -->

<!-- LIVE-DOC:BEGIN Supporting Fixtures -->
### Supporting Fixtures
_No supporting fixtures documented yet_
<!-- LIVE-DOC:END Supporting Fixtures -->
