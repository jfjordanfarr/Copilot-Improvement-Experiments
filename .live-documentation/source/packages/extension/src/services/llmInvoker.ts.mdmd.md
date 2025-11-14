# packages/extension/src/services/llmInvoker.ts

## Metadata
- Layer: 4
- Archetype: implementation
- Code Path: packages/extension/src/services/llmInvoker.ts
- Live Doc ID: LD-implementation-packages-extension-src-services-llminvoker-ts
- Generated At: 2025-11-14T18:42:06.225Z

## Authored
### Purpose
Wraps VS Code's language model APIs so Link-Aware Diagnostics can invoke chat models according to workspace settings.

### Notes
- Reads `llmProviderMode` to block disabled workspaces, filter for local-only models, or prompt users to pick a model interactively.
- Remembers the last successful model id to avoid repeated quick picks and streams response chunks into a single string payload.
- Surfaces structured failure reasons to callers, enabling fallbacks such as the local Ollama bridge when no eligible models are available.

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-14T18:42:06.225Z","inputHash":"c16fcf9c9e2cee78"}]} -->
<!-- LIVE-DOC:BEGIN Public Symbols -->
### Public Symbols
#### `LlmProviderMode`
- Type: type
- Source: [source](../../../../../../packages/extension/src/services/llmInvoker.ts#L5)

#### `LlmInvocationFailureReason`
- Type: type
- Source: [source](../../../../../../packages/extension/src/services/llmInvoker.ts#L7)

#### `LlmInvocationError`
- Type: class
- Source: [source](../../../../../../packages/extension/src/services/llmInvoker.ts#L9)

#### `InvokeChatOptions`
- Type: interface
- Source: [source](../../../../../../packages/extension/src/services/llmInvoker.ts#L16)

#### `InvokeChatResult`
- Type: interface
- Source: [source](../../../../../../packages/extension/src/services/llmInvoker.ts#L25)

#### `LlmInvoker`
- Type: class
- Source: [source](../../../../../../packages/extension/src/services/llmInvoker.ts#L30)
<!-- LIVE-DOC:END Public Symbols -->

<!-- LIVE-DOC:BEGIN Dependencies -->
### Dependencies
- [`configService.LinkDiagnosticsSettings`](../settings/configService.ts.mdmd.md#linkdiagnosticssettings) (type-only)
- `vscode` - `vscode`
<!-- LIVE-DOC:END Dependencies -->

<!-- LIVE-DOC:BEGIN Observed Evidence -->
### Observed Evidence
#### Vitest Unit Tests
- [analyzeWithAI.test.ts](../commands/analyzeWithAI.test.ts.mdmd.md)
<!-- LIVE-DOC:END Observed Evidence -->
