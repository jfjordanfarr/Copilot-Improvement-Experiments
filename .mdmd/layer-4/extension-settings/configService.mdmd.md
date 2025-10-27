# Config Service (Layer 4)

## Source Mapping
- Implementation: [`packages/extension/src/settings/configService.ts`](../../../packages/extension/src/settings/configService.ts)
- Spec references: [FR-010](../../../specs/001-link-aware-diagnostics/spec.md#functional-requirements), [T023](../../../specs/001-link-aware-diagnostics/tasks.md)
- Parent design: [Diagnostics Pipeline Architecture](../../layer-3/diagnostics-pipeline.mdmd.md), [Extension Surfaces Architecture](../../layer-3/extension-surfaces.mdmd.md)

## Exported Symbols
- `LinkDiagnosticsSettings` — shape describing the extension configuration snapshot shared across runtime boundaries.
- `ConfigService` — disposable wrapper that watches configuration changes and emits updated settings.

## Responsibility
Centralises access to the `linkAwareDiagnostics` configuration namespace, keeping the extension and language client runtime in sync with user preferences (provider consent, debounce windows, diagnostics enablement).

## Behaviour
- Reads the current settings on construction and exposes them through the `settings` getter.
- Subscribes to `workspace.onDidChangeConfiguration`; when the monitored section changes, refreshes the cached snapshot and emits `onDidChange` events.
- Provides a `refresh()` helper so activation flows can force a re-read after onboarding prompts update workspace settings.

## Key Settings
- `llmProviderMode`: governs whether diagnostics require explicit model opt-in (`prompt`, `local-only`, `disabled`).
- `noiseSuppression.level`: controls diagnostic batching/budgeting (`low`/`medium`/`high`).
- `storagePath`: optional override for persisted runtime artefacts (knowledge DB, checkpoints).
- `enableDiagnostics`: gate toggled once the user consents to provider usage.
- `debounce.ms`: feeds directly into the server-side change queue interval.

## Implementation Notes
- Event emitter pattern keeps command handlers and activation logic decoupled from VS Code configuration APIs.
- Defaults mirror SpecKit expectations so a fresh workspace starts in a conservative, prompt-first mode.
- `storagePath` blank strings are normalised to `undefined` to avoid leaking empty paths into the server.

## Testing & Usage
- Exercised indirectly via integration tests that move through onboarding flows and verify diagnostics remain disabled until consent is given.
- Manual smoke: change settings in VS Code, watch runtime logs reflect the updated debounce window and provider selection.

## Follow-ups
- Persist last-known settings to the language server even when diagnostics are disabled, enabling future acknowledgement UX to load historical preferences.
- Consider exposing `onDidChange` disposal telemetry for easier debugging of multiple listeners during extension reloads.
