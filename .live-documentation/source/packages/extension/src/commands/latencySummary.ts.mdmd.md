# packages/extension/src/commands/latencySummary.ts

## Metadata
- Layer: 4
- Archetype: implementation
- Code Path: packages/extension/src/commands/latencySummary.ts
- Live Doc ID: LD-implementation-packages-extension-src-commands-latencysummary-ts
- Generated At: 2025-11-09T22:52:09.447Z

## Authored
### Purpose
Registers telemetry commands that fetch, display, and optionally reset latency statistics collected by the language server.

### Notes
- Exposes `linkDiagnostics.getLatencySummary` for programmatic callers and `linkDiagnostics.showLatencySummary` for a UI-driven quick pick.
- Requests latency snapshots from the server with configurable sample counts, then prints a formatted report to a dedicated output channel.
- Highlights threshold breaches in the toast notification and allows operators to clear counters during the same workflow.

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-09T22:52:09.447Z","inputHash":"c4d83eabb112d909"}]} -->
<!-- LIVE-DOC:BEGIN Public Symbols -->
### Public Symbols
#### `registerLatencyTelemetryCommands`
- Type: function
- Source: [source](../../../../../../packages/extension/src/commands/latencySummary.ts#L59)

#### `LATENCY_SUMMARY_COMMAND`
- Type: const
- Source: [source](../../../../../../packages/extension/src/commands/latencySummary.ts#L120)

#### `GET_LATENCY_SUMMARY_INTERNAL_COMMAND`
- Type: const
- Source: [source](../../../../../../packages/extension/src/commands/latencySummary.ts#L121)
<!-- LIVE-DOC:END Public Symbols -->

<!-- LIVE-DOC:BEGIN Dependencies -->
### Dependencies
- `@copilot-improvement/shared` - `LATENCY_SUMMARY_REQUEST`, `LatencySummary`, `LatencySummaryRequest`, `LatencySummaryResponse`
- `vscode` - `vscode`
- `vscode-languageclient/node` - `LanguageClient`
<!-- LIVE-DOC:END Dependencies -->
