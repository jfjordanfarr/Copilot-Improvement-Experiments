# Publish Doc Diagnostics

## Metadata
- Layer: 4
- Implementation ID: IMP-102
- Code Path: [`packages/server/src/features/diagnostics/publishDocDiagnostics.ts`](../../../packages/server/src/features/diagnostics/publishDocDiagnostics.ts)
- Exports: DocumentChangeContext, PublishDocDiagnosticsOptions, PublishDocDiagnosticsResult, publishDocDiagnostics

## Purpose
Emit documentation drift diagnostics by combining ripple impacts, acknowledgement state, hysteresis budgets, and markdown link scans into the `doc-drift` payload consumed by VS Code and CLI tooling.

## Public Symbols

### DocumentChangeContext
Represents a documentation-triggered ripple batch: combines the tracked change, change-event id, and ripple impacts bound for dependent docs.

### PublishDocDiagnosticsOptions
Caller-supplied dependencies (diagnostic sender, contexts, runtime settings, optional hysteresis and acknowledgement services) required for publication.

### PublishDocDiagnosticsResult
Emission summary counters returned to the caller, including suppression metrics for budgets, hysteresis, and acknowledgement.

### publishDocDiagnostics
Main entry point that scans markdown for broken links, filters ripple impacts, enforces suppression policies, and dispatches diagnostics to the LSP client.

## Collaborators
- `AcknowledgementService` for acknowledgement-aware suppression.
- `HysteresisController` for temporal suppression and emission tracking.
- `applyNoiseFilter` for batch budgets and confidence gating.
- Ripple metadata contracts from `RippleImpact` plus internal `collectBrokenLinkDiagnostics` helpers.

## Linked Components
- [COMP-001 – Diagnostics Pipeline](../../layer-3/diagnostics-pipeline.mdmd.md)
- [COMP-003 – Language Server Runtime](../../layer-3/language-server-architecture.mdmd.md)
- [COMP-009 – Falsifiability Suites](../../layer-3/falsifiability/ripple-falsifiability-suite.mdmd.md)

## Evidence
- Unit tests: `publishDocDiagnostics.test.ts` cover suppression metrics, broken-link detection, and payload formatting.
- Integration suites: US1 (code impact) and US2 (markdown drift) assert emitted diagnostics and metadata.
- Safe-to-commit: regression on 2025-10-29 caught suppression drift, validating pipeline guards.

## Operational Notes
- Diagnostics bucket by target URI so the sender flushes one message per document.
- Missing targets skip emission without throwing to keep batch processing resilient.
- Future work: severity calibration tied to ripple confidence tiers and provenance capture once LLM ingestion feeds documentation edges.
