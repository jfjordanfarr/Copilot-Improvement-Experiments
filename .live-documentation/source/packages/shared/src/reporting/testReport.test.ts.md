# packages/shared/src/reporting/testReport.test.ts

## Metadata
- Layer: 4
- Archetype: test
- Code Path: packages/shared/src/reporting/testReport.test.ts
- Live Doc ID: LD-test-packages-shared-src-reporting-testreport-test-ts
- Generated At: 2025-11-16T02:09:51.968Z

## Authored
### Purpose
Ensure the report generator emits the expected sections for known benchmark types and gracefully handles custom payloads.

### Notes
Constructs rebuild-stability and AST-accuracy records to verify table text, environment summaries, and artifact listings all appear in the markdown. A secondary case feeds an unknown benchmark so the suite confirms we still dump the raw JSON, protecting manual investigations when new benchmark families are introduced.

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-16T02:09:51.968Z","inputHash":"5e1d3c3ffde9dcb4"}]} -->
<!-- LIVE-DOC:BEGIN Public Symbols -->
### Public Symbols
_No public symbols detected_
<!-- LIVE-DOC:END Public Symbols -->

<!-- LIVE-DOC:BEGIN Dependencies -->
### Dependencies
- [`testReport.AstAccuracyData`](./testReport.ts.md#astaccuracydata)
- [`testReport.BenchmarkRecord`](./testReport.ts.md#benchmarkrecord)
- [`testReport.RebuildStabilityData`](./testReport.ts.md#rebuildstabilitydata)
- [`testReport.TestReportContext`](./testReport.ts.md#testreportcontext)
- [`testReport.buildTestReportMarkdown`](./testReport.ts.md#buildtestreportmarkdown)
- `vitest` - `describe`, `expect`, `it`
<!-- LIVE-DOC:END Dependencies -->

<!-- LIVE-DOC:BEGIN Targets -->
### Targets
#### Vitest Unit Tests
- packages/shared/src/reporting: [testReport.ts](./testReport.ts.md)
<!-- LIVE-DOC:END Targets -->

<!-- LIVE-DOC:BEGIN Supporting Fixtures -->
### Supporting Fixtures
_No supporting fixtures documented yet_
<!-- LIVE-DOC:END Supporting Fixtures -->
