# tests/integration/benchmarks/fixtures/c/basics/src/util.h

## Metadata
- Layer: 4
- Archetype: asset
- Code Path: tests/integration/benchmarks/fixtures/c/basics/src/util.h
- Live Doc ID: LD-asset-tests-integration-benchmarks-fixtures-c-basics-src-util-h
- Generated At: 2025-11-18T23:45:00.000Z

## Authored
### Purpose
Declares the widget struct and factory API used by the C basics benchmark so the fixture mirrors a minimal but realistic header layout.

### Notes
The header intentionally keeps the API tiny—just a value wrapper and its constructor—to ease cross-language comparison in the benchmark suite.

## Generated
<!-- LIVE-DOC:BEGIN Public Symbols -->
### Public Symbols
#### `struct widget`
- Type: struct
- Summary: Represents the numeric sample container shared across the basics fixture.
- Source: [source](../../../../../../../../../tests/integration/benchmarks/fixtures/c/basics/src/util.h#L9)

#### `build_widget`
- Type: function
- Summary: Doubles the provided seed to build a deterministic widget.
- Source: [source](../../../../../../../../../tests/integration/benchmarks/fixtures/c/basics/src/util.h#L21)
<!-- LIVE-DOC:END Public Symbols -->

<!-- LIVE-DOC:BEGIN Dependencies -->
### Dependencies
_Not applicable_
<!-- LIVE-DOC:END Dependencies -->
