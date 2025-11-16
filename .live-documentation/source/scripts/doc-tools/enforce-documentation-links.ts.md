# scripts/doc-tools/enforce-documentation-links.ts

## Metadata
- Layer: 4
- Archetype: implementation
- Code Path: scripts/doc-tools/enforce-documentation-links.ts
- Live Doc ID: LD-implementation-scripts-doc-tools-enforce-documentation-links-ts
- Generated At: 2025-11-16T02:09:52.175Z

## Authored
### Purpose
_Pending authored purpose_

### Notes
_Pending notes_

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-16T02:09:52.175Z","inputHash":"b0c0d0c1afe1a08e"}]} -->
<!-- LIVE-DOC:BEGIN Public Symbols -->
### Public Symbols
#### `EXIT_CODES`
- Type: const
- Source: [source](../../../../scripts/doc-tools/enforce-documentation-links.ts#L32)

#### `runCli`
- Type: function
- Source: [source](../../../../scripts/doc-tools/enforce-documentation-links.ts#L38)
<!-- LIVE-DOC:END Public Symbols -->

<!-- LIVE-DOC:BEGIN Dependencies -->
### Dependencies
- `node:fs` - `fs`
- `node:path` - `path`
- `node:process` - `process`
- [`documentationLinks.DEFAULT_RULES`](../../packages/shared/src/tooling/documentationLinks.ts.md#default_rules)
- [`documentationLinks.DocumentationLinkEnforcementResult`](../../packages/shared/src/tooling/documentationLinks.ts.md#documentationlinkenforcementresult)
- [`documentationLinks.DocumentationLinkViolation`](../../packages/shared/src/tooling/documentationLinks.ts.md#documentationlinkviolation)
- [`documentationLinks.DocumentationRule`](../../packages/shared/src/tooling/documentationLinks.ts.md#documentationrule)
- [`documentationLinks.runDocumentationLinkEnforcement`](../../packages/shared/src/tooling/documentationLinks.ts.md#rundocumentationlinkenforcement)
- [`pathUtils.normalizeWorkspacePath`](../../packages/shared/src/tooling/pathUtils.ts.md#normalizeworkspacepath)
<!-- LIVE-DOC:END Dependencies -->

<!-- LIVE-DOC:BEGIN Observed Evidence -->
### Observed Evidence
#### Vitest Unit Tests
- [enforce-documentation-links.test.ts](./enforce-documentation-links.test.ts.md)
<!-- LIVE-DOC:END Observed Evidence -->
