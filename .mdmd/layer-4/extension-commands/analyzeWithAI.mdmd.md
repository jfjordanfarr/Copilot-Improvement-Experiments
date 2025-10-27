# Analyze With AI Command (Layer 4)

## Source Mapping
- Implementation: [`packages/extension/src/commands/analyzeWithAI.ts`](../../../packages/extension/src/commands/analyzeWithAI.ts)
- Tests: [`packages/extension/src/commands/analyzeWithAI.test.ts`](../../../packages/extension/src/commands/analyzeWithAI.test.ts)
- Shared contracts: [`LIST_OUTSTANDING_DIAGNOSTICS_REQUEST`, `SET_DIAGNOSTIC_ASSESSMENT_REQUEST`](../../../packages/shared/src/contracts/diagnostics.ts)
- Parent design: [Extension Surfaces Architecture](../../layer-3/extension-surfaces.mdmd.md)

## Exported Symbols
- `registerAnalyzeWithAICommand` — wires the command into VS Code, providing dependencies and lifecycle management.

## Purpose
Provide the `linkDiagnostics.analyzeWithAI` command so leads can request an on-demand language model assessment for any outstanding diagnostic. The command orchestrates diagnostic selection, prompt construction, model invocation, JSON parsing, and persistence, ensuring AI guidance lands back in the knowledge graph with provenance metadata.

## Responsibilities
- Fetch the latest outstanding diagnostics from the language server and present them in a Quick Pick for interactive selection.
- Build a grounded prompt that includes diagnostic metadata, prior assessments, and truncated file snippets for the target and trigger artifacts.
- Invoke the configured language model through `LlmInvoker`, handling cancellation and provider availability errors.
- Parse the model response into the shared `LlmAssessment` shape, clamp confidence values, and retain the raw response for auditing.
- Submit the assessment to the server via `SET_DIAGNOSTIC_ASSESSMENT_REQUEST`, then refresh the diagnostics tree and notify the user.

## Key Concepts
- **Prompt hashing** – A SHA-1 hash of the prompt (`promptHash`) tags both telemetry and persisted assessments, helping correlate downstream ingestion runs.
- **Context snippets** – Target/trigger files are loaded (up to 4k characters) to supply the model with actionable context while keeping prompts within provider limits.
- **Assessment parsing** – Responses are extracted from fenced code blocks if present, validated for `summary` and `confidence`, and capped to four recommended actions.
- **LLM provenance** – Stored assessments capture model id, vendor/family, tags, and generation timestamp so future tooling can trace AI involvement.

## Flow Overview
1. Guard against disabled provider mode (`llmProviderMode === "disabled"`) and bail early with an informational toast.
2. Request `ListOutstandingDiagnosticsResult`; surface errors via `showErrorMessage` and stop if no diagnostics remain.
3. Prompt the user to choose a diagnostic; cancellation exits silently.
4. Build the prompt payload, including previous assessments and context snippets.
5. Call `LlmInvoker.invoke` within `withProgress`, respecting cancellation tokens and surfacing provider errors.
6. Parse and enrich the assessment, then send `SET_DIAGNOSTIC_ASSESSMENT_REQUEST` to persist it in the graph store.
7. Refresh the diagnostics tree (if provided) and display a toast summarising the saved assessment.

## Error Handling
- Provider disabled: informational toast without contacting the server.
- Diagnostic retrieval failure: error toast with the underlying message.
- Model invocation: distinguishes cancellation, provider-mode faults, and unexpected errors; only unexpected errors surface generic failure messages.
- JSON parsing: throws when the response lacks required fields, preventing malformed assessments from persisting.
- Persistence errors: surfaced via `showErrorMessage`, leaving the prior assessment untouched.

## Observability & UX
- Progress notification keeps users informed during model execution and supports cancellation.
- Saved assessment toast includes a truncated summary preview (<120 chars) for quick confirmation.
- Console warnings log snippet load failures to aid debugging without interrupting the command flow.

## Evidence
- [`packages/extension/src/commands/analyzeWithAI.test.ts`](../../../packages/extension/src/commands/analyzeWithAI.test.ts) exercises provider gating, successful invocation, persistence, and diagnostic tree refresh behaviour.
