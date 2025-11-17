# packages/server/src/features/live-docs/harness/headlessHarness.ts

## Metadata
- Layer: 4
- Archetype: implementation
- Code Path: packages/server/src/features/live-docs/harness/headlessHarness.ts
- Live Doc ID: LD-implementation-packages-server-src-features-live-docs-harness-headlessharness-ts
- Generated At: 2025-11-16T22:35:16.020Z

## Authored
### Purpose
Runs the headless harness pipeline end-to-end—preparing a workspace, invoking Live Docs (and optional System views), and writing reports/containers—so we can validate fixtures without VS Code, per the 2025-11-16 execution log ([chat](../../../../../../../../AI-Agent-Workspace/ChatHistory/2025/11/2025-11-16.md#L1085-L1115)).

### Notes
- Builds scenario-specific configs before each run, matching the fixture glob strategy captured earlier that day.
- Emits optional container specs and timestamped reports so CI and hosted demos can replay the same runs without manual wiring.

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-16T22:35:16.020Z","inputHash":"5f8a0ca097c2b19e"}]} -->
<!-- LIVE-DOC:BEGIN Public Symbols -->
### Public Symbols
#### `HeadlessHarnessLogger`
- Type: interface
- Source: [source](../../../../../../../../packages/server/src/features/live-docs/harness/headlessHarness.ts#L18)

#### `HeadlessHarnessRunOptions`
- Type: interface
- Source: [source](../../../../../../../../packages/server/src/features/live-docs/harness/headlessHarness.ts#L28)

#### `HeadlessHarnessRunResult`
- Type: interface
- Source: [source](../../../../../../../../packages/server/src/features/live-docs/harness/headlessHarness.ts#L41)

#### `runHeadlessHarness`
- Type: function
- Source: [source](../../../../../../../../packages/server/src/features/live-docs/harness/headlessHarness.ts#L56)
<!-- LIVE-DOC:END Public Symbols -->

<!-- LIVE-DOC:BEGIN Dependencies -->
### Dependencies
- `node:fs/promises` - `fs`
- `node:os` - `os`
- `node:path` - `path`
- [`generator.LiveDocGeneratorResult`](../generator.ts.mdmd.md#livedocgeneratorresult) (type-only)
- [`generator.generateLiveDocs`](../generator.ts.mdmd.md#generatelivedocs) (type-only)
- [`scenarios.HeadlessHarnessScenario`](./scenarios.ts.mdmd.md#headlessharnessscenario) (type-only)
- [`generator.SystemLiveDocGeneratorResult`](../system/generator.ts.mdmd.md#systemlivedocgeneratorresult) (type-only)
- [`generator.generateSystemLiveDocs`](../system/generator.ts.mdmd.md#generatesystemlivedocs) (type-only)
- [`liveDocumentationConfig.DEFAULT_LIVE_DOCUMENTATION_CONFIG`](../../../../../shared/src/config/liveDocumentationConfig.ts.mdmd.md#default_live_documentation_config)
- [`liveDocumentationConfig.LiveDocumentationConfig`](../../../../../shared/src/config/liveDocumentationConfig.ts.mdmd.md#livedocumentationconfig)
- [`liveDocumentationConfig.LiveDocumentationConfigInput`](../../../../../shared/src/config/liveDocumentationConfig.ts.mdmd.md#livedocumentationconfiginput)
- [`liveDocumentationConfig.normalizeLiveDocumentationConfig`](../../../../../shared/src/config/liveDocumentationConfig.ts.mdmd.md#normalizelivedocumentationconfig)
<!-- LIVE-DOC:END Dependencies -->
