# tests/integration/benchmarks/fixtures/c/modular/src/logger.h

## Metadata
- Layer: 4
- Archetype: asset
- Code Path: tests/integration/benchmarks/fixtures/c/modular/src/logger.h
- Live Doc ID: LD-asset-tests-integration-benchmarks-fixtures-c-modular-src-logger-h
- Generated At: 2025-11-18T23:45:00.000Z

## Authored
### Purpose
Declares the logging helper consumed across the modular C benchmark so pipeline steps can emit diagnostics during analysis.

### Notes
The logger stays intentionally tiny—just a printf wrapper—to keep the fixture portable across build environments.

## Generated
<!-- LIVE-DOC:BEGIN Public Symbols -->
### Public Symbols
#### `log_message`
- Type: function
- Summary: Writes the provided message to stdout when available.
- Source: [source](../../../../../../../../../tests/integration/benchmarks/fixtures/c/modular/src/logger.h#L9)
<!-- LIVE-DOC:END Public Symbols -->

<!-- LIVE-DOC:BEGIN Dependencies -->
### Dependencies
_Not applicable_
<!-- LIVE-DOC:END Dependencies -->
