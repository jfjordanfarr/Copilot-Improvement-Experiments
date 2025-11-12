# Integration Testing Architecture

## Metadata
- Layer: 3
- Component IDs: COMP-008

## Components

### COMP-008 Integration Test Harness
Supports FR-LD1 through FR-LD6 plus REQ-F1 to REQ-F6 by executing end-to-end scenarios that validate Live Documentation regeneration, diagnostics accuracy, knowledge ingestion, and ripple behaviour across the built extension and server.

## Responsibilities

### Deterministic Execution
- Build fresh extension/server bundles before runs and clean stale artifacts with `tests/integration/clean-dist.mjs`.
- Launch the VS Code harness (`tests/integration/vscode/runTests.ts`) to execute suites against compiled output rather than source mocks.

### Fixture Stewardship
- Maintain the simple workspace fixture (`tests/integration/fixtures/simple-workspace`) as the canonical testbed for US1–US4.
- Provide specialised fixtures (LLM ingestion payloads, benchmark repos) for targeted suites without duplicating workspace state.

### Scenario Coverage
- Ensure suites `us1` through `us5` cover writer, developer, scope collision, acknowledgement, and transform ripple flows.
- Add Live Documentation suites (`live-docs-generation`, `live-docs-evidence`, `live-docs-inspect-cli`, `live-docs-docstring-drift`) validating regeneration determinism, evidence population, CLI parity, and drift remediation.
- Keep suite responsibilities mapped back to runtime components (Live Doc generator, diagnostics pipeline, knowledge ingestion, LLM bridge) for traceability.

### Artefact Capture
- Persist run outputs (snapshot JSON, logs, Live Doc markdown fixtures, provenance files) in per-suite temp directories for inspection and regression comparisons.

## Interfaces

### Inbound Interfaces
- `npm run test:integration` (and safe-to-commit) orchestrations that call the VS Code harness.
- Fixture configuration toggles controlling which suites execute, allowing targeted regression runs.

### Outbound Interfaces
- Mocha logs, snapshot files, and staged Live Doc mirrors stored under `tests/integration/.tmp` for debugging.
- Report contributions consumed by the benchmark/reporting pipeline, including Live Doc precision/recall metrics.

## Linked Implementations

### IMP-401 vscodeIntegrationHarness
Bootstraps VS Code with compiled artifacts and loads suites. [VS Code Integration Harness](/.mdmd/layer-4/testing/integration/vscodeIntegrationHarness.mdmd.md)

### IMP-402 simpleWorkspaceFixture
Primary workspace assets used across US suites. [Simple Workspace Fixture](/.mdmd/layer-4/testing/integration/simpleWorkspaceFixture.mdmd.md)

### IMP-403 us1ThroughUs5 Suites
Scenario implementations verifying ripple, writer, developer, scope collision, and transform flows. [US Integration Suites](/.mdmd/layer-4/testing/integration/us1-codeImpactSuite.mdmd.md)

### IMP-404 cleanDistUtility
Removes stale bundles before integration runs. [Clean Dist Utility](/.mdmd/layer-4/testing/integration/cleanDistUtility.mdmd.md)

### IMP-405 liveDocsGenerationSuite
Exercises regeneration CLI, authored preservation, and deterministic output. [Stage‑0 Live Doc](../../.live-documentation/source/tests/integration/live-docs/generation.test.ts.mdmd.md)

### IMP-406 liveDocsEvidenceSuite
Validates evidence ingestion, lint warnings, and `_No automated evidence found_` behaviour. [Stage‑0 Live Doc](../../.live-documentation/source/tests/integration/live-docs/evidence.test.ts.mdmd.md)

### IMP-407 liveDocsInspectCliSuite
CLI parity suite remains on the roadmap; capture its responsibility once the corresponding Stage-0 doc materialises.

### IMP-408 liveDocsDocstringDriftSuite
Drift remediation suite remains planned; update this entry after initial implementation lands in Stage-0 Live Docs.

## Evidence
- Integration suites US1–US5 run inside CI and `npm run test:integration`, asserting diagnostics accuracy, acknowledgement flows, and knowledge ingestion behaviour.
- Planned Live Doc suites (`tests/integration/live-docs/*.test.ts`) will run alongside US suites to gate regeneration parity, evidence coverage, CLI parity, and drift remediation.
- Harness unit tests (`runTests.test.ts`, planned) verify extension attachment and suite registration.
- Safe-to-commit orchestration depends on integration success before passing.

## Operational Notes
- Snapshot directories remain isolated per suite to ease diffing pre/post change.
- Adding a new scenario requires extending the fixture set and documenting its responsibility here to preserve traceability.
