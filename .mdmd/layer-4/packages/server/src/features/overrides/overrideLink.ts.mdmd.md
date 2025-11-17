# packages/server/src/features/overrides/overrideLink.ts

## Metadata
- Layer: 4
- Archetype: implementation
- Code Path: packages/server/src/features/overrides/overrideLink.ts
- Live Doc ID: LD-implementation-packages-server-src-features-overrides-overridelink-ts
- Generated At: 2025-11-16T22:35:16.150Z

## Authored
### Purpose
Implements the language-server side of the T027 manual override flow by persisting `OverrideLinkRequest` payloads into the graph store with deterministic IDs and override metadata, as described in [AI-Agent-Workspace/ChatHistory/2025/10/2025-10-16.md#L2799-L2836](../../../../../../../../AI-Agent-Workspace/ChatHistory/2025/10/2025-10-16.md#L2799-L2836).

### Notes
- Ensures both source and target artifacts exist (creating or refreshing them with override metadata) before writing the SHA‑1-based link, matching the Oct 16 design notes in [AI-Agent-Workspace/ChatHistory/2025/10/2025-10-16.md#L2800-L2836](../../../../../../../../AI-Agent-Workspace/ChatHistory/2025/10/2025-10-16.md#L2800-L2836).
- Automated coverage was deferred in the originating change set because the Node 22 toolchain blocked lint/test execution; the outstanding validation gap is acknowledged in [AI-Agent-Workspace/ChatHistory/2025/10/2025-10-16.md#L2804-L2836](../../../../../../../../AI-Agent-Workspace/ChatHistory/2025/10/2025-10-16.md#L2804-L2836).

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-16T22:35:16.150Z","inputHash":"55c596f31a20585c"}]} -->
<!-- LIVE-DOC:BEGIN Public Symbols -->
### Public Symbols
#### `applyOverrideLink`
- Type: function
- Source: [source](../../../../../../../packages/server/src/features/overrides/overrideLink.ts#L20)
<!-- LIVE-DOC:END Public Symbols -->

<!-- LIVE-DOC:BEGIN Dependencies -->
### Dependencies
- `crypto` - `createHash`, `randomUUID`
- [`index.GraphStore`](../../../../shared/src/index.ts.mdmd.md#graphstore)
- [`index.KnowledgeArtifact`](../../../../shared/src/index.ts.mdmd.md#knowledgeartifact)
- [`index.LinkOverrideReason`](../../../../shared/src/index.ts.mdmd.md#linkoverridereason)
- [`index.LinkRelationshipKind`](../../../../shared/src/index.ts.mdmd.md#linkrelationshipkind)
- [`index.OverrideLinkArtifactInput`](../../../../shared/src/index.ts.mdmd.md#overridelinkartifactinput)
- [`index.OverrideLinkRequest`](../../../../shared/src/index.ts.mdmd.md#overridelinkrequest)
- [`index.OverrideLinkResponse`](../../../../shared/src/index.ts.mdmd.md#overridelinkresponse)
<!-- LIVE-DOC:END Dependencies -->
