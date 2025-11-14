# packages/server/src/main.ts

## Metadata
- Layer: 4
- Archetype: implementation
- Code Path: packages/server/src/main.ts
- Live Doc ID: LD-implementation-packages-server-src-main-ts
- Generated At: 2025-11-14T16:30:21.545Z

## Authored
### Purpose
Bootstraps the language server runtime: establishes the LSP connection, wires telemetry and inference services, and coordinates diagnostics/override handlers for the Live Documentation workflow.

### Notes
- During `onInitialize` it resolves workspace paths, opens the persistent `GraphStore`, hydrates runtime settings, and seeds orchestrators (artifact watcher, LLM ingestion, knowledge feeds) before advertising server capabilities.
- Registers request/notification handlers covering diagnostics acknowledgements, link overrides, dependency inspection, latency summaries, and feed health so the extension can orchestrate impact analysis in real time.
- Responds to configuration updates by recomputing runtime settings, retuning debounce windows/noise filters, and reinitialising ancillary services to ensure operator consent and performance knobs take effect immediately.

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-14T16:30:21.545Z","inputHash":"066b5ec445ecf63f"}]} -->
<!-- LIVE-DOC:BEGIN Public Symbols -->
### Public Symbols
_No public symbols detected_
<!-- LIVE-DOC:END Public Symbols -->

<!-- LIVE-DOC:BEGIN Dependencies -->
### Dependencies
- `@copilot-improvement/shared` - `ACKNOWLEDGE_DIAGNOSTIC_REQUEST`, `AcknowledgeDiagnosticParams`, `AcknowledgeDiagnosticResult`, `DIAGNOSTIC_ACKNOWLEDGED_NOTIFICATION`, `DiagnosticAcknowledgedPayload`, `FEEDS_READY_REQUEST`, `FeedsReadyResult`, `GraphStore`, `INSPECT_DEPENDENCIES_REQUEST`, `INSPECT_SYMBOL_NEIGHBORS_REQUEST`, `InspectDependenciesParams`, `InspectDependenciesResult`, `InspectSymbolNeighborsParams`, `InspectSymbolNeighborsResult`, `LATENCY_SUMMARY_REQUEST`, `LIST_OUTSTANDING_DIAGNOSTICS_REQUEST`, `LatencySummaryRequest`, `LatencySummaryResponse`, `LinkInferenceOrchestrator`, `ListOutstandingDiagnosticsResult`, `OVERRIDE_LINK_REQUEST`, `OverrideLinkRequest`, `OverrideLinkResponse`, `RESET_DIAGNOSTIC_STATE_NOTIFICATION`, `SET_DIAGNOSTIC_ASSESSMENT_REQUEST`, `SetDiagnosticAssessmentParams`, `SetDiagnosticAssessmentResult`, `createRelationshipRuleProvider`
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
- `vscode-languageserver-textdocument` - `TextDocument`
- `vscode-languageserver/node` - `Connection`, `DidChangeConfigurationNotification`, `DidChangeConfigurationParams`, `DocumentDiagnosticParams`, `DocumentDiagnosticRequest`, `InitializeParams`, `InitializeResult`, `ProposedFeatures`, `TextDocumentChangeEvent`, `TextDocumentSyncKind`, `TextDocuments`, `TextDocumentsConfiguration`, `createConnection`
<!-- LIVE-DOC:END Dependencies -->
