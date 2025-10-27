# Artifact Watcher (Layer 4)

## Source Mapping
- Implementation: [`packages/server/src/features/watchers/artifactWatcher.ts`](../../../packages/server/src/features/watchers/artifactWatcher.ts)
- Parent design: [Diagnostics Pipeline Architecture](../../layer-3/diagnostics-pipeline.mdmd.md), [Language Server Architecture](../../layer-3/language-server-architecture.mdmd.md)
- Spec references: [FR-001](../../../specs/001-link-aware-diagnostics/spec.md#functional-requirements), [FR-002](../../../specs/001-link-aware-diagnostics/spec.md#functional-requirements), [FR-015](../../../specs/001-link-aware-diagnostics/spec.md#functional-requirements)

## Exported Symbols

#### ArtifactCategory
`ArtifactCategory` distinguishes the `"document"` and `"code"` change categories so downstream pipelines can branch on artifact type.

#### DocumentStore
`DocumentStore` abstracts the text document cache used to retrieve live editor content before falling back to disk reads.

#### ArtifactWatcherLogger
`ArtifactWatcherLogger` defines minimal info/warn hooks for structured watcher telemetry.

#### ArtifactWatcherOptions
`ArtifactWatcherOptions` wires the document store, graph store, path reference detector, and logger into the watcher, plus optional size thresholds and debounce windows.

#### TrackedArtifactChange
`TrackedArtifactChange` captures the normalized change payload shared with inference orchestrators, including canonical URIs, prior artifacts, content, and hints.

#### DocumentTrackedArtifactChange
`DocumentTrackedArtifactChange` narrows `TrackedArtifactChange` to documentation artifacts, helping inference treat prose differently from code.

#### CodeTrackedArtifactChange
`CodeTrackedArtifactChange` narrows the same payload for code changes so LLM inference and dependency analysis receive enriched metadata.

#### SkippedArtifactChange
`SkippedArtifactChange` records ignored events alongside reasons (missing content, unsupported type) for observability.

#### ArtifactWatcherResult
`ArtifactWatcherResult` aggregates both processed changes and skipped entries, letting callers decide how to react to partial successes.

#### ArtifactWatcher
`ArtifactWatcher` listens to file events, classifies artifacts, loads content, enriches hints, and emits `TrackedArtifactChange` batches for inference.

## Responsibility
Classifies and prepares workspace change events for inference:
- Normalises URIs for consistency across filesystem events.
- Loads document/code contents (from open editors or disk) to feed link detectors.
- Seeds inference runs with existing artifact metadata and provider hints.
- Differentiates between document vs. code categories to route ripple handling.

## Key Behaviour
- **Language/extension classification** – Recognises markdown (`.md`, `.mdx`, `.markdown`) and, after recent updates, YAML templates (`.yaml`, `.yml`) as documentation artifacts; TS/JS variants treated as code.
- **Content loading** – Pulls from in-memory `TextDocument` store when available, falling back to filesystem reads for closed documents.
- **Hint enrichment** – Combines graph-linked hints with path-reference detections (e.g., inline markdown links) before orchestrator execution.
- **Seed management** – Ensures existing artifacts remain part of inference seeds even when unchanged, preserving graph continuity.

## Outputs
Produces `TrackedArtifactChange` records containing:
- `uri`, `category` (document/code), `layer`, `previousArtifact`, `content`, `contentLength`.
- Aggregated relationship hints for inference providers.
- Optional `nextArtifact` attached after inference reconciliation.

## Edge Handling
- Skips changes with unavailable content (logged, but prevents crashes).
- Maintains canonical URIs to avoid duplicate graph entries across differing path formats.
- Supports LLM inference gating via configurable minimum content length (future LLM bridge integration).

## Testing
- `packages/server/src/features/watchers/artifactWatcher.test.ts` exercises classification, hint aggregation, and inference seed preparation.
- Integration suites rely on watcher behaviour indirectly; fixture edits in US3/US5 confirmed YAML templates flow through the document path.

## Follow-ups
- Expand classification heuristics for additional documentation extensions (e.g., `.rst`, `.adoc`).
- Capture metrics on skipped changes to highlight content access issues.
- Tie in workspace providers more tightly (e.g., caching symbol data) once Knowledge Feed enrichment work begins.
