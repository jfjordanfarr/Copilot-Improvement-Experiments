# packages/shared/src/tooling/githubSlugger.ts

## Metadata
- Layer: 4
- Archetype: implementation
- Code Path: packages/shared/src/tooling/githubSlugger.ts
- Live Doc ID: LD-implementation-packages-shared-src-tooling-githubslugger-ts
- Generated At: 2025-11-16T02:09:52.105Z

## Authored
### Purpose
Provides a vendored GitHub-compatible slugger so Live Docs and diagnostics can generate headings without depending on the external `github-slugger` package.

### Notes
- Mirrors the upstream removal regex and hyphenation rules while exposing both stateless `slug` helpers and the `GitHubSlugger` class for duplicate-aware generation.
- Maintains an occurrence map keyed by canonical slugs, returning context objects so callers know which duplicate index was assigned.
- Avoids pulling an ESM dependency into the shared workspace, keeping runtime usage compatible with the extension, server, and tests.

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-16T02:09:52.105Z","inputHash":"60022c047e8317af"}]} -->
<!-- LIVE-DOC:BEGIN Public Symbols -->
### Public Symbols
#### `SlugContext`
- Type: interface
- Source: [source](../../../../../../packages/shared/src/tooling/githubSlugger.ts#L11)

#### `GitHubSlugger`
- Type: class
- Source: [source](../../../../../../packages/shared/src/tooling/githubSlugger.ts#L17)

#### `slug`
- Type: function
- Source: [source](../../../../../../packages/shared/src/tooling/githubSlugger.ts#L54)

#### `createSlugger`
- Type: function
- Source: [source](../../../../../../packages/shared/src/tooling/githubSlugger.ts#L63)
<!-- LIVE-DOC:END Public Symbols -->

<!-- LIVE-DOC:BEGIN Dependencies -->
### Dependencies
- [`githubSluggerRegex.GITHUB_SLUG_REMOVE_PATTERN`](./githubSluggerRegex.ts.md#github_slug_remove_pattern)
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
- [c.docstring.test.ts](../../../server/src/features/live-docs/generation/adapters/c.docstring.test.ts.md)
- [python.docstring.test.ts](../../../server/src/features/live-docs/generation/adapters/python.docstring.test.ts.md)
- [ruby.docstring.test.ts](../../../server/src/features/live-docs/generation/adapters/ruby.docstring.test.ts.md)
- [rust.docstring.test.ts](../../../server/src/features/live-docs/generation/adapters/rust.docstring.test.ts.md)
- [core.docstring.test.ts](../../../server/src/features/live-docs/generation/core.docstring.test.ts.md)
- [generator.test.ts](../../../server/src/features/live-docs/generator.test.ts.md)
- [renderPublicSymbolLines.test.ts](../../../server/src/features/live-docs/renderPublicSymbolLines.test.ts.md)
- [generator.test.ts](../../../server/src/features/live-docs/system/generator.test.ts.md)
- [artifactWatcher.test.ts](../../../server/src/features/watchers/artifactWatcher.test.ts.md)
- [pathReferenceDetector.test.ts](../../../server/src/features/watchers/pathReferenceDetector.test.ts.md)
- [environment.test.ts](../../../server/src/runtime/environment.test.ts.md)
- [settings.test.ts](../../../server/src/runtime/settings.test.ts.md)
- [latencyTracker.test.ts](../../../server/src/telemetry/latencyTracker.test.ts.md)
- [documentationLinks.test.ts](./documentationLinks.test.ts.md)
- [githubSlugger.test.ts](./githubSlugger.test.ts.md)
- [symbolReferences.test.ts](./symbolReferences.test.ts.md)
- [enforce-documentation-links.test.ts](../../../../scripts/doc-tools/enforce-documentation-links.test.ts.md)
<!-- LIVE-DOC:END Observed Evidence -->
