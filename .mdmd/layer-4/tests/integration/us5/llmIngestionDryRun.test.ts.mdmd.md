# tests/integration/us5/llmIngestionDryRun.test.ts

## Metadata
- Layer: 4
- Archetype: test
- Code Path: tests/integration/us5/llmIngestionDryRun.test.ts
- Live Doc ID: LD-test-tests-integration-us5-llmingestiondryrun-test-ts
- Generated At: 2025-11-16T20:43:33.715Z

## Authored
### Purpose
Exercises the US5 LLM ingestion orchestrator end-to-end, proving dry-run snapshots capture speculative edges and persistent runs store only diagnostically eligible relationships after we landed the orchestrator workflow ([orchestrator implementation](../../../../../AI-Agent-Workspace/ChatHistory/2025/10/Summarized/2025-10-24.SUMMARIZED.md#turn-11-orchestrator-implementation--unit-coverage-lines-4461-5200)).

### Notes
- Uses the GraphStore/ProviderGuard wiring introduced for dry-run provenance so the suite can assert skip counts, provenance rows, and the absence of graph mutations while still running through the verify pipeline ([verify pipeline finally runs integration](../../../../../AI-Agent-Workspace/ChatHistory/2025/10/Summarized/2025-10-24.SUMMARIZED.md#turn-15-verify-pipeline-finally-runs-integration-lines-7101-7800)).

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-16T20:43:33.715Z","inputHash":"5e829b7c9aac2273"}]} -->
<!-- LIVE-DOC:BEGIN Public Symbols -->
### Public Symbols
_No public symbols detected_
<!-- LIVE-DOC:END Public Symbols -->

<!-- LIVE-DOC:BEGIN Dependencies -->
### Dependencies
_No dependencies documented yet_
<!-- LIVE-DOC:END Dependencies -->

<!-- LIVE-DOC:BEGIN Targets -->
### Targets
_No targets documented yet_
<!-- LIVE-DOC:END Targets -->

<!-- LIVE-DOC:BEGIN Supporting Fixtures -->
### Supporting Fixtures
_No supporting fixtures documented yet_
<!-- LIVE-DOC:END Supporting Fixtures -->
