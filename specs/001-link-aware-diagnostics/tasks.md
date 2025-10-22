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

---

## Phase 1: Setup (Shared Infrastructure)

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

---

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
- [ ] T046 [US3] Add configurable noise suppression filters in `packages/server/src/features/diagnostics/noiseFilter.ts`
- [ ] T047 [P] [US3] Wire optional AI analysis command using `vscode.lm` in `packages/extension/src/commands/analyzeWithAI.ts`
- [ ] T059 [US3] Persist drift history log entries in `packages/server/src/telemetry/driftHistoryStore.ts` and expose summary reporting demanded by FR-009

**Checkpoint**: All user stories independently functional with full workflow coverage

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Hardening, documentation, instrumentation, and release readiness

- [ ] T048 Update walkthrough with delete/rebind workflow and settings table in `specs/001-link-aware-diagnostics/quickstart.md`
- [ ] T049 [P] Add CI script `ci-check` to root `package.json` invoking headless validation
- [ ] T050 [P] Document constitution alignment, consent controls, and configuration guidance in `README.md`
- [ ] T051 Execute full regression suite via `tests/integration/` runner and record results in `docs/test-report.md`
- [ ] T052 Instrument diagnostic latency telemetry in `packages/server/src/telemetry/latencyTracker.ts`
- [ ] T053 [P] Add performance validation test `tests/integration/perf/diagnosticLatency.test.ts`
- [ ] T057 Establish benchmark workspace automation in `tests/integration/benchmarks/rebuildStability.test.ts` measuring link graph reproducibility
- [ ] T058 [P] Capture inference accuracy metrics and reporting pipeline in `packages/server/src/telemetry/inferenceAccuracy.ts`
- [ ] T060 Curate AST-backed benchmark repos (starting with C and at least one additional language) under `tests/integration/benchmarks/ast-fixtures/`
- [ ] T061 Implement AST comparison harness in `tests/integration/benchmarks/astAccuracy.test.ts` that reconciles inferred graphs with canonical ASTs
- [ ] T062 Integrate dual-mode benchmark selection (AST vs self-similarity) into CI via root `package.json` scripts and `npm run ci-check`

---

## Dependencies & Execution Order

### Phase Dependencies
- **Phase 1 → Phase 2**: Setup must complete before foundational work
- **Phase 2 → Phases 3-5**: Foundational tasks (including configuration, watcher plumbing, hysteresis scaffolding) block all user stories
- **Phase 3 → Phase 4 → Phase 5**: Stories prioritized P1 → P2 → P3; later stories can start once foundational is done but should respect priority unless staffing allows parallel execution
- **Phase 6**: Runs after desired user stories are complete

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
- Marked `[P]` tasks across phases (e.g., T003, T004, T006, T008, T011, T013, T015, T017, T020, T024, T028, T032, T034, T036, T039, T044, T047, T049, T050, T053, T055, T058) can proceed concurrently once prerequisites finish
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

### Parallel Team Strategy
- Engineer A: Leads Phase 2 data store, configuration plumbing, and server backbone (T005–T021)
- Engineer B: Drives US1 implementation (T022–T029)
- Engineer C: Builds US2 dependency intelligence (T030–T035)
- Engineer D: Owns US3 acknowledgement tooling and AI opt-in (T036–T041)
- Shared effort: Polish tasks and instrumentation (T042–T047)

---

## Summary
- **Total Tasks**: 61
- **User Story Task Counts**:
  - US1: 8 tasks (including T034 test)
  - US2: 8 tasks (including T026 test)
  - US3: 7 tasks (including T042 test)
- **Parallel Opportunities**: 22 tasks marked `[P]`
- **Independent Tests**: T034 (US1), T026 (US2), T042 (US3)
- **Suggested MVP Scope**: Phases 1–3 (deliver code-change impact first)
