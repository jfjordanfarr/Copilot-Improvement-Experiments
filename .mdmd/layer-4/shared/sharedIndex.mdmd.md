# Shared Package Index (Layer 4)

## Source Mapping
- Barrel exports: [`packages/shared/src/index.ts`](../../../packages/shared/src/index.ts)
- Downstream consumers: `packages/server/**`, `packages/extension/**`, external tool scripts

## Responsibility
Serve as the central export surface for the shared package, re-exporting domain models, contracts, inference utilities, and LLM helpers. Simplifies imports across the monorepo and ensures external tooling (e.g., VS Code extension) consumes a consistent API.

## Key Concepts
- **Barrel strategy**: Aggregates exports from domain (`artifacts`, `graphStore`), contracts (diagnostics, maintenance, LSIF/SCIP), inference modules, and LLM components.
- **Versioned surface**: Changes to this file constitute API adjustments for server/extension and should be treated as a stability contract.

## Integration Notes
- New shared modules should be exported here after documentation coverage exists, guaranteeing availability to both runtime halves.
- When pruning exports, audit server and extension imports to avoid breaking activation.
- Scripts or external packages that import `@copilot-improvement/shared` rely on this barrel; keep its dependency footprint minimal.
