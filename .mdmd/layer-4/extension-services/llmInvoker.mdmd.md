# LlmInvoker Service (Layer 4)

## Source Mapping
- Implementation: [`packages/extension/src/services/llmInvoker.ts`](../../../packages/extension/src/services/llmInvoker.ts)
- Parent design: [Extension Surfaces Architecture](../../layer-3/extension-surfaces.mdmd.md)
- Downstream consumer: [`Analyze With AI Command`](../extension-commands/analyzeWithAI.mdmd.md)

## Purpose
Encapsulate VS Code's `vscode.lm` chat model selection and invocation logic so extension commands can request language model output without duplicating provider-mode checks, Quick Pick UI, or streaming assembly. The service also caches the most recent model selection to make repeated requests faster.

## Responsibilities
- Respect workspace settings by short-circuiting when `llmProviderMode === "disabled"`.
- Enumerate available chat models via `vscode.lm.selectChatModels()` and filter them according to provider mode (e.g., `local-only`).
- Present a Quick Pick for interactive model choice in prompt mode, caching the selection for subsequent requests.
- Invoke the selected model with justification/tags metadata, stream the response text to completion, and surface the concrete `LanguageModelChat` used.

## Key Concepts
- **Provider modes** – Mirrors `LinkDiagnosticsSettings.llmProviderMode`, supporting `disabled`, `local-only`, and `prompt` (default) behaviours.
- **Local-only filtering** – Heuristically filters models by vendor/family/id to favour Ollama or other on-device engines when the workspace demands local execution.
- **Model caching** – Remembers the last chosen model id for the session so non-interactive flows skip the Quick Pick once a model is accepted.
- **Tags passthrough** – Any telemetry tags provided by callers are forwarded in `modelOptions` for downstream auditing.

## Error Handling
- Throws `LlmInvocationError` with explicit reasons (`disabled`, `no-model`, `cancelled`, `failed`) so callers can tailor UX.
- When no eligible models exist, signals `no-model` instead of surfacing a generic error.
- Cancels gracefully if the Quick Pick is dismissed, propagating a `cancelled` reason to avoid user-facing error toasts.

## Observability & UX
- Leverages VS Code Quick Pick UI for model selection when interactive mode is requested.
- Tags and justification data flow through to providers for future telemetry work.
- By returning the concrete `LanguageModelChat`, callers can persist provenance (id, vendor, family, version) alongside generated content.

## Evidence
- Covered indirectly via [`Analyze With AI Command`](../extension-commands/analyzeWithAI.mdmd.md) unit tests, which stub `LlmInvoker` interactions to verify command behaviour.
