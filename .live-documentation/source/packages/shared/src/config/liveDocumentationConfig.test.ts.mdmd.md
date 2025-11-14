# packages/shared/src/config/liveDocumentationConfig.test.ts

## Metadata
- Layer: 4
- Archetype: test
- Code Path: packages/shared/src/config/liveDocumentationConfig.test.ts
- Live Doc ID: LD-test-packages-shared-src-config-livedocumentationconfig-test-ts
- Generated At: 2025-11-14T18:42:06.632Z

## Authored
### Purpose
Demonstrates how the config normaliser applies defaults, trims overrides, and deduplicates glob patterns for Live Documentation.

### Notes
- Verifies the default snapshot when no input is provided so regressions in baseline values are caught quickly.
- Supplies messy string overrides to assert trimming, deduplication, and evidence strictness propagation.
- Covers blank override inputs, confirming they fall back to defaults rather than emitting empty configuration.

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-14T18:42:06.632Z","inputHash":"637da3df0491a78c"}]} -->
<!-- LIVE-DOC:BEGIN Public Symbols -->
### Public Symbols
_No public symbols detected_
<!-- LIVE-DOC:END Public Symbols -->

<!-- LIVE-DOC:BEGIN Dependencies -->
### Dependencies
- [`liveDocumentationConfig.DEFAULT_LIVE_DOCUMENTATION_CONFIG`](./liveDocumentationConfig.ts.mdmd.md#default_live_documentation_config)
- [`liveDocumentationConfig.normalizeLiveDocumentationConfig`](./liveDocumentationConfig.ts.mdmd.md#normalizelivedocumentationconfig)
- `vitest` - `describe`, `expect`, `it`
<!-- LIVE-DOC:END Dependencies -->

<!-- LIVE-DOC:BEGIN Targets -->
### Targets
#### Vitest Unit Tests
- packages/shared/src/config: [liveDocumentationConfig.ts](./liveDocumentationConfig.ts.mdmd.md)
<!-- LIVE-DOC:END Targets -->

<!-- LIVE-DOC:BEGIN Supporting Fixtures -->
### Supporting Fixtures
_No supporting fixtures documented yet_
<!-- LIVE-DOC:END Supporting Fixtures -->
