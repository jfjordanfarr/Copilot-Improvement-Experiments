# packages/shared/src/db/graphStore.test.ts

## Metadata
- Layer: 4
- Archetype: test
- Code Path: packages/shared/src/db/graphStore.test.ts
- Live Doc ID: LD-test-packages-shared-src-db-graphstore-test-ts
- Generated At: 2025-11-19T15:01:34.680Z

## Authored
### Purpose
Exercises the canonical-ID reuse implemented in GraphStore so fallback inference and change persistence stop tripping SQLite uniqueness guards, as captured in [AI-Agent-Workspace/ChatHistory/2025/10/Summarized/2025-10-23.SUMMARIZED.md#turn-27-graphstore-dedupe-attempt--new-failures-lines-3521-4000](../../../../../../AI-Agent-Workspace/ChatHistory/2025/10/Summarized/2025-10-23.SUMMARIZED.md#turn-27-graphstore-dedupe-attempt--new-failures-lines-3521-4000).

### Notes
Coverage locks the regression we saw during the US1 pipeline run where repeated inference writes hit `links.source_id/target_id/kind` collisions—see [AI-Agent-Workspace/ChatHistory/2025/10/2025-10-23.md#L3710](../../../../../../AI-Agent-Workspace/ChatHistory/2025/10/2025-10-23.md#L3710)—guarding the integration harness from silently dropping persisted edges.

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-19T15:01:34.680Z","inputHash":"4e77caa4ba5c9127"}]} -->
<!-- LIVE-DOC:BEGIN Public Symbols -->
### Public Symbols
_No public symbols detected_
<!-- LIVE-DOC:END Public Symbols -->

<!-- LIVE-DOC:BEGIN Dependencies -->
### Dependencies
- `node:crypto` - `randomUUID`
- `node:fs` - `mkdtempSync`, `rmSync`
- `node:os` - `tmpdir`
- `node:path` - `path`
- [`graphStore.GraphStore`](./graphStore.ts.mdmd.md#symbol-graphstore)
- `vitest` - `afterEach`, `describe`, `expect`, `it`
<!-- LIVE-DOC:END Dependencies -->

<!-- LIVE-DOC:BEGIN Targets -->
### Targets
#### Vitest Unit Tests
- packages/shared/src/db: [graphStore.ts](./graphStore.ts.mdmd.md)
- packages/shared/src/domain: [artifacts.ts](../domain/artifacts.ts.mdmd.md)
<!-- LIVE-DOC:END Targets -->

<!-- LIVE-DOC:BEGIN Supporting Fixtures -->
### Supporting Fixtures
_No supporting fixtures documented yet_
<!-- LIVE-DOC:END Supporting Fixtures -->
