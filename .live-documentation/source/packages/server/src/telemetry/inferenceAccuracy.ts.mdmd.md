# packages/server/src/telemetry/inferenceAccuracy.ts

## Metadata
- Layer: 4
- Archetype: implementation
- Code Path: packages/server/src/telemetry/inferenceAccuracy.ts
- Live Doc ID: LD-implementation-packages-server-src-telemetry-inferenceaccuracy-ts
- Generated At: 2025-11-09T22:52:11.510Z

## Authored
### Purpose
Re-exports the shared inference-accuracy telemetry helpers so server modules can import them from a stable local path.

### Notes
- Keeps server-facing code decoupled from deep shared package paths, easing future refactors of telemetry utilities.

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-09T22:52:11.510Z","inputHash":"d9a3bb7d21c1882f"}]} -->
<!-- LIVE-DOC:BEGIN Public Symbols -->
### Public Symbols
_No public symbols detected_
<!-- LIVE-DOC:END Public Symbols -->

<!-- LIVE-DOC:BEGIN Dependencies -->
### Dependencies
- `@copilot-improvement/shared/telemetry/inferenceAccuracy` (re-export)
<!-- LIVE-DOC:END Dependencies -->

<!-- LIVE-DOC:BEGIN Observed Evidence -->
### Observed Evidence
#### Vitest Unit Tests
- [inferenceAccuracy.test.ts](./inferenceAccuracy.test.ts.mdmd.md)
<!-- LIVE-DOC:END Observed Evidence -->
