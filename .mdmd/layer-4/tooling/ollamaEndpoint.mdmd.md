# Ollama Endpoint Resolver

## Metadata
- Layer: 4
- Code Path: [`packages/shared/src/tooling/ollamaEndpoint.ts`](../../../packages/shared/src/tooling/ollamaEndpoint.ts)
- Exports: resolveOllamaEndpoint, ResolveOllamaEndpointOptions, WorkspaceConfigurationLike
- Parent designs: [LLM Ingestion Pipeline](../../layer-3/llm-ingestion-pipeline.mdmd.md)

## Purpose
Determine the Ollama base URL for both CLI tooling and the VS Code extension by honouring environment overrides, workspace settings, and predictable fallbacks.

## Public Symbols

### resolveOllamaEndpoint
Resolves the endpoint using precedence order: explicit environment variables, BYOK workspace configuration, optional fallback provided by the caller, and finally the baked-in default.

### ResolveOllamaEndpointOptions
Call signature that injects the workspace configuration reader, custom environment variables (useful in tests), and optional fallback endpoint.

### WorkspaceConfigurationLike
Minimal subset of the VS Code configuration API used to read `github.copilot.chat.byok.ollamaEndpoint` without importing the full VS Code type surface.

## Responsibilities
- Normalise environment variables and trim whitespace before returning a candidate endpoint.
- Keep the resolver framework-agnostic so server scripts, extension code, and tests can share the same logic.
- Provide a safe default that works with the standard Ollama daemon configuration (currently `http://localhost:11434`).

## Collaborators
- [`packages/extension/src/services/localOllamaBridge.ts`](../../../packages/extension/src/services/localOllamaBridge.ts) uses the resolver to align extension invocations with CLI behaviour.
- [`packages/shared/src/tooling/ollamaClient.ts`](../../../packages/shared/src/tooling/ollamaClient.ts) consumes the resolved endpoint when issuing requests.

## Linked Components
- [COMP-006 – LLM Ingestion Pipeline](../../layer-3/llm-ingestion-pipeline.mdmd.md)

## Evidence
- Exercised by `localOllamaBridge.test.ts`, which stubs configuration and environment variables to verify precedence.
- Manual validation: adjusting `LINK_AWARE_OLLAMA_ENDPOINT` or the VS Code BYOK setting immediately redirects CLI invocations using `scripts/ollama/run-chat.ts`.
