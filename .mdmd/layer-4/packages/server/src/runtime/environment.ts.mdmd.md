# packages/server/src/runtime/environment.ts

## Metadata
- Layer: 4
- Archetype: implementation
- Code Path: packages/server/src/runtime/environment.ts
- Live Doc ID: LD-implementation-packages-server-src-runtime-environment-ts
- Generated At: 2025-11-16T22:34:12.212Z

## Authored
### Purpose
Provides shared runtime utilities for the language server—resolving database locations, normalising workspace roots, and translating file URIs—so bootstrapping code stays platform-neutral, a consolidation completed while we hardened Live Docs staging in [AI-Agent-Workspace/ChatHistory/2025/11/Summarized/2025-11-08.SUMMARIZED.md#turn-22-begin-evidence-triage--add-targeted-tests-lines-4241-4920](../../../../../../AI-Agent-Workspace/ChatHistory/2025/11/Summarized/2025-11-08.SUMMARIZED.md#turn-22-begin-evidence-triage--add-targeted-tests-lines-4241-4920).

### Notes
`describeError` and `fileUriToPath` gained Windows path handling during that pass—see [AI-Agent-Workspace/ChatHistory/2025/11/2025-11-08.md#L4405-L4602](../../../../../../AI-Agent-Workspace/ChatHistory/2025/11/2025-11-08.md#L4405-L4602)—so any future refactor must preserve UNC safety and drive-by evidence in `environment.test.ts`.

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-16T22:34:12.212Z","inputHash":"991f2d459d64d1b5"}]} -->
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
- [`providerGuard.ExtensionSettings`](../features/settings/providerGuard.ts.mdmd.md#extensionsettings)
- `vscode-languageserver/node` - `InitializeParams`
<!-- LIVE-DOC:END Dependencies -->

<!-- LIVE-DOC:BEGIN Observed Evidence -->
### Observed Evidence
#### Vitest Unit Tests
- [environment.test.ts](./environment.test.ts.mdmd.md)
<!-- LIVE-DOC:END Observed Evidence -->
