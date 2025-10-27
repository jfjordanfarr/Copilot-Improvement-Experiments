# Environment Utilities (Layer 4)

## Source Mapping
- Implementation: [`packages/server/src/runtime/environment.ts`](../../../packages/server/src/runtime/environment.ts)
- Parent design: [Language Server Architecture](../../layer-3/language-server-architecture.mdmd.md)
- Spec references: [FR-002](../../../specs/001-link-aware-diagnostics/spec.md#functional-requirements), [FR-012](../../../specs/001-link-aware-diagnostics/spec.md#functional-requirements)

## Exported Symbols

#### resolveDatabasePath
`resolveDatabasePath` picks an absolute SQLite location based on server settings, falling back to the first workspace folder or a temporary directory when storage overrides are unavailable.

#### resolveWorkspaceRoot
`resolveWorkspaceRoot` normalises LSP initialise parameters into a canonical filesystem root so downstream services can find relative paths.

#### fileUriToPath
`fileUriToPath` converts VS Code `file://` URIs to filesystem paths while tolerating plain path inputs without throwing.

#### ensureDirectory
`ensureDirectory` lazily creates the directory tree containing the SQLite database and workspace cache before the server starts writing data.

#### describeError
`describeError` renders arbitrary errors into concise loggable strings, preserving the name and message fields for real Error instances.

## Responsibility
Provide small, dependable helpers for resolving workspace and storage paths as the language server initialises, ensuring downstream runtime setup routines do not repeat URI/FS handling edge cases.

## Behaviour Notes
- Always joins storage paths to `link-aware-diagnostics.db` so both local and remote workspaces store graphs consistently.
- Prefers workspace folder URIs over legacy `rootUri`/`rootPath` while still supporting both for compatibility with older clients.
- Swallows invalid `file://` URIs by falling back to `path.resolve`, preventing bootstrap failures when tests supply relative paths.

## Evidence
- Exercised indirectly by runtime bootstrap integration tests (see [`tests/integration/us1`](../../../tests/integration/us1) and [`us3`](../../../tests/integration/us3)), which require a resolved database path before the language server persists drift history and diagnostics.
