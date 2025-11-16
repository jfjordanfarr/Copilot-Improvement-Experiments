# packages/server/src/features/diagnostics/rippleTypes.ts

## Metadata
- Layer: 4
- Archetype: implementation
- Code Path: packages/server/src/features/diagnostics/rippleTypes.ts
- Live Doc ID: LD-implementation-packages-server-src-features-diagnostics-rippletypes-ts
- Generated At: 2025-11-16T02:09:51.303Z

## Authored
### Purpose
Defines the shared ripple impact structures passed from inference to diagnostic publishers, including optional depth and path metadata for richer messages.

### Notes
- Wraps `RelationshipHint` so analyzers can attach traversal context (depth, path segments) without breaking compatibility with existing consumers.
- Simplified type definitions keep ripple payloads serializable, enabling storage in the graph store or transmission to clients when needed.

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-16T02:09:51.303Z","inputHash":"6829cb7fed97e1bf"}]} -->
<!-- LIVE-DOC:BEGIN Public Symbols -->
### Public Symbols
#### `RippleHint`
- Type: type
- Source: [source](../../../../../../../packages/server/src/features/diagnostics/rippleTypes.ts#L3)

#### `RippleImpact`
- Type: interface
- Source: [source](../../../../../../../packages/server/src/features/diagnostics/rippleTypes.ts#L8)
<!-- LIVE-DOC:END Public Symbols -->

<!-- LIVE-DOC:BEGIN Dependencies -->
### Dependencies
- `@copilot-improvement/shared` - `KnowledgeArtifact`, `RelationshipHint` (type-only)
<!-- LIVE-DOC:END Dependencies -->

<!-- LIVE-DOC:BEGIN Observed Evidence -->
### Observed Evidence
#### Vitest Unit Tests
- [noiseFilter.test.ts](./noiseFilter.test.ts.md)
- [publishDocDiagnostics.test.ts](./publishDocDiagnostics.test.ts.md)
<!-- LIVE-DOC:END Observed Evidence -->
