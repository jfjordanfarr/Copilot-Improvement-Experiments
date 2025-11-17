# packages/server/src/features/diagnostics/symbolCorrectnessValidator.ts

## Metadata
- Layer: 4
- Archetype: implementation
- Code Path: packages/server/src/features/diagnostics/symbolCorrectnessValidator.ts
- Live Doc ID: LD-implementation-packages-server-src-features-diagnostics-symbolcorrectnessvalidator-ts
- Generated At: 2025-11-16T22:35:15.493Z

## Authored
### Purpose
Evaluates compiled symbol correctness profiles against the workspace graph to surface missing evidence links, anchoring the relationship-rule rollout recorded in [2025-10-31 summary](../../../../../../../AI-Agent-Workspace/ChatHistory/2025/10/Summarized/2025-10-31.SUMMARIZED.md).

### Notes
- Leverages identifier intersection, target matchers, and directionality checks refined during the Oct 30 design sessions ([2025-10-30 summary](../../../../../../../AI-Agent-Workspace/ChatHistory/2025/10/Summarized/2025-10-30.SUMMARIZED.md)) to keep MDMD-layer expectations measurable.

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-16T22:35:15.493Z","inputHash":"7ce85deb27a412f8"}]} -->
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
- [`index.CompiledSymbolProfile`](../../../../shared/src/index.ts.mdmd.md#compiledsymbolprofile)
- [`index.CompiledSymbolProfileRequirement`](../../../../shared/src/index.ts.mdmd.md#compiledsymbolprofilerequirement)
- [`index.CompiledSymbolProfileTarget`](../../../../shared/src/index.ts.mdmd.md#compiledsymbolprofiletarget)
- [`index.GraphStore`](../../../../shared/src/index.ts.mdmd.md#graphstore)
- [`index.KnowledgeArtifact`](../../../../shared/src/index.ts.mdmd.md#knowledgeartifact)
- [`index.LinkRelationshipKind`](../../../../shared/src/index.ts.mdmd.md#linkrelationshipkind)
- [`index.SymbolProfileLookup`](../../../../shared/src/index.ts.mdmd.md#symbolprofilelookup)
- [`index.toWorkspaceRelativePath`](../../../../shared/src/index.ts.mdmd.md#toworkspacerelativepath)
<!-- LIVE-DOC:END Dependencies -->
