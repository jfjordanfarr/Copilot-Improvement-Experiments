# publishDocDiagnostics (Layer 4)

## Source Mapping
- Implementation: [`packages/server/src/features/diagnostics/publishDocDiagnostics.ts`](../../../packages/server/src/features/diagnostics/publishDocDiagnostics.ts)
- Unit tests: [`publishDocDiagnostics.test.ts`](../../../packages/server/src/features/diagnostics/publishDocDiagnostics.test.ts)
- Collaborators:
  - [`AcknowledgementService`](../../../packages/server/src/features/diagnostics/acknowledgementService.ts) for acknowledgement-aware suppression
  - [`HysteresisController`](../../../packages/server/src/features/diagnostics/hysteresisController.ts) for temporal suppression and emission tracking
  - [`applyNoiseFilter`](../../../packages/server/src/features/diagnostics/noiseFilter.ts) for batch budgets and confidence gating
  - Ripple metadata from [`RippleImpact`](../../../packages/server/src/features/diagnostics/rippleTypes.ts)
  - Markdown link scan helpers inside the same file (`collectBrokenLinkDiagnostics`)

## Exported Symbols

### `DocumentChangeContext`
Represents a documentation-triggered ripple batch: combines the tracked change, source artifact, change-event id, and ripple impacts bound for dependent docs.

### `PublishDocDiagnosticsOptions`
Caller-supplied dependencies (diagnostic sender, contexts, runtime settings, optional hysteresis and acknowledgement services) required for publication.

### `PublishDocDiagnosticsResult`
Emission summary counters returned to the caller, including how many diagnostics shipped versus those suppressed by budgets, hysteresis, or acknowledgement, plus the noise-filter totals.

### `publishDocDiagnostics`
Main entry point that scans markdown for broken links, filters ripple impacts, enforces suppression policies, and dispatches the resulting diagnostics to the LSP client.

## Why This File Exists
Documentation churn is one of the earliest signals that ripple analysis produces. `publishDocDiagnostics` translates change-processor results into LSP diagnostics, balancing three competing goals: keep writers informed, avoid noisy repeats, and capture missing markdown assets. It is the sole coordinator that combines ripple impacts, acknowledgement state, hysteresis budgets, and markdown scans into the doc-drift diagnostics surfaced in VS Code and headless tooling.

## Responsibilities
- Iterate over document change contexts, applying noise filters and per-batch budgets from runtime settings.
- Emit markdown drift diagnostics for missing or broken links, independent of ripple analysis.
- For each ripple impact, honour hysteresis/acknowledgement suppression; record emissions to both controllers when diagnostics ship.
- Attach diagnostic metadata (relationship paths, depth, acknowledgement record ids) so the client can render actionable quick actions.
- Produce suppression metrics (`suppressedByBudget`, `suppressedByHysteresis`, `suppressedByAcknowledgement`) for telemetry and tests.

## Behaviour Notes
- Diagnostics are bucketed by target URI, allowing the sender to flush per-document updates in a single LSP notification.
- When an acknowledgement is registered, the corresponding diagnostic carries a `recordId` in `diagnostic.data` so the client can offer follow-up actions.
- Markdown link scanning ignores external URLs and fragments, focusing only on local workspace paths where we can validate existence.
- The function is side-effect free except for calls to collaborators (`sender`, `hysteresis`, `AcknowledgementService`), making unit tests deterministic with stubs.

## Error Handling
- Missing target URIs or artifacts simply skip emission for that ripple impact; the routine avoids throwing to keep batch processing resilient.
- File resolution uses try/catch for `fileURLToPath` conversions, preventing crashes when URIs are malformed.

## Follow-ups
- Integrate severity calibration once ripple confidence tiers map to doc-drift severity levels.
- Capture per-diagnostic provenance (prompt hashes, chunk ids) when LLM ingestion starts feeding documentation relationships.
