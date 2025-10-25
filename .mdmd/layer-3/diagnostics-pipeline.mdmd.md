# Diagnostics Pipeline Architecture (Layer 3)

## Overview
Synchronises on-disk artifact changes with the knowledge graph to emit actionable ripple diagnostics inside VS Code.

- **Extension front-end**: watchers/fileMaintenance sends rename/delete notifications; document selectors in [`extension.ts`](../../packages/extension/src/extension.ts) ensure YAML + markdown feed change events into the language client.
- **Change ingestion**: [`ArtifactWatcher`](../../packages/server/src/features/watchers/artifactWatcher.ts) classifies saved artifacts as document vs. code, loads contents, seeds providers, and reconciles inference hints against [`GraphStore`](../../packages/shared/src/db/graphStore.ts).
- **Ripple analysis**: [`changeProcessor.ts`](../../packages/server/src/runtime/changeProcessor.ts) persists change events, runs [`RippleAnalyzer`](../../packages/server/src/features/knowledge/rippleAnalyzer.ts), and collates ripple impacts for code+document contexts.
- **Diagnostic publication**:
   - [`publishDocDiagnostics`](../layer-4/server-diagnostics/publishDocDiagnostics.mdmd.md) surfaces broken markdown links and ripple metadata for docs, coordinating acknowledgement + hysteresis suppression.
   - [`publishCodeDiagnostics`](../layer-4/server-diagnostics/publishCodeDiagnostics.mdmd.md) handles code ripple hints with hysteresis + batching.
   - [`AcknowledgementService`](../layer-4/server-diagnostics/acknowledgementService.mdmd.md) persists acknowledgement state and feeds suppression decisions.
   - [`listOutstandingDiagnostics`](../layer-4/server-diagnostics/listOutstandingDiagnostics.mdmd.md) produces summaries for CLI/UIs.
   - [`removeOrphans`](../../packages/server/src/features/maintenance/removeOrphans.ts) responds to rename/delete notifications, notifying clients and sending interim diagnostics.
- **Client UX**: [`docDiagnosticProvider`](../../packages/extension/src/diagnostics/docDiagnosticProvider.ts) transforms diagnostic metadata into quick actions and ripple explorers.

## Data Flow
1. **Save Event** *(VS Code)*
   - Language client enqueues `QueuedChange` (URI, languageId, version) to `changeQueue` with debounce.
2. **Artifact Preparation** *(ArtifactWatcher)*
   - Determines category via language/extension heuristics (now includes `.yaml`, `.yml`).
   - Loads text, aggregates workspace + knowledge feed hints, records inference seeds.
3. **Inference & Graph Sync**
   - Runs orchestrators (workspace providers, knowledge feeds, LLM fallback) and persists new edges via `persistInferenceResult`.
   - Normalises URIs (`normalizeFileUri`) to keep graph canonical.
4. **Ripple Analysis**
   - `RippleAnalyzer` generates hints limited by runtime settings (depth, max results, allowed kinds).
   - Splits document/code contexts; attaches cascade metadata (path, confidence, relationship).
5. **Noise Filtering**
   - `noiseFilter` trims low-confidence or redundant ripple impacts based on the active noise suppression preset before publication.
   - Suppression metrics feed runtime logging so operators can tune thresholds.
6. **Diagnostics Emission**
    - [`publishDocDiagnostics`](../layer-4/server-diagnostics/publishDocDiagnostics.mdmd.md) emits `doc-drift` records for:
       - Broken markdown paths (new static scan).
       - Ripple impacts referencing linked artifacts.
    - [`publishCodeDiagnostics`](../layer-4/server-diagnostics/publishCodeDiagnostics.mdmd.md) emits `code-ripple` records for dependent code artifacts.
    - Diagnostics guarded by hysteresis + budget from runtime settings via [`HysteresisController`](../layer-4/server-diagnostics/hysteresisController.mdmd.md) and [`NoiseFilter`](../layer-4/server-diagnostics/noiseFilter.mdmd.md).
    - [`AcknowledgementService`](../layer-4/server-diagnostics/acknowledgementService.mdmd.md) records acknowledgements and suppresses repeats; [`listOutstandingDiagnostics`](../layer-4/server-diagnostics/listOutstandingDiagnostics.mdmd.md) exposes unresolved records to clients.
7. **Client Presentation**
   - `docDiagnosticProvider` registers quick actions (`Open linked artifact`, ripple explorer).
   - `fileMaintenance.ts` signals rename/delete back to server, triggering `removeOrphans` diagnostics + rebind prompts.

## Key Settings & Controls
- `RuntimeSettings.noiseSuppression` configures max diagnostics per batch + hysteresis window.
- `linkAwareDiagnostics.enableDiagnostics` toggles entire pipeline; extension ensures YAML is included in watchers.
- `linkAwareDiagnostics.llmProviderMode` must be set (guarded by providerGate) before diagnostics ship.

## Test Coverage
- **Unit**: [`publishDocDiagnostics.test.ts`](../../packages/server/src/features/diagnostics/publishDocDiagnostics.test.ts), [`acknowledgementService.test.ts`](../../packages/server/src/features/diagnostics/acknowledgementService.test.ts), [`listOutstandingDiagnostics.test.ts`](../../packages/server/src/features/diagnostics/listOutstandingDiagnostics.test.ts), [`artifactWatcher.test.ts`](../../packages/server/src/features/watchers/artifactWatcher.test.ts), [`docDiagnosticProvider.test.ts`](../../packages/extension/src/diagnostics/docDiagnosticProvider.test.ts), [`rippleAnalyzer.test.ts`](../../packages/server/src/features/knowledge/rippleAnalyzer.test.ts).
- **Integration**: US1–US5 suites validate writer, developer, rename, and template ripple flows using fixture workspace `tests/integration/fixtures/simple-workspace`.
- **Verify task**: `npm run verify` orchestrates lint, unit, integration before commits.

## Open Issues / Next Steps
- Extend architecture doc with knowledge-feed ingestion paths once external feeds are added (T05x).
- Document acknowledgement/lead workflows in a sibling layer-3 file once US3 (P3 story) is active.
- Evaluate performance telemetry for ripple analyzer (timings, graph size) prior to scaling to larger workspaces.
