# packages/server/src/features/diagnostics/symbolCorrectnessValidator.ts

## Metadata
- Layer: 4
- Archetype: implementation
- Code Path: packages/server/src/features/diagnostics/symbolCorrectnessValidator.ts
- Live Doc ID: LD-implementation-packages-server-src-features-diagnostics-symbolcorrectnessvalidator-ts
- Generated At: 2025-11-14T16:30:21.285Z

## Authored
### Purpose
Evaluates compiled symbol profile requirements against the workspace graph, producing human-readable violations whenever artifacts lack the expected inbound or outbound relationships.

### Notes
- Uses `SymbolProfileLookup` to map each `KnowledgeArtifact` to relevant profiles, then normalises URIs with `toWorkspaceRelativePath` to keep messages stable across machines.
- `generateSymbolCorrectnessDiagnostics` counts matches by walking graph neighbors via `GraphStore.listLinkedArtifacts`; identifier-based matching reuses profile source metadata to avoid re-parsing documentation.
- Violations carry depth and direction data (`incoming`/`outbound`) so diagnostics consumers can distinguish missing parents from missing dependents.

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-14T16:30:21.285Z","inputHash":"b3d64618b197c930"}]} -->
<!-- LIVE-DOC:BEGIN Public Symbols -->
### Public Symbols
#### `SymbolCorrectnessDiagnosticOptions`
- Type: interface
- Source: [source](../../../../../../../packages/server/src/features/diagnostics/symbolCorrectnessValidator.ts#L12)

#### `SymbolProfileViolation`
- Type: interface
- Source: [source](../../../../../../../packages/server/src/features/diagnostics/symbolCorrectnessValidator.ts#L19)

#### `SymbolProfileSummary`
- Type: interface
- Source: [source](../../../../../../../packages/server/src/features/diagnostics/symbolCorrectnessValidator.ts#L32)

#### `SymbolCorrectnessReport`
- Type: interface
- Source: [source](../../../../../../../packages/server/src/features/diagnostics/symbolCorrectnessValidator.ts#L40)

#### `generateSymbolCorrectnessDiagnostics`
- Type: function
- Source: [source](../../../../../../../packages/server/src/features/diagnostics/symbolCorrectnessValidator.ts#L50)
<!-- LIVE-DOC:END Public Symbols -->

<!-- LIVE-DOC:BEGIN Dependencies -->
### Dependencies
- `@copilot-improvement/shared` - `CompiledSymbolProfile`, `CompiledSymbolProfileRequirement`, `CompiledSymbolProfileTarget`, `GraphStore`, `KnowledgeArtifact`, `LinkRelationshipKind`, `SymbolProfileLookup`, `toWorkspaceRelativePath`
<!-- LIVE-DOC:END Dependencies -->
