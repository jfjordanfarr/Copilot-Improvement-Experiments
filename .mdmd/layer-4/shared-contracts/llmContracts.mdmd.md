# LLM Invocation Contracts (Layer 4)

## Source Mapping
- Implementation: [`packages/shared/src/contracts/llm.ts`](../../../packages/shared/src/contracts/llm.ts)
- Re-export: [`packages/shared/src/index.ts`](../../../packages/shared/src/index.ts)
- Parent designs: [LLM Ingestion Pipeline](../../layer-3/llm-ingestion-pipeline.mdmd.md), [Extension Surfaces Architecture](../../layer-3/extension-surfaces.mdmd.md)

## Purpose
Define the language server ↔ extension contract for model invocation requests so both sides share the same identifiers and payload shapes. These interfaces allow the server to delegate language model work to the extension host (and eventually other providers) while keeping usage accounting and prompt metadata consistent.

## Public Interfaces
- `INVOKE_LLM_REQUEST` – Request id used by the language server when forwarding ingestion prompts to the client.
- `InvokeLlmRequest` – Carries the prompt text plus optional JSON schema and telemetry tags to help providers enforce structured outputs.
- `InvokeLlmResult` – Reports the model response (string or already-parsed object), the provider-resolved `modelId`, and optional `usage` metrics (`promptTokens`, `completionTokens`, etc.).

## Integration Notes
- The server-side [`createDefaultRelationshipExtractor`](../../layer-4/llm-ingestion/llmIngestionManager.mdmd.md) sends `InvokeLlmRequest` messages when provider mode permits live ingestion.
- The extension routes `INVOKE_LLM_REQUEST` through [`LlmInvoker`](../../layer-4/extension-services/llmInvoker.mdmd.md) so workspace settings, Quick Pick selection, and telemetry tags remain consistent.
- `InvokeLlmResult.usage` mirrors the shared `ModelUsage` type from the relationship extractor, enabling ingestion metrics to flow through unchanged.

## Evidence
- Exercised indirectly via [`packages/server/src/runtime/llmIngestion.ts`](../../../packages/server/src/runtime/llmIngestion.ts) unit coverage (see [`relationshipExtractor.test.ts`](../../../packages/shared/src/inference/llm/relationshipExtractor.test.ts)) and the new [`Analyze With AI`](../extension-commands/analyzeWithAI.mdmd.md) command, which share the same request/response contract during live runs.
