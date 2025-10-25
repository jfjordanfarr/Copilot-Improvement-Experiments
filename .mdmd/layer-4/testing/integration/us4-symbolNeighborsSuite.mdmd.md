# US4 Symbol Neighbors Suite (Layer 4)

## Source Mapping
- Tests: [`tests/integration/us4/scopeCollision.test.ts`](../../../../tests/integration/us4/scopeCollision.test.ts), [`tests/integration/us4/inspectSymbolNeighbors.test.ts`](../../../../tests/integration/us4/inspectSymbolNeighbors.test.ts)
- Fixture dependency: [`tests/integration/fixtures/simple-workspace/`](../../../../tests/integration/fixtures/simple-workspace/)
- Runtime collaborators:
	- [`packages/server/src/features/dependencies/symbolNeighbors.ts`](../../../../packages/server/src/features/dependencies/symbolNeighbors.ts)
	- [`packages/server/src/features/watchers/pathReferenceDetector.ts`](../../../../packages/server/src/features/watchers/pathReferenceDetector.ts)
	- [`packages/server/src/features/knowledge/symbolBridgeProvider.ts`](../../../../packages/server/src/features/knowledge/symbolBridgeProvider.ts)

## Responsibility
Validate that symbol neighbor queries surface accurate graph relationships and that scope collisions are handled gracefully when multiple symbols share names across files.

## Scenario Coverage
- `scopeCollision.test.ts` creates overlapping symbol names to ensure the language server de-duplicates neighbor results and warns about ambiguous references.
- `inspectSymbolNeighbors.test.ts` invokes the LSP command to retrieve neighbor listings, verifying the dependency service returns stable ordering and metadata.

## Workflow
1. Modify the simple workspace fixture to introduce colliding symbols and path references.
2. Trigger the dependency inspection commands via the VS Code harness.
3. Assert that neighbor results include the correct upstream/downstream artifacts and exclude noisy duplicates.

## Follow-ups
- Expand coverage to include cross-language neighbors once non-TypeScript fixtures are added.
