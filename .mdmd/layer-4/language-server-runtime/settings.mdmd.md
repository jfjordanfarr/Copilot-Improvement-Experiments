# Runtime Settings Derivation (Layer 4)

## Source Mapping
- Implementation: [`packages/server/src/runtime/settings.ts`](../../../packages/server/src/runtime/settings.ts)
- Collaborators: [`providerGuard.ts`](../../../packages/server/src/features/settings/providerGuard.ts)
- Parent design: [Language Server Architecture](../../layer-3/language-server-architecture.mdmd.md)

## Exported Symbols

#### extractExtensionSettings
`extractExtensionSettings` normalises the VS Code settings payload into the internal ExtensionSettings shape, handling nested settings containers and per-feature namespaces.

#### extractTestModeOverrides
`extractTestModeOverrides` pulls test harness overrides (used by integration suites) into the same ExtensionSettings structure for easy merge.

#### mergeExtensionSettings
`mergeExtensionSettings` overlays optional overrides onto the base settings so runtime configuration can honour test-mode tweaks without mutating the original snapshot.

## Responsibility
Translate loosely typed configuration objects from VS Code initialise/update events into the strongly typed runtime settings consumed by the provider guard, change processor, and diagnostics publishers.

## Behaviour Notes
- Validates enum-like inputs such as `llmProviderMode`, noise suppression `level`, and ripple `allowedKinds`, filtering out invalid entries instead of throwing.
- Supports both the top-level `linkAwareDiagnostics` namespace and raw configuration objects, preserving compatibility with direct unit mocks.
- Treats ripple configuration as optional, only populating the runtime object when at least one field passes validation.

## Evidence
- Covered by the server bootstrap integration suite (see [`tests/integration/us2/markdownDrift.test.ts`](../../../tests/integration/us2/markdownDrift.test.ts)) that requires deterministic merges when toggling noise suppression between scenarios.
- Provider guard behaviour validated indirectly via the server bootstrap path in [`tests/integration/us2/markdownDrift.test.ts`](../../../tests/integration/us2/markdownDrift.test.ts), which exercises diagnostic toggles after settings merges.
