# better-sqlite3 rebuild checklist

This project exercises `better-sqlite3` under two different runtimes:

- **Node 20** for unit tests (`npm run test:unit`).
- **Electron 37.6.0** for VS Code integration tests (`npm run test:integration`, via `@vscode/test-electron`).

`better-sqlite3` ships prebuilt binaries that are specific to a single runtime/ABI. Whenever we run the integration suite, `@vscode/test-electron` rebuilds the dependency for Electron. That binary cannot be loaded by plain Node, which means subsequent unit tests will crash with `ERR_DLOPEN_FAILED` unless we rebuild back to the Node ABI.

## What changed

- Root `package.json` now exposes `npm run rebuild:better-sqlite3:node`.
- The `test:unit` script invokes that rebuild automatically before handing off to Vitest. Running unit tests directly (`vitest run`) will still require a manual rebuild.

## When to run the rebuild manually

Run the dedicated script whenever you:

1. Execute `npm run test:integration` (or anything else that triggers the Electron harness).
2. Need to run `vitest` directly, or the language server in-process, without coming through `npm run test:unit`.

```powershell
# Windows PowerShell / pwsh
npm run rebuild:better-sqlite3:node
```

```bash
# macOS / Linux shells
npm run rebuild:better-sqlite3:node
```

If `npm rebuild` fails locally, clear `node_modules` and reinstall to pick up fresh native artifacts:

```powershell
rm -r -Force node_modules
npm install
npm run rebuild:better-sqlite3:node
```

Recording the scenario here should keep the ABI swap visible until we introduce automated switching or isolate integration tests behind a separate install.
