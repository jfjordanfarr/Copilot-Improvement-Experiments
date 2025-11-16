# packages/shared/src/tooling/ollamaEndpoint.ts

## Metadata
- Layer: 4
- Archetype: implementation
- Code Path: packages/shared/src/tooling/ollamaEndpoint.ts
- Live Doc ID: LD-implementation-packages-shared-src-tooling-ollamaendpoint-ts
- Generated At: 2025-11-16T02:09:52.132Z

## Authored
### Purpose
Resolves which Ollama HTTP endpoint tooling should call, respecting env overrides, VS Code settings, and caller-provided fallbacks.

### Notes
- Checks `LINK_AWARE_OLLAMA_ENDPOINT` and `OLLAMA_ENDPOINT` first so shell scripts and CI can redirect traffic without touching editor settings.
- Reads the BYOK VS Code configuration when available, trimming whitespace but leaving validation to higher layers.
- Falls back to caller-supplied defaults or the standard `http://localhost:11434`, keeping behaviour predictable for local dev.

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-16T02:09:52.132Z","inputHash":"c4c9e1b6a157c782"}]} -->
<!-- LIVE-DOC:BEGIN Public Symbols -->
### Public Symbols
#### `ResolveOllamaEndpointOptions`
- Type: interface
- Source: [source](../../../../../../packages/shared/src/tooling/ollamaEndpoint.ts#L3)

#### `WorkspaceConfigurationLike`
- Type: interface
- Source: [source](../../../../../../packages/shared/src/tooling/ollamaEndpoint.ts#L9)

#### `resolveOllamaEndpoint`
- Type: function
- Source: [source](../../../../../../packages/shared/src/tooling/ollamaEndpoint.ts#L21)

##### `resolveOllamaEndpoint` — Summary
Resolve the Ollama endpoint that Link-Aware Diagnostics should talk to.
Priority order:
1. Explicit environment variables (`LINK_AWARE_OLLAMA_ENDPOINT`, `OLLAMA_ENDPOINT`).
2. VS Code setting `github.copilot.chat.byok.ollamaEndpoint` (if configuration is provided).
3. Callers may supply a custom fallback endpoint.
4. Default to `http://localhost:11434`.
<!-- LIVE-DOC:END Public Symbols -->

<!-- LIVE-DOC:BEGIN Dependencies -->
### Dependencies
_No dependencies documented yet_
<!-- LIVE-DOC:END Dependencies -->

<!-- LIVE-DOC:BEGIN Observed Evidence -->
### Observed Evidence
#### Vitest Unit Tests
- [analyzeWithAI.test.ts](../../../extension/src/commands/analyzeWithAI.test.ts.md)
- [exportDiagnostics.test.ts](../../../extension/src/commands/exportDiagnostics.test.ts.md)
- [inspectSymbolNeighbors.test.ts](../../../extension/src/commands/inspectSymbolNeighbors.test.ts.md)
- [dependencyQuickPick.test.ts](../../../extension/src/diagnostics/dependencyQuickPick.test.ts.md)
- [docDiagnosticProvider.test.ts](../../../extension/src/diagnostics/docDiagnosticProvider.test.ts.md)
- [localOllamaBridge.test.ts](../../../extension/src/services/localOllamaBridge.test.ts.md)
- [symbolBridge.test.ts](../../../extension/src/services/symbolBridge.test.ts.md)
- [saveCodeChange.test.ts](../../../server/src/features/changeEvents/saveCodeChange.test.ts.md)
- [saveDocumentChange.test.ts](../../../server/src/features/changeEvents/saveDocumentChange.test.ts.md)
- [inspectDependencies.test.ts](../../../server/src/features/dependencies/inspectDependencies.test.ts.md)
- [symbolNeighbors.test.ts](../../../server/src/features/dependencies/symbolNeighbors.test.ts.md)
- [acknowledgementService.test.ts](../../../server/src/features/diagnostics/acknowledgementService.test.ts.md)
- [listOutstandingDiagnostics.test.ts](../../../server/src/features/diagnostics/listOutstandingDiagnostics.test.ts.md)
- [noiseFilter.test.ts](../../../server/src/features/diagnostics/noiseFilter.test.ts.md)
- [publishDocDiagnostics.test.ts](../../../server/src/features/diagnostics/publishDocDiagnostics.test.ts.md)
- [feedFormatDetector.test.ts](../../../server/src/features/knowledge/feedFormatDetector.test.ts.md)
- [knowledgeFeedManager.test.ts](../../../server/src/features/knowledge/knowledgeFeedManager.test.ts.md)
- [knowledgeGraphBridge.test.ts](../../../server/src/features/knowledge/knowledgeGraphBridge.test.ts.md)
- [knowledgeGraphIngestor.test.ts](../../../server/src/features/knowledge/knowledgeGraphIngestor.test.ts.md)
- [llmIngestionOrchestrator.test.ts](../../../server/src/features/knowledge/llmIngestionOrchestrator.test.ts.md)
- [lsifParser.test.ts](../../../server/src/features/knowledge/lsifParser.test.ts.md)
- [rippleAnalyzer.test.ts](../../../server/src/features/knowledge/rippleAnalyzer.test.ts.md)
- [scipParser.test.ts](../../../server/src/features/knowledge/scipParser.test.ts.md)
- [workspaceIndexProvider.test.ts](../../../server/src/features/knowledge/workspaceIndexProvider.test.ts.md)
- [artifactWatcher.test.ts](../../../server/src/features/watchers/artifactWatcher.test.ts.md)
- [pathReferenceDetector.test.ts](../../../server/src/features/watchers/pathReferenceDetector.test.ts.md)
- [environment.test.ts](../../../server/src/runtime/environment.test.ts.md)
- [settings.test.ts](../../../server/src/runtime/settings.test.ts.md)
- [latencyTracker.test.ts](../../../server/src/telemetry/latencyTracker.test.ts.md)
<!-- LIVE-DOC:END Observed Evidence -->
