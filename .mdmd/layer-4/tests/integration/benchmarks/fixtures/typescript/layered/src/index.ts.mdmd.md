# tests/integration/benchmarks/fixtures/typescript/layered/src/index.ts

## Metadata
- Layer: 4
- Archetype: asset
- Code Path: tests/integration/benchmarks/fixtures/typescript/layered/src/index.ts
- Live Doc ID: LD-asset-tests-integration-benchmarks-fixtures-typescript-layered-src-index-ts
- Generated At: 2025-11-16T22:34:14.218Z

## Authored
### Purpose
Serves as the orchestration entrypoint for the `ts-layered` benchmark, exercising multi-hop runtime imports validated by the TypeScript oracle work in [2025-11-03 summary](../../../../../../../../../AI-Agent-Workspace/ChatHistory/2025/11/Summarized/2025-11-03.SUMMARIZED.md).

### Notes
- Forces analyzer traces through services, repositories, and utils so transitive runtime edges surface in AST accuracy reports.

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-16T22:34:14.218Z","inputHash":"ca3ac40972e5da67"}]} -->
<!-- LIVE-DOC:BEGIN Public Symbols -->
### Public Symbols
#### `run`
- Type: function
- Source: [source](../../../../../../../../../tests/integration/benchmarks/fixtures/typescript/layered/src/index.ts#L4)
<!-- LIVE-DOC:END Public Symbols -->

<!-- LIVE-DOC:BEGIN Dependencies -->
### Dependencies
- [`widget.Widget`](./models/widget.ts.mdmd.md#widget)
- [`reportService.generateReport`](./services/reportService.ts.mdmd.md#generatereport)
<!-- LIVE-DOC:END Dependencies -->
