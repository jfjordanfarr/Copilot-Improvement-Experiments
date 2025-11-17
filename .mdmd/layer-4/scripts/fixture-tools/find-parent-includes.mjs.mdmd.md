# scripts/fixture-tools/find-parent-includes.mjs

## Metadata
- Layer: 4
- Archetype: implementation
- Code Path: scripts/fixture-tools/find-parent-includes.mjs
- Live Doc ID: LD-implementation-scripts-fixture-tools-find-parent-includes-mjs
- Generated At: 2025-11-16T22:34:13.810Z

## Authored
### Purpose
Scans vendored C fixtures for `#include` directives that climb outside the fixture root (e.g., `../` paths) so we can prove snapshots like libuv remain self-contained before locking their manifests ([libuv hygiene check](../../../../AI-Agent-Workspace/ChatHistory/2025/11/2025-11-01.md#L4735-L4806)).

### Notes
- Authored 2025-11-01 when onboarding libuv to guarantee we didn’t accidentally retain parent-directory includes after trimming the upstream repository; the CLI reports offending paths and exits non-zero so fixture verification halts if we regress ([creation log](../../../../AI-Agent-Workspace/ChatHistory/2025/11/2025-11-01.md#L4735-L4806)).
- Remains part of the fixture tooling bundle recorded in the same commit series, giving us a quick guardrail whenever new C benchmarks arrive ([tooling bundle](../../../../AI-Agent-Workspace/ChatHistory/2025/11/2025-11-01.md#L6166-L6316)).

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-16T22:34:13.810Z","inputHash":"2da3f1d57c6c8a68"}]} -->
<!-- LIVE-DOC:BEGIN Public Symbols -->
### Public Symbols
_No public symbols detected_
<!-- LIVE-DOC:END Public Symbols -->

<!-- LIVE-DOC:BEGIN Dependencies -->
### Dependencies
- `node:fs` - `promises`
- `node:path` - `path`
- `node:process` - `process`
<!-- LIVE-DOC:END Dependencies -->
