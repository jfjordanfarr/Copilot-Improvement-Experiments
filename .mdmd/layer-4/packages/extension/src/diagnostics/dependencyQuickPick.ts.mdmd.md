# packages/extension/src/diagnostics/dependencyQuickPick.ts

## Metadata
- Layer: 4
- Archetype: implementation
- Code Path: packages/extension/src/diagnostics/dependencyQuickPick.ts
- Live Doc ID: LD-implementation-packages-extension-src-diagnostics-dependencyquickpick-ts
- Generated At: 2025-11-16T22:35:14.511Z

## Authored
### Purpose
Implements the T039 dependency inspection quick pick so the extension can call `INSPECT_DEPENDENCIES_REQUEST`, render ripple paths, and let reviewers inspect callers/callees from VS Code, per [AI-Agent-Workspace/ChatHistory/2025/10/2025-10-20.md#L1573-L1605](../../../../../../AI-Agent-Workspace/ChatHistory/2025/10/2025-10-20.md#L1573-L1605).

### Notes
- Refactored on Oct 23 to lean on the shared Zod schemas and to align with the symbol-neighbor work, captured in [AI-Agent-Workspace/ChatHistory/2025/10/2025-10-23.md#L2700-L2790](../../../../../../AI-Agent-Workspace/ChatHistory/2025/10/2025-10-23.md#L2700-L2790).
- The same change set validated lint, unit, and integration runs (`npm run lint`, `npm run test:unit`, `npm run test:integration`), ensuring the quick pick stays regression-tested; see [AI-Agent-Workspace/ChatHistory/2025/10/2025-10-20.md#L1500-L1568](../../../../../../AI-Agent-Workspace/ChatHistory/2025/10/2025-10-20.md#L1500-L1568).

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-16T22:35:14.511Z","inputHash":"5a958ca8e04082c9"}]} -->
<!-- LIVE-DOC:BEGIN Public Symbols -->
### Public Symbols
#### `registerDependencyQuickPick`
- Type: function
- Source: [source](../../../../../../packages/extension/src/diagnostics/dependencyQuickPick.ts#L20)

#### `DependencyQuickPickController`
- Type: class
- Source: [source](../../../../../../packages/extension/src/diagnostics/dependencyQuickPick.ts#L31)

#### `describeEdgePath`
- Type: function
- Source: [source](../../../../../../packages/extension/src/diagnostics/dependencyQuickPick.ts#L159)

#### `InspectDependenciesResultValidator`
- Type: const
- Source: [source](../../../../../../packages/extension/src/diagnostics/dependencyQuickPick.ts#L176)

#### `ParsedEdge`
- Type: unknown
- Source: [source](../../../../../../packages/extension/src/diagnostics/dependencyQuickPick.ts#L178)
<!-- LIVE-DOC:END Public Symbols -->

<!-- LIVE-DOC:BEGIN Dependencies -->
### Dependencies
- [`artifactSchemas.KnowledgeArtifactSchema`](../shared/artifactSchemas.ts.mdmd.md#knowledgeartifactschema)
- [`artifactSchemas.LinkRelationshipKindSchema`](../shared/artifactSchemas.ts.mdmd.md#linkrelationshipkindschema)
- [`index.INSPECT_DEPENDENCIES_REQUEST`](../../../shared/src/index.ts.mdmd.md#inspect_dependencies_request)
- [`index.InspectDependenciesParams`](../../../shared/src/index.ts.mdmd.md#inspectdependenciesparams)
- `vscode` - `vscode`
- `vscode-languageclient/node` - `LanguageClient`
- `zod` - `z`
<!-- LIVE-DOC:END Dependencies -->

<!-- LIVE-DOC:BEGIN Observed Evidence -->
### Observed Evidence
#### Vitest Unit Tests
- [dependencyQuickPick.test.ts](./dependencyQuickPick.test.ts.mdmd.md)
<!-- LIVE-DOC:END Observed Evidence -->
