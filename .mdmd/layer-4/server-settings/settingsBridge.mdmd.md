# settingsBridge

## Metadata
- Layer: 4
- Code Path: [`packages/server/src/features/settings/settingsBridge.ts`](../../../packages/server/src/features/settings/settingsBridge.ts)
- Exports: NoiseSuppressionLevel, NoiseFilterRuntimeConfig, NoiseSuppressionRuntime, RippleRuntimeSettings, RuntimeSettings, DEFAULT_RUNTIME_SETTINGS, deriveRuntimeSettings
- Spec references: [FR-010](../../../specs/001-link-aware-diagnostics/spec.md#functional-requirements), [T021](../../../specs/001-link-aware-diagnostics/tasks.md)

## Purpose
Normalise the extension-facing `ExtensionSettings` into deterministic runtime knobs consumed by change queues, hysteresis controllers, ripple analyzers, and dependency inspectors. Supplies conservative defaults when the client omits configuration fields.

## Public Symbols

### NoiseSuppressionLevel
Union of preset identifiers (`"low" | "medium" | "high"`) that map user selections to tuned suppression and hysteresis bundles.

### NoiseFilterRuntimeConfig
Per-level filter knobs (confidence threshold, depth/limit caps) propagated to `applyNoiseFilter` and ripple traversal.

### NoiseSuppressionRuntime
Derived preset payload combining diagnostics budget, hysteresis delay, and computed `NoiseFilterRuntimeConfig`.

### RippleRuntimeSettings
Traversal bounds forwarded to ripple analyzers—maximum depth/results plus allowed relationship kinds segmented by document vs. code neighbors.

### RuntimeSettings
Top-level runtime contract returned to the server, bundling debounce interval, suppression preset, and ripple traversal constraints.

### DEFAULT_RUNTIME_SETTINGS
Conservative defaults used when the extension provides no configuration, ensuring low-noise diagnostics out of the box.

### deriveRuntimeSettings
Normalises raw `ExtensionSettings`, applies presets, clamps overrides, and returns a stable `RuntimeSettings` object for runtime consumption.

## Collaborators
- Parent design: [Diagnostics Pipeline Architecture](../../layer-3/diagnostics-pipeline.mdmd.md)
- Parent design: [Language Server Architecture](../../layer-3/language-server-architecture.mdmd.md)

## Output Contract
`RuntimeSettings` contains three buckets:
- `debounceMs`: interval passed to `ChangeQueue.updateDebounceWindow`.
- `noiseSuppression`: `{ level, maxDiagnosticsPerBatch, hysteresisMs, filter }` controlling diagnostic budgets and suppression heuristics. `filter` exposes `{ minConfidence, maxDepth?, maxPerChange?, maxPerArtifact? }` for the noise filter.
- `ripple`: `{ maxDepth, maxResults, allowedKinds, documentKinds, codeKinds }` forwarded to ripple analyzer + inspectors.

## Normalization Rules
- `debounceMs` coerced to non-negative integers; falls back to `DEFAULT_RUNTIME_SETTINGS.debounceMs` (1000 ms).
- NoiseSuppression.level restricted to low|medium|high; maps to predefined presets (diagnostic budget + hysteresis + noise filter thresholds). Presets tune minConfidence, maxDepth, maxPerChange, and maxPerArtifact, with overrides clamped to safe ranges.
- Noise filter overrides respect the active ripple maxDepth ceiling so suppression never exceeds traversal bounds.
- Ripple link kind arrays filtered against the supported set {depends_on, implements, documents, references} and deduplicated.
- documentKinds/codeKinds subsets forced to remain within allowedKinds; fallback ensures each bucket retains at least one entry.
- maxDepth/maxResults clamped to positive integers.

## Implementation Notes
- Re-exports `DEFAULT_RUNTIME_SETTINGS` for reuse in tests and bootstrap code.
- Uses helper `normaliseLinkKinds` to filter invalid strings before deduplication.
- Provides `filterByAllowed` closure to guarantee specialized buckets never exceed the allowed superset.

## Failure Handling
- Unknown link kinds silently dropped; if all are invalid the defaults reapply, keeping runtime safe.
- `deriveRuntimeSettings(undefined)` simply returns the defaults, letting server start in a safe, low-noise mode.

## Testing
- Unit coverage should assert combinations of overrides (custom debounce, noise presets, ripple kinds) for deterministic outputs (tracked under T021).
- Integration suites pick up derived settings indirectly when onboarding toggles noise levels or ripple depth.

## Follow-ups
- Surface additional tunables (e.g., hysteresis multiplier, LLM thresholds) as they join the product surface.
- Persist derived settings to telemetry for later tuning dashboards.
