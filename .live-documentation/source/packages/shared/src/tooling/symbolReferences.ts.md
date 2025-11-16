# packages/shared/src/tooling/symbolReferences.ts

## Metadata
- Layer: 4
- Archetype: implementation
- Code Path: packages/shared/src/tooling/symbolReferences.ts
- Live Doc ID: LD-implementation-packages-shared-src-tooling-symbolreferences-ts
- Generated At: 2025-11-16T02:09:52.154Z

## Authored
### Purpose
Surface markdown symbol hygiene issues by scanning tracked files for duplicate heading slugs and anchor links that point at missing targets.

### Notes
- `findSymbolReferenceAnomalies` reads each file, walks headings outside fenced code blocks, and uses `GitHubSlugger.slugWithContext` to capture the canonical slug, base slug, and duplicate index for reporting.
- Inline and reference-style links are parsed through `parseLinkTarget`; relative paths resolve against the workspace root, while external schemes and anchor-less links are ignored.
- Anchor fragments are normalised (decode, trim, lowercase) before matching against the collected heading slug set, and the optional `ignoreSlugPatterns` list suppresses known false positives.
- Rule settings default to `warn` for duplicate headings and `error` for missing anchors but can be overridden per invocation; emitted issues are sorted for deterministic diagnostics.

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-16T02:09:52.154Z","inputHash":"7d76e814182bba5c"}]} -->
<!-- LIVE-DOC:BEGIN Public Symbols -->
### Public Symbols
#### `SymbolIssueKind`
- Type: type
- Source: [source](../../../../../../packages/shared/src/tooling/symbolReferences.ts#L12)

#### `SymbolIssueSeverity`
- Type: type
- Source: [source](../../../../../../packages/shared/src/tooling/symbolReferences.ts#L13)

#### `SymbolRuleSetting`
- Type: type
- Source: [source](../../../../../../packages/shared/src/tooling/symbolReferences.ts#L14)

#### `SymbolReferenceIssue`
- Type: interface
- Source: [source](../../../../../../packages/shared/src/tooling/symbolReferences.ts#L16)

#### `SymbolAuditOptions`
- Type: interface
- Source: [source](../../../../../../packages/shared/src/tooling/symbolReferences.ts#L29)

#### `findSymbolReferenceAnomalies`
- Type: function
- Source: [source](../../../../../../packages/shared/src/tooling/symbolReferences.ts#L67)
<!-- LIVE-DOC:END Public Symbols -->

<!-- LIVE-DOC:BEGIN Dependencies -->
### Dependencies
- `node:fs` - `fs`
- `node:path` - `path`
- [`githubSlugger.GitHubSlugger`](./githubSlugger.ts.md#githubslugger)
- [`markdownShared.computeLineStarts`](./markdownShared.ts.md#computelinestarts)
- [`markdownShared.extractReferenceDefinitions`](./markdownShared.ts.md#extractreferencedefinitions)
- [`markdownShared.parseLinkTarget`](./markdownShared.ts.md#parselinktarget)
- [`markdownShared.toLineAndColumn`](./markdownShared.ts.md#tolineandcolumn)
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
- [symbolReferences.test.ts](./symbolReferences.test.ts.md)
<!-- LIVE-DOC:END Observed Evidence -->
