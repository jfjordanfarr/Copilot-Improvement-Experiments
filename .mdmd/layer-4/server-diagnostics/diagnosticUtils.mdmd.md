# diagnosticUtils (Layer 4)

## Source Mapping
- Implementation: [`packages/server/src/features/diagnostics/diagnosticUtils.ts`](../../../packages/server/src/features/diagnostics/diagnosticUtils.ts)
- Parent design: [Diagnostics Pipeline Architecture](../../layer-3/diagnostics-pipeline.mdmd.md), [Language Server Architecture](../../layer-3/language-server-architecture.mdmd.md)

## Responsibility
Provides lightweight helpers shared by diagnostic publishers—currently a thin wrapper around LSP `sendDiagnostics` and normalised path formatting for human-readable messages.

## Behaviour
- `DiagnosticSender` interface abstracts the LSP transport so unit tests and integration harnesses can inject spies/stubs.
- `normaliseDisplayPath` converts `file://` URIs into platform-specific filesystem paths (via `fileURLToPath`) while leaving non-file schemes untouched, ensuring diagnostics read naturally in the Problems panel.

## Implementation Notes
- Uses Node’s `path.normalize` to collapse separators, producing deterministic displays across Windows/macOS/Linux.
- Falls back gracefully when URI parsing fails, returning the original string instead of throwing.

## Testing
- Behaviour exercised via publisher unit tests (pending) and integration suites; direct unit coverage is minimal given the small scope.

## Follow-ups
- Extend this file as we add shared formatting (e.g., hover markdown builders, related-location helpers) to keep publisher modules focused on business logic.
