# US3 Diagnostics Acknowledgement Suite (Layer 4)

## Source Mapping
- Tests: [`tests/integration/us3/acknowledgeDiagnostics.test.ts`](../../../../tests/integration/us3/acknowledgeDiagnostics.test.ts), [`tests/integration/us3/markdownLinkDrift.test.ts`](../../../../tests/integration/us3/markdownLinkDrift.test.ts)
- Fixture dependency: [`tests/integration/fixtures/simple-workspace/`](../../../../tests/integration/fixtures/simple-workspace/)
- Runtime collaborators:
	- [`packages/server/src/features/diagnostics/acknowledgementService.ts`](../../../../packages/server/src/features/diagnostics/acknowledgementService.ts)
	- [`packages/server/src/features/diagnostics/listOutstandingDiagnostics.ts`](../../../../packages/server/src/features/diagnostics/listOutstandingDiagnostics.ts)
	- [`packages/server/src/features/diagnostics/publishDocDiagnostics.ts`](../../../../packages/server/src/features/diagnostics/publishDocDiagnostics.ts)

## Responsibility
Verify that users can acknowledge diagnostics, that acknowledgements persist across refreshes, and that markdown link drift diagnostics respect acknowledgement state transitions.

## Scenario Coverage
- Exercises acknowledgement CRUD via the language server protocol and ensures the knowledge graph reflects acknowledged entries.
- Confirms that previously acknowledged diagnostics resurface when regressions occur.
- Checks that markdown drift warnings respect acknowledgement state and include provenance metadata for auditing.

## Workflow
1. Use the VS Code harness to generate diagnostics by mutating fixture files.
2. Call acknowledgement APIs through the extension test hooks and observe updates from `acknowledgementService`.
3. Validate outstanding diagnostic listings (`listOutstandingDiagnostics`) match expected acknowledged/unacknowledged sets.

## Follow-ups
- Add concurrent acknowledgement scenarios once multi-user state replication is implemented.
