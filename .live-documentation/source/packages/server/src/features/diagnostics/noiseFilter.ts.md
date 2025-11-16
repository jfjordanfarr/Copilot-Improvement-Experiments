# packages/server/src/features/diagnostics/noiseFilter.ts

## Metadata
- Layer: 4
- Archetype: implementation
- Code Path: packages/server/src/features/diagnostics/noiseFilter.ts
- Live Doc ID: LD-implementation-packages-server-src-features-diagnostics-noisefilter-ts
- Generated At: 2025-11-16T02:09:51.273Z

## Authored
### Purpose
Applies runtime-configurable noise suppression to ripple impact contexts, trimming low-confidence, deep, or overly chatty targets before diagnostics are emitted.

### Notes
- `applyNoiseFilter` tallies drops by reason (confidence, depth, per-change limit, per-target limit) so telemetry can report how aggressive the filter behaved.
- Confidence values default to 0.5 when unspecified and clamp outside [0,1], keeping heuristics resilient when upstream analyzers omit scoring.
- The filter works per context, retaining order and metadata while replacing the `rippleImpacts` array with only the accepted impacts.

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-16T02:09:51.273Z","inputHash":"ecebfe88517d8127"}]} -->
<!-- LIVE-DOC:BEGIN Public Symbols -->
### Public Symbols
#### `NoiseFilterTotals`
- Type: interface
- Source: [source](../../../../../../../packages/server/src/features/diagnostics/noiseFilter.ts#L4)

#### `ZERO_NOISE_FILTER_TOTALS`
- Type: const
- Source: [source](../../../../../../../packages/server/src/features/diagnostics/noiseFilter.ts#L11)

#### `NoiseFilterResult`
- Type: interface
- Source: [source](../../../../../../../packages/server/src/features/diagnostics/noiseFilter.ts#L46)

#### `applyNoiseFilter`
- Type: function
- Source: [source](../../../../../../../packages/server/src/features/diagnostics/noiseFilter.ts#L51)
<!-- LIVE-DOC:END Public Symbols -->

<!-- LIVE-DOC:BEGIN Dependencies -->
### Dependencies
- [`rippleTypes.RippleImpact`](./rippleTypes.ts.md#rippleimpact) (type-only)
- [`settingsBridge.NoiseFilterRuntimeConfig`](../settings/settingsBridge.ts.md#noisefilterruntimeconfig) (type-only)
<!-- LIVE-DOC:END Dependencies -->

<!-- LIVE-DOC:BEGIN Observed Evidence -->
### Observed Evidence
#### Vitest Unit Tests
- [noiseFilter.test.ts](./noiseFilter.test.ts.md)
- [publishDocDiagnostics.test.ts](./publishDocDiagnostics.test.ts.md)
<!-- LIVE-DOC:END Observed Evidence -->
