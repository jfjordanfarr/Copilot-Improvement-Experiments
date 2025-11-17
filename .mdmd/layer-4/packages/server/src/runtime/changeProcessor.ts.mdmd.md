# packages/server/src/runtime/changeProcessor.ts

## Metadata
- Layer: 4
- Archetype: implementation
- Code Path: packages/server/src/runtime/changeProcessor.ts
- Live Doc ID: LD-implementation-packages-server-src-runtime-changeprocessor-ts
- Generated At: 2025-11-16T22:35:16.397Z

## Authored
### Purpose
Coordinates the runtime pipeline that drains `changeQueue`, persists document/code edits, and republishes diagnostics—work extracted from `main.ts` during the runtime modularisation in [AI-Agent-Workspace/ChatHistory/2025/10/Summarized/2025-10-20.SUMMARIZED.md#turn-10-option-review--runtime-modularization-commit-lines-2526-3070](../../../../../../../AI-Agent-Workspace/ChatHistory/2025/10/Summarized/2025-10-20.SUMMARIZED.md#turn-10-option-review--runtime-modularization-commit-lines-2526-3070) and extended with ripple analysis in Turn 11 of that same log.

### Notes
Acknowledgement gating, hysteresis, and ripple-aware publishing were added the following day—see [AI-Agent-Workspace/ChatHistory/2025/10/Summarized/2025-10-21.SUMMARIZED.md#turn-06-acknowledgement-hysteresis--diagnostic-replay-lines-601-1220](../../../../../../../AI-Agent-Workspace/ChatHistory/2025/10/Summarized/2025-10-21.SUMMARIZED.md#turn-06-acknowledgement-hysteresis--diagnostic-replay-lines-601-1220)—so any refactor must keep the sequencing between acknowledgement service, hysteresis controller, and ripple analyzer intact to avoid “stale diagnostic” regressions.

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-16T22:35:16.397Z","inputHash":"36e22a92f01384b7"}]} -->
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
- [`index.GraphStore`](../../../shared/src/index.ts.mdmd.md#graphstore) (type-only)
- [`index.KnowledgeArtifact`](../../../shared/src/index.ts.mdmd.md#knowledgeartifact) (type-only)
- `vscode-languageserver/node` - `Connection` (type-only)
<!-- LIVE-DOC:END Dependencies -->
