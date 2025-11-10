# packages/server/src/features/settings/settingsBridge.ts

## Metadata
- Layer: 4
- Archetype: implementation
- Code Path: packages/server/src/features/settings/settingsBridge.ts
- Live Doc ID: LD-implementation-packages-server-src-features-settings-settingsbridge-ts
- Generated At: 2025-11-09T22:52:11.138Z

## Authored
### Purpose
Normalises user-supplied extension configuration into bounded runtime settings that the language server can rely on for diagnostics batching, noise filtering, and ripple exploration.

### Notes
- Applies presets per suppression level, then clamps caller overrides (confidence, depths, counts) to safe ranges to avoid runaway diagnostic emission.
- Reconciles ripple link-kind selections against the universal allow list so invalid enum values are discarded without crashing.
- Ensures coupled limits remain coherent, e.g. noise-filter depth never exceeding ripple search depth, before returning the final `RuntimeSettings` snapshot.

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-09T22:52:11.138Z","inputHash":"f20c9d4f2917c600"}]} -->
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
- `@copilot-improvement/shared` - `LinkRelationshipKind` (type-only)
- [`providerGuard.ExtensionSettings`](./providerGuard.ts.mdmd.md#extensionsettings)
<!-- LIVE-DOC:END Dependencies -->

<!-- LIVE-DOC:BEGIN Observed Evidence -->
### Observed Evidence
#### Vitest Unit Tests
- [acknowledgementService.test.ts](../diagnostics/acknowledgementService.test.ts.mdmd.md)
- [noiseFilter.test.ts](../diagnostics/noiseFilter.test.ts.mdmd.md)
- [publishDocDiagnostics.test.ts](../diagnostics/publishDocDiagnostics.test.ts.mdmd.md)
<!-- LIVE-DOC:END Observed Evidence -->
