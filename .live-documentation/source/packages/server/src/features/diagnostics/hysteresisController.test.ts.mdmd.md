# packages/server/src/features/diagnostics/hysteresisController.test.ts

## Metadata
- Layer: 4
- Archetype: test
- Code Path: packages/server/src/features/diagnostics/hysteresisController.test.ts
- Live Doc ID: LD-test-packages-server-src-features-diagnostics-hysteresiscontroller-test-ts
- Generated At: 2025-11-14T18:42:06.325Z

## Authored
### Purpose
Exercises the hysteresis controller so reciprocal diagnostics are silenced within the configured window, acknowledgements clear stored edges, and over-capacity states retain only the newest entries.

### Notes
- Relies on a deterministic `now` factory to advance the virtual clock and verify suppression expiry boundaries.
- Confirms `acknowledge` removes both directions for a given pair, restoring emissions immediately.
- Sets a small `maxEntries` value to assert the trimming logic removes the oldest record and keeps the map bounded for production workloads.

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-14T18:42:06.325Z","inputHash":"b1dc30da7548cb78"}]} -->
<!-- LIVE-DOC:BEGIN Public Symbols -->
### Public Symbols
_No public symbols detected_
<!-- LIVE-DOC:END Public Symbols -->

<!-- LIVE-DOC:BEGIN Dependencies -->
### Dependencies
- [`hysteresisController.HysteresisController`](./hysteresisController.ts.mdmd.md#hysteresiscontroller)
- `vitest` - `describe`, `expect`, `it`
<!-- LIVE-DOC:END Dependencies -->

<!-- LIVE-DOC:BEGIN Targets -->
### Targets
#### Vitest Unit Tests
- packages/server/src/features/diagnostics: [hysteresisController.ts](./hysteresisController.ts.mdmd.md)
<!-- LIVE-DOC:END Targets -->

<!-- LIVE-DOC:BEGIN Supporting Fixtures -->
### Supporting Fixtures
_No supporting fixtures documented yet_
<!-- LIVE-DOC:END Supporting Fixtures -->
