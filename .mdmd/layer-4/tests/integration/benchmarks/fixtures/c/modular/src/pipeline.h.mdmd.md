# tests/integration/benchmarks/fixtures/c/modular/src/pipeline.h

## Metadata
- Layer: 4
- Archetype: asset
- Code Path: tests/integration/benchmarks/fixtures/c/modular/src/pipeline.h
- Live Doc ID: LD-asset-tests-integration-benchmarks-fixtures-c-modular-src-pipeline-h
- Generated At: 2025-11-18T23:45:00.000Z

## Authored
### Purpose
Defines the primary analytics entry point for the modular C benchmark, mirroring the signatures exercised by the pipeline implementation.

### Notes
Includes `<stddef.h>` for the `size_t` alias and chains to `metrics.h` so downstream headers stay self-contained during compilation.

## Generated
<!-- LIVE-DOC:BEGIN Public Symbols -->
### Public Symbols
#### `run_pipeline`
- Type: function
- Summary: Processes input samples and returns a normalized metric.
- Source: [source](../../../../../../../../../tests/integration/benchmarks/fixtures/c/modular/src/pipeline.h#L12)
<!-- LIVE-DOC:END Public Symbols -->

<!-- LIVE-DOC:BEGIN Dependencies -->
### Dependencies
- [`metrics`](./metrics.h.mdmd.md)
<!-- LIVE-DOC:END Dependencies -->
