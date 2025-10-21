# VS Code Extension Bootstrap (Layer 4)

## Source Mapping
- Implementation: [`packages/extension/src/extension.ts`](../../../packages/extension/src/extension.ts)
- Collaborating modules:
  - Configuration service (`packages/extension/src/settings/configService.ts`)
  - Diagnostics providers (`packages/extension/src/diagnostics/*`)
  - Watchers (`packages/extension/src/watchers/*`)
  - Commands (`packages/extension/src/commands/*`)
- Parent design: [Diagnostics Pipeline Architecture](../../layer-3/diagnostics-pipeline.mdmd.md), [Extension Surfaces Architecture](../../layer-3/extension-surfaces.mdmd.md)
- Spec references: [FR-002](../../../specs/001-link-aware-diagnostics/spec.md#functional-requirements), [FR-010](../../../specs/001-link-aware-diagnostics/spec.md#functional-requirements), [FR-014](../../../specs/001-link-aware-diagnostics/spec.md#functional-requirements)

## Responsibility
Initialises the language client, pushes configuration changes to the server, and wires front-end UX surfaces (diagnostics, commands, dependency inspector). Ensures the server only starts once the user selects an LLM provider or opts into local-only mode.

## Activation Flow
1. Resolve server entrypoint (`../server/dist/main.js`) and instantiate `ConfigService`.
2. Run onboarding provider guard to capture provider consent; log resolved settings.
3. Build `LanguageClient` with document selectors for markdown/plaintext/TS/JS/TSX/JSX **and YAML** (recent update).
4. Register commands:
   - `linkAwareDiagnostics.isServerReady`
   - `linkAwareDiagnostics.clearAllDiagnostics`
   - `linkDiagnostics.analyzeWithAI` (placeholder gate)
   - Dependency quick pick, symbol bridge, override commands, rebind prompt handler.
5. Register diagnostics providers and watchers (file maintenance, document diagnostics, knowledge dependencies).
6. Pipe configuration changes back to the server via `SETTINGS_NOTIFICATION`.
7. Preload documents referenced by diagnostics to keep Problems view actionable.

## Settings & Modes
- `initializationOptions` embed storage path, persisted settings, and optional test overrides.
- Diagnostics remain disabled until provider guard acknowledges `enableDiagnostics` + `llmProviderMode` (enforced server-side).

## Failure Handling
- If the client isn’t ready, command handlers log and return gracefully.
- Diagnostic preloading wraps `openTextDocument` in best-effort guard to avoid throwing for missing files.

## Testing Hooks
- Covered indirectly via integration suites (client registers watchers/diagnostics).
- Unit tests (`docDiagnosticProvider.test.ts`, `dependencyQuickPick.test.ts`) require extension activation to provide commands.

## Follow-ups
- Add telemetry for command usage and provider selections once consent flows are complete.
- Integrate ripple metadata into hover surfaces (pending T06x UX work).
