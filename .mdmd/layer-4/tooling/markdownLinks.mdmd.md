# Markdown Link Audit (Layer 4)

## Source Mapping
- Implementation: [`packages/shared/src/tooling/markdownLinks.ts`](../../../packages/shared/src/tooling/markdownLinks.ts)
- Parent design: [SlopCop Workspace Linting](../../layer-3/slopcop.mdmd.md)

## Exported Symbols

#### MarkdownLinkIssue
`MarkdownLinkIssue` reports the file, position, and raw link text for broken markdown references.

#### MarkdownLinkAuditOptions
`MarkdownLinkAuditOptions` configures the audit (workspace root and ignore patterns).

#### findBrokenMarkdownLinks
`findBrokenMarkdownLinks` parses a markdown file, resolves relative targets, and returns missing references as issues.

## Responsibility
Detect broken local markdown links before they hit CI by parsing inline and reference-style syntax, normalising targets, and verifying files exist on disk.

## Evidence
- Used by SlopCop markdown checks documented in [`scripts/slopcop/check-markdown-links.ts`](../../../scripts/slopcop/check-markdown-links.ts).
