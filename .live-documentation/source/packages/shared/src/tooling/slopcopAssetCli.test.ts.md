# packages/shared/src/tooling/slopcopAssetCli.test.ts

## Metadata
- Layer: 4
- Archetype: test
- Code Path: packages/shared/src/tooling/slopcopAssetCli.test.ts
- Live Doc ID: LD-test-packages-shared-src-tooling-slopcopassetcli-test-ts
- Generated At: 2025-11-16T02:09:52.142Z

## Authored
### Purpose
Exercises the asset-check CLI end-to-end, confirming it reports clean runs for healthy workspaces and surfaces missing asset errors after files are removed.

### Notes
- Launches the CLI via `tsx --tsconfig` so the same entrypoint used in scripts is covered, parsing the JSON payload to assert counts and exit codes.
- Breaks the copied fixture workspace by deleting known assets, verifying the command exits with code `3` and lists each missing target before restoring and retesting.
- Uses a temporary directory copy to keep the integration deterministic without mutating the shared fixtures in `tests/integration/fixtures/slopcop-assets`.

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-16T02:09:52.142Z","inputHash":"5ffd82e741555fc2"}]} -->
<!-- LIVE-DOC:BEGIN Public Symbols -->
### Public Symbols
_No public symbols detected_
<!-- LIVE-DOC:END Public Symbols -->

<!-- LIVE-DOC:BEGIN Dependencies -->
### Dependencies
- `node:child_process` - `spawnSync`
- `node:fs` - `fs`
- `node:os` - `os`
- `node:path` - `path`
- `node:process` - `process`
- `vitest` - `describe`, `expect`, `it`
<!-- LIVE-DOC:END Dependencies -->

<!-- LIVE-DOC:BEGIN Targets -->
### Targets
_No targets documented yet_
<!-- LIVE-DOC:END Targets -->

<!-- LIVE-DOC:BEGIN Supporting Fixtures -->
### Supporting Fixtures
_No supporting fixtures documented yet_
<!-- LIVE-DOC:END Supporting Fixtures -->
