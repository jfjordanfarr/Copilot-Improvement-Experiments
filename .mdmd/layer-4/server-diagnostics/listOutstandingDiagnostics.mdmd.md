# listOutstandingDiagnostics Utilities (Layer 4)

## Source Mapping
- Implementation: [`packages/server/src/features/diagnostics/listOutstandingDiagnostics.ts`](../../../packages/server/src/features/diagnostics/listOutstandingDiagnostics.ts)
- Unit tests: [`listOutstandingDiagnostics.test.ts`](../../../packages/server/src/features/diagnostics/listOutstandingDiagnostics.test.ts)
- Upstream data: [`GraphStore`](../../../packages/shared/src/db/graphStore.ts) diagnostic APIs
- Downstream consumers: acknowledgement CLI/commands exposed via [`packages/extension/src/commands/acknowledgeDiagnostic.ts`](../../../packages/extension/src/commands/acknowledgeDiagnostic.ts)

## Why This File Exists
After ripple diagnostics emit, users need a consistent way to review what remains unresolved—especially in headless contexts (CLI, CI, telemetry dashboards). The helpers in `listOutstandingDiagnostics.ts` transform raw `DiagnosticRecord`s from the graph store into lightweight summaries tailored for LSP responses and tooling. By centralising this translation layer, we guarantee that every consumer sees acknowledged timestamps, artifact metadata, and link provenance in the same shape.

## Responsibilities
- Convert graph records and related artifacts into `ListOutstandingDiagnosticsResult` payloads with ISO timestamps and optional `llmAssessment` details for each diagnostic.
- Safely handle missing artifact references (e.g., deleted files) by returning `undefined` targets/triggers instead of throwing.
- Provide a single place to evolve the summary schema; tests lock down field coverage so client commands stay backward compatible.

## Behaviour Notes
- `mapOutstandingDiagnostic` reads both the target artifact (diagnostic location) and trigger artifact (source of ripple) to populate the summary, and now preserves any stored `LlmAssessment` so the extension tree view can surface AI guidance.
- Artifact metadata is sourced lazily from `GraphStore.getArtifactById`, so the helper can be used in batch scripts without preloading graphs.
- The optional `now` factory keeps payload generation deterministic in tests and repeatable in automation.

## Follow-ups
- Extend summaries with acknowledgement history once UI surfaces require insight into who muted an alert and when.
- Add pagination helpers if diagnostic volumes exceed comfort thresholds in large repositories.
