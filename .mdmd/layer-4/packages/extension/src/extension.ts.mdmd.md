# packages/extension/src/extension.ts

## Metadata
- Layer: 4
- Archetype: implementation
- Code Path: packages/extension/src/extension.ts
- Live Doc ID: LD-implementation-packages-extension-src-extension-ts
- Generated At: 2025-11-16T22:35:14.604Z

## Authored
### Purpose
_Pending authored purpose_

### Notes
_Pending notes_

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-16T22:35:14.604Z","inputHash":"5df48b8aa70605e1"}]} -->
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
- [`index.FEEDS_READY_REQUEST`](../../shared/src/index.ts.mdmd.md#feeds_ready_request)
- [`index.FeedsReadyResult`](../../shared/src/index.ts.mdmd.md#feedsreadyresult)
- [`index.INVOKE_LLM_REQUEST`](../../shared/src/index.ts.mdmd.md#invoke_llm_request)
- [`index.InvokeLlmRequest`](../../shared/src/index.ts.mdmd.md#invokellmrequest)
- [`index.InvokeLlmResult`](../../shared/src/index.ts.mdmd.md#invokellmresult)
- [`index.RESET_DIAGNOSTIC_STATE_NOTIFICATION`](../../shared/src/index.ts.mdmd.md#reset_diagnostic_state_notification)
- [`index.RebindRequiredPayload`](../../shared/src/index.ts.mdmd.md#rebindrequiredpayload)
- `path` - `path`
- `process` - `process`
- `vscode` - `vscode`
- `vscode-languageclient/node` - `LanguageClient`, `LanguageClientOptions`, `ServerOptions`, `TransportKind`
<!-- LIVE-DOC:END Dependencies -->
