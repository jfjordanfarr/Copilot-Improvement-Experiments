# Benchmark & Telemetry Reporting

## Metadata
- Layer: 3
- Component IDs: COMP-007

## Components

### COMP-007 Diagnostics Benchmarking
Supports REQ-030 by producing reproducible performance and accuracy reports that prove ripple pipelines stay fast, deterministic, and trustworthy as adoption scales.

## Responsibilities

### Unified Reporting
- Generate durable per-mode artifacts (for example, `reports/test-report.self-similarity.md`, `reports/test-report.ast.md`) each verification run summarising integration outcomes, benchmark deltas, and telemetry snapshots.
- Harmonise CLI tooling so `npm run verify -- --report` emits structured JSON consumed by the report renderer.
- Leverage the shared formatter (`buildTestReportMarkdown`) so Markdown sections stay consistent across local development and CI runs.

### Benchmark Automation
- Author reproducible workspaces under `tests/integration/benchmarks` that target graph rebuild stability (T057), inference accuracy (T061), and benchmark mode selection (T062).
- Provide utilities (e.g., `benchmarkRecorder.ts`) that orchestrate fixtures and return comparable metrics.
- Manage benchmark coverage through `fixtures.manifest.json`, allowing `BENCHMARK_MODE` toggles (`self-similarity`, `ast`, `all`) to gate which fixtures run during verification.
- Record per-fixture precision/recall metrics so future regression reports can spotlight language-specific drift.
- Materialise every vendored benchmark by cloning its source repository into an ephemeral staging workspace (under `AI-Agent-Workspace/tmp/benchmarks/<fixture-id>`), pinning the commit declared in the manifest before snapshots or analyzers execute.
- Express file selection through manifest glob rules (`include` / `exclude`) so the integrity pipeline expands, hashes, and documents the resolved set automatically—no manually curated file lists.
- Capture repository provenance (repo, ref, commit, license) in manifest metadata so documentation and staging directories stay reproducible and traceable.
- Expand fixture census across languages (TypeScript, C, Python, Rust, Ruby, Java) with paired baseline and layered scenarios so accuracy metrics surface ecosystem-specific strengths and gaps without co-opting full integration workspaces.

### Telemetry Capture
- Persist inference accuracy metrics alongside latency stats using shared telemetry modules.
- Expose `InferenceAccuracyTracker.snapshot()` for benchmarks and extension surfaces so adoption metrics reflect live behaviour.

## Interfaces

### Inbound Interfaces
- `npm run verify -- --report` command line switch requesting benchmark runs.
- Shared telemetry collectors invoked by benchmarks and the regression report generator.

### Outbound Interfaces
- Markdown/JSON reports persisted to `reports/test-report.<mode>.md` alongside versioned JSON under `reports/benchmarks/<mode>/`.
- Telemetry updates stored in SQLite (`packages/server/src/telemetry`) for subsequent audits.

## Linked Implementations

### IMP-306 testReportGenerator
Produces the combined verification and benchmark report. [Test Report Generator](/.mdmd/layer-4/tooling/testReportGenerator.mdmd.md)

### IMP-307 benchmarkRecorder
Shared utilities powering benchmark fixtures. [Benchmark Recorder](/.mdmd/layer-4/testing/benchmarks/benchmarkRecorder.mdmd.md)

### IMP-308 inferenceAccuracy Tracker
Captures precision/recall metrics for ripple inference. [Inference Accuracy Telemetry](/.mdmd/layer-4/telemetry/inferenceAccuracyTracker.mdmd.md)

## Evidence
- Benchmark integration suites under `tests/integration/benchmarks` ensure rebuild stability and inference accuracy assertions stay green.
- Telemetry unit tests (`inferenceAccuracy.test.ts`, `latencyTracker.test.ts`) protect metric calculations.
- Safe-to-commit pipeline runs `npm run verify -- --report` weekly to produce artefacts referenced in stakeholder updates.

## Operational Notes
- Initial scope excludes full AST fixture curation (T060) and external dashboard publishing.
- Retry/backoff strategy for flaky benchmarks remains configurable; tolerances to be documented as benchmarks evolve.
