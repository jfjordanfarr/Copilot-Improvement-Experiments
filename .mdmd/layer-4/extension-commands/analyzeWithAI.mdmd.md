# Analyze With AI Command

## Metadata
- Layer: 4
- Implementation ID: IMP-108
- Code Path: [`packages/extension/src/commands/analyzeWithAI.ts`](../../../packages/extension/src/commands/analyzeWithAI.ts)
- Exports: registerAnalyzeWithAICommand

## Purpose
Expose the `linkDiagnostics.analyzeWithAI` command so leads can request LLM-assisted assessments for outstanding diagnostics while preserving provenance and prompt discipline.

## Public Symbols

### registerAnalyzeWithAICommand
Registers the Analyze with AI command, orchestrates diagnostic selection, prompt construction, LLM invocation, assessment parsing, and persistence into the knowledge graph.

## Responsibilities
- Fetch outstanding diagnostics and present them via Quick Pick with graceful cancellation handling.
- Build grounded prompts that include diagnostic metadata, prior assessments, and truncated file snippets bound by provider limits.
- Invoke the configured `LlmInvoker`, capture provenance (model id, vendor, prompt hash), and clamp returned confidence values.
- Persist assessments through `SET_DIAGNOSTIC_ASSESSMENT_REQUEST`, refresh the diagnostics tree, and notify the user of saved results.

## Collaborators
- [`packages/shared/src/contracts/diagnostics.ts`](../../../packages/shared/src/contracts/diagnostics.ts) supplies outstanding-diagnostics and assessment contracts.
- Language server endpoints (`LIST_OUTSTANDING_DIAGNOSTICS_REQUEST`, `SET_DIAGNOSTIC_ASSESSMENT_REQUEST`) deliver/accept payloads.
- Diagnostics tree view ([Diagnostics Tree](../extension-views/diagnosticsTree.mdmd.md)) reflects refreshed assessments post-save.
- LLM bridges (local Ollama, hosted providers) accessed via `LlmInvoker`.

## Linked Components
- [COMP-002 – Extension Surfaces](../../layer-3/extension-surfaces.mdmd.md)
- [COMP-006 – LLM Ingestion Pipeline](../../layer-3/llm-ingestion-pipeline.mdmd.md)

## Evidence
- Unit tests: [`packages/extension/src/commands/analyzeWithAI.test.ts`](../../../packages/extension/src/commands/analyzeWithAI.test.ts) cover provider gating, invocation success, and diagnostics tree refresh.
- Manual verification captures prompt hashing and telem logging within AI-Agent workspace sessions (2025-10-29 logs).

## Operational Notes
- Guard returns informational toasts when provider mode is disabled; no server traffic occurs in that state.
- JSON parsing enforces the shared `LlmAssessment` schema; malformed responses abort persistence with actionable errors.
- Future enhancement: emit telemetry on assessment submission outcomes for adoption dashboards.
