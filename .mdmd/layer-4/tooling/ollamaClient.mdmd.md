# Ollama Client

## Metadata
- Layer: 4
- Code Path: [`packages/shared/src/tooling/ollamaClient.ts`](../../../packages/shared/src/tooling/ollamaClient.ts)
- Exports: invokeOllamaChat, OllamaChatRequest, OllamaChatResult, OllamaChatUsage, OllamaInvocationError
- Parent designs: [LLM Ingestion Pipeline](../../layer-3/llm-ingestion-pipeline.mdmd.md)
- Collaborating docs: [Ollama Bridge Tooling](./ollamaBridge.mdmd.md)

## Purpose
Provide a Node-friendly client for the Ollama `/api/chat` endpoint that standardises request shaping, timeout handling, usage telemetry, and structured error reporting for ingestion pipelines, CLI scripts, and extension services.

## Public Symbols

### invokeOllamaChat
Primary async helper that POSTs a chat-completion request, enforces deterministic defaults (temperature, top_p, non-streaming), records optional traces, and returns the provider response text plus usage metrics.

### OllamaChatRequest
Configuration surface for `invokeOllamaChat`, including endpoint, model id, prompt text, optional system prompt, timeout, context window, and provider-specific overrides.

### OllamaChatResult
Structured result emitted by the client: response text, resolved model identifier, and optional token usage summary.

### OllamaChatUsage
Token accounting payload extracted from Ollama responses (`prompt_eval_count`, `eval_count`) so telemetry dashboards can report utilisation.

### OllamaInvocationError
Error subclass raised when the client cannot reach Ollama, receives an error payload, or encounters malformed responses. Captures an optional cause to aid diagnostics.

## Responsibilities
- Resolve the global `fetch` implementation and guard against runtimes that lack it.
- Apply deterministic defaults (system prompt, temperature, top_p) so local inference stays consistent across hosts.
- Surface per-call traces when `LINK_AWARE_OLLAMA_TRACE_DIR` is configured, writing JSON blobs that capture request/response metadata.
- Normalise provider responses, wrapping errors with actionable messages and usage data.

## Collaborators
- [`packages/shared/src/tooling/ollamaEndpoint.ts`](../../../packages/shared/src/tooling/ollamaEndpoint.ts) selects the appropriate endpoint prior to invocation.
- [`packages/shared/src/tooling/ollamaMock.ts`](../../../packages/shared/src/tooling/ollamaMock.ts) produces deterministic fallbacks when providers are offline.
- [`packages/extension/src/services/localOllamaBridge.ts`](../../../packages/extension/src/services/localOllamaBridge.ts) consumes this client for in-editor invocations.

## Linked Components
- [COMP-006 – LLM Ingestion Pipeline](../../layer-3/llm-ingestion-pipeline.mdmd.md)

## Evidence
- Exercised indirectly via [`packages/extension/src/services/localOllamaBridge.test.ts`](../../../packages/extension/src/services/localOllamaBridge.test.ts), which stubs network calls and validates error propagation.
- Manual verification: `npm run ollama:chat` (see `scripts/ollama/run-chat.ts`) demonstrates deterministic request shaping and trace persistence.
