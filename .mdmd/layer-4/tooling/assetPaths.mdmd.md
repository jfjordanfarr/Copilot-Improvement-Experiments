# Asset Path Audit (Layer 4)

## Source Mapping
- Implementation: [`packages/shared/src/tooling/assetPaths.ts`](../../../packages/shared/src/tooling/assetPaths.ts)
- Parent design: [SlopCop Workspace Linting](../../layer-3/slopcop.mdmd.md)

## Exported Symbols

#### AssetReferenceIssue
`AssetReferenceIssue` reports the file, position, and attribute associated with a missing asset reference.

#### AssetAuditOptions
`AssetAuditOptions` configures the audit (workspace root, ignore patterns, asset root directories).

#### findBrokenAssetReferences
`findBrokenAssetReferences` scans HTML/CSS content for asset references, resolves candidate paths, and returns missing targets as issues.

## Responsibility
Detect stale asset references across documentation and web assets so SlopCop and integration tests can surface broken links before release.

## Evidence
- Used by the SlopCop asset checker (see [`scripts/slopcop/check-asset-paths.ts`](../../../scripts/slopcop/check-asset-paths.ts)) and documented in [`slopcopAssetPaths.mdmd.md`](./slopcopAssetPaths.mdmd.md).
