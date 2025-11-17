# packages/server/src/runtime/llmIngestion.ts

## Metadata
- Layer: 4
- Archetype: implementation
- Code Path: packages/server/src/runtime/llmIngestion.ts
- Live Doc ID: LD-implementation-packages-server-src-runtime-llmingestion-ts
- Generated At: 2025-11-16T22:35:16.453Z

## Authored
### Purpose
Runs the language-server side of the Analyze-with-AI pipeline, queuing artifacts for `LlmIngestionOrchestrator` and relaying `INVOKE_LLM_REQUEST` calls back to the extension so AI assessments get persisted, a workflow introduced in [AI-Agent-Workspace/ChatHistory/2025/10/Summarized/2025-10-26.SUMMARIZED.md#turn-13-analyze-with-ai-command-lands-lines-1501-2000](../../../../../../../AI-Agent-Workspace/ChatHistory/2025/10/Summarized/2025-10-26.SUMMARIZED.md#turn-13-analyze-with-ai-command-lands-lines-1501-2000).

### Notes
`createDefaultRelationshipExtractor` gates remote invocation behind `providerGuard` so disabled or local-only modes short-circuit gracefully; tune the provider policy alongside the analyzer contract touched in [AI-Agent-Workspace/ChatHistory/2025/10/2025-10-26.md#L1754-L1789](../../../../../../../AI-Agent-Workspace/ChatHistory/2025/10/2025-10-26.md#L1754-L1789) to avoid regressions. Logging only emits the first successful dispatch per session to keep the extension host output readable while still surfacing failures during the ingestion loop.

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-16T22:35:16.453Z","inputHash":"b335f1dc67a2812c"}]} -->
<!-- LIVE-DOC:BEGIN Public Symbols -->
### Public Symbols
#### `LlmIngestionManagerOptions`
- Type: interface
- Source: [source](../../../../../../packages/server/src/runtime/llmIngestion.ts#L14)

#### `LlmIngestionManager`
- Type: class
- Source: [source](../../../../../../packages/server/src/runtime/llmIngestion.ts#L19)

#### `CreateRelationshipExtractorOptions`
- Type: interface
- Source: [source](../../../../../../packages/server/src/runtime/llmIngestion.ts#L80)

#### `createDefaultRelationshipExtractor`
- Type: function
- Source: [source](../../../../../../packages/server/src/runtime/llmIngestion.ts#L85)
<!-- LIVE-DOC:END Public Symbols -->

<!-- LIVE-DOC:BEGIN Dependencies -->
### Dependencies
- [`llmIngestionOrchestrator.LlmIngestionOrchestrator`](../features/knowledge/llmIngestionOrchestrator.ts.mdmd.md#llmingestionorchestrator)
- [`llmIngestionOrchestrator.LlmIngestionResult`](../features/knowledge/llmIngestionOrchestrator.ts.mdmd.md#llmingestionresult)
- [`providerGuard.ProviderGuard`](../features/settings/providerGuard.ts.mdmd.md#providerguard) (type-only)
- [`index.INVOKE_LLM_REQUEST`](../../../shared/src/index.ts.mdmd.md#invoke_llm_request)
- [`index.InvokeLlmRequest`](../../../shared/src/index.ts.mdmd.md#invokellmrequest)
- [`index.InvokeLlmResult`](../../../shared/src/index.ts.mdmd.md#invokellmresult)
- [`index.ModelInvoker`](../../../shared/src/index.ts.mdmd.md#modelinvoker)
- [`index.RelationshipExtractor`](../../../shared/src/index.ts.mdmd.md#relationshipextractor)
- `vscode-languageserver/node` - `Connection` (type-only)
<!-- LIVE-DOC:END Dependencies -->
