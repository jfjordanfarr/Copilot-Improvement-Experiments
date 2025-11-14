# packages/server/src/features/knowledge/rippleAnalyzer.ts

## Metadata
- Layer: 4
- Archetype: implementation
- Code Path: packages/server/src/features/knowledge/rippleAnalyzer.ts
- Live Doc ID: LD-implementation-packages-server-src-features-knowledge-rippleanalyzer-ts
- Generated At: 2025-11-14T18:42:06.443Z

## Authored
### Purpose
Generates ripple hints from the workspace graph so diagnostics can flag downstream files that might be impacted by a change.

### Notes
- Performs a breadth-first walk over linked artifacts with configurable depth, result limits, and relationship filters.
- Normalises URIs, deduplicates explored nodes, and records hop paths to provide actionable rationales.
- Computes heuristic confidence scores by combining relationship kind baselines with depth penalties to keep hints comparable.

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-14T18:42:06.443Z","inputHash":"5dce3d7d92168357"}]} -->
<!-- LIVE-DOC:BEGIN Public Symbols -->
### Public Symbols
#### `RippleAnalyzerLogger`
- Type: interface
- Source: [source](../../../../../../../packages/server/src/features/knowledge/rippleAnalyzer.ts#L11)

#### `RippleAnalyzerOptions`
- Type: interface
- Source: [source](../../../../../../../packages/server/src/features/knowledge/rippleAnalyzer.ts#L18)

#### `RippleAnalysisRequest`
- Type: interface
- Source: [source](../../../../../../../packages/server/src/features/knowledge/rippleAnalyzer.ts#L26)

#### `RippleHint`
- Type: type
- Source: [source](../../../../../../../packages/server/src/features/knowledge/rippleAnalyzer.ts#L34)

#### `RippleAnalyzer`
- Type: class
- Source: [source](../../../../../../../packages/server/src/features/knowledge/rippleAnalyzer.ts#L72)
<!-- LIVE-DOC:END Public Symbols -->

<!-- LIVE-DOC:BEGIN Dependencies -->
### Dependencies
- `@copilot-improvement/shared` - `GraphStore`, `KnowledgeArtifact`, `LinkRelationshipKind`, `LinkedArtifactSummary`, `RelationshipHint`
- [`uri.normalizeFileUri`](../utils/uri.ts.mdmd.md#normalizefileuri)
<!-- LIVE-DOC:END Dependencies -->

<!-- LIVE-DOC:BEGIN Observed Evidence -->
### Observed Evidence
#### Vitest Unit Tests
- [rippleAnalyzer.test.ts](./rippleAnalyzer.test.ts.mdmd.md)
<!-- LIVE-DOC:END Observed Evidence -->
