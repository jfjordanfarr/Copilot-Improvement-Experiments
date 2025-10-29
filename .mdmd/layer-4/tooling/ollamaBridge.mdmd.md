# Ollama Bridge Tooling (Layer 4)

## Purpose
Provide a deterministic path for integration tests and local dogfooding to issue Ollama chat requests without depending on marketplace extensions. The bridge wraps shared helpers so both the VS Code extension and harness scripts can talk to a workspace-local Ollama server (or emit reproducible mock responses when none is available).

## Source Mapping
- Runtime fallback: [`packages/extension/src/services/localOllamaBridge.ts`](../../../packages/extension/src/services/localOllamaBridge.ts)
- CLI entrypoint: [`scripts/ollama/run-chat.ts`](../../../scripts/ollama/run-chat.ts)
- Shared utilities: [`packages/shared/src/tooling/ollamaClient.ts`](../../../packages/shared/src/tooling/ollamaClient.ts), [`packages/shared/src/tooling/ollamaEndpoint.ts`](../../../packages/shared/src/tooling/ollamaEndpoint.ts), [`packages/shared/src/tooling/ollamaMock.ts`](../../../packages/shared/src/tooling/ollamaMock.ts)

## Behaviour
- `resolveOllamaEndpoint` consults environment overrides (`LINK_AWARE_OLLAMA_ENDPOINT`, `OLLAMA_ENDPOINT`) and VS Code settings (`github.copilot.chat.byok.ollamaEndpoint`) before falling back to `http://localhost:11434`.
- `invokeLocalOllamaBridge` is invoked when `llmProviderMode === "local-only"` and no `vscode.lm` chat models are registered. It forwards prompts to the shared `invokeOllamaChat` helper and captures usage metadata for telemetry. When no model is configured or the request fails, it emits the deterministic mock payload from `createMockOllamaResponse`, keeping relationship extraction JSON-valid (`relationships: []`).
- `scripts/ollama/run-chat.ts` mirrors the same helper chain for command-line usage. Prompts arrive via stdin, responses stream to stdout, and failures fall back to the mock payload so Shell orchestration remains deterministic.
- When `LINK_AWARE_OLLAMA_TRACE_DIR` is defined, `invokeOllamaChat` persists request/response transcripts (prompt, model, usage, errors) to timestamped JSON files, enabling post-run forensic analysis of LLM outputs. The integration harness defaults this to `AI-Agent-Workspace/ollama-traces` unless overridden.

## API Surface
- [`OllamaChatRequest`](../../../packages/shared/src/tooling/ollamaClient.ts) / [`OllamaChatResult`](../../../packages/shared/src/tooling/ollamaClient.ts) / [`OllamaChatUsage`](../../../packages/shared/src/tooling/ollamaClient.ts) capture the REST payload shape and telemetry we emit to the benchmark pipeline.
- [`OllamaInvocationError`](../../../packages/shared/src/tooling/ollamaClient.ts) normalises network and protocol failures so both the extension and CLI can offer deterministic fallbacks.
- [`ResolveOllamaEndpointOptions`](../../../packages/shared/src/tooling/ollamaEndpoint.ts) and [`WorkspaceConfigurationLike`](../../../packages/shared/src/tooling/ollamaEndpoint.ts) abstract VS Code configuration lookups for the shared endpoint resolver.
- [`MockOllamaResponse`](../../../packages/shared/src/tooling/ollamaMock.ts) and [`CreateMockOllamaResponseOptions`](../../../packages/shared/src/tooling/ollamaMock.ts) describe the deterministic payload emitted when a model is unavailable or an invocation fails.

## Evidence
- Unit coverage: [`packages/extension/src/services/localOllamaBridge.test.ts`](../../../packages/extension/src/services/localOllamaBridge.test.ts)
- Integration harness wiring: [`tests/integration/vscode/runTests.ts`](../../../tests/integration/vscode/runTests.ts) pins `LINK_AWARE_PROVIDER_MODE=local-only` and defers model selection to environment variables or workspace settings (`github.copilot.chat.byok.ollamaModel`), keeping bridge execution deterministic while avoiding misleading pull prompts.
- Benchmark metadata includes provider hints via [`tests/integration/benchmarks/utils/benchmarkRecorder.ts`](../../../tests/integration/benchmarks/utils/benchmarkRecorder.ts), recording which bridge configuration produced each artifact.
