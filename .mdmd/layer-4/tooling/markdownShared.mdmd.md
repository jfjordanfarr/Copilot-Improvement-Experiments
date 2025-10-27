# Markdown Shared Utilities (Layer 4)

## Source Mapping
- Implementation: [`packages/shared/src/tooling/markdownShared.ts`](../../../packages/shared/src/tooling/markdownShared.ts)
- Parent design: [SlopCop Workspace Linting](../../layer-3/slopcop.mdmd.md)

## Exported Symbols

#### ReferenceDefinition
`ReferenceDefinition` stores the byte index and URL associated with a markdown reference definition.

#### extractReferenceDefinitions
`extractReferenceDefinitions` parses a markdown file into a map of reference ids to their definitions.

#### computeLineStarts
`computeLineStarts` returns the byte offsets of newline boundaries, supporting fast position calculations.

#### toLineAndColumn
`toLineAndColumn` converts a byte offset into 1-based line/column numbers using the precomputed line start table.

#### parseLinkTarget
`parseLinkTarget` normalises inline link targets by stripping surrounding brackets, quotes, and trailing titles.

## Responsibility
Provide reusable parsing helpers shared by markdown link and asset audits so position calculations and URL parsing stay consistent across tooling.

## Evidence
- Imported by [`markdownLinks.ts`](./markdownLinks.mdmd.md) and the documentation drift detectors in server integration tests.
