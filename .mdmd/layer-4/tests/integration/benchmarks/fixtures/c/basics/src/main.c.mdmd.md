# tests/integration/benchmarks/fixtures/c/basics/src/main.c

## Metadata
- Layer: 4
- Archetype: asset
- Code Path: tests/integration/benchmarks/fixtures/c/basics/src/main.c
- Live Doc ID: LD-asset-tests-integration-benchmarks-fixtures-c-basics-src-main-c
- Generated At: 2025-11-19T15:01:36.048Z

## Authored
### Purpose
Entry point for the C basics benchmark, calling into `util` so the analyzer observes header-driven dependencies.

### Notes
The body must stay compact; its role is to surface the `build_widget` usage.

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-19T15:01:36.048Z","inputHash":"19b2d93d5a93ff1a"}]} -->
<!-- LIVE-DOC:BEGIN Public Symbols -->
### Public Symbols
#### `main` {#symbol-main}
- Type: function
- Source: [source](../../../../../../../../../tests/integration/benchmarks/fixtures/c/basics/src/main.c#L7)

##### `main` — Summary
Entry point that exercises build_widget.

##### `main` — Returns
int Zero when widget math behaves as expected.
<!-- LIVE-DOC:END Public Symbols -->

<!-- LIVE-DOC:BEGIN Dependencies -->
### Dependencies
- [`util`](./util.h.mdmd.md)
<!-- LIVE-DOC:END Dependencies -->
