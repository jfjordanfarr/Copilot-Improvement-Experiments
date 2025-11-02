# Documentation Link Bridge (Layer 4)

## Metadata
- Layer: 4
- Implementation ID: IMP-613
- Code Path: [`packages/shared/src/tooling/documentationLinks.ts`](../../../packages/shared/src/tooling/documentationLinks.ts), [`scripts/doc-tools/enforce-documentation-links.ts`](../../../scripts/doc-tools/enforce-documentation-links.ts)
- Exports: parseDocumentationAnchors, resolveCodeToDocumentationMap, formatDocumentationLinkComment, runDocumentationLinkEnforcement

## Purpose
Provides the shared enforcement layer that keeps comment-capable code units linked to their authoritative documentation, regardless of the documentation system a workspace adopts. The bridge parses documentation files, tracks which sections claim ownership of which code paths, validates bidirectional links, and offers an autofix flow so CLIs, language servers, and future docstring bridges all rely on the same configuration-driven contract.

## Implementation Surface
<!-- mdmd:code packages/shared/src/tooling/documentationLinks.ts -->
- [`packages/shared/src/tooling/documentationLinks.ts`](../../../packages/shared/src/tooling/documentationLinks.ts)
Centralises documentation anchor parsing, enforcement, and formatting utilities so every caller (CLI, language server, future automation) shares a single configuration-driven workflow.

## Public Symbols

### parseDocumentationAnchors
<!-- mdmd:code packages/shared/src/tooling/documentationLinks.ts -->
- [`packages/shared/src/tooling/documentationLinks.ts`](../../../packages/shared/src/tooling/documentationLinks.ts)
Reads documentation sources declared by a rule, capturing headings, machine-readable `<!-- mdmd:code ... -->` markers, and inline backlinks so downstream tooling understands which code artifacts each section covers.

### resolveCodeToDocumentationMap
<!-- mdmd:code packages/shared/src/tooling/documentationLinks.ts -->
- [`packages/shared/src/tooling/documentationLinks.ts`](../../../packages/shared/src/tooling/documentationLinks.ts)
Combines anchor data from every rule into a workspace-wide map from commentable code paths to canonical documentation targets (document + slug) while preferring sections that already link back to the code.

### formatDocumentationLinkComment
<!-- mdmd:code packages/shared/src/tooling/documentationLinks.ts -->
- [`packages/shared/src/tooling/documentationLinks.ts`](../../../packages/shared/src/tooling/documentationLinks.ts)
Produces the marker comment using the rule's label (defaulting to `Live Documentation:`) and the resolved documentation target, automatically choosing the appropriate line-comment delimiter for the file extension.

### runDocumentationLinkEnforcement
<!-- mdmd:code packages/shared/src/tooling/documentationLinks.ts -->
- [`packages/shared/src/tooling/documentationLinks.ts`](../../../packages/shared/src/tooling/documentationLinks.ts)
Implements the enforcement engine that scans configured code globs, accepts existing documentation comments anywhere ahead of the first statement (skipping shebangs and header comments), verifies backlinks, and optionally inserts or updates comments when `--fix` is enabled.

### DEFAULT_RULES
<!-- mdmd:code packages/shared/src/tooling/documentationLinks.ts -->
- [`packages/shared/src/tooling/documentationLinks.ts`](../../../packages/shared/src/tooling/documentationLinks.ts)
Default configuration mapping Layer-4 MDMD documents to comment-capable code globs, ensuring enforcement succeeds out of the box.

### DocumentationRule
<!-- mdmd:code packages/shared/src/tooling/documentationLinks.ts -->
- [`packages/shared/src/tooling/documentationLinks.ts`](../../../packages/shared/src/tooling/documentationLinks.ts)
Shape describing a single rule’s label plus documentation and code globs, used by callers to override default enforcement scopes.

### DocumentationAnchorSummary
<!-- mdmd:code packages/shared/src/tooling/documentationLinks.ts -->
- [`packages/shared/src/tooling/documentationLinks.ts`](../../../packages/shared/src/tooling/documentationLinks.ts)
Intermediate structure capturing headings, slugs, backlinks, and declared code paths extracted from Layer-4 documents.

### DocumentationDocumentAnchors
<!-- mdmd:code packages/shared/src/tooling/documentationLinks.ts -->
- [`packages/shared/src/tooling/documentationLinks.ts`](../../../packages/shared/src/tooling/documentationLinks.ts)
Augments anchor summaries with rule metadata so enforcement can reason about which documents satisfy which rule.

### DocumentationTargetMap
<!-- mdmd:code packages/shared/src/tooling/documentationLinks.ts -->
- [`packages/shared/src/tooling/documentationLinks.ts`](../../../packages/shared/src/tooling/documentationLinks.ts)
Type alias describing the lookup from workspace-relative code paths to their owning documentation sections.

### DocumentationLinkViolation
<!-- mdmd:code packages/shared/src/tooling/documentationLinks.ts -->
- [`packages/shared/src/tooling/documentationLinks.ts`](../../../packages/shared/src/tooling/documentationLinks.ts)
Represents a single enforcement failure, including the rule label, expected breadcrumb, and optional actual comment for diffs.

### DocumentationLinkEnforcementResult
<!-- mdmd:code packages/shared/src/tooling/documentationLinks.ts -->
- [`packages/shared/src/tooling/documentationLinks.ts`](../../../packages/shared/src/tooling/documentationLinks.ts)
Aggregates counts and violations produced during enforcement runs so CLIs and tests can inspect results without reprocessing logs.

### ParseDocumentationAnchorsOptions
<!-- mdmd:code packages/shared/src/tooling/documentationLinks.ts -->
- [`packages/shared/src/tooling/documentationLinks.ts`](../../../packages/shared/src/tooling/documentationLinks.ts)
Options bag passed when parsing documentation, currently allowing workspace overrides and raw content injection for tests.

### ResolvedDocumentationTarget
<!-- mdmd:code packages/shared/src/tooling/documentationLinks.ts -->
- [`packages/shared/src/tooling/documentationLinks.ts`](../../../packages/shared/src/tooling/documentationLinks.ts)
Details the canonical document, slug, and backlink presence associated with a code path once rules are applied.

### RunDocumentationLinkEnforcementOptions
<!-- mdmd:code packages/shared/src/tooling/documentationLinks.ts -->
- [`packages/shared/src/tooling/documentationLinks.ts`](../../../packages/shared/src/tooling/documentationLinks.ts)
Configuration object accepted by `runDocumentationLinkEnforcement`, covering workspace root, overrides, include filters, and autofix toggles.

## Source Breadcrumbs
<!-- mdmd:code packages/shared/src/tooling/documentationLinks.ts -->
- [`packages/shared/src/tooling/documentationLinks.ts`](../../../packages/shared/src/tooling/documentationLinks.ts)

## Collaborators
- Depends on [`packages/shared/src/tooling/githubSlugger.ts`](../../../packages/shared/src/tooling/githubSlugger.ts) for consistent heading slug generation.
- Normalises workspace paths through [`packages/shared/src/tooling/pathUtils.ts`](../../../packages/shared/src/tooling/pathUtils.ts).
- Shares anchor parsing logic with [`packages/shared/src/tooling/markdownShared.ts`](../../../packages/shared/src/tooling/markdownShared.ts) to remain compatible with existing SlopCop linting utilities.
- Invoked by [`scripts/doc-tools/enforce-documentation-links.ts`](../../../scripts/doc-tools/enforce-documentation-links.ts) to surface actionable diffs during verification pipelines.

## Linked Components
- [SlopCop Tooling Component](/.mdmd/layer-3/slopcop.mdmd.md)
- [COMP010 – Relationship Rule Engine](/.mdmd/layer-3/relationship-rule-engine.mdmd.md#comp010-relationship-rule-engine)

## Evidence
- Unit coverage introduced in [`packages/shared/src/tooling/documentationLinks.test.ts`](../../../packages/shared/src/tooling/documentationLinks.test.ts) exercises anchor parsing, slug generation, and comment formatting across supported languages.
- CLI integration covered by end-to-end smoke assertions in [`scripts/doc-tools/__tests__/enforce-documentation-links.test.ts`](../../../scripts/doc-tools/__tests__/enforce-documentation-links.test.ts) verifying failure modes and `--fix` behavior.

## Follow-up
- Extend the bridge to enforce docstring-level anchors once exported symbol comments adopt the same documentation link contract.
- Surface documentation link diagnostics inside the language server so authors receive real-time feedback without running the CLI manually.
