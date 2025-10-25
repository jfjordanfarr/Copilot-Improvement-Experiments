# normalizeFileUri Utility (Layer 4)

## Source Mapping
- Implementation: [`packages/server/src/features/utils/uri.ts`](../../../packages/server/src/features/utils/uri.ts)
- Consumers: [`runtime/changeProcessor.ts`](../../../packages/server/src/runtime/changeProcessor.ts), [`features/watchers/artifactWatcher.ts`](../../../packages/server/src/features/watchers/artifactWatcher.ts), [`features/watchers/pathReferenceDetector.ts`](../../../packages/server/src/features/watchers/pathReferenceDetector.ts)

## Responsibility
Provide a consistent canonical form for `file://` URIs across the server runtime. Ensures Windows drive letters, relative segments, and percent-encoding collapse to a stable representation so watcher diffing, ripple generation, and diagnostics operate on normalized keys.

## Key Concepts
- **Canonicalization**: Converts `file://` URIs to absolute normalized filesystem paths and back to URLs, eliminating duplicate representations of the same file.
- **Resilience**: Swallows conversion errors, returning the original URI when `fileURLToPath` fails (e.g., malformed URIs) so callers can still proceed.

## Public API
- `normalizeFileUri(uri: string): string`

## Internal Flow
1. Trim whitespace and exit early for non-`file://` schemes.
2. Convert the URI to a filesystem path using `fileURLToPath`.
3. Normalize OS-specific segments via `path.normalize`.
4. Rehydrate the normalized path as a `file://` URL and return it.
5. On conversion failure, return the original string unchanged.

## Integration Notes
- Artifact watcher stores artifacts by canonical URI to avoid duplicate entries when paths differ only in case or slashes.
- Ripple analyzer logging uses the normalized form to produce deterministic debug output.
- Path reference detector relies on normalization so markdown references resolve regardless of authoring style.
