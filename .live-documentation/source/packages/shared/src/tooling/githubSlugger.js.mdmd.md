# packages/shared/src/tooling/githubSlugger.js

## Metadata
- Layer: 4
- Archetype: implementation
- Code Path: packages/shared/src/tooling/githubSlugger.js
- Live Doc ID: LD-implementation-packages-shared-src-tooling-githubslugger-js
- Generated At: 2025-11-09T22:52:13.190Z

## Authored
### Purpose
CommonJS bundle of the vendored GitHub slugger, enabling Node consumers (e.g. scripts) to import the implementation without transpilation.

### Notes
- Transpiled alongside the TypeScript source so build tooling that resolves `.js` extensions continues to work in plain `require` environments.
- Re-exports the same `GitHubSlugger`, `slug`, and `createSlugger` APIs, keeping behaviour identical to the TypeScript module.

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-09T22:52:13.190Z","inputHash":"0de6642b9397bc5f"}]} -->
<!-- LIVE-DOC:BEGIN Public Symbols -->
### Public Symbols
_No public symbols detected_
<!-- LIVE-DOC:END Public Symbols -->

<!-- LIVE-DOC:BEGIN Dependencies -->
### Dependencies
_No dependencies documented yet_
<!-- LIVE-DOC:END Dependencies -->
