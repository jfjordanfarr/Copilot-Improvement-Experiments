# Live Documentation Pipeline

## Metadata
- Layer: 3
- Component IDs: COMP-201, COMP-202

## Components

### COMP-201 Live Doc Generator Service
Supports FR-LD1, FR-LD2, and FR-LD3 by orchestrating analyzers, template preservation, and provenance capture to emit deterministic markdown mirrors under `/.live-documentation/<baseLayer>/`.

### COMP-202 Live Doc Graph Projector
Supports FR-LD5, FR-LD7, and SC-LD4 by ingesting generated markdown links into the workspace knowledge graph, powering diagnostics, CLI exports, and Copilot prompts.

## Responsibilities

### Template Preservation & Authored Guardrails (COMP-201)
- Load Layer-4 Live Documentation files, parse HTML markers, and protect authored headers (`Description`, `Purpose`, `Notes`) from generator overwrites.
- Enforce generated section ordering (`Public Symbols`, `Dependencies`, `Observed Evidence`/archetype sections) and emit deterministic delimiters for diff tooling.
- Validate relative-link requirements and slug dialect configuration before writing outputs.

### Analyzer & Enricher Coordination (COMP-201)
- Invoke language-specific analyzers (TypeScript, Python, Rust, C#, etc.) to resolve exported symbols and first-order dependencies per artifact.
- Normalise docstring payloads across analyzer outputs into a canonical schema (`summary`, `remarks`, `parameters`, `returns`, `exceptions`, `examples`) before writing markdown so Live Docs surface consistent headings regardless of source language.
- Merge coverage bridges and docstring adapters to populate `Observed Evidence`, `Targets`, and drift metadata when available.
- Render docstring fields as deterministic `##### `Symbol` — Field` subsections, emit `_Not documented_` placeholders for empty entries, and persist raw fragments plus provenance for tags we do not yet model so adopters retain lossless payloads.
- Collect provenance (`generator tool`, `version`, `benchmark hash`, `input hash`) and persist it inside Live Doc metadata for audit trails.

### Graph Projection & Indexing (COMP-202)
- Parse generated markdown links to synthesise graph edges tying implementation ↔ tests ↔ assets, respecting archetype semantics.
- Surface backlink queries (`which Live Docs depend on X?`) to diagnostics and CLI consumers while avoiding authored-section mutations.
- Cache projections so downstream diagnostics remain responsive without rereading every markdown file on each request.

### Consumption Surface Integration (COMP-202)
- Provide typed accessors for diagnostics publishers, CLI commands, and Copilot helpers to resolve Live Doc metadata, evidence summaries, and regeneration timestamps.
- Expose diff helpers so `npm run live-docs:generate -- --dry-run` and UI preview panes can highlight pending updates before writes.

## Interfaces

### Inbound Interfaces
- Analyzer outputs exposed by `packages/server/src/features` modules (symbol harvesters, dependency resolvers, coverage adapters).
- Workspace configuration obtained via `packages/shared/src/config/liveDocumentationConfig.ts`.
- CLI/extension commands requesting regeneration (`live-docs:generate`, `Live Docs: Regenerate File`).

### Outbound Interfaces
- Markdown writes to `/.live-documentation/<baseLayer>/` guarded by atomic file swaps and provenance updates.
- Graph projection APIs consumed by diagnostics publishers, CLI inspectors, and Copilot prompt builders (`packages/shared/src/live-docs/*`).
- Telemetry hooks emitting regeneration latency and evidence coverage metrics to benchmark pipelines.

## Linked Implementations

### IMP-301 liveDocsGenerateCli
Scaffolds the generation CLI entry point. See `.live-documentation/source/scripts/live-docs/generate.ts.mdmd.md` for the Stage-0 mirror and `npm run live-docs:generate -- --help` for usage.

### IMP-302 liveDocGenerator
Coordinates analyzers, template parsing, and provenance capture. Implementation detail resides in `.live-documentation/source/packages/server/src/features/live-docs/generator.ts.mdmd.md`.

### IMP-303 liveDocGraphProjector
Projects markdown links into the workspace graph for diagnostics and CLI use. The generated view is `.live-documentation/source/packages/server/src/features/live-docs/graphProjector.ts.mdmd.md`.

### IMP-304 liveDocDiffService
Produces diff previews for dry-run and UI workflows. The diff helper currently ships inside the generator CLI; standalone materialisation will be regenerated once the service is reinstated.

### IMP-305 liveDocMetadataStore
Persists provenance metadata and archetype assignments. Metadata persistence now lives within `.live-documentation/source/packages/shared/src/live-docs/schema.ts.mdmd.md`; a dedicated store will resurface when promotion tooling requires it.

## Evidence
- Planned integration suites (`tests/integration/live-docs/generation.test.ts`, `evidence.test.ts`, `inspect-cli.test.ts`) cover regeneration determinism, evidence emission, and CLI parity.
- Benchmark reports under `reports/benchmarks/live-docs/` record regeneration latency and analyzer precision/recall for generated sections.
- Safe-to-commit pipeline will fail when Live Doc lint, SlopCop link audits, or provenance checks detect regressions.

## Operational Notes
- Live Doc IDs hash normalised relative paths + archetype to stay stable across machines; avoid incorporating timestamps into identifiers.
- Asset archetypes remain optional—prefer validating links from implementation/test Live Docs before emitting standalone asset docs.
- Future work (Phase 7) will derive Layer‑2/Layer‑3 documentation directly from generated markdown once churn/reference enrichers stabilise.
