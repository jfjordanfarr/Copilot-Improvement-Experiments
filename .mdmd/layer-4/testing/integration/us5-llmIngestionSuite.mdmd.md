# US5 LLM Ingestion Suite (Layer 4)

## Source Mapping
- Tests: [`tests/integration/us5/llmIngestionDryRun.test.ts`](../../../../tests/integration/us5/llmIngestionDryRun.test.ts), [`tests/integration/us5/transformRipple.test.ts`](../../../../tests/integration/us5/transformRipple.test.ts)
- Fixture: [`tests/integration/us5/__fixtures__/llm-ingestion/dry-run.sample.json`](../../../../tests/integration/us5/__fixtures__/llm-ingestion/dry-run.sample.json)
- Runtime collaborators:
	- [`packages/server/src/features/knowledge/llmIngestionOrchestrator.ts`](../../../../packages/server/src/features/knowledge/llmIngestionOrchestrator.ts)
	- [`packages/server/src/runtime/llmIngestion.ts`](../../../../packages/server/src/runtime/llmIngestion.ts)
	- [`packages/shared/src/db/graphStore.ts`](../../../../packages/shared/src/db/graphStore.ts)
	- [`packages/extension/src/services/localOllamaBridge.ts`](../../../../packages/extension/src/services/localOllamaBridge.ts)

## Responsibility
Exercise the LLM ingestion pipeline end-to-end, covering both dry-run snapshot generation and persisted ripple transforms. Ensures calibration, provenance capture, and ripple diagnostics integrate cleanly with the knowledge graph.

## Scenario Coverage
- `llmIngestionDryRun.test.ts` uses a mocked extractor to verify that dry-run executions emit snapshots without mutating the SQLite graph.
- `transformRipple.test.ts` validates that stored relationships trigger ripple transformations and produce diagnostics aligned with ingestion results.

## Workflow
1. Spin up a temporary GraphStore and instantiate `LlmIngestionOrchestrator`/`LlmIngestionManager` with stubbed extractors.
2. Enqueue artifacts, invoke dry-run or persisted ingestion, and inspect snapshots/provenance records on disk.
3. Assert ripple diagnostics reflect ingested edges and that calibration flags (`diagnosticsEligible`, `shadowed`) behave as expected.
4. When `llmProviderMode === "local-only"`, the extension falls back to the workspace-local Ollama bridge, returning deterministic mock relationships so Mocha runs stay reproducible without remote providers.

## Follow-ups
- Add coverage for provider consent transitions once live `vscode.lm` providers are wired into the orchestrator.
- Include failure-path tests (extractor errors, file read failures) to validate logging and retry behaviour.
- Record a fixture for the mock Ollama bridge output once real prompts are enabled to detect future schema drift.
