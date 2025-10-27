# LLM Invocation Contracts (Layer 4)

## Source Mapping
- Implementation: [`packages/shared/src/contracts/llm.ts`](../../../packages/shared/src/contracts/llm.ts)
- Re-export: [`packages/shared/src/index.ts`](../../../packages/shared/src/index.ts)
- Parent designs: [LLM Ingestion Pipeline](../../layer-3/llm-ingestion-pipeline.mdmd.md), [Extension Surfaces Architecture](../../layer-3/extension-surfaces.mdmd.md)

## Exported Symbols

#### INVOKE_LLM_REQUEST
`INVOKE_LLM_REQUEST` is the request identifier used when the server delegates model invocations to the extension.

#### InvokeLlmRequest
`InvokeLlmRequest` packages the prompt, optional JSON schema, and telemetry tags for an invocation.

#### InvokeLlmResult
`InvokeLlmResult` returns the model response payload, resolved model id, and optional usage metrics.

## Purpose
Define the language server ↔ extension contract for model invocation requests so both sides share the same identifiers and payload shapes. These interfaces allow the server to delegate language model work to the extension host (and eventually other providers) while keeping usage accounting and prompt metadata consistent.

## Integration Notes
- The server-side [`createDefaultRelationshipExtractor`](../../layer-4/llm-ingestion/llmIngestionManager.mdmd.md) sends `InvokeLlmRequest` messages when provider mode permits live ingestion.
- The extension routes `INVOKE_LLM_REQUEST` through [`LlmInvoker`](../../layer-4/extension-services/llmInvoker.mdmd.md) so workspace settings, Quick Pick selection, and telemetry tags remain consistent.
- `InvokeLlmResult.usage` mirrors the shared `ModelUsage` type from the relationship extractor, enabling ingestion metrics to flow through unchanged.

## Evidence
- Exercised indirectly via [`packages/server/src/runtime/llmIngestion.ts`](../../../packages/server/src/runtime/llmIngestion.ts) unit coverage (see [`relationshipExtractor.test.ts`](../../../packages/shared/src/inference/llm/relationshipExtractor.test.ts)) and the new [`Analyze With AI`](../extension-commands/analyzeWithAI.mdmd.md) command, which share the same request/response contract during live runs.
