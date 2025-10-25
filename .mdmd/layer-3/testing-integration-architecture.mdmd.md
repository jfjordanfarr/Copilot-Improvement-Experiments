# Integration Testing Architecture (Layer 3)

## Purpose & Scope
Describe how the workspace exercises multi-module behaviour through end-to-end and integration scenarios. This architecture ties the VS Code harness, reusable fixtures, and scenario suites together so we can validate ripple analysis, diagnostics drift, and LLM ingestion across package boundaries.

## Goals
- Provide a deterministic harness that runs against built server/extension artifacts and captures regressions in user stories (`us1`–`us5`).
- Reuse fixture workspaces so scenarios share a common vocabulary for files, relationships, and diagnostics expectations.
- Ensure test orchestration mirrors real user workflows (build clean stage, launch VS Code driver, execute scenario suites, tear down).
- Keep integration suites linked to their primary runtime responsibilities (diagnostics, knowledge ingestion, ripple transforms) for traceability.

## Key Components
| Component | Location | Responsibility |
|-----------|----------|----------------|
| Clean dist script | [`tests/integration/clean-dist.mjs`](../../tests/integration/clean-dist.mjs) | Clears `packages/*/dist` artifacts before building to guarantee scenarios run against fresh bundles. |
| VS Code test harness | [`tests/integration/vscode/runTests.ts`](../../tests/integration/vscode/runTests.ts), [`tests/integration/vscode/suite/index.ts`](../../tests/integration/vscode/suite/index.ts) | Spawns the VS Code integration runner and loads individual suites. |
| Simple workspace fixture | [`tests/integration/fixtures/simple-workspace/`](../../tests/integration/fixtures/simple-workspace/) | Provides a minimal repo with docs, code, and config used by US1–US4 suites. |
| Scenario suites | [`tests/integration/us*/**/*.test.ts`](../../tests/integration/) | Execute behaviour-focused assertions for ripple analysis, diagnostics drift, scope collisions, and LLM ingestion. |
| LLM ingestion fixtures | [`tests/integration/us5/__fixtures__/llm-ingestion/dry-run.sample.json`](../../tests/integration/us5/__fixtures__/llm-ingestion/dry-run.sample.json) | Supplies representative dry-run payloads for ingestion verification. |

## Execution Flow
1. `npm run build` prepares extension/server bundles; `tests/integration/clean-dist.mjs` wipes stale outputs if suites run standalone.
2. `tests/integration/vscode/runTests.ts` launches VS Code with the compiled extension and registers the mocha-based suite loader.
3. Scenario suites (`tests/integration/us1` – `tests/integration/us5`) hydrate the simple workspace fixture, perform actions, and assert behaviour against runtime services (`ChangeProcessor`, `KnowledgeGraphBridge`, `LlmIngestionOrchestrator`).
4. Harness utilities emit artifacts (snapshots, provenance JSON) into per-suite temp directories for post-run inspection.

## Interaction Diagram
```
clean-dist.mjs ──► build artifacts ──► vscode/runTests.ts ──► suite/index.ts
                                                      │
                                                      ▼
                                       fixtures/simple-workspace/**/*
                                                      │
                                                      ▼
                                        us* scenario suites (mocha)
```

## Observability & Maintenance
- Suites log through mocha; failures capture fixture workspace paths for manual reproduction.
- Snapshot outputs (e.g., `llm-ingestion-snapshots`) are kept inside temp dirs so runs stay isolated.
- Adding a new scenario involves wiring the suite under `tests/integration/<id>/` and updating this architecture doc with its coverage area.

## Related Documentation
- Layer 4 implementation notes for individual suites reside under `.mdmd/layer-4/testing/integration/`.
- LLM ingestion runtime design: `.mdmd/layer-3/llm-ingestion-pipeline.mdmd.md`.
- Diagnostics pipeline architecture: `.mdmd/layer-3/diagnostics-pipeline.mdmd.md`.
