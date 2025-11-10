# Relationship Rule Resolvers

## Metadata
- Layer: 4
- Implementation ID: IMP-403
- Code Path: [`packages/shared/src/rules/relationshipResolvers.ts`](../../../packages/shared/src/rules/relationshipResolvers.ts)
- Exports: createBuiltInResolvers

## Purpose
Provides the resolver catalogue that interprets rule hops, including markdown link scanning and MDMD metadata inspection, so declarative relationship rules can translate authoring conventions into concrete graph edges.

## Public Symbols

### createBuiltInResolvers
Constructs the resolver registry, currently exposing the `markdown-links` resolver (parses inline and reference-style links) and the `mdmd-code-paths` resolver (reads Layer 4 metadata to discover documented code paths).

## Collaborators
- `packages/shared/src/tooling/pathUtils.ts` normalises workspace-relative and absolute paths so resolver results map cleanly onto artifact URIs.
- `packages/shared/src/tooling/markdownShared.ts` extracts markdown reference definitions that the resolvers rely on to interpret link targets.

## Linked Components
- [COMP-010 – Relationship Rule Engine](/.mdmd/layer-3/relationship-rule-engine.mdmd.md#comp010-relationship-rule-engine)

## Evidence
- Pending unit coverage under `packages/shared/src/rules/relationshipResolvers.test.ts` to capture resolver edge cases.
- Manual validation: `npm run graph:snapshot` should now produce `documents` edges for Layer 4 docs referencing code via metadata or inline links.
