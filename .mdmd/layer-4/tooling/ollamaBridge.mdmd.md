# Ollama Bridge Tooling

## Metadata
- Layer: 4
- Implementation ID: IMP-505
- Code Path: [`packages/extension/src/services/localOllamaBridge.ts`](../../../packages/extension/src/services/localOllamaBridge.ts)
- Exports: resolveOllamaEndpoint, invokeLocalOllamaBridge

## Purpose
Offer deterministic local LLM invocation for extension commands, diagnostics, and scripts so ripple inference stays grounded even when external providers are unavailable.

## Public Symbols

### resolveOllamaEndpoint
Consults workspace settings and environment overrides before defaulting to `http://localhost:11434`, returning the endpoint used by both the extension and CLI.

### invokeLocalOllamaBridge
Wraps `invokeOllamaChat`, emits usage metadata, and falls back to deterministic mock payloads when no model responds, ensuring relationship extraction remains JSON-valid.

## Responsibilities
- Honour `LINK_AWARE_OLLAMA_ENDPOINT`/`OLLAMA_ENDPOINT` and VS Code BYOK settings while selecting endpoints.
- Persist invocation traces to `LINK_AWARE_OLLAMA_TRACE_DIR` (defaults to `AI-Agent-Workspace/ollama-traces`) when configured.
- Surface failures via structured `OllamaInvocationError` objects and provide predictable mock responses for downstream pipelines.
- Share helpers with `scripts/ollama/run-chat.ts` so CLI usage mirrors in-editor behaviour.

## Collaborators
- [`scripts/ollama/run-chat.ts`](../../../scripts/ollama/run-chat.ts) consumes the same helpers for headless invocation.
- Shared utilities: [`packages/shared/src/tooling/ollamaClient.ts`](../../../packages/shared/src/tooling/ollamaClient.ts), [`ollamaEndpoint.ts`](../../../packages/shared/src/tooling/ollamaEndpoint.ts), [`ollamaMock.ts`](../../../packages/shared/src/tooling/ollamaMock.ts).
- Benchmark recorder ([Benchmark Recorder Utility](../testing/benchmarks/benchmarkRecorder.mdmd.md)) captures bridge metadata for performance audits.

## Linked Components
- [COMP-006 – LLM Ingestion Pipeline](../../layer-3/llm-ingestion-pipeline.mdmd.md)
- [COMP-002 – Extension Surfaces](../../layer-3/extension-surfaces.mdmd.md)

## Evidence
- Unit tests: [`packages/extension/src/services/localOllamaBridge.test.ts`](../../../packages/extension/src/services/localOllamaBridge.test.ts).
- Integration harness: [`tests/integration/vscode/runTests.ts`](../../../tests/integration/vscode/runTests.ts) hardens provider mode and ensures deterministic fallbacks during VS Code smoke tests.
- Benchmark metadata stored via [`tests/integration/benchmarks/utils/benchmarkRecorder.ts`](../../../tests/integration/benchmarks/utils/benchmarkRecorder.ts) records bridge configuration per run.

## Operational Notes
- CLI and extension share endpoint resolution to avoid configuration drift.
- Tracing is opt-in; files are timestamped JSON blobs to keep forensic analysis straightforward.
- Future enhancement: expose telemetry summarising local vs remote invocation ratios for adoption dashboards.
