# NoiseFilter (Layer 4)

## Source Mapping
- Implementation: [`packages/server/src/features/diagnostics/noiseFilter.ts`](../../../packages/server/src/features/diagnostics/noiseFilter.ts)
- Tests: [`packages/server/src/features/diagnostics/noiseFilter.test.ts`](../../../packages/server/src/features/diagnostics/noiseFilter.test.ts)
- Parent design: [Diagnostics Pipeline Architecture](../../layer-3/diagnostics-pipeline.mdmd.md), [Language Server Architecture](../../layer-3/language-server-architecture.mdmd.md), [Settings Bridge](../../layer-4/server-settings/settingsBridge.mdmd.md)
- Spec references: [FR-008](../../../specs/001-link-aware-diagnostics/spec.md#functional-requirements), [T046](../../../specs/001-link-aware-diagnostics/tasks.md)

## Exported Symbols

### `NoiseFilterTotals`
Counter bundle tracking how many ripple impacts were discarded for confidence, depth, per-change, and per-artifact limits. Returned with every filter invocation so telemetry and acknowledgement services can reason about suppression pressure.

### `ZERO_NOISE_FILTER_TOTALS`
Reusable zeroed structure used to seed suppression counters. Cloning this constant keeps results immutable for callers while avoiding repeated literal construction.

### `NoiseFilterResult`
Typed return payload combining the filtered contexts with their `NoiseFilterTotals`. Enables downstream pipelines to forward both the sanitized ripple set and the suppression diagnostics in one object.

### `applyNoiseFilter`
Primary entry point: applies runtime-configured suppression rules to ripple contexts, producing trimmed impacts plus updated totals for observability.

## Responsibility
Applies level-aware noise suppression rules to ripple diagnostics before they are published. The filter trims low-confidence or overly redundant ripple impacts so the remaining diagnostics stay actionable without overwhelming the Problems view.

## Behaviour
- Evaluates every `RippleImpact` produced by the change processor prior to `publishDocDiagnostics` / `publishCodeDiagnostics`.
- Applies a preset derived from `RuntimeSettings.noiseSuppression.filter`, enforcing:
  - `minConfidence` threshold (fallback confidence 0.5 when inference omits a value).
  - Optional `maxDepth` ceiling to curtail deep cascades when teams request aggressive suppression.
  - `maxPerChange` cap limiting how many ripple diagnostics a single change event can emit.
  - `maxPerArtifact` cap constraining repeated emissions targeting the same dependent artifact.
- Returns a filtered copy of each context and emits suppression metrics (`byConfidence`, `byDepth`, `byTargetLimit`, `byChangeLimit`) so the runtime can log how much noise was trimmed.
- Runs before acknowledgement registration and hysteresis, ensuring suppressed impacts do not produce stale database entries.

## Configuration
Runtime presets originate from the `noiseSuppression.level` setting with optional overrides exposed under `linkAwareDiagnostics.noiseSuppression.*`:

| Level | minConfidence | maxDepth | maxPerChange | maxPerArtifact |
|-------|---------------|----------|--------------|----------------|
| `low` | 0.10 | ∞ (disabled) | 20 | 8 |
| `medium` *(default)* | 0.35 | 4 | 10 | 4 |
| `high` | 0.60 | 3 | 6 | 2 |

Overrides (`noiseSuppression.minConfidence`, `.maxDepth`, `.maxPerChange`, `.maxPerArtifact`) clamp to safe ranges and respect the active ripple `maxDepth`. All values are interpreted as integers ≥1 except `minConfidence`, which accepts 0–1.

## Interactions
- Change processor feeds contexts through the noise filter before handing them to diagnostic publishers, then logs suppression totals for observability.
- Publishers receive fewer ripple impacts, reducing the likelihood of budget exhaustion and acknowledgement churn while keeping hysteresis semantics intact.
- Runtime settings recomputation (`syncRuntimeSettings`) refreshes filter presets so CI or workspace configuration updates take effect without restarting the server.

## Testing
- Dedicated unit suite exercises each suppression rule (confidence gating, depth ceiling, per-change and per-artifact caps) and verifies metric reporting.
- `publishDocDiagnostics.test.ts` asserts the integration path: filtered impacts no longer emit diagnostics and the returned result records suppression totals.
- Integration suites (US5 transform ripple) can tune `noiseSuppression.level` to validate behaviour under stricter presets.

## Follow-ups
- Allow per-layer overrides (e.g., more aggressive suppression for documentation versus code).
- Surface suppression statistics via telemetry once metrics sinks are available.
- Consider adaptive confidence thresholds that learn from acknowledgement history or feed health signals.
