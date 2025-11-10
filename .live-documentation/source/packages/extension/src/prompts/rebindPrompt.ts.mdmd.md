# packages/extension/src/prompts/rebindPrompt.ts

## Metadata
- Layer: 4
- Archetype: implementation
- Code Path: packages/extension/src/prompts/rebindPrompt.ts
- Live Doc ID: LD-implementation-packages-extension-src-prompts-rebindprompt-ts
- Generated At: 2025-11-09T22:52:09.669Z

## Authored
### Purpose
Surfaces a toast when tracked artifacts are removed or renamed and offers to rebind affected links.

### Notes
- Summarises the impact by listing up to three URIs and tailoring the message for delete versus rename events.
- Defers to the `linkDiagnostics.overrideLink` command with the full rebind payload when the user accepts, preserving new URI details for renames.
- Leaves diagnostics untouched when dismissed, ensuring operators stay in control of remediation timing.

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-09T22:52:09.669Z","inputHash":"d1ecb2b648038fdd"}]} -->
<!-- LIVE-DOC:BEGIN Public Symbols -->
### Public Symbols
#### `showRebindPrompt`
- Type: function
- Source: [source](../../../../../../packages/extension/src/prompts/rebindPrompt.ts#L7)
<!-- LIVE-DOC:END Public Symbols -->

<!-- LIVE-DOC:BEGIN Dependencies -->
### Dependencies
- `@copilot-improvement/shared` - `RebindRequiredPayload`
- `vscode` - `vscode`
<!-- LIVE-DOC:END Dependencies -->
