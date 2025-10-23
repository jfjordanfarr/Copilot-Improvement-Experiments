# Doc Diagnostics Publisher (Layer 4)

## Source Mapping
- Implementation: [`packages/server/src/features/diagnostics/publishDocDiagnostics.ts`](../../../packages/server/src/features/diagnostics/publishDocDiagnostics.ts)
- Collaborators:
  - `ArtifactWatcher` change contexts (document category)
  - `RippleAnalyzer` hints (`RippleImpact` payloads)
  - Noise filter presets derived from runtime settings
  - Hysteresis controller + runtime noise suppression settings
- Parent design: [Diagnostics Pipeline Architecture](../../layer-3/diagnostics-pipeline.mdmd.md), [Language Server Architecture](../../layer-3/language-server-architecture.mdmd.md)
- Spec references: [FR-003](../../../specs/001-link-aware-diagnostics/spec.md#functional-requirements), [FR-006](../../../specs/001-link-aware-diagnostics/spec.md#functional-requirements), [FR-008](../../../specs/001-link-aware-diagnostics/spec.md#functional-requirements), [FR-011](../../../specs/001-link-aware-diagnostics/spec.md#functional-requirements)

## Responsibility
Transforms document change contexts into `doc-drift` diagnostics. Handles two categories:
1. **Ripple impacts** – downstream artifacts identified by the ripple analyzer (existing behaviour).
2. **Broken markdown links** – new static sweep that flags missing link targets immediately after a save.

## Execution Flow
1. Receive batched `DocumentChangeContext` items.
2. For each context:
   - Run `collectBrokenLinkDiagnostics` on the latest content (resolving relative paths against the document directory).
   - Iterate ripple impacts and honour hysteresis/budget before emitting diagnostics.
3. Accumulate diagnostics per target URI and dispatch via `DiagnosticSender`.
4. Return emission statistics (emitted count, suppressed by budget, suppressed by hysteresis) for logging/telemetry.

## Diagnostic Schema
- `code`: `doc-drift`
- `severity`: `Warning` for broken links, `Information` for ripple alerts.
- `data` payload:
  - `triggerUri` – canonical URI for the source artifact (document or link target).
  - `targetUri` – dependent artifact receiving the diagnostic.
  - `relationshipKind` – edge type (defaults to `references` for broken links).
  - `depth`, `path`, `confidence` – ripple metadata forwarded to the extension. Depth ≥2 represents multi-hop chains.
  - *Note*: Broken-link diagnostics invert `triggerUri`/`targetUri` so the missing resource is treated as the trigger and the referencing document receives the warning; extension consumers should account for this when opening quick fixes.

## Guards & Edge Cases
- Missing content returns early (no diagnostics).
- Invalid URIs in ripple hints are skipped silently.
- Diagnostics budget/hysteresis is respected before sending to prevent ricochet loops.
- Broken-link detection ignores external URLs, anchor fragments, and query strings; Windows paths are normalised to forward slashes before resolution.

## Testing
- `packages/server/src/features/diagnostics/publishDocDiagnostics.test.ts` asserts:
  - Ripple emissions respect budget/hysteresis boundaries.
  - Broken link parsing finds relative markdown targets.
  - Diagnostics payload carries expected metadata for quick actions.
- Integration suites (`tests/integration/us3`, `tests/integration/us5`) validate rename/broken path and template ripple scenarios end-to-end.

## Follow-ups
- Extend parser to support reference-style markdown links (`[id]: ./path.md`).
- Consider caching filesystem checks to avoid repeated disk hits during rapid edits.
- Surface diagnostic counts per run for telemetry once metrics infrastructure is online.
