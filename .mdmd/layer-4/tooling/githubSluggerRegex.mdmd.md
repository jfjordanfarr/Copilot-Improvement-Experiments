# GitHub Slug Regex (Layer 4)

## Source Mapping
- Implementation: [`packages/shared/src/tooling/githubSluggerRegex.ts`](../../../packages/shared/src/tooling/githubSluggerRegex.ts)
- Parent design: [SlopCop Workspace Linting](../../layer-3/slopcop.mdmd.md)

## Exported Symbols

#### GITHUB_SLUG_REMOVE_PATTERN
`GITHUB_SLUG_REMOVE_PATTERN` is the vendored regular expression used to strip unsupported characters when generating GitHub-compatible slugs.

## Responsibility
Extract the heavy regular expression into its own module so both runtime slugging and tests share the same canonical pattern without re-computing it.

## Evidence
- Imported by [`githubSlugger.ts`](./githubSlugger.mdmd.md) which performs the slug transformation.
