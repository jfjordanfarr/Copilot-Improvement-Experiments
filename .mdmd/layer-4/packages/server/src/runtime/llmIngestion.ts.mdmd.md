# packages/server/src/runtime/llmIngestion.ts

## Metadata
- Layer: 4
- Archetype: implementation
- Code Path: packages/server/src/runtime/llmIngestion.ts
- Live Doc ID: LD-implementation-packages-server-src-runtime-llmingestion-ts
- Generated At: 2025-11-16T22:35:16.453Z

## Authored
### Purpose
_Pending authored purpose_

### Notes
_Pending notes_

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
