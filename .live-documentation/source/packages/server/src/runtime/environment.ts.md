# packages/server/src/runtime/environment.ts

## Metadata
- Layer: 4
- Archetype: implementation
- Code Path: packages/server/src/runtime/environment.ts
- Live Doc ID: LD-implementation-packages-server-src-runtime-environment-ts
- Generated At: 2025-11-16T02:09:51.705Z

## Authored
### Purpose
Provides filesystem helpers that the language server uses to resolve workspace roots, determine SQLite storage locations, normalise file URIs, and ensure backing directories exist before persistence.

### Notes
- Prefers the extension’s configured `storagePath` when persisting the database; falls back to a per-workspace `.link-aware-diagnostics` folder before using the OS temp directory.
- `fileUriToPath` guards against malformed `file://` URIs by attempting `fileURLToPath` first, then decoding the URL path, ensuring Windows and POSIX paths round-trip.
- `ensureDirectory` is synchronous to keep boot deterministic inside the extension host; higher-level callers handle async operations once the storage root exists.

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-16T02:09:51.705Z","inputHash":"dc04d774989aca69"}]} -->
<!-- LIVE-DOC:BEGIN Public Symbols -->
### Public Symbols
#### `resolveDatabasePath`
- Type: function
- Source: [source](../../../../../../packages/server/src/runtime/environment.ts#L10)

#### `resolveWorkspaceRoot`
- Type: function
- Source: [source](../../../../../../packages/server/src/runtime/environment.ts#L24)

#### `fileUriToPath`
- Type: function
- Source: [source](../../../../../../packages/server/src/runtime/environment.ts#L40)

#### `ensureDirectory`
- Type: function
- Source: [source](../../../../../../packages/server/src/runtime/environment.ts#L60)

#### `describeError`
- Type: function
- Source: [source](../../../../../../packages/server/src/runtime/environment.ts#L66)
<!-- LIVE-DOC:END Public Symbols -->

<!-- LIVE-DOC:BEGIN Dependencies -->
### Dependencies
- `node:fs` - `fs`
- `node:os` - `os`
- `node:path` - `path`
- `node:url` - `fileURLToPath`
- [`providerGuard.ExtensionSettings`](../features/settings/providerGuard.ts.md#extensionsettings)
- `vscode-languageserver/node` - `InitializeParams`
<!-- LIVE-DOC:END Dependencies -->

<!-- LIVE-DOC:BEGIN Observed Evidence -->
### Observed Evidence
#### Vitest Unit Tests
- [environment.test.ts](./environment.test.ts.md)
<!-- LIVE-DOC:END Observed Evidence -->
