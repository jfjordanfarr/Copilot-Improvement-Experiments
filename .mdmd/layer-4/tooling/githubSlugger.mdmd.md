# GitHub Slug Utilities (Layer 4)

## Source Mapping
- Implementation: [`packages/shared/src/tooling/githubSlugger.ts`](../../../packages/shared/src/tooling/githubSlugger.ts)
- Parent design: [SlopCop Workspace Linting](../../layer-3/slopcop.mdmd.md)

## Exported Symbols

#### SlugContext
`SlugContext` reports the generated slug, the base slug, and the duplicate index when resolving collisions.

#### GitHubSlugger
`GitHubSlugger` generates GitHub-compatible slugs, tracking duplicates to append numeric suffixes.

#### slug
`slug` performs the stateless slug conversion (lowercasing, stripping punctuation, replacing spaces) without collision tracking.

#### createSlugger
`createSlugger` instantiates a `GitHubSlugger` with a fresh occurrence map.

## Responsibility
Provide a vendored, dependency-free implementation of GitHub’s slugging behaviour so diagnostics and documentation tooling can compute anchor ids consistently.

## Evidence
- Consumed by SlopCop symbol audits (see [`scripts/slopcop/check-symbols.ts`](../../../scripts/slopcop/check-symbols.ts)) and documentation tooling when generating anchors for MDMD headings.
