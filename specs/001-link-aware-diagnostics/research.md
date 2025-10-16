# Research Findings

## Diagnostic Architecture
- **Decision**: Use a Node.js-based language server, coordinated by a thin VS Code extension, to own graph construction and drift diagnostics.
- **Rationale**: LSP keeps analysis off the UI thread, enables reuse in other editors/CI, and aligns with official tooling guidance. Prior research confirmed diagnostics can be published via `connection.sendDiagnostics` and the VS Code client can remain lightweight.
- **Alternatives Considered**: Pure extension (rejected due to UI thread pressure and limited reuse); external service (rejected for added deployment complexity at pilot scale).

## Symbol Ingestion Strategy
- **Decision**: Prefer VS Code’s built-in `execute*Provider` commands and existing language-server diagnostics before falling back to custom parsing.
- **Rationale**: Lets us inherit improvements from maintained language servers and reduces maintenance. Diagnostic events and symbol providers already expose structured data.
- **Alternatives Considered**: Always run Tree-sitter parsing (rejected: duplicated effort, more upkeep); rely solely on LLM extraction (rejected: lower precision, higher cost).

## Workspace Indexing & Change Detection
- **Observation**: VS Code core maintains a file-service index backed by OS-level watchers (fsEvents, inotify, ReadDirectoryChangesW) and delivers incremental events to extensions; language servers receive `didOpen`, `didChange`, `didClose`, and `didSave` notifications for synchronized documents.
- **Implication**: Our LSP can subscribe to the same incremental feed—no bespoke polling needed. For files outside open editors, we can request symbol/reference data via `workspace.findFiles`, `executeWorkspaceSymbolProvider`, or by consuming LSIF/SCIP indexes emitted by existing tooling.
- **Reference**: Language Server Extension Guide documents incremental sync handlers, confirming that servers only receive deltas after the initial open, limiting reparsing overhead.

## Link Establishment Strategy
- **Decision (updated)**: Treat link relationships as an indexable projection rather than user-authored metadata. Default to auto-inferred links derived from existing language/intelligence providers (definitions, references, diagnostics) and optional external knowledge graphs. Allow explicit overrides via lightweight manifests only when inference fails, keeping the projection rebuildable at any time.
- **Rationale**: Mirrors VS Code’s workspace indexing philosophy—indexes are cached artifacts that can be regenerated on demand, avoiding brittle front matter requirements. Aligns with user preference to “ride” official tooling and ensures graph recovery is as easy as deleting the cache.
- **Alternatives Considered**: Mandatory front matter or CLI registration (rejected: high friction, hard to keep in sync); heuristic-only approach without override capability (rejected: lacks control for edge cases or proprietary patterns).

## Baseline Inference & Fallbacks
- **Decision**: Implement a GraphRAG-style fallback that can construct the knowledge graph using heuristics and LLM analysis alone when native language-server signals are missing.
- **Rationale**: Ensures the system works in any workspace, with language-server data treated as an optimization that reduces token usage and improves precision. Aligns with open practices for building knowledge graphs directly from source text.
- **References**: Microsoft GraphRAG research highlights reproducible graph creation via LLM-driven pipelines; we adapt similar staging (chunking, edge extraction, ranking) for local inference.

## Graph Rebuild & Freshness
- **Decision**: Store graph snapshots as ephemeral cache files alongside the SQLite store. On start or cache miss, rebuild by replaying symbol/reference queries, language-server diagnostics, and external knowledge-graph feeds.
- **Rationale**: Mimics VS Code’s rebuildable indexes (tsserver project service, LSIF caches). Ensures deleting the cache forces a clean reindex without data loss. Supports offline scenarios and easy migration between machines.
- **Alternatives Considered**: Treat graph as authoritative user data (rejected: complicates sync, increases risk when schema evolves); full in-memory rebuild on every activation (rejected: slower warm-up for large workspaces).

## Graph Storage Layer
- **Decision**: Persist artifact and relationship data in an embedded SQLite database with node/edge tables and indexes for typical traversals.
- **Rationale**: SQLite is lightweight, cross-platform, and proven for property-graph workloads at our target scale. Works offline and simplifies distribution.
- **Alternatives Considered**: KùzuDB (kept in reserve if queries require richer pattern matching); in-memory store only (rejected: no history/audit, loses data on restart).

## Knowledge-Graph Schema Contract
- **Decision**: Require external feeds to provide artifact identifiers, edge types, directionality, timestamps, and optional confidence scores in a normalized schema that maps directly onto our SQLite tables.
- **Rationale**: Allows deterministic ingestion regardless of provider (GitLab GKG, LSIF/SCIP exports, custom GraphRAG output) and makes validation straightforward before data mutates the graph store.
- **Alternatives Considered**: Accept provider-specific payloads with on-the-fly mapping (rejected: hard to validate, increases maintenance); mandate a proprietary format (rejected: reduces interoperability).

## LLM Augmentation
- **Decision**: Integrate optional reasoning through the `vscode.lm` API, respecting user-selected providers and exposing a “local-only” mode.
- **Rationale**: API abstracts cloud vs. local (Ollama) models, grants access to future improvements, and keeps consent/usage visible to users. Allows deeper change impact analysis without hard dependency.
- **Alternatives Considered**: Require dedicated Ollama instance (rejected: limits adoption); custom HTTP integration bypassing VS Code (rejected: duplicates policy handling, raises compliance risk).

## Testing Approach
- **Decision**: Use `vitest` for shared modules, `@vscode/test-electron` for extension-client integration, and targeted contract tests for custom LSP messages.
- **Rationale**: Matches existing VS Code ecosystem practices, provides fast unit feedback, and ensures protocol stability.
- **Alternatives Considered**: Jest (less aligned with ESM/TypeScript setup); integration-only manual validation (insufficient coverage).
