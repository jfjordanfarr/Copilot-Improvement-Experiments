# packages/server/src/runtime/settings.ts

## Metadata
- Layer: 4
- Archetype: implementation
- Code Path: packages/server/src/runtime/settings.ts
- Live Doc ID: LD-implementation-packages-server-src-runtime-settings-ts
- Generated At: 2025-11-16T02:09:51.719Z

## Authored
### Purpose
Parses raw initialization payloads into typed extension settings, applies test-mode overrides, and merges the two for language-server consumption.

### Notes
- Walks nested `settings` → `linkAwareDiagnostics` containers to tolerate both legacy and modern configuration shapes.
- Validates enum-like fields (LLM provider mode, noise suppression levels, relationship kinds) before copying them, discarding anything outside the allow list.
- `extractTestModeOverrides` mirrors the primary parser but only honours a curated subset, letting integration tests short-circuit consent and rate limits via initialization options.

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-16T02:09:51.719Z","inputHash":"f44bc0c70c8f8b9c"}]} -->
<!-- LIVE-DOC:BEGIN Public Symbols -->
### Public Symbols
#### `extractExtensionSettings`
- Type: function
- Source: [source](../../../../../../packages/server/src/runtime/settings.ts#L69)

#### `extractTestModeOverrides`
- Type: function
- Source: [source](../../../../../../packages/server/src/runtime/settings.ts#L156)

#### `mergeExtensionSettings`
- Type: function
- Source: [source](../../../../../../packages/server/src/runtime/settings.ts#L219)
<!-- LIVE-DOC:END Public Symbols -->

<!-- LIVE-DOC:BEGIN Dependencies -->
### Dependencies
- `@copilot-improvement/shared` - `LinkRelationshipKind` (type-only)
- [`providerGuard.ExtensionSettings`](../features/settings/providerGuard.ts.md#extensionsettings)
<!-- LIVE-DOC:END Dependencies -->

<!-- LIVE-DOC:BEGIN Observed Evidence -->
### Observed Evidence
#### Vitest Unit Tests
- [settings.test.ts](./settings.test.ts.md)
<!-- LIVE-DOC:END Observed Evidence -->
