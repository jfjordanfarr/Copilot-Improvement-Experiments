# tests/integration/benchmarks/fixtures/fixtures.manifest.json

## Metadata
- Layer: 4
- Archetype: asset
- Code Path: tests/integration/benchmarks/fixtures/fixtures.manifest.json
- Live Doc ID: LD-asset-tests-integration-benchmarks-fixtures-fixtures-manifest-json
- Generated At: 2025-11-18T20:51:24.495Z

## Authored
### Purpose
Master manifest enumerating every benchmark repository and fixture scenario the AST/self-similarity suites clone during verification runs.

### Notes
- Declares repository URLs, pinned commits, and include/exclude globs so benchmark orchestration can stage reproducible workspaces.
- The manifest drives both `npm run verify -- --report` and `npm run safe:commit -- --benchmarks`; edits here change coverage and must be coordinated with Layer‑3 benchmark documentation.
- Update entries when refreshing vendored repositories or adding new language scenarios, and regenerate fixtures plus reports to keep precision/recall metrics honest.

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-18T20:51:24.495Z","inputHash":"3a8010c470e6f9a0"}]} -->
<!-- LIVE-DOC:BEGIN Public Symbols -->
### Public Symbols
_No public symbols detected_
<!-- LIVE-DOC:END Public Symbols -->

<!-- LIVE-DOC:BEGIN Dependencies -->
### Dependencies
_No dependencies documented yet_
<!-- LIVE-DOC:END Dependencies -->
