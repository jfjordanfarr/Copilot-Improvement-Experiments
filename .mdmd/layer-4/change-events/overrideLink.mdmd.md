# applyOverrideLink (Layer 4)

## Source Mapping
- Implementation: [`packages/server/src/features/overrides/overrideLink.ts`](../../../packages/server/src/features/overrides/overrideLink.ts)
- Graph store contract: [`packages/shared/src/db/graphStore.ts`](../../../packages/shared/src/db/graphStore.ts)
- Parent design: [Diagnostics Pipeline – Overrides](../server-diagnostics/publishDocDiagnostics.mdmd.md)

## Responsibility
Apply operator-specified link overrides directly to the knowledge graph. Ensures override requests persist both the link and any new artifacts they reference, allowing diagnostics and ripple analysis to respect manual corrections.

## Key Concepts
- **OverrideLinkRequest**: API payload describing source/target artifacts, relationship kind, confidence, and reason.
- **Artifact upsert**: Guarantees both source and target artifacts exist in the graph, creating them with override metadata when absent.
- **Deterministic link IDs**: SHA1 hash of `source|kind|target` prevents duplicate overrides and supports idempotent retries.

## Exported Symbols

#### applyOverrideLink
`applyOverrideLink` upserts the supplied source/target artifacts, computes a deterministic link id, and persists the override relationship before returning the identifiers required for acknowledgement and diagnostics updates.

## Internal Flow
1. Capture a timestamp used for both artifact metadata and link creation.
2. Resolve source and target artifacts via `ensureArtifact`; update language metadata when provided.
3. Compute a deterministic link ID and upsert the link with the supplied reason encoded in `createdBy`.
4. Return the IDs needed by callers to surface acknowledgement or diagnostics updates.

## Error Handling
- Relies on `GraphStore` to throw when persistence fails; callers are expected to wrap and translate errors into diagnostics.
- Artifact ensure step only adjusts language when metadata changes, avoiding unnecessary writes.

## Integration Notes
- Overrides integrate with the acknowledgement service so user-accepted overrides cease raising drift warnings.
- Manual overrides remain stable across restarts because deterministic IDs align with checkpointed graph entries.
- Future audit trails can extend the override metadata without changing the core algorithm.
