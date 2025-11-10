# packages/server/src/features/diagnostics/diagnosticPublisher.ts

## Metadata
- Layer: 4
- Archetype: implementation
- Code Path: packages/server/src/features/diagnostics/diagnosticPublisher.ts
- Live Doc ID: LD-implementation-packages-server-src-features-diagnostics-diagnosticpublisher-ts
- Generated At: 2025-11-09T22:52:10.119Z

## Authored
### Purpose
Caches diagnostics sent through the language server connection so subsequent document diagnostic pulls (a.k.a. refresh requests) can reuse result IDs and avoid resending unchanged payloads.

### Notes
- Implements the `DiagnosticSender` contract consumed by drift workflows; `sendDiagnostics` stores the latest list per URI and assigns an incrementing `resultId`.
- `removeByRecordId` filters diagnostics in-place when an acknowledgement clears a specific record, keeping other items intact without requiring an immediate recompute.
- `buildDocumentReport` returns `DocumentDiagnosticReportKind.Unchanged` whenever the consumer presents the current `resultId`, letting VS Code skip redundant UI updates.

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-09T22:52:10.119Z","inputHash":"6c423484ab68c553"}]} -->
<!-- LIVE-DOC:BEGIN Public Symbols -->
### Public Symbols
#### `DiagnosticPublisher`
- Type: class
- Source: [source](../../../../../../../packages/server/src/features/diagnostics/diagnosticPublisher.ts#L17)
<!-- LIVE-DOC:END Public Symbols -->

<!-- LIVE-DOC:BEGIN Dependencies -->
### Dependencies
- [`diagnosticUtils.DiagnosticSender`](./diagnosticUtils.ts.mdmd.md#diagnosticsender) (type-only)
- `vscode-languageserver/node` - `Connection`, `Diagnostic`, `DocumentDiagnosticReport`, `DocumentDiagnosticReportKind`, `PublishDiagnosticsParams`
<!-- LIVE-DOC:END Dependencies -->
