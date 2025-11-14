# packages/server/src/features/diagnostics/publishDocDiagnostics.ts

## Metadata
- Layer: 4
- Archetype: implementation
- Code Path: packages/server/src/features/diagnostics/publishDocDiagnostics.ts
- Live Doc ID: LD-implementation-packages-server-src-features-diagnostics-publishdocdiagnostics-ts
- Generated At: 2025-11-14T18:42:06.364Z

## Authored
### Purpose
Emits documentation drift diagnostics by combining broken-link checks with ripple impact analysis, respecting noise suppression budgets, hysteresis windows, and prior acknowledgements.

### Notes
- `collectBrokenLinkDiagnostics` surfaces intra-document issues before ripple traversal so authors see immediate feedback on deleted anchors or missing files.
- Shares the same noise filtering and acknowledgement logic as code diagnostics, but emits informational severity and records emissions for audit parity.
- Converts filesystem paths with `normaliseDisplayPath` to keep diagnostic messages readable regardless of URI encoding or platform separators.

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-14T18:42:06.364Z","inputHash":"f90b5a6f5bfda08b"}]} -->
<!-- LIVE-DOC:BEGIN Public Symbols -->
### Public Symbols
#### `DocumentChangeContext`
- Type: interface
- Source: [source](../../../../../../../packages/server/src/features/diagnostics/publishDocDiagnostics.ts#L19)

#### `PublishDocDiagnosticsOptions`
- Type: interface
- Source: [source](../../../../../../../packages/server/src/features/diagnostics/publishDocDiagnostics.ts#L26)

#### `PublishDocDiagnosticsResult`
- Type: interface
- Source: [source](../../../../../../../packages/server/src/features/diagnostics/publishDocDiagnostics.ts#L34)

#### `publishDocDiagnostics`
- Type: function
- Source: [source](../../../../../../../packages/server/src/features/diagnostics/publishDocDiagnostics.ts#L43)
<!-- LIVE-DOC:END Public Symbols -->

<!-- LIVE-DOC:BEGIN Dependencies -->
### Dependencies
- `@copilot-improvement/shared` - `KnowledgeArtifact` (type-only)
- `node:fs` - `fs`
- `node:path` - `path`
- `node:url` - `fileURLToPath`, `pathToFileURL`
- [`acknowledgementService.AcknowledgementService`](./acknowledgementService.ts.mdmd.md#acknowledgementservice) (type-only)
- [`diagnosticUtils.DiagnosticSender`](./diagnosticUtils.ts.mdmd.md#diagnosticsender)
- [`diagnosticUtils.normaliseDisplayPath`](./diagnosticUtils.ts.mdmd.md#normalisedisplaypath)
- [`hysteresisController.HysteresisController`](./hysteresisController.ts.mdmd.md#hysteresiscontroller) (type-only)
- [`noiseFilter.NoiseFilterTotals`](./noiseFilter.ts.mdmd.md#noisefiltertotals)
- [`noiseFilter.ZERO_NOISE_FILTER_TOTALS`](./noiseFilter.ts.mdmd.md#zero_noise_filter_totals)
- [`noiseFilter.applyNoiseFilter`](./noiseFilter.ts.mdmd.md#applynoisefilter)
- [`rippleTypes.RippleImpact`](./rippleTypes.ts.mdmd.md#rippleimpact) (type-only)
- [`settingsBridge.RuntimeSettings`](../settings/settingsBridge.ts.mdmd.md#runtimesettings) (type-only)
- [`artifactWatcher.DocumentTrackedArtifactChange`](../watchers/artifactWatcher.ts.mdmd.md#documenttrackedartifactchange) (type-only)
- `vscode-languageserver/node` - `Diagnostic`, `DiagnosticSeverity`
<!-- LIVE-DOC:END Dependencies -->

<!-- LIVE-DOC:BEGIN Observed Evidence -->
### Observed Evidence
#### Vitest Unit Tests
- [publishDocDiagnostics.test.ts](./publishDocDiagnostics.test.ts.mdmd.md)
<!-- LIVE-DOC:END Observed Evidence -->
