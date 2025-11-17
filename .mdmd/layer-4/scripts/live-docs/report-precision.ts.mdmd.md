# scripts/live-docs/report-precision.ts

## Metadata
- Layer: 4
- Archetype: implementation
- Code Path: scripts/live-docs/report-precision.ts
- Live Doc ID: LD-implementation-scripts-live-docs-report-precision-ts
- Generated At: 2025-11-16T22:35:18.131Z

## Authored
### Purpose
Evaluates generated Live Docs against the analyzer to calculate symbol and dependency precision/recall scores, producing `reports/benchmarks/live-docs/precision.json` so we can detect regressions in the documentation pipeline.

### Notes
First built for the Live Docs accuracy benchmark (Sep 2024) and tightened during the 2025 re-export fixes. The script mirrors the metrics enforced during `npm run safe:commit`, emitting non-zero exit codes when precision drops below 0.9 for symbols or dependency recall slips under 0.8.

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-16T22:35:18.131Z","inputHash":"a9168ae00aeac4c2"}]} -->
<!-- LIVE-DOC:BEGIN Public Symbols -->
### Public Symbols
_No public symbols detected_
<!-- LIVE-DOC:END Public Symbols -->

<!-- LIVE-DOC:BEGIN Dependencies -->
### Dependencies
- `glob` - `glob`
- `node:fs/promises` - `fs`
- `node:path` - `path`
- `node:process` - `process`
- [`generator.__testUtils`](../../packages/server/src/features/live-docs/generator.ts.mdmd.md#__testutils)
- [`liveDocumentationConfig.DEFAULT_LIVE_DOCUMENTATION_CONFIG`](../../packages/shared/src/config/liveDocumentationConfig.ts.mdmd.md#default_live_documentation_config)
- [`liveDocumentationConfig.LIVE_DOCUMENTATION_FILE_EXTENSION`](../../packages/shared/src/config/liveDocumentationConfig.ts.mdmd.md#live_documentation_file_extension)
- [`liveDocumentationConfig.LiveDocumentationConfig`](../../packages/shared/src/config/liveDocumentationConfig.ts.mdmd.md#livedocumentationconfig)
- [`liveDocumentationConfig.normalizeLiveDocumentationConfig`](../../packages/shared/src/config/liveDocumentationConfig.ts.mdmd.md#normalizelivedocumentationconfig)
- [`pathUtils.normalizeWorkspacePath`](../../packages/shared/src/tooling/pathUtils.ts.mdmd.md#normalizeworkspacepath)
- `typescript` - `ts`
<!-- LIVE-DOC:END Dependencies -->
