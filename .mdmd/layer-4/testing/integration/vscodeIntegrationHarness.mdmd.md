# VS Code Integration Harness (Layer 4)

## Source Mapping
- Entry point: [`tests/integration/vscode/runTests.ts`](../../../../tests/integration/vscode/runTests.ts)
- Suite loader: [`tests/integration/vscode/suite/index.ts`](../../../../tests/integration/vscode/suite/index.ts)
- Collaborators: [`tests/integration/clean-dist.mjs`](../../../../tests/integration/clean-dist.mjs), scenario suites under [`tests/integration/us*/`](../../../../tests/integration/)

## Responsibility
Launch the VS Code extension test host, register mocha suites, and coordinate scenario execution against the compiled extension/server bundles. Provides the glue between the Node-based test runner and the VS Code integration environment.

## Execution Flow
1. `runTests.ts` resolves the VS Code executable, ensures clean builds (via `clean-dist.mjs` when needed), and boots the extension host with the compiled extension.
2. Control transfers to `suite/index.ts`, which loads scenario suites (`us1`–`us5`) and wires mocha hooks for setup/teardown.
3. Each suite uses the helper exports from `suite/index.ts` to obtain workspace paths, spawn the language server, and dispose resources after completion.

## Observability
- Harness logs the VS Code launch command and forwards stderr/stdout so scenario failures include host output.
- When a suite fails, the harness reports the suite id and workspace temp directory for post-mortem inspection.

## Follow-ups
- Add support for parallel suite execution once the language server can be isolated per workspace.
- Capture screenshots or logs from the VS Code host if future UI-driven scenarios require them.
