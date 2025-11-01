# Test Report Formatter

## Metadata
- Layer: 4
- Implementation ID: IMP-412
- Code Path: [`packages/shared/src/reporting/testReport.ts`](../../../packages/shared/src/reporting/testReport.ts)
- Exports: BenchmarkRecord, BenchmarkEnvironment, TestReportContext, ReportSection, buildTestReportMarkdown, RebuildStabilityData, AstAccuracyData, AstAccuracyFixture, AstAccuracyTotals

## Purpose
Convert structured benchmark outputs into Markdown so verification tasks can persist evidence in `docs/test-report.md` and downstream tooling can diff run-to-run coverage.

## Public Symbols

### BenchmarkRecord
Shape for parsed benchmark JSON artefacts. Captures benchmark name, timestamp, execution environment, and the raw payload needed for rendering.

### BenchmarkEnvironment
Describes runtime characteristics (Node version, platform, architecture, provider mode, optional OSS model metadata) attached to each benchmark record for provenance.

### TestReportContext
Carries metadata about the verification run (Git commit, benchmark mode, timestamps) so the renderer can stamp the report with reproducible provenance.

### ReportSection
Renderable Markdown block yielded by the formatter for each benchmark. Encapsulates a section title and body lines so callers can extend output without touching the report layout logic.

### buildTestReportMarkdown
Formats rebuild stability and AST accuracy benchmarks into Markdown sections (tables and bullet lists) while deferring unknown benchmark types to a JSON block. Includes environment and artefact summaries for traceability.

### RebuildStabilityData
Typed view over the rebuild stability payload (`rebuild-stability.json`) describing durations, drift detection, and run configuration.

### AstAccuracyData
Typed view over AST accuracy payloads (`ast-accuracy.json`) including thresholds, aggregate totals, and per-fixture metrics.

### AstAccuracyFixture
Fixture-level metrics and metadata (id, label, language, totals) used to render the AST accuracy table.

### AstAccuracyTotals
Counts and derived precision/recall/F1 metrics shared by both aggregate and per-fixture reporting entries.

## Collaborators
- [`tests/integration/benchmarks/astAccuracy.test.ts`](../../../tests/integration/benchmarks/astAccuracy.test.ts) emits the AST accuracy payload consumed here.
- [`tests/integration/benchmarks/rebuildStability.test.ts`](../../../tests/integration/benchmarks/rebuildStability.test.ts) produces the rebuild stability JSON consumed here.
- [`scripts/reporting/generateTestReport.ts`](../../../scripts/reporting/generateTestReport.ts) invokes the formatter and writes `docs/test-report.md`.

## Evidence
- Unit coverage: [`packages/shared/src/reporting/testReport.test.ts`](../../../packages/shared/src/reporting/testReport.test.ts) exercises Markdown generation for known benchmark shapes and the environment summary logic.
- Manual verification: invoking `npm run verify -- --report` writes `docs/test-report.md`, demonstrating end-to-end serialization.
