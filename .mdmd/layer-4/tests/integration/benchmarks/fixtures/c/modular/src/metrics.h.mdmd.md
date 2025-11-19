# tests/integration/benchmarks/fixtures/c/modular/src/metrics.h

## Metadata
- Layer: 4
- Archetype: asset
- Code Path: tests/integration/benchmarks/fixtures/c/modular/src/metrics.h
- Live Doc ID: LD-asset-tests-integration-benchmarks-fixtures-c-modular-src-metrics-h
- Generated At: 2025-11-18T23:45:00.000Z

## Authored
### Purpose
Summarises the statistical helpers exposed to the modular pipeline implementation within the C benchmark fixture.

### Notes
Exports both averaging and clamping routines so the pipeline can normalise values before logging.

## Generated
<!-- LIVE-DOC:BEGIN Public Symbols -->
### Public Symbols
#### `compute_average`
- Type: function
- Summary: Computes the arithmetic mean for a contiguous sample window.
- Source: [source](../../../../../../../../../tests/integration/benchmarks/fixtures/c/modular/src/metrics.h#L12)

#### `clamp`
- Type: function
- Summary: Restricts a floating-point value to the provided bounds.
- Source: [source](../../../../../../../../../tests/integration/benchmarks/fixtures/c/modular/src/metrics.h#L22)
<!-- LIVE-DOC:END Public Symbols -->

<!-- LIVE-DOC:BEGIN Dependencies -->
### Dependencies
_Not applicable_
<!-- LIVE-DOC:END Dependencies -->
