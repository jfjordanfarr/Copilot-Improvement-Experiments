# packages/server/src/features/diagnostics/publishDocDiagnostics.ts

## Metadata
- Layer: 4
- Archetype: implementation
- Code Path: packages/server/src/features/diagnostics/publishDocDiagnostics.ts
- Live Doc ID: LD-implementation-packages-server-src-features-diagnostics-publishdocdiagnostics-ts
- Generated At: 2025-11-16T22:35:15.447Z

## Authored
### Purpose
_Pending authored purpose_

### Notes
_Pending notes_

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-16T22:35:15.447Z","inputHash":"459901b61fa6ba03"}]} -->
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
- [`index.KnowledgeArtifact`](../../../../shared/src/index.ts.mdmd.md#knowledgeartifact) (type-only)
- `vscode-languageserver/node` - `Diagnostic`, `DiagnosticSeverity`
<!-- LIVE-DOC:END Dependencies -->

<!-- LIVE-DOC:BEGIN Observed Evidence -->
### Observed Evidence
#### Vitest Unit Tests
- [publishDocDiagnostics.test.ts](./publishDocDiagnostics.test.ts.mdmd.md)
<!-- LIVE-DOC:END Observed Evidence -->
