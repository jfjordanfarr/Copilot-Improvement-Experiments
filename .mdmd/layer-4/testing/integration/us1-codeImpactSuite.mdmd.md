# US1 Code Impact Suite (Layer 4)

## Source Mapping
- Tests: [`tests/integration/us1/codeImpact.test.ts`](../../../../tests/integration/us1/codeImpact.test.ts), [`tests/integration/us1/markdownDrift.test.ts`](../../../../tests/integration/us1/markdownDrift.test.ts)
- Fixture dependency: [`tests/integration/fixtures/simple-workspace/`](../../../../tests/integration/fixtures/simple-workspace/)
- Runtime collaborators:
	- [`packages/server/src/runtime/changeProcessor.ts`](../../../../packages/server/src/runtime/changeProcessor.ts)
	- [`packages/server/src/features/diagnostics/publishDocDiagnostics.ts`](../../../../packages/server/src/features/diagnostics/publishDocDiagnostics.ts)
	- [`packages/shared/src/db/graphStore.ts`](../../../../packages/shared/src/db/graphStore.ts)

## Responsibility
Validate that document/code edits within the simple workspace fixture produce the expected ripple diagnostics and markdown link drift alerts. Exercises the full language-server runtime—from change ingestion to diagnostics publication—under realistic scenarios.

## Scenario Coverage
- `codeImpact.test.ts` mutates TypeScript modules and asserts that ripple diagnostics surface impacted dependents via `ChangeProcessor` and graph updates.
- `markdownDrift.test.ts` edits documentation links to ensure markdown diagnostics flag stale or missing references using the knowledge graph bridge.

## Workflow
1. Harness copies the simple workspace fixture into a temp directory and registers it with the language server.
2. Tests apply file mutations (code or markdown) and trigger save events through the VS Code harness.
3. Assertions read diagnostics emitted by `publishDocDiagnostics`/`publishCodeDiagnostics`, ensuring ripple metadata matches expectations.

## Follow-ups
- Add negative cases covering large batch edits once throttling behaviour stabilises.
- Expand coverage to include acknowledgement flows after ripple diagnostics are fulfilled.
