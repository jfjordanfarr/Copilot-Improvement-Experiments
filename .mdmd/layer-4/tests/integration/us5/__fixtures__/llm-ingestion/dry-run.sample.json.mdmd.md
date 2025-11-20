# tests/integration/us5/__fixtures__/llm-ingestion/dry-run.sample.json

## Metadata
- Layer: 4
- Archetype: asset
- Code Path: tests/integration/us5/__fixtures__/llm-ingestion/dry-run.sample.json
- Live Doc ID: LD-asset-tests-integration-us5-fixtures-llm-ingestion-dry-run-sample-json
- Generated At: 2025-11-18T20:51:27.061Z

## Authored
### Purpose
Capture the deterministic dry-run payload we expect during US5 so the orchestration described in [`LLM Ingestion Pipeline`](../../../../../../../.mdmd/layer-3/llm-ingestion-pipeline.mdmd.md) always has a reviewed fixture for regression detection.

### Notes
- Source file: [`tests/integration/us5/__fixtures__/llm-ingestion/dry-run.sample.json`](../../../../../../../tests/integration/us5/__fixtures__/llm-ingestion/dry-run.sample.json)
- Mirrors the snapshot produced by `npm run test:integration -- --suite us5` when the orchestrator operates in dry-run mode.
- Update alongside prompt schema or provenance changes so regression tooling can diff the fixture before persisting edges.

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-18T20:51:27.061Z","inputHash":"30ad4e3378454c9f"}]} -->
<!-- LIVE-DOC:BEGIN Public Symbols -->
### Public Symbols
_No public symbols detected_
<!-- LIVE-DOC:END Public Symbols -->

<!-- LIVE-DOC:BEGIN Dependencies -->
### Dependencies
_No dependencies documented yet_
<!-- LIVE-DOC:END Dependencies -->
