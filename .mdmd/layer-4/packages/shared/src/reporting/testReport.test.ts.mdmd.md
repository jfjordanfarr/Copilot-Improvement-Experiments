# packages/shared/src/reporting/testReport.test.ts

## Metadata
- Layer: 4
- Archetype: test
- Code Path: packages/shared/src/reporting/testReport.test.ts
- Live Doc ID: LD-test-packages-shared-src-reporting-testreport-test-ts
- Generated At: 2025-11-16T22:34:13.234Z

## Authored
### Purpose
Guards the Markdown renderer so benchmark summaries stay stable when reports ingest new fixtures, modes, or telemetry fields.[AI-Agent-Workspace/ChatHistory/2025/10/Summarized/2025-10-31.SUMMARIZED.md#turn-08-new-language-fixtures--documentation-sweep-lines-1821-2200]

### Notes
- Added alongside the initial reporting module to exercise rebuild and AST sections before wiring `safe-to-commit`.[AI-Agent-Workspace/ChatHistory/2025/10/Summarized/2025-10-31.SUMMARIZED.md#turn-09-full-verify-run--commit-prep-lines-2201-2400]
- Extended during the dual-mode upgrade to cover AST vs self-similarity markdown permutations.[AI-Agent-Workspace/ChatHistory/2025/11/Summarized/2025-11-03.SUMMARIZED.md#turn-09-implement-per-mode-benchmark-reporting-lines-821-1030]

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-16T22:34:13.234Z","inputHash":"5b0a07647e3816f0"}]} -->
<!-- LIVE-DOC:BEGIN Public Symbols -->
### Public Symbols
_No public symbols detected_
<!-- LIVE-DOC:END Public Symbols -->

<!-- LIVE-DOC:BEGIN Dependencies -->
### Dependencies
- [`testReport.AstAccuracyData`](./testReport.ts.mdmd.md#astaccuracydata)
- [`testReport.BenchmarkRecord`](./testReport.ts.mdmd.md#benchmarkrecord)
- [`testReport.RebuildStabilityData`](./testReport.ts.mdmd.md#rebuildstabilitydata)
- [`testReport.TestReportContext`](./testReport.ts.mdmd.md#testreportcontext)
- [`testReport.buildTestReportMarkdown`](./testReport.ts.mdmd.md#buildtestreportmarkdown)
- `vitest` - `describe`, `expect`, `it`
<!-- LIVE-DOC:END Dependencies -->

<!-- LIVE-DOC:BEGIN Targets -->
### Targets
#### Vitest Unit Tests
- packages/shared/src/reporting: [testReport.ts](./testReport.ts.mdmd.md)
<!-- LIVE-DOC:END Targets -->

<!-- LIVE-DOC:BEGIN Supporting Fixtures -->
### Supporting Fixtures
_No supporting fixtures documented yet_
<!-- LIVE-DOC:END Supporting Fixtures -->
