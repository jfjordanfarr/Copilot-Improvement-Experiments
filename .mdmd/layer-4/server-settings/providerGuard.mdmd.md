# ProviderGuard (Layer 4)

## Source Mapping
- Implementation: [`packages/server/src/features/settings/providerGuard.ts`](../../../packages/server/src/features/settings/providerGuard.ts)
- Parent design: [Diagnostics Pipeline Architecture](../../layer-3/diagnostics-pipeline.mdmd.md), [Language Server Architecture](../../layer-3/language-server-architecture.mdmd.md)
- Spec references: [FR-010](../../../specs/001-link-aware-diagnostics/spec.md#functional-requirements), [T021](../../../specs/001-link-aware-diagnostics/tasks.md)

## Responsibility
Track the extension-provided configuration snapshot and gate diagnostic emission until the user explicitly enables the feature. Also relays consent-related log messages back to the client via the language server connection.

## Behaviour
- `apply(settings)` merges new partial settings into the cached `ExtensionSettings` object.
- Logs an informational message when diagnostics remain disabled after the latest update (guardrail for onboarding flows).
- `areDiagnosticsEnabled()` exposes a boolean used by runtime bootstrap and change processor to short-circuit diagnostic publication when consent is absent.
- `getSettings()` returns the most recent merged settings for downstream derivation (`settingsBridge.ts`).

## Settings Schema
- `enableDiagnostics`: primary guard. Defaults to `false` until the extension toggles it post-consent.
- `llmProviderMode`: tracks user intent (`prompt`, `local-only`, `disabled`) for future provider routing.
- `debounceMs`, `noiseSuppression`, `ripple` nested knobs are passed through untouched for runtime derivation.

## Failure Handling
- Silent no-op when `apply` receives `undefined`, preserving previous state.
- Keeps existing properties across partial updates so staged onboarding (e.g., set provider mode first, enable later) works without losing data.

## Testing Notes
- Intended to be tested with lightweight unit coverage that feeds successive `apply` calls and asserts the guard's enablement flag; backlog item under T021.
- Integration suites observe guard behaviour indirectly: diagnostics do not emit until onboarding completes.

## Follow-ups
- Extend logging to include the chosen provider mode for richer telemetry once privacy approvals are cleared.
- Consider persisting last-known settings to disk so server restarts do not reset consent state.
