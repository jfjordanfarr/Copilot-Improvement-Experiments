# packages/server/src/features/overrides/overrideLink.ts

## Metadata
- Layer: 4
- Archetype: implementation
- Code Path: packages/server/src/features/overrides/overrideLink.ts
- Live Doc ID: LD-implementation-packages-server-src-features-overrides-overridelink-ts
- Generated At: 2025-11-09T22:52:11.116Z

## Authored
### Purpose
Persists a manually curated relationship between two artifacts by ensuring both sides exist in the graph and recording an override link that downstream diagnostics will honor.

### Notes
- `ensureArtifact` looks up each URI, updating the stored language when it changes or creating a new artifact tagged with the override reason and timestamp.
- Derives deterministic link identifiers via SHA-1 of `source|kind|target` so subsequent overrides de-duplicate cleanly.
- Returns the affected artifact and link ids so calling surfaces can reconcile with their local optimistic state.

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-09T22:52:11.116Z","inputHash":"0bb11a2505860882"}]} -->
<!-- LIVE-DOC:BEGIN Public Symbols -->
### Public Symbols
#### `applyOverrideLink`
- Type: function
- Source: [source](../../../../../../../packages/server/src/features/overrides/overrideLink.ts#L20)
<!-- LIVE-DOC:END Public Symbols -->

<!-- LIVE-DOC:BEGIN Dependencies -->
### Dependencies
- `@copilot-improvement/shared` - `GraphStore`, `KnowledgeArtifact`, `LinkOverrideReason`, `LinkRelationshipKind`, `OverrideLinkArtifactInput`, `OverrideLinkRequest`, `OverrideLinkResponse`
- `crypto` - `createHash`, `randomUUID`
<!-- LIVE-DOC:END Dependencies -->
