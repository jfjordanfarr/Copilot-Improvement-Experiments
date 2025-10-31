# Relationship Rule Provider

## Metadata
- Layer: 4
- Implementation ID: IMP-405
- Code Path: [`packages/shared/src/rules/relationshipRuleProvider.ts`](../../../packages/shared/src/rules/relationshipRuleProvider.ts)
- Exports: createRelationshipRuleProvider, RelationshipRuleProviderOptions, RelationshipRuleProviderLogger

## Purpose
Exposes the relationship rule engine as a workspace link provider so the snapshot CLI and language server can infer documentation links without duplicating rule-loading logic.

## Public Symbols

### createRelationshipRuleProvider
Constructs a `WorkspaceLinkProvider` that loads the JSON rule configuration, compiles it, and emits `LinkEvidence` records for satisfied rule chains.

### RelationshipRuleProviderOptions
Configuration object governing the provider: workspace root location, optional config path overrides, provenance labels, and logger hooks for surfaced warnings.

### RelationshipRuleProviderLogger
Lightweight logger interface used to surface rule compilation warnings and evidence generation summaries.

## Collaborators
- `packages/shared/src/rules/relationshipRuleEngine.ts` performs the heavy lifting for rule compilation and evidence generation.
- `packages/shared/src/inference/linkInference.ts` consumes the provider contributions during snapshot and server runs.

## Linked Components
- [COMP-010 – Relationship Rule Engine](/.mdmd/layer-3/relationship-rule-engine.mdmd.md#comp010-relationship-rule-engine)

## Evidence
- Covered by `packages/shared/src/rules/relationshipRuleProvider.test.ts`, verifying evidence emission for a representative MDMD chain.
- Exercised indirectly by `npm run graph:snapshot`, which now registers this provider alongside the workspace index.
