# Extension Artifact Schemas (Layer 4)

## Source Mapping
- Implementation: [`packages/extension/src/shared/artifactSchemas.ts`](../../../packages/extension/src/shared/artifactSchemas.ts)
- Shared consumers: [`packages/extension/src/commands/inspectSymbolNeighbors.ts`](../../../packages/extension/src/commands/inspectSymbolNeighbors.ts), [`packages/extension/src/diagnostics/dependencyQuickPick.ts`](../../../packages/extension/src/diagnostics/dependencyQuickPick.ts), [`packages/extension/src/services/symbolBridge.ts`](../../../packages/extension/src/services/symbolBridge.ts)
- Spec alignment: [Knowledge Schema](../../../specs/001-link-aware-diagnostics/knowledge-schema.md)

## Exported Symbols

#### ArtifactLayerSchema
The `ArtifactLayerSchema` zod enum describes the five-layer MDMD stack and keeps runtime validation aligned with documentation layers.

#### ArtifactLayer
The `ArtifactLayer` type is the inferred TypeScript union used in client code to type-check artifact layers.

#### KnowledgeArtifactSchema
The `KnowledgeArtifactSchema` definition captures the normalized artifact structure shared across extension-side collectors.

#### KnowledgeArtifact
The `KnowledgeArtifact` type represents single artifacts flowing through symbol and dependency pipelines.

#### LinkRelationshipKindSchema
The `LinkRelationshipKindSchema` zod enum lists supported link relationship kinds consumed by UI and analytics.

#### LinkRelationshipKind
The `LinkRelationshipKind` type keeps command inputs aligned with server graph expectations.

## Purpose
Provide strongly typed zod schemas for extension code that exchanges artifact data with the language server. The schemas mirror server contracts, enabling the extension to validate responses before touching the VS Code UI and to generate well-formed seeds when emitting workspace knowledge.

## Responsibilities
- Offer reusable `zod` definitions for artifact shapes so commands and services agree on the contract.
- Keep exported TypeScript unions in sync with schema definitions, preventing drift between runtime validation and compile-time expectations.
- Act as the single import path for relationship/layer constants across extension modules, reducing accidental mismatches.

## Evidence
- Exercised indirectly by extension unit tests covering dependency quick pick, symbol neighbor inspection, and symbol bridge analytics.
