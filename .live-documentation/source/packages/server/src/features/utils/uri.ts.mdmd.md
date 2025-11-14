# packages/server/src/features/utils/uri.ts

## Metadata
- Layer: 4
- Archetype: implementation
- Code Path: packages/server/src/features/utils/uri.ts
- Live Doc ID: LD-implementation-packages-server-src-features-utils-uri-ts
- Generated At: 2025-11-14T18:42:06.570Z

## Authored
### Purpose
Provides the server feature layer with the canonical `normalizeFileUri` helper without forcing deeper imports into shared implementation paths.

### Notes
- Acts purely as a re-export so feature modules can depend on a stable local module path.
- Keeps future augmentation (e.g. additional URI helpers) colocated with the server’s feature utilities directory.

#### normalizeFileUri
Forwarded export of [`@copilot-improvement/shared/uri/normalizeFileUri`](../../../../shared/src/uri/normalizeFileUri.ts.mdmd.md#normalizefileuri) so server features can import from a local module path without reaching into shared internals.

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-14T18:42:06.570Z","inputHash":"2c8be50959f8601b"}]} -->
<!-- LIVE-DOC:BEGIN Public Symbols -->
### Public Symbols
_No public symbols detected_
<!-- LIVE-DOC:END Public Symbols -->

<!-- LIVE-DOC:BEGIN Dependencies -->
### Dependencies
- `@copilot-improvement/shared/uri/normalizeFileUri` - `normalizeFileUri` (re-export)
<!-- LIVE-DOC:END Dependencies -->

<!-- LIVE-DOC:BEGIN Observed Evidence -->
### Observed Evidence
#### Vitest Unit Tests
- [saveCodeChange.test.ts](../changeEvents/saveCodeChange.test.ts.mdmd.md)
- [saveDocumentChange.test.ts](../changeEvents/saveDocumentChange.test.ts.mdmd.md)
- [inspectDependencies.test.ts](../dependencies/inspectDependencies.test.ts.mdmd.md)
- [symbolNeighbors.test.ts](../dependencies/symbolNeighbors.test.ts.mdmd.md)
- [publishDocDiagnostics.test.ts](../diagnostics/publishDocDiagnostics.test.ts.mdmd.md)
- [knowledgeFeedManager.test.ts](../knowledge/knowledgeFeedManager.test.ts.mdmd.md)
- [knowledgeGraphBridge.test.ts](../knowledge/knowledgeGraphBridge.test.ts.mdmd.md)
- [knowledgeGraphIngestor.test.ts](../knowledge/knowledgeGraphIngestor.test.ts.mdmd.md)
- [rippleAnalyzer.test.ts](../knowledge/rippleAnalyzer.test.ts.mdmd.md)
- [artifactWatcher.test.ts](../watchers/artifactWatcher.test.ts.mdmd.md)
- [pathReferenceDetector.test.ts](../watchers/pathReferenceDetector.test.ts.mdmd.md)
- [latencyTracker.test.ts](../../telemetry/latencyTracker.test.ts.mdmd.md)
<!-- LIVE-DOC:END Observed Evidence -->
