# DiagnosticPublisher (Layer 4)

## Metadata
- Layer: 4
- Implementation ID: IMP-111
- Code Path: [`packages/server/src/features/diagnostics/diagnosticPublisher.ts`](../../../packages/server/src/features/diagnostics/diagnosticPublisher.ts)
- Exports: DiagnosticPublisher

## Source Breadcrumbs
<!-- mdmd:code packages/server/src/features/diagnostics/diagnosticPublisher.ts -->
- [`packages/server/src/features/diagnostics/diagnosticPublisher.ts`](../../../packages/server/src/features/diagnostics/diagnosticPublisher.ts) implements the language server diagnostic sender.
- Consumers:
  - [`packages/server/src/main.ts`](../../../packages/server/src/main.ts) attaches the publisher to the LSP connection and diagnostic pull handler.
  - [`packages/server/src/features/diagnostics/diagnosticUtils.ts`](../../../packages/server/src/features/diagnostics/diagnosticUtils.ts) defines the `DiagnosticSender` contract satisfied here.

## Exported Symbols

### `DiagnosticPublisher`
Implements the client-facing diagnostic sender; handles publish/pull flows plus acknowledgement pruning.

## Purpose
`DiagnosticPublisher` is the language server's bridge between our aggregated drift/ripple analysis and the VS Code diagnostic transports. It packages server-emitted findings into push notifications, retains the minimal cache required for pull-based refreshes, and prunes acknowledged entries so clients only see actionable alerts. Without it, the server would re-compute diagnostics on every pull request and acknowledgements would linger in the Problems panel.

## Responsibilities
- Emit VS Code `textDocument/publishDiagnostics` push notifications with deterministic `resultId`s per document.
- Cache the latest diagnostics per URI so `textDocument/diagnostic` pull requests can answer with `full` or `unchanged` responses.
- Drop acknowledged diagnostics via `removeByRecordId` so acks propagate to the Problems list without a full graph recomputation.
- Generate incrementing `resultId`s so the client can short-circuit unchanged diagnostics during pull sessions.

## Behaviour Notes
- Entries are keyed by URI to align with VS Code's document identity and to support multi-root workspaces.
- `removeByRecordId` intentionally ignores missing URIs: acknowledgement workflows always pass best-effort identifiers, and stale records should not throw.
- `nextResultId` combines a timestamp and sequence so concurrent acknowledgements still generate unique identifiers while remaining deterministic enough for debugging.

## Evidence
- Integration: [`tests/integration/us1/codeImpact.test.ts`](../../../tests/integration/us1/codeImpact.test.ts) verifies diagnostics publish and refresh for code ripples.
- Integration: [`tests/integration/us2/markdownDrift.test.ts`](../../../tests/integration/us2/markdownDrift.test.ts) exercises document-driven diagnostics and ensures acknowledgements clear Problems entries.
- Integration: [`tests/integration/us3/acknowledgeDiagnostics.test.ts`](../../../tests/integration/us3/acknowledgeDiagnostics.test.ts) confirms acknowledgements persist and diagnostics disappear until the next change event.
- Integration: [`tests/integration/us4/inspectSymbolNeighbors.test.ts`](../../../tests/integration/us4/inspectSymbolNeighbors.test.ts) bootstraps the language server using this publisher for pull diagnostics while driving symbol inspection commands.
- Integration: [`tests/integration/us5/transformRipple.test.ts`](../../../tests/integration/us5/transformRipple.test.ts) validates transform ripple diagnostics propagate through the same publishing path.
