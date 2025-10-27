# Extension Artifact Schemas (Layer 4)

## Source Mapping
- Implementation: [`packages/extension/src/shared/artifactSchemas.ts`](../../../packages/extension/src/shared/artifactSchemas.ts)
- Shared consumers: [`packages/extension/src/commands/inspectSymbolNeighbors.ts`](../../../packages/extension/src/commands/inspectSymbolNeighbors.ts), [`packages/extension/src/diagnostics/dependencyQuickPick.ts`](../../../packages/extension/src/diagnostics/dependencyQuickPick.ts), [`packages/extension/src/services/symbolBridge.ts`](../../../packages/extension/src/services/symbolBridge.ts)
- Spec alignment: [Knowledge Schema](../../../specs/001-link-aware-diagnostics/knowledge-schema.md)

## Exported Symbols
- `ArtifactLayerSchema` — zod enum describing the five-layer MDMD stack mapped into code.
- `ArtifactLayer` — inferred TypeScript union used in client code to type-check artifact layers.
- `KnowledgeArtifactSchema` — normalized artifact structure shared across extension-side collectors.
- `KnowledgeArtifact` — inferred type representing single artifacts flowing through symbol/dependency pipelines.
- `LinkRelationshipKindSchema` — zod enum for supported link relationship kinds consumed by UI and analytics.
- `LinkRelationshipKind` — inferred type that keeps command inputs aligned with server graph expectations.

## Purpose
Provide strongly typed zod schemas for extension code that exchanges artifact data with the language server. The schemas mirror server contracts, enabling the extension to validate responses before touching the VS Code UI and to generate well-formed seeds when emitting workspace knowledge.

## Responsibilities
- Offer reusable `zod` definitions for artifact shapes so commands and services agree on the contract.
- Keep exported TypeScript unions in sync with schema definitions, preventing drift between runtime validation and compile-time expectations.
- Act as the single import path for relationship/layer constants across extension modules, reducing accidental mismatches.

## Evidence
- Exercised indirectly by extension unit tests covering dependency quick pick, symbol neighbor inspection, and symbol bridge analytics.
