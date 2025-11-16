# packages/server/src/features/diagnostics/publishCodeDiagnostics.ts

## Metadata
- Layer: 4
- Archetype: implementation
- Code Path: packages/server/src/features/diagnostics/publishCodeDiagnostics.ts
- Live Doc ID: LD-implementation-packages-server-src-features-diagnostics-publishcodediagnostics-ts
- Generated At: 2025-11-16T22:35:15.391Z

## Authored
### Purpose
_Pending authored purpose_

### Notes
_Pending notes_

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-16T22:35:15.391Z","inputHash":"86d0d190c49369bb"}]} -->
<!-- LIVE-DOC:BEGIN Public Symbols -->
### Public Symbols
#### `CodeChangeContext`
- Type: interface
- Source: [source](../../../../../../../packages/server/src/features/diagnostics/publishCodeDiagnostics.ts#L16)

#### `PublishCodeDiagnosticsOptions`
- Type: interface
- Source: [source](../../../../../../../packages/server/src/features/diagnostics/publishCodeDiagnostics.ts#L23)

#### `PublishCodeDiagnosticsResult`
- Type: interface
- Source: [source](../../../../../../../packages/server/src/features/diagnostics/publishCodeDiagnostics.ts#L31)

#### `publishCodeDiagnostics`
- Type: function
- Source: [source](../../../../../../../packages/server/src/features/diagnostics/publishCodeDiagnostics.ts#L47)
<!-- LIVE-DOC:END Public Symbols -->

<!-- LIVE-DOC:BEGIN Dependencies -->
### Dependencies
- [`acknowledgementService.AcknowledgementService`](./acknowledgementService.ts.mdmd.md#acknowledgementservice) (type-only)
- [`diagnosticUtils.DiagnosticSender`](./diagnosticUtils.ts.mdmd.md#diagnosticsender)
- [`diagnosticUtils.normaliseDisplayPath`](./diagnosticUtils.ts.mdmd.md#normalisedisplaypath)
- [`hysteresisController.HysteresisController`](./hysteresisController.ts.mdmd.md#hysteresiscontroller) (type-only)
- [`noiseFilter.NoiseFilterTotals`](./noiseFilter.ts.mdmd.md#noisefiltertotals)
- [`noiseFilter.ZERO_NOISE_FILTER_TOTALS`](./noiseFilter.ts.mdmd.md#zero_noise_filter_totals)
- [`noiseFilter.applyNoiseFilter`](./noiseFilter.ts.mdmd.md#applynoisefilter)
- [`rippleTypes.RippleImpact`](./rippleTypes.ts.mdmd.md#rippleimpact) (type-only)
- [`settingsBridge.RuntimeSettings`](../settings/settingsBridge.ts.mdmd.md#runtimesettings) (type-only)
- [`artifactWatcher.CodeTrackedArtifactChange`](../watchers/artifactWatcher.ts.mdmd.md#codetrackedartifactchange) (type-only)
- [`index.KnowledgeArtifact`](../../../../shared/src/index.ts.mdmd.md#knowledgeartifact) (type-only)
- `vscode-languageserver/node` - `Diagnostic`, `DiagnosticSeverity`
<!-- LIVE-DOC:END Dependencies -->
