# packages/server/src/features/settings/settingsBridge.ts

## Metadata
- Layer: 4
- Archetype: implementation
- Code Path: packages/server/src/features/settings/settingsBridge.ts
- Live Doc ID: LD-implementation-packages-server-src-features-settings-settingsbridge-ts
- Generated At: 2025-11-16T22:35:16.186Z

## Authored
### Purpose
Transforms extension configuration into validated runtime settings for the language server so diagnostics, ripple exploration, and noise suppression components run with sane, bounded parameters even when users omit or misconfigure options.

### Notes
- Introduced while hardening activation flows to eliminate interactive prompts during automated runs; see [2025-10-19 summary](../../../../../../../AI-Agent-Workspace/ChatHistory/2025/10/Summarized/2025-10-19.SUMMARIZED.md).
- Expanded defaults for document-oriented relationship kinds during the Oct 21 diagnostic copy edit pass documented in [2025-10-21 summary](../../../../../../../AI-Agent-Workspace/ChatHistory/2025/10/Summarized/2025-10-21.SUMMARIZED.md).

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-16T22:35:16.186Z","inputHash":"42339b2545aadc82"}]} -->
<!-- LIVE-DOC:BEGIN Public Symbols -->
### Public Symbols
#### `NoiseSuppressionLevel`
- Type: type
- Source: [source](../../../../../../../packages/server/src/features/settings/settingsBridge.ts#L5)

#### `NoiseFilterRuntimeConfig`
- Type: interface
- Source: [source](../../../../../../../packages/server/src/features/settings/settingsBridge.ts#L7)

#### `NoiseSuppressionRuntime`
- Type: interface
- Source: [source](../../../../../../../packages/server/src/features/settings/settingsBridge.ts#L14)

#### `RippleRuntimeSettings`
- Type: interface
- Source: [source](../../../../../../../packages/server/src/features/settings/settingsBridge.ts#L21)

#### `RuntimeSettings`
- Type: interface
- Source: [source](../../../../../../../packages/server/src/features/settings/settingsBridge.ts#L29)

#### `DEFAULT_RUNTIME_SETTINGS`
- Type: const
- Source: [source](../../../../../../../packages/server/src/features/settings/settingsBridge.ts#L35)

#### `deriveRuntimeSettings`
- Type: function
- Source: [source](../../../../../../../packages/server/src/features/settings/settingsBridge.ts#L148)
<!-- LIVE-DOC:END Public Symbols -->

<!-- LIVE-DOC:BEGIN Dependencies -->
### Dependencies
- [`providerGuard.ExtensionSettings`](./providerGuard.ts.mdmd.md#extensionsettings)
- [`index.LinkRelationshipKind`](../../../../shared/src/index.ts.mdmd.md#linkrelationshipkind) (type-only)
<!-- LIVE-DOC:END Dependencies -->

<!-- LIVE-DOC:BEGIN Observed Evidence -->
### Observed Evidence
#### Vitest Unit Tests
- [acknowledgementService.test.ts](../diagnostics/acknowledgementService.test.ts.mdmd.md)
- [noiseFilter.test.ts](../diagnostics/noiseFilter.test.ts.mdmd.md)
- [publishDocDiagnostics.test.ts](../diagnostics/publishDocDiagnostics.test.ts.mdmd.md)
<!-- LIVE-DOC:END Observed Evidence -->
