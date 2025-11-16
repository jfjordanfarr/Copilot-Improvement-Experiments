# packages/server/src/features/settings/providerGuard.ts

## Metadata
- Layer: 4
- Archetype: implementation
- Code Path: packages/server/src/features/settings/providerGuard.ts
- Live Doc ID: LD-implementation-packages-server-src-features-settings-providerguard-ts
- Generated At: 2025-11-16T02:09:51.648Z

## Authored
### Purpose
Captures the latest extension configuration coming from the language client and gates diagnostics features until explicit provider consent is granted.

### Notes
- Merges successive `apply` calls to retain previously supplied values while honoring new overrides from the client.
- Logs a console notice when diagnostics remain disabled so operators understand why requests may be ignored.
- Surfaces typed accessors (`getSettings`, `areDiagnosticsEnabled`) for downstream services that need to read consent state without owning the raw settings blob.

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-16T02:09:51.648Z","inputHash":"84e8fc748451659d"}]} -->
<!-- LIVE-DOC:BEGIN Public Symbols -->
### Public Symbols
#### `RippleExtensionSettings`
- Type: interface
- Source: [source](../../../../../../../packages/server/src/features/settings/providerGuard.ts#L5)

#### `ExtensionSettings`
- Type: interface
- Source: [source](../../../../../../../packages/server/src/features/settings/providerGuard.ts#L13)

#### `ProviderGuard`
- Type: class
- Source: [source](../../../../../../../packages/server/src/features/settings/providerGuard.ts#L28)
<!-- LIVE-DOC:END Public Symbols -->

<!-- LIVE-DOC:BEGIN Dependencies -->
### Dependencies
- `@copilot-improvement/shared` - `LinkRelationshipKind` (type-only)
- `vscode-languageserver` - `Connection`
<!-- LIVE-DOC:END Dependencies -->

<!-- LIVE-DOC:BEGIN Observed Evidence -->
### Observed Evidence
#### Vitest Unit Tests
- [acknowledgementService.test.ts](../diagnostics/acknowledgementService.test.ts.md)
- [noiseFilter.test.ts](../diagnostics/noiseFilter.test.ts.md)
- [publishDocDiagnostics.test.ts](../diagnostics/publishDocDiagnostics.test.ts.md)
- [llmIngestionOrchestrator.test.ts](../knowledge/llmIngestionOrchestrator.test.ts.md)
- [environment.test.ts](../../runtime/environment.test.ts.md)
- [settings.test.ts](../../runtime/settings.test.ts.md)
<!-- LIVE-DOC:END Observed Evidence -->
