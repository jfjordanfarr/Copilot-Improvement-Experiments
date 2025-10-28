# Vitest Configuration (Layer 4)

## Source Mapping
- Config: [`vitest.config.ts`](/vitest.config.ts)
- CLI coverage exclusions documented in [`packages/extension/src/commands/analyzeWithAI.test.ts`](/packages/extension/src/commands/analyzeWithAI.test.ts) and [`packages/shared/src/tooling/slopcopAssetCli.test.ts`](/packages/shared/src/tooling/slopcopAssetCli.test.ts)

## Responsibility
Define the unit-test harness for shared, server, extension, and SlopCop CLI suites, including coverage reporting and thread policy.

## Key Updates
- Single-thread pool (min/max 1) prevents Windows-native crashes encountered when Vitest spawned multiple workers.
- Coverage reporting excludes the CLI entrypoints under `scripts/**` and the extension activation shim (`packages/extension/src/extension.ts`), because those binaries execute in separate Node/Electron processes. Their behaviour is verified through dedicated CLI spawn tests and the VS Code integration harness, so omitting them from coverage keeps reports focused on instrumented modules.

## Related Docs
- Integration testing architecture: [`.mdmd/layer-3/testing-integration-architecture.mdmd.md`](../../layer-3/testing-integration-architecture.mdmd.md)
- Safe-to-commit pipeline: [`.mdmd/layer-4/tooling/safeToCommit.mdmd.md`](./safeToCommit.mdmd.md)
