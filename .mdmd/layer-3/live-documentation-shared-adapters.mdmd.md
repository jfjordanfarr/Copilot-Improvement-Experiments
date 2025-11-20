# Live Documentation Shared Adapters

## Metadata
- Layer: 3
- Archetype: component
- Live Doc ID: COMP-shared-livedocs-adapters

## Authored
### Purpose
Explain the language-specific adapters that translate project source files into Stage‑0 Live Doc symbol graphs, keeping regeneration multi-language.

### Notes
- Each adapter harmonises language-oracle output (TypeScript program, Python module graph, C# Roslyn analysis, ASP.NET asset discovery) into the shared Live Doc schema.
- Adapters encapsulate normalisation quirks—namespace flattening, decorator support, DOM asset stitching—so downstream tooling can reason about symbols consistently.
- The index module exposes a registry consumed by generators, benchmarks, and the extension; adding a new language requires wiring it here and documenting coverage in Layer‑4 mirrors.
- We treat adapters as the guardrail against analyzer regressions by insisting benchmarks exercise every registered language before safe-commit goes green.

### Strategy
- Add Rust and Java connectors to the registry once we stabilise inference accuracy in the benchmarks, ensuring regeneration covers every vendored AST fixture.
- Document adapter configuration toggles (scoping rules, heuristic overrides) so workspace integrators can opt into language-specific behaviour without forking core code.

## System References
### Components
- [packages/shared/src/live-docs/adapters/index.ts](../layer-4/packages/shared/src/live-docs/adapters/index.ts.mdmd.md)
- [packages/shared/src/live-docs/adapters/csharp.ts](../layer-4/packages/shared/src/live-docs/adapters/csharp.ts.mdmd.md)
- [packages/shared/src/live-docs/adapters/aspnet.ts](../layer-4/packages/shared/src/live-docs/adapters/aspnet.ts.mdmd.md)
- [packages/shared/src/live-docs/adapters/python.ts](../layer-4/packages/shared/src/live-docs/adapters/python.ts.mdmd.md)
- [packages/shared/src/live-docs/adapters/rust.ts](../layer-4/packages/shared/src/live-docs/adapters/rust.ts.mdmd.md)

## Evidence
- Benchmark fixtures under `tests/integration/benchmarks/fixtures/**` replay adapter output per language, validating symbol and dependency recall.
- Headless harness scenarios (`packages/server/src/features/live-docs/harness/scenarios.ts`) assert adapters emit stable graphs during regeneration.
