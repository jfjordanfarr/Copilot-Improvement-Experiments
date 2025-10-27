# Provider Gate (Layer 4)

## Source Mapping
- Implementation: [`packages/extension/src/onboarding/providerGate.ts`](../../../packages/extension/src/onboarding/providerGate.ts)
- Settings service: [`packages/extension/src/settings/configService.ts`](../../../packages/extension/src/settings/configService.ts)
- Parent design: [Extension Diagnostics – Link-Aware Extension](../extension-diagnostics/linkAwareExtension.mdmd.md)

## Responsibility
Ensure first-time users select how Link-Aware Diagnostics should interact with LLM providers and diagnostics. Persists the chosen mode, updates workspace configuration, and suppresses future prompts once onboarding completes.

## Key Concepts
- **ProviderChoice**: Quick pick entries mapping UI labels to `llmProviderMode` and diagnostics enablement.
- **Global state flag**: `linkDiagnostics.providerOnboarded` prevents re-prompting after the first decision.
- **Forced mode**: Environment variable `LINK_AWARE_PROVIDER_MODE` and test mode allow automation to bypass UI prompts.

## Exported Symbols

#### ensureProviderSelection
The `ensureProviderSelection` helper persists provider mode selections and refreshes extension settings before enabling diagnostics.

## Internal Flow
1. Short-circuit when the onboarding flag is already set.
2. Define `applySelection` helper to update workspace settings, persist onboarding status, and refresh the config service.
3. Respect forced modes (test environment or env var) before prompting the user.
4. Present quick pick with three options: local-only, prompt each time, or disable diagnostics.
5. Apply the chosen configuration, warning users when they dismiss the picker without selecting a mode.
6. When diagnostics are disabled, surface an informational reminder about re-enabling later.

## Error Handling
- Early returns when users cancel the picker to avoid modifying configuration unexpectedly.
- Configuration updates use `Promise.all` to keep settings in sync; failures propagate to the caller for logging.

## Integration Notes
- Config service `refresh()` ensures downstream components observe the new provider mode immediately.
- Workspace-level updates avoid mutating user settings globally, aligning with team workspaces.
- Future enhancements can append more provider modes or telemetry prompts without altering the flag workflow.
