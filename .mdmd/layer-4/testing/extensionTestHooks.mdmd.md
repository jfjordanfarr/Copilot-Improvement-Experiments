# Extension Test Hooks (Layer 4)

## Source Mapping
- Implementation: [`packages/extension/src/testing/testHooks.ts`](../../../packages/extension/src/testing/testHooks.ts)
- Consumers: Extension unit tests under `packages/extension/src/**/*.test.ts`

## Responsibility
Provide a controlled seam for overriding VS Code window APIs during extension unit tests. Lets tests simulate user selections or suppress notifications without monkey-patching every call site.

## Key Concepts
- **Global test hooks**: `globalThis.__linkAwareDiagnosticsTestHooks` carries optional override implementations populated by test harnesses.
- **Window overrides**: Subset of VS Code window methods (`showQuickPick`, `showInformationMessage`, `showErrorMessage`) that tests frequently need to stub.
- **Fallback binding**: When no override is provided, the hooks bind back to the real VS Code APIs, preserving extension runtime behavior.

## Public API
- `resolveWindowApis(): { showQuickPick, showInformationMessage, showErrorMessage }`

## Internal Flow
1. Inspect the global test hooks container for window overrides.
2. Return override implementations when present; otherwise, bind the native VS Code methods to maintain correct `this` context.
3. Call sites destructure these resolved functions, making their user interactions easily testable.

## Error Handling
- Safe when hooks are unset; returns actual window methods without modification.
- Additional APIs can be exposed by extending the `WindowMethodKey` union and override interface.

## Integration Notes
- Encourages tests to configure overrides in setup/teardown rather than mocking `vscode` wholesale.
- Works in both Node test environments and VS Code test runners since it relies only on `globalThis`.
