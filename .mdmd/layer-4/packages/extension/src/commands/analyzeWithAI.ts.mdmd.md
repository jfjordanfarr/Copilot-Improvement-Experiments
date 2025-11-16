# packages/extension/src/commands/analyzeWithAI.ts

## Metadata
- Layer: 4
- Archetype: implementation
- Code Path: packages/extension/src/commands/analyzeWithAI.ts
- Live Doc ID: LD-implementation-packages-extension-src-commands-analyzewithai-ts
- Generated At: 2025-11-16T22:35:14.257Z

## Authored
### Purpose
_Pending authored purpose_

### Notes
_Pending notes_

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-16T22:35:14.257Z","inputHash":"b9bb70b883085fd4"}]} -->
<!-- LIVE-DOC:BEGIN Public Symbols -->
### Public Symbols
#### `registerAnalyzeWithAICommand`
- Type: function
- Source: [source](../../../../../../packages/extension/src/commands/analyzeWithAI.ts#L31)
<!-- LIVE-DOC:END Public Symbols -->

<!-- LIVE-DOC:BEGIN Dependencies -->
### Dependencies
- `node:crypto` - `createHash`
- [`llmInvoker.InvokeChatResult`](../services/llmInvoker.ts.mdmd.md#invokechatresult)
- [`llmInvoker.LlmInvocationError`](../services/llmInvoker.ts.mdmd.md#llminvocationerror)
- [`llmInvoker.LlmInvoker`](../services/llmInvoker.ts.mdmd.md#llminvoker)
- [`configService.LinkDiagnosticsSettings`](../settings/configService.ts.mdmd.md#linkdiagnosticssettings) (type-only)
- [`index.LIST_OUTSTANDING_DIAGNOSTICS_REQUEST`](../../../shared/src/index.ts.mdmd.md#list_outstanding_diagnostics_request)
- [`index.ListOutstandingDiagnosticsResult`](../../../shared/src/index.ts.mdmd.md#listoutstandingdiagnosticsresult)
- [`index.OutstandingDiagnosticSummary`](../../../shared/src/index.ts.mdmd.md#outstandingdiagnosticsummary)
- [`index.SET_DIAGNOSTIC_ASSESSMENT_REQUEST`](../../../shared/src/index.ts.mdmd.md#set_diagnostic_assessment_request)
- [`index.SetDiagnosticAssessmentParams`](../../../shared/src/index.ts.mdmd.md#setdiagnosticassessmentparams)
- [`index.SetDiagnosticAssessmentResult`](../../../shared/src/index.ts.mdmd.md#setdiagnosticassessmentresult)
- `vscode` - `vscode`
- `vscode-languageclient/node` - `LanguageClient`
<!-- LIVE-DOC:END Dependencies -->

<!-- LIVE-DOC:BEGIN Observed Evidence -->
### Observed Evidence
#### Vitest Unit Tests
- [analyzeWithAI.test.ts](./analyzeWithAI.test.ts.mdmd.md)
<!-- LIVE-DOC:END Observed Evidence -->
