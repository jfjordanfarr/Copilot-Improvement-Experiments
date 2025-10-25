# US2 Markdown Drift Suite (Layer 4)

## Source Mapping
- Test: [`tests/integration/us2/markdownDrift.test.ts`](../../../../tests/integration/us2/markdownDrift.test.ts)
- Fixture dependency: [`tests/integration/fixtures/simple-workspace/`](../../../../tests/integration/fixtures/simple-workspace/)
- Runtime collaborators:
	- [`packages/server/src/features/diagnostics/publishDocDiagnostics.ts`](../../../../packages/server/src/features/diagnostics/publishDocDiagnostics.ts)
	- [`packages/server/src/features/knowledge/knowledgeGraphBridge.ts`](../../../../packages/server/src/features/knowledge/knowledgeGraphBridge.ts)

## Responsibility
Ensure markdown drift diagnostics escalate correctly when documentation diverges from the knowledge graph. Extends the US1 coverage with additional emphasis on drift acknowledgement and remediation flows.

## Scenario Highlights
- Introduces parallel edits across multiple docs to verify hysteresis/noise handling for documentation diagnostics.
- Confirms that regenerated knowledge graph entries clear drift warnings after updates propagate through `ChangeProcessor`.

## Workflow
1. Duplicate the simple workspace fixture and modify markdown files to create deliberate drift.
2. Trigger language server processing via the VS Code harness, awaiting updates from `publishDocDiagnostics`.
3. Assert diagnostics payloads (including ripple metadata and acknowledgement tokens) match expected outcomes.

## Follow-ups
- Incorporate scenarios where code and doc changes land together to validate drift suppression heuristics.
