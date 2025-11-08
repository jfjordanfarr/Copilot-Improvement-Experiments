---
description: "Task list for Link-Aware Diagnostics"
---

# Tasks: Link-Aware Diagnostics

**Input**: Design documents from `/specs/001-link-aware-diagnostics/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Integration tests are included per user story to guarantee independent validation of each slice.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`
- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions
- VS Code extension client: `packages/extension/`
- Language server: `packages/server/`
- Shared utilities & domain: `packages/shared/`
- SQLite migrations: `data/migrations/`
- Tests: `tests/unit/`, `tests/integration/`
## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Establish workspace configuration, tooling, and launch assets

- [x] T001 Create npm workspace definition in `package.json` with packages `packages/extension`, `packages/server`, `packages/shared`
- [x] T002 Author root TypeScript configuration at `tsconfig.base.json` with project references for all packages
- [x] T003 [P] Configure linting and formatting via `.eslintrc.cjs` and `.prettierrc` at repository root
- [x] T004 [P] Add VS Code launch and tasks configuration in `.vscode/launch.json` and `.vscode/tasks.json` for extension + tests

---

- **Purpose**: Core structure, configuration, consent gating, and shared services that every user story relies on

- [x] T005 Scaffold shared package metadata in `packages/shared/package.json` with build and type definitions
- [x] T006 [P] Create shared TypeScript config in `packages/shared/tsconfig.json` and enable path aliases
- [x] T007 Define domain models for artifacts, links, and diagnostics in `packages/shared/src/domain/artifacts.ts`
- [x] T008 [P] Implement SQLite graph store wrapper using `better-sqlite3` in `packages/shared/src/db/graphStore.ts`
- [x] T009 Create initial migration schema for nodes and edges in `data/migrations/001_init.sql`
- [x] T010 Scaffold language server entrypoint with LSP bootstrap in `packages/server/src/main.ts`
- [x] T011 [P] Configure server package manifest and scripts in `packages/server/package.json`
- [x] T012 Implement VS Code extension activation that launches the language server in `packages/extension/src/extension.ts`
- [x] T013 [P] Configure extension manifest contributions in `packages/extension/package.json` (commands, activation events)
- [x] T014 Establish Vitest test runner config in `vitest.config.ts` targeting `packages/shared`
- [x] T015 [P] Add VS Code integration harness using `@vscode/test-electron` in `tests/integration/vscode/runTests.ts`
- [x] T016 Add configuration schema under `contributes.configuration` in `packages/extension/package.json` for noise suppression, LLM provider mode, and diagnostics storage path
- [x] T017 [P] Implement settings watcher in `packages/extension/src/settings/configService.ts` that forwards configuration to the language server
- [x] T018 Implement first-run provider onboarding UI and consent gate in `packages/extension/src/onboarding/providerGate.ts`
- [x] T019 Implement provider selection handshake and diagnostics gate in `packages/server/src/features/settings/providerGuard.ts`
- [x] T020 [P] Add file maintenance watcher for deletes/moves in `packages/extension/src/watchers/fileMaintenance.ts`
- [x] T021 Implement graph cleanup and rebind prompts in `packages/server/src/features/maintenance/removeOrphans.ts`
- [x] T022 Implement change queue with debounce in `packages/server/src/features/changeEvents/changeQueue.ts`
- [x] T023 Expose debounce tuning and noise thresholds to server via `packages/server/src/features/settings/settingsBridge.ts`
- [x] T024 [P] Evaluate GitLab Knowledge Graph (GKG) integration paths and document findings in `specs/001-link-aware-diagnostics/research.md`
- [x] T025 Prototype external knowledge graph ingestion bridge in `packages/shared/src/knowledge/knowledgeGraphBridge.ts`
- [x] T054 Implement heuristic/LLM fallback inference pipeline in `packages/shared/src/inference/fallbackInference.ts` that operates without existing language-server data
- [x] T055 [P] Document external knowledge-graph schema contract in `specs/001-link-aware-diagnostics/contracts/knowledge-schema.md`
- [x] T056 Enforce schema validation for external feeds in `packages/server/src/features/knowledge/schemaValidator.ts`
- [x] T060 [P] Expand knowledge graph ingestion to support LSIF/SCIP formats via auto-detection in `packages/server/src/features/knowledge/feedFormatDetector.ts`, `lsifParser.ts`, and `scipParser.ts`

**Checkpoint**: Foundation ready — user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Developers see code-change impact (Priority: P1) 🎯 MVP

**Goal**: Raise diagnostics on every code artifact impacted by a change so engineers know the full ripple before merging

**Independent Test**: Editing a code file in a benchmark workspace triggers diagnostics on all dependent modules without relying on documentation features

- [x] T034 [P] [US1] Add integration test `tests/integration/us1/codeImpact.test.ts` covering code-change diagnostics, debounce behaviour, and dependency surfacing (with and without AST fixtures)

### Implementation for User Story 1

- [x] T035 [US1] Implement VS Code symbol ingestion adapter in `packages/extension/src/services/symbolBridge.ts`
- [x] T036 [P] [US1] Build dependency graph extraction logic in `packages/server/src/features/dependencies/buildCodeGraph.ts`
- [x] T037 [US1] Persist code change events and graph updates in `packages/server/src/features/changeEvents/saveCodeChange.ts`
- [x] T038 [US1] Publish diagnostics to dependent code modules in `packages/server/src/features/diagnostics/publishCodeDiagnostics.ts`
- [x] T039 [P] [US1] Add dependency inspection quick pick UI in `packages/extension/src/diagnostics/dependencyQuickPick.ts`
- [x] T040 [US1] Build knowledge graph ingestion pipeline in `packages/server/src/features/knowledge/knowledgeGraphBridge.ts` to support arbitrary artifact links beyond direct code imports
- [x] T041 [US1] Implement LLM-assisted ripple analysis for cross-artifact watchers in `packages/server/src/features/knowledge/rippleAnalyzer.ts`

**Checkpoint**: Code-change impact is fully functional and independently testable

---

## Phase 4: User Story 2 - Writers get drift alerts (Priority: P2)

**Goal**: Warn writers when documentation changes require code or downstream document review, powered by the shared dependency graph

**Independent Test**: Saving a mapped markdown file raises diagnostics on linked implementation files without US3 features

- [x] T026 [P] [US2] Add integration test `tests/integration/us2/markdownDrift.test.ts` covering markdown edits, debounce behaviour, and diagnostic publication

### Implementation for User Story 2

- [x] T027 [US2] Implement link override command in `packages/extension/src/commands/overrideLink.ts`
- [x] T028 [P] [US2] Build link inference orchestrator in `packages/shared/src/inference/linkInference.ts` that consumes symbol/reference providers and knowledge-graph feeds
- [x] T029 [US2] Implement markdown save watcher in `packages/server/src/features/watchers/markdownWatcher.ts`
- [x] T030 [US2] Persist documentation change events in `packages/server/src/features/changeEvents/saveDocumentChange.ts`
- [x] T031 [US2] Publish diagnostics to linked implementation artifacts in `packages/server/src/features/diagnostics/publishDocDiagnostics.ts`
- [x] T032 [P] [US2] Provide Problems panel metadata and open-linked-file quick action in `packages/extension/src/diagnostics/docDiagnosticProvider.ts`
- [x] T033 [US2] Implement hysteresis controller in `packages/server/src/features/diagnostics/hysteresisController.ts` to suppress reciprocal diagnostics until acknowledgement

**Checkpoint**: Documentation drift diagnostics operate on top of the unified graph

---

## Phase 5: User Story 3 - Leads resolve alerts efficiently (Priority: P3)

**Goal**: Provide acknowledgement workflows and consolidated views so leads can manage drift signals

**Independent Test**: Acknowledging diagnostics clears them until new changes and exports summaries without relying on prior stories

- [x] T042 [P] [US3] Add integration test `tests/integration/us3/acknowledgeDiagnostics.test.ts` covering acknowledgement flow, hysteresis release, and settings overrides

### Implementation for User Story 3

- [x] T043 [US3] Implement acknowledgement service with SQLite persistence and settings awareness in `packages/server/src/features/diagnostics/acknowledgementService.ts`
- [x] T044 [P] [US3] Create diagnostics tree view provider in `packages/extension/src/views/diagnosticsTree.ts`
- [x] T045 [US3] Implement export diagnostics command in `packages/extension/src/commands/exportDiagnostics.ts`
- [x] T046 [US3] Add configurable noise suppression filters in `packages/server/src/features/diagnostics/noiseFilter.ts`
- [x] T047 [P] [US3] Wire optional AI analysis command using `vscode.lm` in `packages/extension/src/commands/analyzeWithAI.ts`
- [x] T059 [US3] Persist drift history log entries in `packages/server/src/telemetry/driftHistoryStore.ts` and expose summary reporting demanded by FR-009

**Checkpoint**: All user stories independently functional with full workflow coverage


## Phase 6: User Story 4 - Maintainers explore symbol neighborhoods (Priority: P4)

**Goal**: Provide dogfooding tooling so maintainers and Copilot agents can inspect graph neighborhoods for any symbol or artifact prior to relying on LLM explainability.

**Independent Test**: Invoking the “Inspect Symbol Neighbors” command (or CLI) returns hop-limited neighbors grouped by relationship kind without mutating diagnostics.

- [x] T063 [P] [US4] Add server-side traversal unit tests in `packages/server/src/features/dependencies/symbolNeighbors.test.ts` covering hop limits, relationship grouping, and confidence ordering
- [x] T064 [US4] Implement neighbor traversal service in `packages/server/src/features/dependencies/symbolNeighbors.ts` that queries the graph store and enforces hop/depth limits
- [x] T065 [P] [US4] Expose an LSP request/response contract in `packages/server/src/main.ts` & `packages/shared/src/contracts/diagnostics.ts` (or new contract) with telemetry hooks for future LLM usage
- [x] T066 [US4] Implement VS Code command palette + quick pick UI in `packages/extension/src/commands/inspectSymbolNeighbors.ts` consuming the LSP request and rendering grouped results
- [x] T067 [P] [US4] Add a developer-focused CLI entry (e.g., `scripts/graph-tools/inspect-symbol.ts`) and document workflow in `.mdmd/layer-4/extension-services` or quickstart appendix for internal dogfooding

**Checkpoint**: Symbol neighborhood explorer available for dogfooding, returning actionable graph insights without relying on diagnostics.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Hardening, documentation, instrumentation, and release readiness

- [x] T048 Update walkthrough with delete/rebind workflow and settings table in `specs/001-link-aware-diagnostics/quickstart.md`
- [x] T049 [P] Add CI script `ci-check` to root `package.json` invoking headless validation
- [x] T050 [P] Document constitution alignment, consent controls, and configuration guidance in `README.md`
- [x] T051 Execute full regression suite via `tests/integration/` runner and record results in `reports/test-report.self-similarity.md` and `reports/test-report.ast.md`
- [x] T052 Instrument diagnostic latency telemetry in `packages/server/src/telemetry/latencyTracker.ts`
- [x] T053 [P] Add performance validation test `tests/integration/perf/diagnosticLatency.test.ts`
- [x] T057 Establish benchmark workspace automation in `tests/integration/benchmarks/rebuildStability.test.ts` measuring link graph reproducibility
- [x] T058 [P] Capture inference accuracy metrics and reporting pipeline in `packages/server/src/telemetry/inferenceAccuracy.ts`
- [x] T060 Curate AST-backed benchmark repos (starting with C and at least one additional language) under `tests/integration/benchmarks/ast-fixtures/`
- [x] T061 Implement AST comparison harness in `tests/integration/benchmarks/astAccuracy.test.ts` that reconciles inferred graphs with canonical ASTs
- [ ] T062 Integrate dual-mode benchmark selection (AST vs self-similarity) into CI via root `package.json` scripts and `npm run ci-check`
- [x] T073 [P] Author SlopCop markdown audit CLI docs in `.mdmd/layer-4/tooling/slopcopMarkdownLinks.mdmd.md`
- [x] T074 Implement markdown link audit CLI in `scripts/slopcop/check-markdown-links.ts` and wire into `safe:commit`
- [x] T075 [P] Vendor GitHub slugging logic and heading extractor in `packages/shared/src/tooling/symbolReferences.ts` with unit coverage + slugger parity tests
- [x] T076 Implement SlopCop symbol CLI (`scripts/slopcop/check-symbols.ts`) with fixture-backed regression test in `packages/shared/src/tooling/slopcopSymbolsCli.test.ts`
- [x] T077 Update safe-to-commit, README, and MDMD docs to cover asset + symbol audits and their configuration gates
- [x] T078 [P] Wire the local Ollama bridge (shared helper, CLI fallback, harness defaults) across `packages/extension`, `packages/shared`, `scripts/ollama`, and integration docs
- [x] T087 Curate external TypeScript benchmark snapshot from `sindresorhus/ky` and integrate it under `tests/integration/benchmarks/fixtures/typescript/ky` with accompanying manifest entry and documentation links.
- [x] T088 Materialise the full `libuv/libuv` repository via the benchmark manifest (clone → glob include/exclude) and refresh AST expectations against the staging workspace.
- [x] T089 Materialise the full `psf/requests` repository via the benchmark manifest (clone → glob include/exclude) and document dynamic import considerations surfaced by full-project analysis.
- [x] T090 Materialise the full `rust-lang/log` repository via the benchmark manifest (clone → glob include/exclude) and capture macro-expansion notes from full-project analysis.
- [ ] T091 Materialise the full `square/okhttp` repository via the benchmark manifest (clone → glob include/exclude) and map builder pattern coverage.
- [ ] T092 Materialise the full `ruby-grape/grape` repository via the benchmark manifest (clone → glob include/exclude) and annotate runtime DSL edges discovered by whole-project analysis.
- [ ] T093 Materialise the full `apache/commons-lang` repository via the benchmark manifest (clone → glob include/exclude) and document scope exclusions revealed by whole-project analysis.
- [x] T094 [P] Document Python oracle scope by updating `.mdmd/layer-2/product-roadmap.mdmd.md` and `.mdmd/layer-3/benchmark-telemetry-pipeline.mdmd.md`, and introduce Layer 4 implementation notes in `.mdmd/layer-4/testing/benchmarks/pythonFixtureOracle.mdmd.md`.
- [x] T095 Implement Python fixture oracle runtime in `packages/shared/src/testing/fixtureOracles/pythonFixtureOracle.ts` with unit coverage mirroring the TypeScript oracle API.
- [x] T096 Extend the regeneration CLI to support Python fixtures (interpreter detection, manifest integration) and plumb `--lang python` through `scripts/fixture-tools/regenerate-benchmarks.ts` and `scripts/run-benchmarks.mjs`.
- [ ] T097 Regenerate the `psf/requests` benchmark using the Python oracle, persist updated expectations under `tests/integration/benchmarks/fixtures/python/requests/`, and refresh AST accuracy reports.

---

## Phase 8: Polyglot Oracles & Sampling Harness (Priority: P2)

**Goal**: Deliver deterministic AST coverage for remaining benchmark languages while introducing an optional, confidence-gated LLM sampling pipeline for cross-language inference.

- [x] T098 [P] Implement C fixture oracle runtime in `packages/shared/src/testing/fixtureOracles/cFixtureOracle.ts` (BYO compiler discovery, edge normalization, override handling) with unit coverage.
- [x] T099 [P] Implement Rust fixture oracle runtime in `packages/shared/src/testing/fixtureOracles/rustFixtureOracle.ts` leveraging `cargo metadata`/`rust-analyzer` outputs and add unit coverage.
- [x] T100 [P] Implement Java fixture oracle runtime in `packages/shared/src/testing/fixtureOracles/javaFixtureOracle.ts` using workspace `javac`/`jdeps` introspection and add unit coverage.
- [x] T101 [P] Implement Ruby fixture oracle runtime in `packages/shared/src/testing/fixtureOracles/rubyFixtureOracle.ts` via interpreter-driven require graph harvesting with unit coverage.
- [x] T102 Refactor `scripts/fixture-tools/regenerate-benchmarks.ts` into a language-agnostic CLI supporting `--lang c|rust|java|ruby|python|typescript`, per-language artifacts, and manifest-driven toolchain hints.
- [ ] T103 Update `scripts/run-benchmarks.mjs` and `tests/integration/benchmarks/fixtures/fixtures.manifest.json` to surface polyglot oracle coverage, regenerate C/Rust/Java/Ruby fixtures, and refresh `reports/benchmarks/**/*` precision/recall snapshots. *(Regeneration now fires automatically ahead of every benchmark run; manifest surfacing and cross-language refresh still outstanding.)*
- [ ] T104 Add language-aware fallback heuristics (C calls, Rust use/mod, Java imports, Ruby require_relative) to `packages/shared/src/inference/fallbackInference.ts` with regression tests guaranteeing parity against oracle ground truth.
- [ ] T105 Build LLM sampling harness in `packages/shared/src/inference/llmSampling.ts`, integrate configurable sampling into `packages/shared/src/inference/linkInference.ts`, and expose server/extension settings for sample counts and confidence thresholds.
- [ ] T106 Extend telemetry (`packages/shared/src/telemetry/inferenceAccuracy.ts`, benchmark reporters) to record oracle coverage, sampling agreement scores, and flag divergent LLM edges for operator review.
- [x] T110 Implement C# fixture oracle runtime in `packages/shared/src/testing/fixtureOracles/csharpFixtureOracle.ts`, covering namespace, partial class, and alias edge cases with unit tests.
- [x] T111 [P] Extend fixture regeneration and fallback capture CLIs to support `--lang csharp`, including `.cs` glob defaults and integrity digests.
- [x] T112 Scaffold deterministic C# fixtures under `tests/integration/benchmarks/fixtures/csharp/` (starting with `csharp-basic`) with `expected.json`/`inferred.json` baselines and manifest wiring.
- [x] T113 Materialise a Roslyn subset benchmark (e.g., `dotnet/roslyn` compilers layer) with sparse checkout, integrity metadata, and regeneration scripts.
- [x] T114 Update `.mdmd/layer-2/product-roadmap.mdmd.md` and Layer 4 benchmark docs to document C# oracle coverage, regeneration workflow, and Roslyn onboarding checkpoints.

---

## Phase 9: LLM Ingestion (Next Iteration)

- [x] T068 Capture LLM ingestion architecture and confidence taxonomy in `.mdmd/layer-3/llm-ingestion-pipeline.mdmd.md`.
- [x] T069 [P] Author reproducible prompt templates and schema contracts under `packages/server/src/prompts/llm-ingestion/` with accompanying dry-run fixtures.
- [x] T070 Implement `LLMIngestionOrchestrator` in `packages/server/src/features/knowledge/llmIngestionOrchestrator.ts` with batching, consent gating, and throttling.
- [x] T071 [P] Build shared `relationshipExtractor` + `confidenceCalibrator` utilities in `packages/shared/src/inference/llm/` with unit coverage verifying JSON decoding and confidence mapping.
- [x] T072 Add integration test `tests/integration/us5/llmIngestionDryRun.test.ts` that exercises dry-run mode, ensures provenance storage, and verifies diagnostics ignore `Low` confidence edges by default.

---

## Phase 10: Documentation Bridges & LLM-Oriented Surfaces

- Focus: graduate workspaces from read-only observation to enforceable contracts by layering path-scoped profiles, docstring bridges, and ripple narratives that copilots and humans both trust.

- [ ] T079 [P] Define docstring bridge metadata schema in `packages/shared/src/tooling/docstringBridgeConfig.ts` and generator `scripts/docbridge/generateConfig.ts` that reads `.mdmd/layer-4/**/*.mdmd.md` front matter to emit a workspace-local `docbridge.config.json` consumed by runtime services.
- [ ] T080 Implement docstring bridge ingestion service in `packages/server/src/features/docbridge/docstringBridgeService.ts` to load generated mappings, normalize URIs, and expose drift status for diagnostics and sync commands.
- [ ] T081 Publish docstring drift diagnostics via `packages/server/src/features/diagnostics/publishDocstringDiagnostics.ts`, integrating bridge state into the existing diagnostic pipeline and respecting hysteresis/acknowledgement rules.
- [ ] T082 Add VS Code command `linkDiagnostics.syncDocstrings` in `packages/extension/src/commands/syncDocstrings.ts` that triggers bridge reloads, surfaces diff previews, and updates Layer‑4 documentation per workspace policy.
- [ ] T083 Add integration test `tests/integration/us6/docstringBridge.test.ts` covering docstring↔markdown sync, drift diagnostics, and acknowledgement flows using sample MDMD artifacts.
- [ ] T084 [P] Implement ripple narrative renderer in `packages/shared/src/reporting/rippleNarrative.ts` to produce structured JSON, Markdown tables, and ASCII diagrams with configurable depth/width for humans and copilots.
- [ ] T085 Wire the narrative renderer into `packages/extension/src/views/diagnosticsTree.ts`, `packages/extension/src/commands/exportDiagnostics.ts`, and new CLI `scripts/graph-tools/render-ripple.ts` so change-impact reports share the same human/LLM-friendly formats.
- [ ] T086 Add regression tests `tests/integration/benchmarks/rippleNarrative.test.ts` validating renderer output against golden fixtures and enforcing formatting/configuration guarantees required by FR-021.

---

## Implementation Traceability
- [`packages/server/src/main.ts`](../../packages/server/src/main.ts), [`packages/server/src/runtime/changeProcessor.ts`](../../packages/server/src/runtime/changeProcessor.ts), and [`packages/server/src/runtime/knowledgeFeeds.ts`](../../packages/server/src/runtime/knowledgeFeeds.ts) map directly to the server-side tasks enumerated above.
- [`packages/extension/src/extension.ts`](../../packages/extension/src/extension.ts), [`packages/extension/src/watchers/fileMaintenance.ts`](../../packages/extension/src/watchers/fileMaintenance.ts), and [`packages/extension/src/views/diagnosticsTree.ts`](../../packages/extension/src/views/diagnosticsTree.ts) fulfill the extension deliverables outlined throughout the task list.
- [`packages/shared/src/domain/artifacts.ts`](../../packages/shared/src/domain/artifacts.ts), [`packages/shared/src/db/graphStore.ts`](../../packages/shared/src/db/graphStore.ts), and [`packages/shared/src/inference/linkInference.ts`](../../packages/shared/src/inference/linkInference.ts) provide the shared infrastructure referenced in Phase 1 and later phases.
- [`tests/integration/us1/codeImpact.test.ts`](../../tests/integration/us1/codeImpact.test.ts), [`tests/integration/us3/acknowledgeDiagnostics.test.ts`](../../tests/integration/us3/acknowledgeDiagnostics.test.ts), and [`tests/integration/us5/transformRipple.test.ts`](../../tests/integration/us5/transformRipple.test.ts) enforce the test coverage called out alongside each user story.

## Dependencies & Execution Order

### Phase Dependencies
- **Phase 1 → Phase 2**: Setup must complete before foundational work
- **Phase 2 → Phases 3-5**: Foundational tasks (including configuration, watcher plumbing, hysteresis scaffolding) block all user stories
- **Phase 3 → Phase 4 → Phase 5**: Stories prioritized P1 → P2 → P3; later stories can start once foundational is done but should respect priority unless staffing allows parallel execution
- **Phase 6**: Runs after desired user stories are complete
- **Phase 7 → Phase 8**: Benchmark automation and reporting infrastructure must be stable before expanding deterministic coverage to additional languages.
- **Phase 8 → Phase 9**: Polyglot oracles and fallback heuristics should land before enabling LLM ingestion to sample across languages.
- **Phase 9 → Phase 10**: LLM-derived insights and telemetry inform the documentation bridges and ripple surfaces shipped in Phase 10.

### User Story Dependencies
- **US1**: Depends only on Phase 2 completion
- **US2**: Depends on Phase 2; enriches but does not strictly depend on US1 implementations
- **US3**: Depends on Phase 2; consumes diagnostics produced by earlier stories but can be developed independently using seeded data

### Task Dependencies (Highlights)
- T031 depends on T027–T030
- T033 depends on T043 (acknowledgement state definitions) and T017 (settings propagation)
- T038 depends on T035–T037
- T041 depends on T017–T019 and T025
- T056 depends on T055 and T025
- T052 depends on T022 and T038
- T057 depends on T054, T028, and T058

---

## Parallel Opportunities
- Marked `[P]` tasks across phases (e.g., T003, T004, T006, T008, T011, T013, T015, T017, T020, T024, T028, T032, T034, T036, T039, T044, T047, T049, T050, T053, T055, T058, T073, T075, T078, T079, T084, T098–T101) can proceed concurrently once prerequisites finish
- Different user stories can be staffed in parallel after Phase 2, with coordination to avoid file conflicts
- Within each story, tests (T022, T030, T036) can be drafted while implementation scaffolding proceeds

---

## Implementation Strategy

### MVP First (User Story 1)
1. Complete Phases 1 and 2
2. Deliver Phase 3 (US1) and validate via T022
3. Ship MVP to pilot teams for early feedback

### Incremental Delivery
1. Extend MVP with Phase 4 (US2) diagnostics for developers
2. Add Phase 5 (US3) management workflows when teams are ready for operational tracking
3. Finish with Phase 6 polish before broader rollout, including telemetry and performance validation
4. Harden benchmark coverage in Phase 8 so deterministic oracles exist for every curated language before sampling begins
5. Layer in Phase 9 LLM ingestion followed by Phase 10 documentation bridges to close the loop between diagnostics and ripple narratives

### Parallel Team Strategy
- Engineer A: Leads Phase 2 data store, configuration plumbing, and server backbone (T005–T021)
- Engineer B: Drives US1 implementation (T022–T029)
- Engineer C: Builds US2 dependency intelligence (T030–T035)
- Engineer D: Owns US3 acknowledgement tooling and AI opt-in (T036–T041)
- Shared effort: Polish tasks and instrumentation (T042–T047)

---

## Summary
- **Total Tasks**: 107
- **User Story Task Counts**:
  - US1: 8 tasks (including T034 test)
  - US2: 8 tasks (including T026 test)
  - US3: 7 tasks (including T042 test)
- US4: 5 tasks (including T063 test)
- **Parallel Opportunities**: 40 tasks marked `[P]`
- **Independent Tests**: T034 (US1), T026 (US2), T042 (US3), T063 (US4), TBD sampling reliability suite (Phase 8 polyglot sampling)
- **Suggested MVP Scope**: Phases 1–3 (deliver code-change impact first)
