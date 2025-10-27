# Export Diagnostics Command (Layer 4)

## Source Mapping
- Implementation: [`packages/extension/src/commands/exportDiagnostics.ts`](../../../packages/extension/src/commands/exportDiagnostics.ts)
- Tests: [`packages/extension/src/commands/exportDiagnostics.test.ts`](../../../packages/extension/src/commands/exportDiagnostics.test.ts)
- Shared contract: [`LIST_OUTSTANDING_DIAGNOSTICS_REQUEST`](../../../packages/shared/src/contracts/diagnostics.ts)
- Parent design: [Diagnostics Pipeline](../server-diagnostics/publishDocDiagnostics.mdmd.md)

## Responsibility
Provide a VS Code command (`linkDiagnostics.exportDiagnostics`) that exports outstanding diagnostics to user-selected CSV or JSON files. Bridges the language server’s diagnostics response into portable artifacts for incident reviews and knowledge sharing.

## Key Concepts
- **ExportFormat**: Defines formatter label, file extension, and serialization function for each supported format.
- **ListOutstandingDiagnosticsResult**: Shared contract delivering server-side diagnostics to the extension.
- **User prompts**: Quick pick collects format, save dialog selects destination, optional information message opens exported file.

## Exported Symbols
- `EXPORT_DIAGNOSTICS_COMMAND` — command identifier shared with server-side diagnostics export flows.
- `registerExportDiagnosticsCommand` — registers the export command handler against a language client.

## Internal Flow
1. Register the command with VS Code, wiring the handler to the supplied language client.
2. Prompt the user for an export format; bail out quietly on cancellation.
3. Request diagnostics from the server via `LIST_OUTSTANDING_DIAGNOSTICS_REQUEST`.
4. When diagnostics exist, serialize to CSV (quoted fields, relative URIs) or pretty JSON.
5. Ask for a save location with a timestamped default filename; write via `fs.writeFile`.
6. Offer to open the exported file; surface errors through `showErrorMessage`.

## Error Handling
- Early returns when the user cancels either prompt to avoid unnecessary IO.
- Any failure during request, serialization, or file write is caught and reported via VS Code notifications.
- Empty diagnostics collections produce an informational toast instead of writing an empty file.

## Observability Hooks
- Relies on VS Code UI prompts and notifications; no additional telemetry is emitted yet.

## Integration Notes
- CSV formatter converts URIs to workspace-relative paths so exports remain portable.
- Additional export formats can be added by extending `EXPORT_FORMATS` without modifying command wiring.
- Tests cover command registration, CSV export happy path, empty result messaging, and cancellation handling.
