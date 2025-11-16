# packages/server/src/runtime/changeProcessor.ts

## Metadata
- Layer: 4
- Archetype: implementation
- Code Path: packages/server/src/runtime/changeProcessor.ts
- Live Doc ID: LD-implementation-packages-server-src-runtime-changeprocessor-ts
- Generated At: 2025-11-16T02:09:51.698Z

## Authored
### Purpose
Coordinates queued workspace changes through artifact persistence, ripple analysis, diagnostics publication, and LLM ingestion follow-up for the language server.

### Notes
- Delegates change hydration to the `ArtifactWatcher`, then persists document/code artifacts, capturing ripple impacts and routing diagnostics through noise filters, hysteresis, and acknowledgement checks.
- Tracks latency per change, trimming skipped entries and completing processed batches so telemetry consumers can visualise throughput.
- Re-enqueues artifacts into the LLM ingestion manager and respects provider consent, ensuring diagnostics only emit once operators have opted in.

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-16T02:09:51.698Z","inputHash":"06954e95539d1a84"}]} -->
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
- [`changeQueue.QueuedChange`](../features/changeEvents/changeQueue.ts.md#queuedchange) (type-only)
- [`saveCodeChange.saveCodeChange`](../features/changeEvents/saveCodeChange.ts.md#savecodechange)
- [`saveDocumentChange.persistInferenceResult`](../features/changeEvents/saveDocumentChange.ts.md#persistinferenceresult)
- [`saveDocumentChange.saveDocumentChange`](../features/changeEvents/saveDocumentChange.ts.md#savedocumentchange)
- [`acknowledgementService.AcknowledgementService`](../features/diagnostics/acknowledgementService.ts.md#acknowledgementservice) (type-only)
- [`diagnosticUtils.DiagnosticSender`](../features/diagnostics/diagnosticUtils.ts.md#diagnosticsender) (type-only)
- [`hysteresisController.HysteresisController`](../features/diagnostics/hysteresisController.ts.md#hysteresiscontroller) (type-only)
- [`publishCodeDiagnostics.CodeChangeContext`](../features/diagnostics/publishCodeDiagnostics.ts.md#codechangecontext)
- [`publishCodeDiagnostics.publishCodeDiagnostics`](../features/diagnostics/publishCodeDiagnostics.ts.md#publishcodediagnostics)
- [`publishDocDiagnostics.DocumentChangeContext`](../features/diagnostics/publishDocDiagnostics.ts.md#documentchangecontext)
- [`publishDocDiagnostics.publishDocDiagnostics`](../features/diagnostics/publishDocDiagnostics.ts.md#publishdocdiagnostics)
- [`rippleTypes.RippleImpact`](../features/diagnostics/rippleTypes.ts.md#rippleimpact) (type-only)
- [`rippleAnalyzer.RippleAnalyzer`](../features/knowledge/rippleAnalyzer.ts.md#rippleanalyzer)
- [`providerGuard.ProviderGuard`](../features/settings/providerGuard.ts.md#providerguard) (type-only)
- [`settingsBridge.RuntimeSettings`](../features/settings/settingsBridge.ts.md#runtimesettings) (type-only)
- [`uri.normalizeFileUri`](../features/utils/uri.ts.md#normalizefileuri)
- [`artifactWatcher.ArtifactWatcher`](../features/watchers/artifactWatcher.ts.md#artifactwatcher)
- [`artifactWatcher.CodeTrackedArtifactChange`](../features/watchers/artifactWatcher.ts.md#codetrackedartifactchange)
- [`artifactWatcher.DocumentTrackedArtifactChange`](../features/watchers/artifactWatcher.ts.md#documenttrackedartifactchange)
- [`environment.describeError`](./environment.ts.md#describeerror)
- [`llmIngestion.LlmIngestionManager`](./llmIngestion.ts.md#llmingestionmanager) (type-only)
- [`latencyTracker.LatencyTracker`](../telemetry/latencyTracker.ts.md#latencytracker) (type-only)
- `vscode-languageserver/node` - `Connection` (type-only)
<!-- LIVE-DOC:END Dependencies -->
