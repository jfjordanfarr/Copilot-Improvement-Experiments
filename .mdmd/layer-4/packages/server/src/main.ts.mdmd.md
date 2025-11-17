# packages/server/src/main.ts

## Metadata
- Layer: 4
- Archetype: implementation
- Code Path: packages/server/src/main.ts
- Live Doc ID: LD-implementation-packages-server-src-main-ts
- Generated At: 2025-11-16T22:35:16.341Z

## Authored
### Purpose
Hosts the language server entrypoint, wiring the LSP connection, runtime services, and diagnostics pipelines that the extension relies on for Live Documentation guidance ([server bootstrap commits](../../../../../AI-Agent-Workspace/ChatHistory/2025/10/2025-10-24.md#L180-L260)).

### Notes
- Spins up the GraphStore, drift history tracker, acknowledgement service, and change processor so diagnostics remain stateful across sessions ([drift history rollout](../../../../../AI-Agent-Workspace/ChatHistory/2025/10/2025-10-24.md#L180-L260)).
- Registers dependency inspection, symbol neighbors, override, and latency routes exposed to the extension once those commands shipped ([symbol neighbor integration](../../../../../AI-Agent-Workspace/ChatHistory/2025/10/2025-10-24.md#L180-L260)).
- Keeps telemetry and ingestion services alive during integration runs, which is why the benchmark and US suites exercise this file whenever the language server boots ([integration replay](../../../../../AI-Agent-Workspace/ChatHistory/2025/11/2025-11-06.md#L5200-L5280)).

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-16T22:35:16.341Z","inputHash":"da88e6ff64f77327"}]} -->
<!-- LIVE-DOC:BEGIN Public Symbols -->
### Public Symbols
_No public symbols detected_
<!-- LIVE-DOC:END Public Symbols -->

<!-- LIVE-DOC:BEGIN Dependencies -->
### Dependencies
- `node:path` - `path`
- [`changeQueue.ChangeQueue`](./features/changeEvents/changeQueue.ts.mdmd.md#changequeue)
- [`changeQueue.QueuedChange`](./features/changeEvents/changeQueue.ts.mdmd.md#queuedchange)
- [`inspectDependencies.inspectDependencies`](./features/dependencies/inspectDependencies.ts.mdmd.md#inspectdependencies)
- [`symbolNeighbors.inspectSymbolNeighbors`](./features/dependencies/symbolNeighbors.ts.mdmd.md#inspectsymbolneighbors)
- [`acknowledgementService.AcknowledgementService`](./features/diagnostics/acknowledgementService.ts.mdmd.md#acknowledgementservice)
- [`diagnosticPublisher.DiagnosticPublisher`](./features/diagnostics/diagnosticPublisher.ts.mdmd.md#diagnosticpublisher)
- [`hysteresisController.HysteresisController`](./features/diagnostics/hysteresisController.ts.mdmd.md#hysteresiscontroller)
- [`listOutstandingDiagnostics.buildOutstandingDiagnosticsResult`](./features/diagnostics/listOutstandingDiagnostics.ts.mdmd.md#buildoutstandingdiagnosticsresult)
- [`llmIngestionOrchestrator.LlmIngestionOrchestrator`](./features/knowledge/llmIngestionOrchestrator.ts.mdmd.md#llmingestionorchestrator)
- [`staticFeedWorkspaceProvider.createStaticFeedWorkspaceProvider`](./features/knowledge/staticFeedWorkspaceProvider.ts.mdmd.md#createstaticfeedworkspaceprovider)
- [`symbolBridgeProvider.createSymbolBridgeProvider`](./features/knowledge/symbolBridgeProvider.ts.mdmd.md#createsymbolbridgeprovider)
- [`workspaceIndexProvider.createWorkspaceIndexProvider`](./features/knowledge/workspaceIndexProvider.ts.mdmd.md#createworkspaceindexprovider)
- [`removeOrphans.handleArtifactDeleted`](./features/maintenance/removeOrphans.ts.mdmd.md#handleartifactdeleted)
- [`removeOrphans.handleArtifactRenamed`](./features/maintenance/removeOrphans.ts.mdmd.md#handleartifactrenamed)
- [`overrideLink.applyOverrideLink`](./features/overrides/overrideLink.ts.mdmd.md#applyoverridelink)
- [`providerGuard.ExtensionSettings`](./features/settings/providerGuard.ts.mdmd.md#extensionsettings)
- [`providerGuard.ProviderGuard`](./features/settings/providerGuard.ts.mdmd.md#providerguard)
- [`settingsBridge.DEFAULT_RUNTIME_SETTINGS`](./features/settings/settingsBridge.ts.mdmd.md#default_runtime_settings)
- [`settingsBridge.RuntimeSettings`](./features/settings/settingsBridge.ts.mdmd.md#runtimesettings)
- [`settingsBridge.deriveRuntimeSettings`](./features/settings/settingsBridge.ts.mdmd.md#deriveruntimesettings)
- [`artifactWatcher.ArtifactWatcher`](./features/watchers/artifactWatcher.ts.mdmd.md#artifactwatcher)
- [`changeProcessor.createChangeProcessor`](./runtime/changeProcessor.ts.mdmd.md#createchangeprocessor)
- [`environment.ensureDirectory`](./runtime/environment.ts.mdmd.md#ensuredirectory)
- [`environment.resolveDatabasePath`](./runtime/environment.ts.mdmd.md#resolvedatabasepath)
- [`environment.resolveWorkspaceRoot`](./runtime/environment.ts.mdmd.md#resolveworkspaceroot)
- [`knowledgeFeeds.KnowledgeFeedController`](./runtime/knowledgeFeeds.ts.mdmd.md#knowledgefeedcontroller)
- [`llmIngestion.LlmIngestionManager`](./runtime/llmIngestion.ts.mdmd.md#llmingestionmanager)
- [`llmIngestion.createDefaultRelationshipExtractor`](./runtime/llmIngestion.ts.mdmd.md#createdefaultrelationshipextractor)
- [`settings.extractExtensionSettings`](./runtime/settings.ts.mdmd.md#extractextensionsettings)
- [`settings.extractTestModeOverrides`](./runtime/settings.ts.mdmd.md#extracttestmodeoverrides)
- [`settings.mergeExtensionSettings`](./runtime/settings.ts.mdmd.md#mergeextensionsettings)
- [`driftHistoryStore.DriftHistoryStore`](./telemetry/driftHistoryStore.ts.mdmd.md#drifthistorystore)
- [`latencyTracker.LatencyTracker`](./telemetry/latencyTracker.ts.mdmd.md#latencytracker)
- [`index.ACKNOWLEDGE_DIAGNOSTIC_REQUEST`](../../shared/src/index.ts.mdmd.md#acknowledge_diagnostic_request)
- [`index.AcknowledgeDiagnosticParams`](../../shared/src/index.ts.mdmd.md#acknowledgediagnosticparams)
- [`index.AcknowledgeDiagnosticResult`](../../shared/src/index.ts.mdmd.md#acknowledgediagnosticresult)
- [`index.DIAGNOSTIC_ACKNOWLEDGED_NOTIFICATION`](../../shared/src/index.ts.mdmd.md#diagnostic_acknowledged_notification)
- [`index.DiagnosticAcknowledgedPayload`](../../shared/src/index.ts.mdmd.md#diagnosticacknowledgedpayload)
- [`index.FEEDS_READY_REQUEST`](../../shared/src/index.ts.mdmd.md#feeds_ready_request)
- [`index.FeedsReadyResult`](../../shared/src/index.ts.mdmd.md#feedsreadyresult)
- [`index.GraphStore`](../../shared/src/index.ts.mdmd.md#graphstore)
- [`index.INSPECT_DEPENDENCIES_REQUEST`](../../shared/src/index.ts.mdmd.md#inspect_dependencies_request)
- [`index.INSPECT_SYMBOL_NEIGHBORS_REQUEST`](../../shared/src/index.ts.mdmd.md#inspect_symbol_neighbors_request)
- [`index.InspectDependenciesParams`](../../shared/src/index.ts.mdmd.md#inspectdependenciesparams)
- [`index.InspectDependenciesResult`](../../shared/src/index.ts.mdmd.md#inspectdependenciesresult)
- [`index.InspectSymbolNeighborsParams`](../../shared/src/index.ts.mdmd.md#inspectsymbolneighborsparams)
- [`index.InspectSymbolNeighborsResult`](../../shared/src/index.ts.mdmd.md#inspectsymbolneighborsresult)
- [`index.LATENCY_SUMMARY_REQUEST`](../../shared/src/index.ts.mdmd.md#latency_summary_request)
- [`index.LIST_OUTSTANDING_DIAGNOSTICS_REQUEST`](../../shared/src/index.ts.mdmd.md#list_outstanding_diagnostics_request)
- [`index.LatencySummaryRequest`](../../shared/src/index.ts.mdmd.md#latencysummaryrequest)
- [`index.LatencySummaryResponse`](../../shared/src/index.ts.mdmd.md#latencysummaryresponse)
- [`index.LinkInferenceOrchestrator`](../../shared/src/index.ts.mdmd.md#linkinferenceorchestrator)
- [`index.ListOutstandingDiagnosticsResult`](../../shared/src/index.ts.mdmd.md#listoutstandingdiagnosticsresult)
- [`index.OVERRIDE_LINK_REQUEST`](../../shared/src/index.ts.mdmd.md#override_link_request)
- [`index.OverrideLinkRequest`](../../shared/src/index.ts.mdmd.md#overridelinkrequest)
- [`index.OverrideLinkResponse`](../../shared/src/index.ts.mdmd.md#overridelinkresponse)
- [`index.RESET_DIAGNOSTIC_STATE_NOTIFICATION`](../../shared/src/index.ts.mdmd.md#reset_diagnostic_state_notification)
- [`index.SET_DIAGNOSTIC_ASSESSMENT_REQUEST`](../../shared/src/index.ts.mdmd.md#set_diagnostic_assessment_request)
- [`index.SetDiagnosticAssessmentParams`](../../shared/src/index.ts.mdmd.md#setdiagnosticassessmentparams)
- [`index.SetDiagnosticAssessmentResult`](../../shared/src/index.ts.mdmd.md#setdiagnosticassessmentresult)
- [`index.createRelationshipRuleProvider`](../../shared/src/index.ts.mdmd.md#createrelationshipruleprovider)
- `vscode-languageserver-textdocument` - `TextDocument`
- `vscode-languageserver/node` - `Connection`, `DidChangeConfigurationNotification`, `DidChangeConfigurationParams`, `DocumentDiagnosticParams`, `DocumentDiagnosticRequest`, `InitializeParams`, `InitializeResult`, `ProposedFeatures`, `TextDocumentChangeEvent`, `TextDocumentSyncKind`, `TextDocuments`, `TextDocumentsConfiguration`, `createConnection`
<!-- LIVE-DOC:END Dependencies -->
