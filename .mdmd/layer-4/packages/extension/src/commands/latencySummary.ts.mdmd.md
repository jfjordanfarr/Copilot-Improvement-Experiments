# packages/extension/src/commands/latencySummary.ts

## Metadata
- Layer: 4
- Archetype: implementation
- Code Path: packages/extension/src/commands/latencySummary.ts
- Live Doc ID: LD-implementation-packages-extension-src-commands-latencysummary-ts
- Generated At: 2025-11-16T22:35:14.433Z

## Authored
### Purpose
Surfaces diagnostic latency telemetry inside VS Code by registering `linkDiagnostics.showLatencySummary`/`linkDiagnostics.getLatencySummary`, giving maintainers a quick pick that fetches the server’s `LATENCY_SUMMARY_REQUEST`, shows the latest percentiles, and optionally resets samples per [AI-Agent-Workspace/ChatHistory/2025/10/Summarized/2025-10-28.SUMMARIZED.md#turn-21-latency-command--perf-test-lines-2321-2385](../../../../../../../AI-Agent-Workspace/ChatHistory/2025/10/Summarized/2025-10-28.SUMMARIZED.md#turn-21-latency-command--perf-test-lines-2321-2385).

### Notes
- The integration perf suite exercises this command to enforce the p95 latency ceiling, so regressions are caught by `tests/integration/perf/diagnosticLatency.test.ts`; see the recorded run in [AI-Agent-Workspace/ChatHistory/2025/10/2025-10-28.md#L2329-L2380](../../../../../../../AI-Agent-Workspace/ChatHistory/2025/10/2025-10-28.md#L2329-L2380).
- Follow-up doc cleanup on Oct 28 removed inline-code command IDs after SlopCop flagged them, keeping symbol coverage green per [AI-Agent-Workspace/ChatHistory/2025/10/2025-10-28.md#L2700-L2764](../../../../../../../AI-Agent-Workspace/ChatHistory/2025/10/2025-10-28.md#L2700-L2764).

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-16T22:35:14.433Z","inputHash":"3ea537f153d2c107"}]} -->
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
- [`index.LATENCY_SUMMARY_REQUEST`](../../../shared/src/index.ts.mdmd.md#latency_summary_request)
- [`index.LatencySummary`](../../../shared/src/index.ts.mdmd.md#latencysummary)
- [`index.LatencySummaryRequest`](../../../shared/src/index.ts.mdmd.md#latencysummaryrequest)
- [`index.LatencySummaryResponse`](../../../shared/src/index.ts.mdmd.md#latencysummaryresponse)
- `vscode` - `vscode`
- `vscode-languageclient/node` - `LanguageClient`
<!-- LIVE-DOC:END Dependencies -->
