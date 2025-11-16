# packages/extension/src/settings/configService.ts

## Metadata
- Layer: 4
- Archetype: implementation
- Code Path: packages/extension/src/settings/configService.ts
- Live Doc ID: LD-implementation-packages-extension-src-settings-configservice-ts
- Generated At: 2025-11-16T02:09:51.137Z

## Authored
### Purpose
Centralizes reading and watching Link-Aware Diagnostics workspace settings so other services can react to updates.

### Notes
- Exposes typed access to provider mode, debounce timing, noise suppression, and storage path settings under the `linkAwareDiagnostics` section.
- Listens for VS Code configuration changes and re-emits the merged settings snapshot through an event emitter.
- Provides a manual `refresh` hook used after onboarding prompts update workspace settings.

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-16T02:09:51.137Z","inputHash":"67b6f6929e00fa29"}]} -->
<!-- LIVE-DOC:BEGIN Public Symbols -->
### Public Symbols
#### `LinkDiagnosticsSettings`
- Type: interface
- Source: [source](../../../../../../packages/extension/src/settings/configService.ts#L3)

#### `ConfigService`
- Type: class
- Source: [source](../../../../../../packages/extension/src/settings/configService.ts#L17)
<!-- LIVE-DOC:END Public Symbols -->

<!-- LIVE-DOC:BEGIN Dependencies -->
### Dependencies
- `vscode` - `vscode`
<!-- LIVE-DOC:END Dependencies -->

<!-- LIVE-DOC:BEGIN Observed Evidence -->
### Observed Evidence
#### Vitest Unit Tests
- [analyzeWithAI.test.ts](../commands/analyzeWithAI.test.ts.md)
<!-- LIVE-DOC:END Observed Evidence -->
