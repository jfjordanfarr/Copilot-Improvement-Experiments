# PathReferenceDetector (Layer 4)

## Source Mapping
- Implementation: [`packages/server/src/features/watchers/pathReferenceDetector.ts`](../../../packages/server/src/features/watchers/pathReferenceDetector.ts)
- Unit tests: [`pathReferenceDetector.test.ts`](../../../packages/server/src/features/watchers/pathReferenceDetector.test.ts)
- Parent design: [Diagnostics Pipeline Architecture](../../layer-3/diagnostics-pipeline.mdmd.md), [Language Server Architecture](../../layer-3/language-server-architecture.mdmd.md)
- Spec references: [FR-004](../../../specs/001-link-aware-diagnostics/spec.md#functional-requirements), [T028](../../../specs/001-link-aware-diagnostics/tasks.md)

## Exported Symbols

#### ArtifactCategory
`ArtifactCategory` labels the source artifact as `"document"` or `"code"`, steering hint kind selection.

#### PathReferenceOrigin
`PathReferenceOrigin` documents which detector (`"import"`, `"markdown"`, etc.) produced a hint, feeding rationale and confidence weighting.

#### buildFileReferenceHints
`buildFileReferenceHints` scans file content for relative references, resolves absolute targets, and returns `RelationshipHint[]` annotated with origin metadata.

## Responsibility
Scan saved artifact content for relative path references (imports, markdown links, literal hints) and emit `RelationshipHint` entries that seed the inference pipeline before diagnostics run. Helps bootstrap dependency edges even when the knowledge graph has not yet been enriched by symbol analysis or external feeds.

## Detection Strategy
- Supports multiple origins via dedicated regular expressions:
  - `import` / `from` statements
  - `require()` calls
  - dynamic `import()` expressions
  - markdown inline links
  - generic string literals that look like relative file paths
- Normalises candidate paths (strip fragments, convert backslashes, ignore URLs/anchors) and resolves them to absolute file-system targets relative to the source file.
- Produces hints only if the resolved file exists on disk, preventing spurious edges.

## Hint Construction
- `sourceUri`: canonicalised via `normalizeFileUri`.
- `targetUri`: canonicalised file URL of the resolved path.
- `kind`: inferred from source category (`document` vs `code`) and target extension (documents emit `documents`/`references`; code emits `depends_on`).
- `confidence`: origin-weighted (`import` 0.85, `markdown` 0.7, etc.) to guide ripple prioritisation.
- `rationale`: stamped as `path-reference:<origin>` for downstream observability.

## Implementation Notes
- Uses `DEFAULT_EXTENSION_GUESSES` to probe extensionless import paths (e.g., `./utils`) by checking common file and `index.*` combinations.
- Deduplicates hints per target URI, keeping the highest-confidence origin when multiple patterns resolve to the same file.
- Relies on synchronous `fs.statSync` while running inside the change queue; bounded guess list keeps latency manageable.

## Testing
- Should be covered by unit tests that feed fixture contents (JS imports, markdown links, literal paths) and assert emitted hints (confidence, kind, target URIs). Coverage backlog tracked with watcher test suite expansion.
- Integration suites US1/US2 leverage the detector implicitly to connect markdown docs to code artifacts before ripple analysis.

## Follow-ups
- Expand `DEFAULT_EXTENSION_GUESSES` once additional languages are onboarded (e.g., Python, Go).
- Switch to cached filesystem lookups if profiling shows repeated stat calls dominate debounce windows.
- Add guardrails for project-specific aliasing (webpack tsconfig paths) when configuration ingestion is available.
