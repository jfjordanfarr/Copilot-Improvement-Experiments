# Documentation Link Enforcement Fixture

## Metadata
- Layer: 4
- Implementation ID: IMP-614
- Code Path: [`packages/shared/src/tooling/__fixtures__/documentation-links/sample-tool.ts`](../../../packages/shared/src/tooling/__fixtures__/documentation-links/sample-tool.ts)
- Exports: sampleTool

## Purpose
Provides a minimal code surface that exercises the documentation link enforcement toolchain without introducing production dependencies. The fixture mirrors the structure documentation authors encounter when linking MDMD sections to implementation files and is consumed by verification scripts and unit tests.

## Public Symbols

### sampleTool
<!-- mdmd:code packages/shared/src/tooling/__fixtures__/documentation-links/sample-tool.ts -->
- [`packages/shared/src/tooling/__fixtures__/documentation-links/sample-tool.ts`](../../../packages/shared/src/tooling/__fixtures__/documentation-links/sample-tool.ts)
Returns a stable string so tests can verify that the enforcement CLI inserts the correct breadcrumb without mutating observable behaviour.

## Collaborators
- Exercised by [`scripts/doc-tools/__tests__/enforce-documentation-links.test.ts`](../../../scripts/doc-tools/__tests__/enforce-documentation-links.test.ts) when validating the CLI `--fix` flow.
- Referenced by [`packages/shared/src/tooling/documentationLinks.test.ts`](../../../packages/shared/src/tooling/documentationLinks.test.ts) to confirm the shared enforcement helpers detect missing breadcrumbs and autofix them.

## Linked Components
- `.mdmd/layer-4/tooling/documentationLinkBridge.mdmd.md` documents the shared enforcement engine that consumes this fixture
- `.mdmd/layer-4/tooling/benchmarkFixtureToolkit.mdmd.md` references the fixture verification pipeline that relies on doc-linkable code samples

## Evidence
- `npm run docs:links:enforce` now observes the breadcrumb on this fixture and reports a clean status after `--fix` flows.
- `npm run test:unit -- scripts/doc-tools/__tests__/enforce-documentation-links.test.ts` inserts the breadcrumb via the CLI and asserts it succeeds with `EXIT_CODES.SUCCESS`.
