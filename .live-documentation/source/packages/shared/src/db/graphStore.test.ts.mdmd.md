# packages/shared/src/db/graphStore.test.ts

## Metadata
- Layer: 4
- Archetype: test
- Code Path: packages/shared/src/db/graphStore.test.ts
- Live Doc ID: LD-test-packages-shared-src-db-graphstore-test-ts
- Generated At: 2025-11-09T22:52:11.691Z

## Authored
### Purpose
Exercises critical GraphStore behaviours—artifact upserts and LLM provenance persistence—to ensure the SQLite wrapper handles id stability and metadata round-tripping.

### Notes
- Spins an isolated temp database per test so schema bootstrap and migrations run exactly as they do in production without polluting the repo.
- Validates that upserting by URI reuses the same artifact id and that provenance metadata survives JSON serialization when retrieved.

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-09T22:52:11.691Z","inputHash":"7541e0fc824d5c49"}]} -->
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
- [`graphStore.GraphStore`](./graphStore.ts.mdmd.md#graphstore)
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
