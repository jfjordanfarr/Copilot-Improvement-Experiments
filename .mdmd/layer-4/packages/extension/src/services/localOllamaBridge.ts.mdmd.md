# packages/extension/src/services/localOllamaBridge.ts

## Metadata
- Layer: 4
- Archetype: implementation
- Code Path: packages/extension/src/services/localOllamaBridge.ts
- Live Doc ID: LD-implementation-packages-extension-src-services-localollamabridge-ts
- Generated At: 2025-11-16T22:35:14.702Z

## Authored
### Purpose
_Pending authored purpose_

### Notes
_Pending notes_

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-16T22:35:14.702Z","inputHash":"7b0010c0ca14db54"}]} -->
<!-- LIVE-DOC:BEGIN Public Symbols -->
### Public Symbols
#### `invokeLocalOllamaBridge`
- Type: function
- Source: [source](../../../../../../packages/extension/src/services/localOllamaBridge.ts#L22)

##### `invokeLocalOllamaBridge` — Summary
Attempt to call a workspace-local Ollama server. Falls back to a deterministic mock response when
the model is undefined or the request fails so integration tests stay reproducible.
<!-- LIVE-DOC:END Public Symbols -->

<!-- LIVE-DOC:BEGIN Dependencies -->
### Dependencies
- [`index.InvokeLlmResult`](../../../shared/src/index.ts.mdmd.md#invokellmresult)
- [`index.OllamaInvocationError`](../../../shared/src/index.ts.mdmd.md#ollamainvocationerror)
- [`index.createMockOllamaResponse`](../../../shared/src/index.ts.mdmd.md#createmockollamaresponse)
- [`index.invokeOllamaChat`](../../../shared/src/index.ts.mdmd.md#invokeollamachat)
- [`index.resolveOllamaEndpoint`](../../../shared/src/index.ts.mdmd.md#resolveollamaendpoint)
- `vscode` - `vscode`
<!-- LIVE-DOC:END Dependencies -->

<!-- LIVE-DOC:BEGIN Observed Evidence -->
### Observed Evidence
#### Vitest Unit Tests
- [localOllamaBridge.test.ts](./localOllamaBridge.test.ts.mdmd.md)
<!-- LIVE-DOC:END Observed Evidence -->
