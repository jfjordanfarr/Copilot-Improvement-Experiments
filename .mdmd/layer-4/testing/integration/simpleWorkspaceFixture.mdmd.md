# Simple Workspace Fixture (Layer 4)

## Source Mapping
- Fixture root: [`tests/integration/fixtures/simple-workspace/`](../../../../tests/integration/fixtures/simple-workspace/)
- Template script: [`tests/integration/fixtures/simple-workspace/scripts/applyTemplate.ts`](../../../../tests/integration/fixtures/simple-workspace/scripts/applyTemplate.ts)
- Source modules:
	- [`tests/integration/fixtures/simple-workspace/src/core.ts`](../../../../tests/integration/fixtures/simple-workspace/src/core.ts)
	- [`tests/integration/fixtures/simple-workspace/src/dataAlpha.ts`](../../../../tests/integration/fixtures/simple-workspace/src/dataAlpha.ts)
	- [`tests/integration/fixtures/simple-workspace/src/dataBeta.ts`](../../../../tests/integration/fixtures/simple-workspace/src/dataBeta.ts)
	- [`tests/integration/fixtures/simple-workspace/src/feature.ts`](../../../../tests/integration/fixtures/simple-workspace/src/feature.ts)
	- [`tests/integration/fixtures/simple-workspace/src/util.ts`](../../../../tests/integration/fixtures/simple-workspace/src/util.ts)
- Documentation assets: [`tests/integration/fixtures/simple-workspace/docs/`](../../../../tests/integration/fixtures/simple-workspace/docs/)
- Configuration:
	- [`tests/integration/fixtures/simple-workspace/templates/config.template.yaml`](../../../../tests/integration/fixtures/simple-workspace/templates/config.template.yaml)
	- [`tests/integration/fixtures/simple-workspace/config/web.config`](../../../../tests/integration/fixtures/simple-workspace/config/web.config)

## Responsibility
Provide a deterministic miniature repository that mimics common ripple scenarios. Integration suites clone this workspace into temp directories, mutate files, and observe diagnostics/link ripple effects without depending on the host repo.

## Fixture Workflow
1. `applyTemplate.ts` copies `templates/config.template.yaml` into the workspace and applies variable substitutions for each test run.
2. Test harnesses copy the `docs/` and `src/` trees verbatim; code modules expose simple exports/imports to trigger dependency analysis.
3. Suites mutate `src/*.ts` or `docs/*.md` files, then invoke the language server to observe ripple diagnostics.

## Key Design Points
- Each file stays deliberately small and readable so assertions focus on graph/link behaviour, not parser complexity.
- `core.ts` re-exports items from `dataAlpha.ts`/`dataBeta.ts` to simulate fan-in dependencies.
- `feature.ts` and `util.ts` provide downstream consumers used in scope-collision and ripple-transform scenarios.
- Docs under `docs/` align with diagnostics drift tests, ensuring markdown references map to the knowledge graph.

## Consumers
- US1 suites (`tests/integration/us1/*.test.ts`) mutate docs/code to validate ripple diagnostics.
- US2 markdown drift scenarios reuse the same fixture with alternative assertions.
- US3 acknowledgement tests observe state transitions after fixture modifications.
- US4 scope-collision tests exercise overlapping symbol names across the fixture modules.

## Follow-ups
- Add fixture variants (e.g., multi-language projects) when future suites require broader coverage.
- Consider templating the fixture with additional metadata (layer hints, doc links) once the knowledge graph supports richer annotations.
