# packages/extension/src/commands/analyzeWithAI.ts

## Metadata
- Layer: 4
- Archetype: implementation
- Code Path: packages/extension/src/commands/analyzeWithAI.ts
- Live Doc ID: LD-implementation-packages-extension-src-commands-analyzewithai-ts
- Generated At: 2025-11-09T22:52:09.254Z

## Authored
### Purpose
Provides the `linkDiagnostics.analyzeWithAI` command that lets maintainers request an AI-generated remediation plan for a selected outstanding diagnostic.

### Notes
- Checks Link-Aware Diagnostics settings before offering the command and surfaces helpful messaging when AI providers are disabled or no diagnostics remain.
- Pulls the latest diagnostics snapshot from the language server, gathers surrounding file content for the chosen record, and crafts a reproducible prompt tagged with a stable hash.
- Invokes the configured `LlmInvoker`, validates the JSON response, and persists the structured assessment via the server API before refreshing tree views and notifying the user.

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-09T22:52:09.254Z","inputHash":"b9197eff6864631a"}]} -->
<!-- LIVE-DOC:BEGIN Public Symbols -->
### Public Symbols
#### `registerAnalyzeWithAICommand`
- Type: function
- Source: [source](../../../../../../packages/extension/src/commands/analyzeWithAI.ts#L31)
<!-- LIVE-DOC:END Public Symbols -->

<!-- LIVE-DOC:BEGIN Dependencies -->
### Dependencies
- `@copilot-improvement/shared` - `LIST_OUTSTANDING_DIAGNOSTICS_REQUEST`, `ListOutstandingDiagnosticsResult`, `OutstandingDiagnosticSummary`, `SET_DIAGNOSTIC_ASSESSMENT_REQUEST`, `SetDiagnosticAssessmentParams`, `SetDiagnosticAssessmentResult`
- `node:crypto` - `createHash`
- [`llmInvoker.InvokeChatResult`](../services/llmInvoker.ts.mdmd.md#invokechatresult)
- [`llmInvoker.LlmInvocationError`](../services/llmInvoker.ts.mdmd.md#llminvocationerror)
- [`llmInvoker.LlmInvoker`](../services/llmInvoker.ts.mdmd.md#llminvoker)
- [`configService.LinkDiagnosticsSettings`](../settings/configService.ts.mdmd.md#linkdiagnosticssettings) (type-only)
- `vscode` - `vscode`
- `vscode-languageclient/node` - `LanguageClient`
<!-- LIVE-DOC:END Dependencies -->

<!-- LIVE-DOC:BEGIN Observed Evidence -->
### Observed Evidence
#### Vitest Unit Tests
- [analyzeWithAI.test.ts](./analyzeWithAI.test.ts.mdmd.md)
<!-- LIVE-DOC:END Observed Evidence -->
