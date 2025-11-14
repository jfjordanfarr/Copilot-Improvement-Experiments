# packages/extension/src/extension.ts

## Metadata
- Layer: 4
- Archetype: implementation
- Code Path: packages/extension/src/extension.ts
- Live Doc ID: LD-implementation-packages-extension-src-extension-ts
- Generated At: 2025-11-14T16:30:21.019Z

## Authored
### Purpose
Bootstraps the Link-Aware Diagnostics VS Code extension by launching the language client, wiring extension commands, and synchronizing configuration with the server.

### Notes
- Builds language client options from workspace settings, orchestrates provider onboarding, and starts the Node-based server entry point with test-friendly overrides.
- Forwards config changes, diagnostics resets, LLM invocation requests, and maintenance notifications between VS Code and the language server, including fallback logic for local Ollama usage.
- Registers the full suite of commands, tree views, quick picks, and watchers that make up the extension UX, plus a diagnostics listener that preloads affected markdown files for drift review.

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-14T16:30:21.019Z","inputHash":"020df86a11708b8f"}]} -->
<!-- LIVE-DOC:BEGIN Public Symbols -->
### Public Symbols
#### `activate`
- Type: function
- Source: [source](../../../../../packages/extension/src/extension.ts#L45)

#### `deactivate`
- Type: function
- Source: [source](../../../../../packages/extension/src/extension.ts#L285)
<!-- LIVE-DOC:END Public Symbols -->

<!-- LIVE-DOC:BEGIN Dependencies -->
### Dependencies
- `@copilot-improvement/shared` - `FEEDS_READY_REQUEST`, `FeedsReadyResult`, `INVOKE_LLM_REQUEST`, `InvokeLlmRequest`, `InvokeLlmResult`, `RESET_DIAGNOSTIC_STATE_NOTIFICATION`, `RebindRequiredPayload`
- [`acknowledgeDiagnostic.registerAcknowledgementWorkflow`](./commands/acknowledgeDiagnostic.ts.mdmd.md#registeracknowledgementworkflow)
- [`analyzeWithAI.registerAnalyzeWithAICommand`](./commands/analyzeWithAI.ts.mdmd.md#registeranalyzewithaicommand)
- [`exportDiagnostics.registerExportDiagnosticsCommand`](./commands/exportDiagnostics.ts.mdmd.md#registerexportdiagnosticscommand)
- [`inspectSymbolNeighbors.registerInspectSymbolNeighborsCommand`](./commands/inspectSymbolNeighbors.ts.mdmd.md#registerinspectsymbolneighborscommand)
- [`latencySummary.registerLatencyTelemetryCommands`](./commands/latencySummary.ts.mdmd.md#registerlatencytelemetrycommands)
- [`overrideLink.registerOverrideLinkCommand`](./commands/overrideLink.ts.mdmd.md#registeroverridelinkcommand)
- [`dependencyQuickPick.registerDependencyQuickPick`](./diagnostics/dependencyQuickPick.ts.mdmd.md#registerdependencyquickpick)
- [`docDiagnosticProvider.registerDocDiagnosticProvider`](./diagnostics/docDiagnosticProvider.ts.mdmd.md#registerdocdiagnosticprovider)
- [`providerGate.ensureProviderSelection`](./onboarding/providerGate.ts.mdmd.md#ensureproviderselection)
- [`rebindPrompt.showRebindPrompt`](./prompts/rebindPrompt.ts.mdmd.md#showrebindprompt)
- [`llmInvoker.LlmInvocationError`](./services/llmInvoker.ts.mdmd.md#llminvocationerror)
- [`llmInvoker.LlmInvoker`](./services/llmInvoker.ts.mdmd.md#llminvoker)
- [`localOllamaBridge.invokeLocalOllamaBridge`](./services/localOllamaBridge.ts.mdmd.md#invokelocalollamabridge)
- [`symbolBridge.registerSymbolBridge`](./services/symbolBridge.ts.mdmd.md#registersymbolbridge)
- [`configService.ConfigService`](./settings/configService.ts.mdmd.md#configservice)
- [`diagnosticsTree.registerDiagnosticsTreeView`](./views/diagnosticsTree.ts.mdmd.md#registerdiagnosticstreeview)
- [`fileMaintenance.registerFileMaintenanceWatcher`](./watchers/fileMaintenance.ts.mdmd.md#registerfilemaintenancewatcher)
- `path` - `path`
- `process` - `process`
- `vscode` - `vscode`
- `vscode-languageclient/node` - `LanguageClient`, `LanguageClientOptions`, `ServerOptions`, `TransportKind`
<!-- LIVE-DOC:END Dependencies -->
