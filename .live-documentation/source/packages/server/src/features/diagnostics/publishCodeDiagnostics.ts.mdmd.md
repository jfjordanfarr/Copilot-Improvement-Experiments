# packages/server/src/features/diagnostics/publishCodeDiagnostics.ts

## Metadata
- Layer: 4
- Archetype: implementation
- Code Path: packages/server/src/features/diagnostics/publishCodeDiagnostics.ts
- Live Doc ID: LD-implementation-packages-server-src-features-diagnostics-publishcodediagnostics-ts
- Generated At: 2025-11-09T22:52:10.357Z

## Authored
### Purpose
Generates ripple diagnostics for code edits, honouring noise suppression budgets, acknowledgement history, and hysteresis windows before publishing to the language server client.

### Notes
- Applies `applyNoiseFilter` ahead of budget checks, recording per-reason totals so telemetry can attribute drops to confidence, depth, or limit caps.
- Respects acknowledgements by consulting `AcknowledgementService.shouldEmitDiagnostic` before generating messages, and registers emissions to maintain audit trails.
- Populates diagnostic metadata (`recordId`, `changeEventId`, URIs) to enable quick actions and allow downstream consumers to correlate VS Code entries with graph records.

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-09T22:52:10.357Z","inputHash":"af3b16d16d7db01f"}]} -->
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
- `@copilot-improvement/shared` - `KnowledgeArtifact` (type-only)
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
- `vscode-languageserver/node` - `Diagnostic`, `DiagnosticSeverity`
<!-- LIVE-DOC:END Dependencies -->
