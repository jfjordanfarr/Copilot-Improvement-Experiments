# TypeScript AST Utilities

## Metadata
- Layer: 4
- Implementation ID: IMP-349
- Code Path: [`packages/shared/src/language/typeScriptAstUtils.ts`](../../../packages/shared/src/language/typeScriptAstUtils.ts)
- Exports: IdentifierUsage, collectIdentifierUsage, extractLocalImportNames, hasRuntimeUsage, hasTypeUsage, isLikelyTypeDefinitionSpecifier

## Purpose
Provide reusable helpers for TypeScript-aware analyses that need to distinguish runtime bindings from type-only imports.
- Normalise identifier usage collection so evidence builders can filter speculative edges.
- Extract local binding names from import clauses without duplicating AST plumbing across server modules.
- Support heuristics that must respect TypeScript semantics while operating without the full language service.

## Public Symbols

### IdentifierUsage
Tuple-style record describing whether an identifier is observed in value (`value: true`) and/or type (`type: true`) positions within a source file.

### collectIdentifierUsage
Parses a `ts.SourceFile`, walks the AST, and builds a map keyed by local identifier that records whether each symbol appears in value or type contexts.

### extractLocalImportNames
Returns the local binding names declared by a given `ts.ImportClause`, covering default, named, and namespace import syntaxes.

### hasRuntimeUsage
Convenience helper that checks whether any provided local names have been observed in value positions according to the usage map.

### hasTypeUsage
Reports whether any imported identifiers are referenced purely in type positions, enabling callers to surface type-only dependencies without inflating runtime edges.

### isLikelyTypeDefinitionSpecifier
Flags module specifiers that most likely resolve to `.d.ts` or other type declaration files so callers can keep type-only imports in reference classifications.

## Collaborators
- [`packages/server/src/features/knowledge/workspaceIndexProvider.ts`](../../../packages/server/src/features/knowledge/workspaceIndexProvider.ts) relies on the helpers to emit `depends_on` evidences only for runtime imports.
- [`packages/shared/src/inference/fallbackInference.ts`](../../../packages/shared/src/inference/fallbackInference.ts) uses the utilities to suppress fallback links for purely type-level dependencies.
- [`packages/server/src/features/knowledge/workspaceIndexProvider.test.ts`](../../../packages/server/src/features/knowledge/workspaceIndexProvider.test.ts) exercises the runtime detection to guard against regressions.

## Linked Components
- [COMP-005 – Knowledge Graph Ingestion](../../layer-3/knowledge-graph-ingestion.mdmd.md#comp005-knowledge-graph-ingestion)
- [COMP-012 – Language Server Architecture](../../layer-3/language-server-architecture.mdmd.md)

## Evidence
- Unit: [`packages/shared/src/inference/fallbackInference.test.ts`](../../../packages/shared/src/inference/fallbackInference.test.ts) verifies that type-only imports no longer produce fallback links, ensuring runtime detection is honoured.
- Unit: [`packages/server/src/features/knowledge/workspaceIndexProvider.test.ts`](../../../packages/server/src/features/knowledge/workspaceIndexProvider.test.ts) confirms workspace evidences require runtime usage.
- Process: `npm run graph:audit` reports full coverage only when the helper powers both workspace and fallback analyses, providing ongoing validation of MDMD link integrity.
