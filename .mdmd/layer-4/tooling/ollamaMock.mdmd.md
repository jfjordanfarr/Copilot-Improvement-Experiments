# Ollama Mock Helpers

## Metadata
- Layer: 4
- Code Path: [`packages/shared/src/tooling/ollamaMock.ts`](../../../packages/shared/src/tooling/ollamaMock.ts)
- Exports: createMockOllamaResponse, CreateMockOllamaResponseOptions, MockOllamaResponse
- Parent designs: [LLM Ingestion Pipeline](../../layer-3/llm-ingestion-pipeline.mdmd.md)

## Purpose
Supply deterministic JSON responses that mimic the Ollama chat API so ingestion, audit, and extension flows can continue operating when no local model is available.

## Public Symbols

### createMockOllamaResponse
Generates a JSON payload with empty `relationships`, an explanatory rationale, and an echo of the prompt (capped to 256 characters) while synthesising token usage metrics.

### CreateMockOllamaResponseOptions
Optional overrides for `createMockOllamaResponse`, allowing tests to specify the model id or rationale text when asserting telemetry.

### MockOllamaResponse
Return shape produced by the factory—serialised `responseText`, resolved `modelId`, and `OllamaChatUsage` metrics.

## Responsibilities
- Provide deterministic mock data that respects usage accounting so telemetry dashboards remain coherent during offline development.
- Avoid throwing on malformed prompts by coercing undefined input into an empty string.
- Keep payload size bounded via prompt truncation, preventing excessive disk usage when traces are written; emitted payloads default to the `ollama-mock` identifier unless overridden.

## Collaborators
- [`packages/shared/src/tooling/ollamaClient.ts`](../../../packages/shared/src/tooling/ollamaClient.ts) defines the shared usage shape consumed by the mock.
- [`packages/extension/src/services/localOllamaBridge.ts`](../../../packages/extension/src/services/localOllamaBridge.ts) invokes the mock when real provider calls fail.

## Linked Components
- [COMP-006 – LLM Ingestion Pipeline](../../layer-3/llm-ingestion-pipeline.mdmd.md)

## Evidence
- Covered indirectly via `localOllamaBridge.test.ts`, which confirms fallback payloads remain JSON-parseable and propagate usage metrics.
- Manual check: unset `LINK_AWARE_OLLAMA_ENDPOINT` and run `npm run graph:audit` to observe deterministic mock responses recorded under `AI-Agent-Workspace/ollama-traces`.
