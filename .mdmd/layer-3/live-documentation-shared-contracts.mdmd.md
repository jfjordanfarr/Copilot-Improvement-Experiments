# Live Documentation Shared Contracts

## Metadata
- Layer: 3
- Archetype: component
- Live Doc ID: COMP-shared-contracts

## Authored
### Purpose
Summarise the shared type definitions and protocol contracts that glue the extension, server, and tooling together.

### Notes
- Contracts define the diagnostic payloads, dependency graphs, and override schemas that move between the extension, server, and CLI—any drift here leads to runtime failures.
- Domain models capture Live Doc metadata (archetypes, evidence summaries, link kinds) so every surface references the same vocabulary.
- We track schema evolution using semantic version comments inside the Layer‑4 docs; when contracts change we update both the extension command handlers and server serializers.
- Contracts double as prompt payloads for LLM enrichment, so keeping them clear and well documented reduces hallucination risk.

### Strategy
- Establish JSON schema outputs for key contracts (diagnostics, dependency findings) so CI can validate third-party integrations without bundling TypeScript.
- Pair contract updates with Live Doc migration scripts to automate Stage‑0 regeneration after schema shifts.

## System References
### Components
- [packages/shared/src/domain/artifacts.ts](../layer-4/packages/shared/src/domain/artifacts.ts.mdmd.md)
- [packages/shared/src/contracts/diagnostics.ts](../layer-4/packages/shared/src/contracts/diagnostics.ts.mdmd.md)
- [packages/shared/src/contracts/overrides.ts](../layer-4/packages/shared/src/contracts/overrides.ts.mdmd.md)
- [packages/shared/src/contracts/dependencies.ts](../layer-4/packages/shared/src/contracts/dependencies.ts.mdmd.md)
- [packages/shared/src/contracts/symbols.ts](../layer-4/packages/shared/src/contracts/symbols.ts.mdmd.md)

## Evidence
- Contract unit suites (`diagnostics.test.ts`, `dependencies.test.ts`) verify encoder/decoder parity.
- Integration snapshots produced by `npm run graph:snapshot` fail fast when contracts and runtime serializers diverge.
