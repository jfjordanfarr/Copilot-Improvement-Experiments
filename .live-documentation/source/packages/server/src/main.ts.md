# packages/server/src/main.ts

## Metadata
- Layer: 4
- Archetype: implementation
- Code Path: packages/server/src/main.ts
- Live Doc ID: LD-implementation-packages-server-src-main-ts
- Generated At: 2025-11-16T02:09:51.685Z

## Authored
### Purpose
Bootstraps the language server runtime: establishes the LSP connection, wires telemetry and inference services, and coordinates diagnostics/override handlers for the Live Documentation workflow.

### Notes
- During `onInitialize` it resolves workspace paths, opens the persistent `GraphStore`, hydrates runtime settings, and seeds orchestrators (artifact watcher, LLM ingestion, knowledge feeds) before advertising server capabilities.
- Registers request/notification handlers covering diagnostics acknowledgements, link overrides, dependency inspection, latency summaries, and feed health so the extension can orchestrate impact analysis in real time.
- Responds to configuration updates by recomputing runtime settings, retuning debounce windows/noise filters, and reinitialising ancillary services to ensure operator consent and performance knobs take effect immediately.

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-16T02:09:51.685Z","inputHash":"066b5ec445ecf63f"}]} -->
<!-- LIVE-DOC:BEGIN Public Symbols -->
### Public Symbols
_No public symbols detected_
<!-- LIVE-DOC:END Public Symbols -->

<!-- LIVE-DOC:BEGIN Dependencies -->
### Dependencies
- `@copilot-improvement/shared` - `ACKNOWLEDGE_DIAGNOSTIC_REQUEST`, `AcknowledgeDiagnosticParams`, `AcknowledgeDiagnosticResult`, `DIAGNOSTIC_ACKNOWLEDGED_NOTIFICATION`, `DiagnosticAcknowledgedPayload`, `FEEDS_READY_REQUEST`, `FeedsReadyResult`, `GraphStore`, `INSPECT_DEPENDENCIES_REQUEST`, `INSPECT_SYMBOL_NEIGHBORS_REQUEST`, `InspectDependenciesParams`, `InspectDependenciesResult`, `InspectSymbolNeighborsParams`, `InspectSymbolNeighborsResult`, `LATENCY_SUMMARY_REQUEST`, `LIST_OUTSTANDING_DIAGNOSTICS_REQUEST`, `LatencySummaryRequest`, `LatencySummaryResponse`, `LinkInferenceOrchestrator`, `ListOutstandingDiagnosticsResult`, `OVERRIDE_LINK_REQUEST`, `OverrideLinkRequest`, `OverrideLinkResponse`, `RESET_DIAGNOSTIC_STATE_NOTIFICATION`, `SET_DIAGNOSTIC_ASSESSMENT_REQUEST`, `SetDiagnosticAssessmentParams`, `SetDiagnosticAssessmentResult`, `createRelationshipRuleProvider`
- `node:path` - `path`
- [`changeQueue.ChangeQueue`](./features/changeEvents/changeQueue.ts.md#changequeue)
- [`changeQueue.QueuedChange`](./features/changeEvents/changeQueue.ts.md#queuedchange)
- [`inspectDependencies.inspectDependencies`](./features/dependencies/inspectDependencies.ts.md#inspectdependencies)
- [`symbolNeighbors.inspectSymbolNeighbors`](./features/dependencies/symbolNeighbors.ts.md#inspectsymbolneighbors)
- [`acknowledgementService.AcknowledgementService`](./features/diagnostics/acknowledgementService.ts.md#acknowledgementservice)
- [`diagnosticPublisher.DiagnosticPublisher`](./features/diagnostics/diagnosticPublisher.ts.md#diagnosticpublisher)
- [`hysteresisController.HysteresisController`](./features/diagnostics/hysteresisController.ts.md#hysteresiscontroller)
- [`listOutstandingDiagnostics.buildOutstandingDiagnosticsResult`](./features/diagnostics/listOutstandingDiagnostics.ts.md#buildoutstandingdiagnosticsresult)
- [`llmIngestionOrchestrator.LlmIngestionOrchestrator`](./features/knowledge/llmIngestionOrchestrator.ts.md#llmingestionorchestrator)
- [`staticFeedWorkspaceProvider.createStaticFeedWorkspaceProvider`](./features/knowledge/staticFeedWorkspaceProvider.ts.md#createstaticfeedworkspaceprovider)
- [`symbolBridgeProvider.createSymbolBridgeProvider`](./features/knowledge/symbolBridgeProvider.ts.md#createsymbolbridgeprovider)
- [`workspaceIndexProvider.createWorkspaceIndexProvider`](./features/knowledge/workspaceIndexProvider.ts.md#createworkspaceindexprovider)
- [`removeOrphans.handleArtifactDeleted`](./features/maintenance/removeOrphans.ts.md#handleartifactdeleted)
- [`removeOrphans.handleArtifactRenamed`](./features/maintenance/removeOrphans.ts.md#handleartifactrenamed)
- [`overrideLink.applyOverrideLink`](./features/overrides/overrideLink.ts.md#applyoverridelink)
- [`providerGuard.ExtensionSettings`](./features/settings/providerGuard.ts.md#extensionsettings)
- [`providerGuard.ProviderGuard`](./features/settings/providerGuard.ts.md#providerguard)
- [`settingsBridge.DEFAULT_RUNTIME_SETTINGS`](./features/settings/settingsBridge.ts.md#default_runtime_settings)
- [`settingsBridge.RuntimeSettings`](./features/settings/settingsBridge.ts.md#runtimesettings)
- [`settingsBridge.deriveRuntimeSettings`](./features/settings/settingsBridge.ts.md#deriveruntimesettings)
- [`artifactWatcher.ArtifactWatcher`](./features/watchers/artifactWatcher.ts.md#artifactwatcher)
- [`changeProcessor.createChangeProcessor`](./runtime/changeProcessor.ts.md#createchangeprocessor)
- [`environment.ensureDirectory`](./runtime/environment.ts.md#ensuredirectory)
- [`environment.resolveDatabasePath`](./runtime/environment.ts.md#resolvedatabasepath)
- [`environment.resolveWorkspaceRoot`](./runtime/environment.ts.md#resolveworkspaceroot)
- [`knowledgeFeeds.KnowledgeFeedController`](./runtime/knowledgeFeeds.ts.md#knowledgefeedcontroller)
- [`llmIngestion.LlmIngestionManager`](./runtime/llmIngestion.ts.md#llmingestionmanager)
- [`llmIngestion.createDefaultRelationshipExtractor`](./runtime/llmIngestion.ts.md#createdefaultrelationshipextractor)
- [`settings.extractExtensionSettings`](./runtime/settings.ts.md#extractextensionsettings)
- [`settings.extractTestModeOverrides`](./runtime/settings.ts.md#extracttestmodeoverrides)
- [`settings.mergeExtensionSettings`](./runtime/settings.ts.md#mergeextensionsettings)
- [`driftHistoryStore.DriftHistoryStore`](./telemetry/driftHistoryStore.ts.md#drifthistorystore)
- [`latencyTracker.LatencyTracker`](./telemetry/latencyTracker.ts.md#latencytracker)
- `vscode-languageserver-textdocument` - `TextDocument`
- `vscode-languageserver/node` - `Connection`, `DidChangeConfigurationNotification`, `DidChangeConfigurationParams`, `DocumentDiagnosticParams`, `DocumentDiagnosticRequest`, `InitializeParams`, `InitializeResult`, `ProposedFeatures`, `TextDocumentChangeEvent`, `TextDocumentSyncKind`, `TextDocuments`, `TextDocumentsConfiguration`, `createConnection`
<!-- LIVE-DOC:END Dependencies -->
