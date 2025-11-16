# packages/extension/src/watchers/fileMaintenance.ts

## Metadata
- Layer: 4
- Archetype: implementation
- Code Path: packages/extension/src/watchers/fileMaintenance.ts
- Live Doc ID: LD-implementation-packages-extension-src-watchers-filemaintenance-ts
- Generated At: 2025-11-16T02:09:51.162Z

## Authored
### Purpose
Notifies the language server when workspace files are deleted or renamed so it can clean up stale links.

### Notes
- Combines a file system watcher with explicit delete/rename events to catch both manual edits and bulk operations.
- Sends normalized URI payloads over custom notifications for each affected file.
- Returns a composite disposable that tears down all listeners when the extension deactivates.

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-16T02:09:51.162Z","inputHash":"4f3839910ab02e9a"}]} -->
<!-- LIVE-DOC:BEGIN Public Symbols -->
### Public Symbols
#### `registerFileMaintenanceWatcher`
- Type: function
- Source: [source](../../../../../../packages/extension/src/watchers/fileMaintenance.ts#L7)
<!-- LIVE-DOC:END Public Symbols -->

<!-- LIVE-DOC:BEGIN Dependencies -->
### Dependencies
- `vscode` - `vscode`
- `vscode-languageclient/node` - `LanguageClient`
<!-- LIVE-DOC:END Dependencies -->
