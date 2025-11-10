# packages/server/src/runtime/changeProcessor.ts

## Metadata
- Layer: 4
- Archetype: implementation
- Code Path: packages/server/src/runtime/changeProcessor.ts
- Live Doc ID: LD-implementation-packages-server-src-runtime-changeprocessor-ts
- Generated At: 2025-11-09T22:52:11.374Z

## Authored
### Purpose
Coordinates queued workspace changes through artifact persistence, ripple analysis, diagnostics publication, and LLM ingestion follow-up for the language server.

### Notes
- Delegates change hydration to the `ArtifactWatcher`, then persists document/code artifacts, capturing ripple impacts and routing diagnostics through noise filters, hysteresis, and acknowledgement checks.
- Tracks latency per change, trimming skipped entries and completing processed batches so telemetry consumers can visualise throughput.
- Re-enqueues artifacts into the LLM ingestion manager and respects provider consent, ensuring diagnostics only emit once operators have opted in.

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-09T22:52:11.374Z","inputHash":"bca23f75b4b1a636"}]} -->
<!-- LIVE-DOC:BEGIN Public Symbols -->
### Public Symbols
#### `ChangeProcessorContext`
- Type: interface
- Source: [source](../../../../../../packages/server/src/runtime/changeProcessor.ts#L28)

#### `ChangeProcessor`
- Type: interface
- Source: [source](../../../../../../packages/server/src/runtime/changeProcessor.ts#L37)

#### `ChangeProcessorOptions`
- Type: interface
- Source: [source](../../../../../../packages/server/src/runtime/changeProcessor.ts#L42)

#### `createChangeProcessor`
- Type: function
- Source: [source](../../../../../../packages/server/src/runtime/changeProcessor.ts#L51)
<!-- LIVE-DOC:END Public Symbols -->

<!-- LIVE-DOC:BEGIN Dependencies -->
### Dependencies
- `@copilot-improvement/shared` - `GraphStore`, `KnowledgeArtifact` (type-only)
- [`changeQueue.QueuedChange`](../features/changeEvents/changeQueue.ts.mdmd.md#queuedchange) (type-only)
- [`saveCodeChange.saveCodeChange`](../features/changeEvents/saveCodeChange.ts.mdmd.md#savecodechange)
- [`saveDocumentChange.persistInferenceResult`](../features/changeEvents/saveDocumentChange.ts.mdmd.md#persistinferenceresult)
- [`saveDocumentChange.saveDocumentChange`](../features/changeEvents/saveDocumentChange.ts.mdmd.md#savedocumentchange)
- [`acknowledgementService.AcknowledgementService`](../features/diagnostics/acknowledgementService.ts.mdmd.md#acknowledgementservice) (type-only)
- [`diagnosticUtils.DiagnosticSender`](../features/diagnostics/diagnosticUtils.ts.mdmd.md#diagnosticsender) (type-only)
- [`hysteresisController.HysteresisController`](../features/diagnostics/hysteresisController.ts.mdmd.md#hysteresiscontroller) (type-only)
- [`publishCodeDiagnostics.CodeChangeContext`](../features/diagnostics/publishCodeDiagnostics.ts.mdmd.md#codechangecontext)
- [`publishCodeDiagnostics.publishCodeDiagnostics`](../features/diagnostics/publishCodeDiagnostics.ts.mdmd.md#publishcodediagnostics)
- [`publishDocDiagnostics.DocumentChangeContext`](../features/diagnostics/publishDocDiagnostics.ts.mdmd.md#documentchangecontext)
- [`publishDocDiagnostics.publishDocDiagnostics`](../features/diagnostics/publishDocDiagnostics.ts.mdmd.md#publishdocdiagnostics)
- [`rippleTypes.RippleImpact`](../features/diagnostics/rippleTypes.ts.mdmd.md#rippleimpact) (type-only)
- [`rippleAnalyzer.RippleAnalyzer`](../features/knowledge/rippleAnalyzer.ts.mdmd.md#rippleanalyzer)
- [`providerGuard.ProviderGuard`](../features/settings/providerGuard.ts.mdmd.md#providerguard) (type-only)
- [`settingsBridge.RuntimeSettings`](../features/settings/settingsBridge.ts.mdmd.md#runtimesettings) (type-only)
- [`uri.normalizeFileUri`](../features/utils/uri.ts.mdmd.md#normalizefileuri)
- [`artifactWatcher.ArtifactWatcher`](../features/watchers/artifactWatcher.ts.mdmd.md#artifactwatcher)
- [`artifactWatcher.CodeTrackedArtifactChange`](../features/watchers/artifactWatcher.ts.mdmd.md#codetrackedartifactchange)
- [`artifactWatcher.DocumentTrackedArtifactChange`](../features/watchers/artifactWatcher.ts.mdmd.md#documenttrackedartifactchange)
- [`environment.describeError`](./environment.ts.mdmd.md#describeerror)
- [`llmIngestion.LlmIngestionManager`](./llmIngestion.ts.mdmd.md#llmingestionmanager) (type-only)
- [`latencyTracker.LatencyTracker`](../telemetry/latencyTracker.ts.mdmd.md#latencytracker) (type-only)
- `vscode-languageserver/node` - `Connection` (type-only)
<!-- LIVE-DOC:END Dependencies -->
