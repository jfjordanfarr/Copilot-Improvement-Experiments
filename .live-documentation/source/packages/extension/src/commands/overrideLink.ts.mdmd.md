# packages/extension/src/commands/overrideLink.ts

## Metadata
- Layer: 4
- Archetype: implementation
- Code Path: packages/extension/src/commands/overrideLink.ts
- Live Doc ID: LD-implementation-packages-extension-src-commands-overridelink-ts
- Generated At: 2025-11-09T22:52:09.474Z

## Authored
### Purpose
Provides the `linkDiagnostics.overrideLink` command to create or update relationships when links drift or artifacts move.

### Notes
- Routes manual overrides through interactive prompts that capture source/target layers, relationship kind, and a replacement artifact, then submits an override request to the language server.
- Handles rename-driven rebinding by iterating impacted artifacts under a progress notification and rebuilding each link against the newly selected URI.
- Applies heuristics to suggest sensible defaults (layer guesses, relationship types) and echoes results via VS Code toasts for user confirmation.

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-09T22:52:09.474Z","inputHash":"47feec27f3ba701c"}]} -->
<!-- LIVE-DOC:BEGIN Public Symbols -->
### Public Symbols
#### `registerOverrideLinkCommand`
- Type: function
- Source: [source](../../../../../../packages/extension/src/commands/overrideLink.ts#L39)
<!-- LIVE-DOC:END Public Symbols -->

<!-- LIVE-DOC:BEGIN Dependencies -->
### Dependencies
- `@copilot-improvement/shared` - `ArtifactLayer`, `LinkRelationshipKind`, `OVERRIDE_LINK_REQUEST`, `OverrideLinkRequest`, `OverrideLinkResponse`, `RebindImpactedArtifact`, `RebindReason`, `RebindRequiredArtifact`
- `path` - `path`
- `vscode` - `vscode`
- `vscode-languageclient/node` - `LanguageClient`
<!-- LIVE-DOC:END Dependencies -->
