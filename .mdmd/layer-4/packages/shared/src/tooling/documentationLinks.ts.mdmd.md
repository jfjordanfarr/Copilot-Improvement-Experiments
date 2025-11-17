# packages/shared/src/tooling/documentationLinks.ts

## Metadata
- Layer: 4
- Archetype: implementation
- Code Path: packages/shared/src/tooling/documentationLinks.ts
- Live Doc ID: LD-implementation-packages-shared-src-tooling-documentationlinks-ts
- Generated At: 2025-11-16T22:34:13.541Z

## Authored
### Purpose
Supplies the shared engine that parses Live Doc anchors, maps code files to documentation targets, and enforces breadcrumb comments so maintainer workflows can guarantee every artifact cites its Layer‑4 mirror.[AI-Agent-Workspace/ChatHistory/2025/11/Summarized/2025-11-02.SUMMARIZED.md#turn-13-safe-to-commit-orchestration--audit-gaps]

### Notes
- Introduced while building the docs-to-code validation pipeline on November 2, including the CLI demo that intentionally broke `main.ts` to prove mismatched breadcrumb detection.[AI-Agent-Workspace/ChatHistory/2025/11/Summarized/2025-11-02.SUMMARIZED.md#turn-12-enforcement-demonstration]
- Powers `npm run docs:links:enforce` and the `safe:commit` gate, with follow-up runs on November 3 and beyond confirming zero violations once anchors were repaired.[AI-Agent-Workspace/ChatHistory/2025/11/2025-11-03.md]

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-16T22:34:13.541Z","inputHash":"97bb7ced96a8291b"}]} -->
<!-- LIVE-DOC:BEGIN Public Symbols -->
### Public Symbols
#### `DocumentationRule`
- Type: interface
- Source: [source](../../../../../../packages/shared/src/tooling/documentationLinks.ts#L16)

#### `DEFAULT_RULES`
- Type: const
- Source: [source](../../../../../../packages/shared/src/tooling/documentationLinks.ts#L22)

#### `DocumentationAnchorSummary`
- Type: interface
- Source: [source](../../../../../../packages/shared/src/tooling/documentationLinks.ts#L37)

#### `DocumentationDocumentAnchors`
- Type: interface
- Source: [source](../../../../../../packages/shared/src/tooling/documentationLinks.ts#L52)

#### `ResolvedDocumentationTarget`
- Type: interface
- Source: [source](../../../../../../packages/shared/src/tooling/documentationLinks.ts#L56)

#### `DocumentationTargetMap`
- Type: type
- Source: [source](../../../../../../packages/shared/src/tooling/documentationLinks.ts#L66)

#### `ParseDocumentationAnchorsOptions`
- Type: interface
- Source: [source](../../../../../../packages/shared/src/tooling/documentationLinks.ts#L68)

#### `DocumentationLinkViolation`
- Type: interface
- Source: [source](../../../../../../packages/shared/src/tooling/documentationLinks.ts#L73)

#### `DocumentationLinkEnforcementResult`
- Type: interface
- Source: [source](../../../../../../packages/shared/src/tooling/documentationLinks.ts#L90)

#### `RunDocumentationLinkEnforcementOptions`
- Type: interface
- Source: [source](../../../../../../packages/shared/src/tooling/documentationLinks.ts#L97)

#### `parseDocumentationAnchors`
- Type: function
- Source: [source](../../../../../../packages/shared/src/tooling/documentationLinks.ts#L104)

#### `resolveCodeToDocumentationMap`
- Type: function
- Source: [source](../../../../../../packages/shared/src/tooling/documentationLinks.ts#L161)

#### `formatDocumentationLinkComment`
- Type: function
- Source: [source](../../../../../../packages/shared/src/tooling/documentationLinks.ts#L195)

#### `runDocumentationLinkEnforcement`
- Type: function
- Source: [source](../../../../../../packages/shared/src/tooling/documentationLinks.ts#L208)
<!-- LIVE-DOC:END Public Symbols -->

<!-- LIVE-DOC:BEGIN Dependencies -->
### Dependencies
- `glob` - `globSync`
- `node:fs` - `fs`
- `node:path` - `path`
- [`githubSlugger.createSlugger`](./githubSlugger.ts.mdmd.md#createslugger)
- [`markdownShared.extractReferenceDefinitions`](./markdownShared.ts.mdmd.md#extractreferencedefinitions)
- [`pathUtils.normalizeWorkspacePath`](./pathUtils.ts.mdmd.md#normalizeworkspacepath)
<!-- LIVE-DOC:END Dependencies -->

<!-- LIVE-DOC:BEGIN Observed Evidence -->
### Observed Evidence
#### Vitest Unit Tests
- [documentationLinks.test.ts](./documentationLinks.test.ts.mdmd.md)
- [enforce-documentation-links.test.ts](../../../../scripts/doc-tools/enforce-documentation-links.test.ts.mdmd.md)
<!-- LIVE-DOC:END Observed Evidence -->
