# tests/integration/benchmarks/fixtures/c/modular/src/main.c

## Metadata
- Layer: 4
- Archetype: asset
- Code Path: tests/integration/benchmarks/fixtures/c/modular/src/main.c
- Live Doc ID: LD-asset-tests-integration-benchmarks-fixtures-c-modular-src-main-c
- Generated At: 2025-11-19T15:01:36.064Z

## Authored
### Purpose
Runs the modular C benchmark end-to-end, invoking the pipeline and logger to expose cross-translation-unit dependencies.

### Notes
Keep the sample values and logging strings stable; they provide deterministic edges for the analyzer.

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-19T15:01:36.064Z","inputHash":"6c9d4882d57c1b19"}]} -->
<!-- LIVE-DOC:BEGIN Public Symbols -->
### Public Symbols
#### `main` {#symbol-main}
- Type: function
- Source: [source](../../../../../../../../../tests/integration/benchmarks/fixtures/c/modular/src/main.c#L8)

##### `main` — Summary
End-to-end demonstration of the modular pipeline runnable.

##### `main` — Returns
int Zero when the pipeline produces a non-negative value.
<!-- LIVE-DOC:END Public Symbols -->

<!-- LIVE-DOC:BEGIN Dependencies -->
### Dependencies
- [`logger`](./logger.h.mdmd.md)
- [`pipeline`](./pipeline.h.mdmd.md)
<!-- LIVE-DOC:END Dependencies -->
