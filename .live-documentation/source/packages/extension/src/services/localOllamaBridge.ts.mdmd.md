# packages/extension/src/services/localOllamaBridge.ts

## Metadata
- Layer: 4
- Archetype: implementation
- Code Path: packages/extension/src/services/localOllamaBridge.ts
- Live Doc ID: LD-implementation-packages-extension-src-services-localollamabridge-ts
- Generated At: 2025-11-09T22:52:09.728Z

## Authored
### Purpose
Invokes a workspace-local Ollama endpoint when the primary LLM provider is unavailable, keeping ingestion workflows unblocked.

### Notes
- Reads model and context window overrides from environment variables or the Copilot BYOK setting before constructing the Ollama request.
- Falls back to deterministic mock responses when no model is configured or the request fails, preserving reproducible integration tests.
- Logs actionable warnings for missing models so operators know to `ollama pull` or adjust configuration.

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-09T22:52:09.728Z","inputHash":"3dae011413424993"}]} -->
<!-- LIVE-DOC:BEGIN Public Symbols -->
### Public Symbols
#### `invokeLocalOllamaBridge`
- Type: function
- Source: [source](../../../../../../packages/extension/src/services/localOllamaBridge.ts#L22)
- Summary: Attempt to call a workspace-local Ollama server. Falls back to a deterministic mock response when
the model is undefined or the request fails so integration tests stay reproducible.
<!-- LIVE-DOC:END Public Symbols -->

<!-- LIVE-DOC:BEGIN Dependencies -->
### Dependencies
- `@copilot-improvement/shared` - `InvokeLlmResult`, `OllamaInvocationError`, `createMockOllamaResponse`, `invokeOllamaChat`, `resolveOllamaEndpoint`
- `vscode` - `vscode`
<!-- LIVE-DOC:END Dependencies -->

<!-- LIVE-DOC:BEGIN Observed Evidence -->
### Observed Evidence
#### Vitest Unit Tests
- [localOllamaBridge.test.ts](./localOllamaBridge.test.ts.mdmd.md)
<!-- LIVE-DOC:END Observed Evidence -->
