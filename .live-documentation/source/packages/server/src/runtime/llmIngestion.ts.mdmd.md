# packages/server/src/runtime/llmIngestion.ts

## Metadata
- Layer: 4
- Archetype: implementation
- Code Path: packages/server/src/runtime/llmIngestion.ts
- Live Doc ID: LD-implementation-packages-server-src-runtime-llmingestion-ts
- Generated At: 2025-11-09T22:52:11.445Z

## Authored
### Purpose
Queues artifacts for LLM-powered relationship extraction and provides a default model invoker that honours operator LLM preferences.

### Notes
- `LlmIngestionManager` deduplicates concurrent runs, draining the orchestrator until the queue is empty while logging stored/skipped outcomes.
- Emits console diagnostics when model invocations fail or when provider mode disables requests, keeping operators aware of ingestion state.
- `createDefaultRelationshipExtractor` wraps the language server connection’s `INVOKE_LLM_REQUEST`, tagging logs and enforcing `llmProviderMode` before forwarding prompts.

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-09T22:52:11.445Z","inputHash":"46a4fcc65a9e2cf8"}]} -->
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
- `@copilot-improvement/shared` - `INVOKE_LLM_REQUEST`, `InvokeLlmRequest`, `InvokeLlmResult`, `ModelInvoker`, `RelationshipExtractor`
- [`llmIngestionOrchestrator.LlmIngestionOrchestrator`](../features/knowledge/llmIngestionOrchestrator.ts.mdmd.md#llmingestionorchestrator)
- [`llmIngestionOrchestrator.LlmIngestionResult`](../features/knowledge/llmIngestionOrchestrator.ts.mdmd.md#llmingestionresult)
- [`providerGuard.ProviderGuard`](../features/settings/providerGuard.ts.mdmd.md#providerguard) (type-only)
- `vscode-languageserver/node` - `Connection` (type-only)
<!-- LIVE-DOC:END Dependencies -->
