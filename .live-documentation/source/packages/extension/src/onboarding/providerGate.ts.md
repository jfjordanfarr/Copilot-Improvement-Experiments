# packages/extension/src/onboarding/providerGate.ts

## Metadata
- Layer: 4
- Archetype: implementation
- Code Path: packages/extension/src/onboarding/providerGate.ts
- Live Doc ID: LD-implementation-packages-extension-src-onboarding-providergate-ts
- Generated At: 2025-11-16T02:09:51.082Z

## Authored
### Purpose
Guides first-time users to choose an LLM provider mode so diagnostics and AI features start in a known configuration.

### Notes
- Skips the prompt when onboarding already happened, when tests are running, or when a provider is forced via environment variable.
- Applies the chosen mode by updating workspace settings for `llmProviderMode` and `enableDiagnostics`, then refreshes the extension config service.
- Presents a guarded quick pick that defaults to local-only diagnostics but allows opting into repeated prompts or fully disabling LLM-backed diagnostics.

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-16T02:09:51.082Z","inputHash":"b90a332287edbbc0"}]} -->
<!-- LIVE-DOC:BEGIN Public Symbols -->
### Public Symbols
#### `ensureProviderSelection`
- Type: function
- Source: [source](../../../../../../packages/extension/src/onboarding/providerGate.ts#L13)
<!-- LIVE-DOC:END Public Symbols -->

<!-- LIVE-DOC:BEGIN Dependencies -->
### Dependencies
- [`configService.ConfigService`](../settings/configService.ts.md#configservice)
- `vscode` - `vscode`
<!-- LIVE-DOC:END Dependencies -->
