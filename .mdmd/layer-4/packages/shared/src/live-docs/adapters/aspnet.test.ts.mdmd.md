# packages/shared/src/live-docs/adapters/aspnet.test.ts

## Metadata
- Layer: 4
- Archetype: test
- Code Path: packages/shared/src/live-docs/adapters/aspnet.test.ts
- Live Doc ID: LD-test-packages-shared-src-live-docs-adapters-aspnet-test-ts
- Generated At: 2025-11-18T03:38:23.964Z

## Authored
### Purpose
Verifies that the ASP.NET markup adapter links Blazor `.razor` pages to both their generated partial classes and web-root scripts, guarding the regression highlighted during the LD-402 expansion.

### Notes
- Runs against a temporary workspace so we can assert filesystem-driven heuristics (like `~/` resolution) without polluting the repo fixtures.

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-18T03:38:23.964Z","inputHash":"c9ede42ba097b282"}]} -->
<!-- LIVE-DOC:BEGIN Public Symbols -->
### Public Symbols
_No public symbols detected_
<!-- LIVE-DOC:END Public Symbols -->

<!-- LIVE-DOC:BEGIN Dependencies -->
### Dependencies
- `node:fs/promises` - `fs`
- `node:os` - `os`
- `node:path` - `path`
- [`aspnet.aspNetMarkupAdapter`](./aspnet.ts.mdmd.md#aspnetmarkupadapter)
- `vitest` - `afterEach`, `beforeEach`, `describe`, `expect`, `it`
<!-- LIVE-DOC:END Dependencies -->

<!-- LIVE-DOC:BEGIN Targets -->
### Targets
_No targets documented yet_
<!-- LIVE-DOC:END Targets -->

<!-- LIVE-DOC:BEGIN Supporting Fixtures -->
### Supporting Fixtures
_No supporting fixtures documented yet_
<!-- LIVE-DOC:END Supporting Fixtures -->
