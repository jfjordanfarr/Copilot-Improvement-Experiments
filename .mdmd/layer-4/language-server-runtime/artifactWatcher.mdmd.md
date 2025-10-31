# Artifact Watcher

## Metadata
- Layer: 4
- Implementation ID: IMP-116
- Code Path: [`packages/server/src/features/watchers/artifactWatcher.ts`](../../../packages/server/src/features/watchers/artifactWatcher.ts)
- Exports: ArtifactWatcher, ArtifactWatcherOptions, TrackedArtifactChange, ArtifactWatcherResult, ArtifactCategory

## Purpose
Classify workspace change events and enrich them with content, canonical URIs, and relationship hints so the inference orchestrator can evaluate ripple impacts deterministically across documents and code.

## Public Symbols

### ArtifactWatcher
Processes queued changes, loads content, builds inference hints, and invokes the link inference orchestrator to reconcile graph artifacts. Applies canonical URI normalisation so downstream consumers observe stable identifiers.

### ArtifactWatcherOptions
Configuration contract wiring document stores, graph stores, inference orchestrators, optional knowledge feeds, workspace providers, LLM bridges, and logger hooks into the watcher.

### TrackedArtifactChange
Represents a fully prepared change (canonical URI, layer, category, content, hints, prior artifact) emitted to inference, allowing ripple analysis to compare previous vs. next artifact state.

### ArtifactWatcherResult
Aggregator returned from `processChanges`, exposing processed entries, skipped items with reasons, and inference outcomes (links, errors, traces) for diagnostics and retry logic.

### ArtifactCategory
Union type (`"document" | "code"`) shared across the diagnostics and inference stacks so document-specific heuristics remain enforceable in TypeScript.

### DocumentTrackedArtifactChange
Refined variant of `TrackedArtifactChange` that guarantees document-layer metadata and simplifies downstream handling in diagnostics.

### CodeTrackedArtifactChange
Refined variant of `TrackedArtifactChange` focused on code-layer metadata while retaining shared fields for inference orchestration.

### SkippedArtifactChange
Records ignored events alongside a reason string (`content-unavailable`, etc.), enabling telemetry and future retry logic when watchers cannot access content.

### DocumentStore
Abstracts the VS Code `TextDocument` cache so the watcher can read live content before falling back to disk.

### ArtifactWatcherLogger
Minimal logging surface (info, warn, error) so hosts can inject structured logging without coupling the watcher to a specific transport.

## Responsibilities
- Classify change events using language/extension heuristics and prior graph metadata to determine artifact layer and category.
- Load content from open editors or disk, producing relationship hints from existing graph edges plus path-reference detection.
- Prepare inference seeds and run `LinkInferenceOrchestrator`, reconciling resulting artifacts back onto processed changes for downstream publication.
- Manage optional collaborators (workspace providers, knowledge feeds, LLM bridge) including dependency injection updates at runtime.

## Collaborators
- [`packages/server/src/features/changeEvents/changeQueue.ts`](../../../packages/server/src/features/changeEvents/changeQueue.ts) supplies debounced change batches.
- [`packages/server/src/features/watchers/pathReferenceDetector.ts`](../../../packages/server/src/features/watchers/pathReferenceDetector.ts) emits path-based `depends_on` hints.
- [`packages/shared/src/db/graphStore.ts`](../../../packages/shared/src/db/graphStore.ts) provides artifact lookups and relationship summaries used during preparation.
- [`@copilot-improvement/shared`](../../../packages/shared/src/inference/linkInference.ts) orchestrator reconciles seeds and hints into updated artifacts and links.

## Linked Components
- [COMP-001 – Diagnostics Pipeline](../../layer-3/diagnostics-pipeline.mdmd.md#imp116-artifactwatcher)
- [COMP-003 – Language Server Runtime](../../layer-3/language-server-architecture.mdmd.md#imp116-artifactwatcher)

## Evidence
- Unit tests: [`packages/server/src/features/watchers/artifactWatcher.test.ts`](../../../packages/server/src/features/watchers/artifactWatcher.test.ts) cover classification, hint aggregation, and inference reconciliation.
- Integration suites (US1–US5) exercise watcher flows via simulated workspace edits, ensuring document and code diagnostics stay aligned.
- Manual smoke tests: editing fixtures inside `tests/integration/simple-workspace` shows watcher logs and confirmed ripple emissions within safe-to-commit runs.

## Operational Notes
- Skips inference when no prepared changes remain, returning structured reasons for observability.
- Canonicalises URIs early to avoid case-sensitive duplicates in the graph, critical on Windows/macOS filesystems.
- Configurable `minContentLengthForLLM` prevents large LLM payloads on tiny files until adoption policies allow.
