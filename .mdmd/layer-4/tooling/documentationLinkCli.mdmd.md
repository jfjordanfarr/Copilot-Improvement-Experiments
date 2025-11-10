# Documentation Link Enforcement CLI

## Metadata
- Layer: 4
- Implementation ID: IMP-615
- Code Path: [`scripts/doc-tools/enforce-documentation-links.ts`](../../../scripts/doc-tools/enforce-documentation-links.ts)
- Exports: runCli, EXIT_CODES

## Purpose
Provides the executable interface for documentation link enforcement so engineers and pipelines can validate or repair `// Live Documentation:` breadcrumbs without wiring in the shared module directly. The CLI handles argument parsing, workspace discovery, rule configuration, and JSON/human-readable output, making it the boundary between MDMD documentation and code-level enforcement.

## Implementation Surface
<!-- mdmd:code scripts/doc-tools/enforce-documentation-links.ts -->
- [`scripts/doc-tools/enforce-documentation-links.ts`](../../../scripts/doc-tools/enforce-documentation-links.ts)
Exports CLI wiring for documentation link enforcement, including argument parsing, workspace validation, and fix-mode orchestration.

## Public Symbols

### runCli
<!-- mdmd:code scripts/doc-tools/enforce-documentation-links.ts -->
- [`scripts/doc-tools/enforce-documentation-links.ts`](../../../scripts/doc-tools/enforce-documentation-links.ts)
Parses command-line flags, resolves the workspace configuration, and invokes `runDocumentationLinkEnforcement`, returning an exit code that reflects success, violations, or execution failure.

### EXIT_CODES
<!-- mdmd:code scripts/doc-tools/enforce-documentation-links.ts -->
- [`scripts/doc-tools/enforce-documentation-links.ts`](../../../scripts/doc-tools/enforce-documentation-links.ts)
Constants mapping CLI outcomes to process exit codes, enabling shell scripts and CI tasks to differentiate clean runs, detected violations, and unexpected failures.

## Collaborators
- Relies on [`packages/shared/src/tooling/documentationLinks.ts`](../../../packages/shared/src/tooling/documentationLinks.ts) for the enforcement engine and rule parsing helpers.
- Used by [`scripts/doc-tools/enforce-documentation-links.test.ts`](../../../scripts/doc-tools/enforce-documentation-links.test.ts) to verify CLI behaviour, including autofix flows.
- Integrated into the safe-to-commit pipeline via [`scripts/safe-to-commit.mjs`](../../../scripts/safe-to-commit.mjs) so documentation drift is caught before commits land.

## Evidence
- `npm run docs:links:enforce` executes the CLI in check mode across the entire workspace.
- `npm run docs:links:enforce -- --fix` exercises the autofix path and confirms exit codes reflect updated files.
- `npm run test:unit -- scripts/doc-tools/enforce-documentation-links.test.ts` covers error paths, include filtering, and autofix behaviour under controlled fixtures.
