# scripts/live-docs/migrate-authored-mdmd.ts

## Metadata
- Layer: 4
- Archetype: implementation
- Code Path: scripts/live-docs/migrate-authored-mdmd.ts
- Live Doc ID: LD-implementation-scripts-live-docs-migrate-authored-mdmd-ts
- Generated At: 2025-11-16T22:34:14.030Z

## Authored
### Purpose
Legacy helper that copies authored sections out of the original `.live-documentation/source` mirror into the permanent `.mdmd` files during the staged MDMD migration.

### Notes
This script was used during the Oct 2025 cut-over to preserve human-written Purpose/Notes blocks before the generator began writing directly to `.mdmd/layer-4/`. It is intentionally not part of the current pipeline but remains available for future repos upgrading from the Stage‑0 layout.

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-16T22:34:14.030Z","inputHash":"77caf75da316bc04"}]} -->
<!-- LIVE-DOC:BEGIN Public Symbols -->
### Public Symbols
_No public symbols detected_
<!-- LIVE-DOC:END Public Symbols -->

<!-- LIVE-DOC:BEGIN Dependencies -->
### Dependencies
- `node:fs` - `fs`
- `node:path` - `path`
<!-- LIVE-DOC:END Dependencies -->
