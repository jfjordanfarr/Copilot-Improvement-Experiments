# Falsifiability Test Architecture

## Metadata
- Layer: 3
- Component IDs: COMP-009

## Components

### COMP-009 Falsifiability Suites
Supports REQ-F1 to REQ-F5 by providing deterministic integration suites that expose documentation drift, scope collision, and transform ripple scenarios.

## Responsibilities

### Documentation Drift Coverage
- Exercise markdown link drift and file rename scenarios (`tests/integration/us3`) to guarantee documentation diagnostics surface actionable metadata.
- Leverage `ArtifactWatcher` + `pathReferenceDetector` to seed `documents` relationships without manual graph seeding.

### Noise Suppression Guardrails
- Validate scope collision protection via `tests/integration/us4`, ensuring identical symbol names in separate scopes do not emit diagnostics.
- Confirm hysteresis budgets remain untouched when no legitimate ripple exists.

### Transform Pipeline Validation
- Drive template → script → generated asset flows (`tests/integration/us5`) using bootstrap knowledge feeds so ripple metadata carries depth/path provenance.
- Assert `code-ripple` diagnostics include relationship kind and confidence suitable for downstream tooling.

## Interfaces

### Inbound Interfaces
- Integration harness configuration selecting falsifiability suites.
- Knowledge feed bootstrap fixtures housed alongside scenario workspaces.

### Outbound Interfaces
- Diagnostics emitted during suites captured by Problems view snapshots and CLI logs for audit.
- Snapshot JSON and adoption telemetry produced by suites for later inspection.

## Linked Implementations

### IMP-403 us1ThroughUs5 Suites
Scenario implementations verifying falsifiability coverage. [US1 Code Impact Suite](../../../.live-documentation/source/tests/integration/us1/codeImpact.test.ts.md)

### IMP-406 markdownDrift Suite
Dedicated falsifiability run for markdown drift. [US2 Markdown Drift Suite](../../../.live-documentation/source/tests/integration/us2/markdownDrift.test.ts.md)

### IMP-407 acknowledgement Suite
Ensures acknowledgement flows remain stable under drift. [US3 Acknowledge Diagnostics Suite](../../../.live-documentation/source/tests/integration/us3/acknowledgeDiagnostics.test.ts.md)

### IMP-408 scopeCollision Suite
Confirms duplicate symbols do not emit diagnostics. [US4 Scope Collision Suite](../../../.live-documentation/source/tests/integration/us4/inspectSymbolNeighbors.test.ts.md)

### IMP-409 transformRipple Suite
Validates template-driven ripple depth metadata. [US5 LLM Ingestion Suite](../../../.live-documentation/source/tests/integration/us5/llmIngestionDryRun.test.ts.md)

## Evidence
- Integration suites US3–US5 run under `npm run test:integration` and safe-to-commit, producing falsifiability coverage reports.
- Fixture documentation captures rename helpers, knowledge feed bootstraps, and transform scripts under `tests/integration/fixtures/simple-workspace`.
- Safe-to-commit logs show falsifiability suites gating merges on 2025-10-29 when drift detection regressed.

## Operational Notes
- Harness accepts fixture names so new falsifiability scenarios can plug in without bespoke bootstrap code.
- Future work includes adding CLI toggles for selective falsifiability runs and surfacing suite outcomes inside ASCII adoption narratives.
