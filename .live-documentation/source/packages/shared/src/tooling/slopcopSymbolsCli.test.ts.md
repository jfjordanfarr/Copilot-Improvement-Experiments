# packages/shared/src/tooling/slopcopSymbolsCli.test.ts

## Metadata
- Layer: 4
- Archetype: test
- Code Path: packages/shared/src/tooling/slopcopSymbolsCli.test.ts
- Live Doc ID: LD-test-packages-shared-src-tooling-slopcopsymbolscli-test-ts
- Generated At: 2025-11-16T02:09:52.145Z

## Authored
### Purpose
Verifies the symbol hygiene CLI detects markdown heading regressions and recovers once docs are restored.

### Notes
- Executes the `check-symbols.ts` entrypoint via `tsx`, mirroring the real CLI invocation path and asserting exit codes plus JSON issue payloads.
- Corrupts a copied fixture workspace by duplicating headings and inserting a broken anchor to trigger `duplicate-heading` and `missing-anchor` findings.
- Restores the fixture files to confirm the CLI returns to a clean bill of health, ensuring the tests cover both failure and repair cycles.

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-16T02:09:52.145Z","inputHash":"ac4d249ab62bcc34"}]} -->
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
