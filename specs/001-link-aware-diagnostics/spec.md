# Feature Specification: Link-Aware Diagnostics

**Feature Branch**: `001-link-aware-diagnostics`  
**Created**: 2025-10-16  
**Status**: In Progress  
**Input**: User description: "Create a system (extension or language server) that raises IntelliSense problems when linked markdown layers and implementation files drift, extending to code files via dependency awareness so Copilot agents notice related context."

## User Scenarios & Testing *(mandatory)*

<!--
  IMPORTANT: User stories should be PRIORITIZED as user journeys ordered by importance.
  Each user story/journey must be INDEPENDENTLY TESTABLE - meaning if you implement just ONE of them,
  you should still have a viable MVP (Minimum Viable Product) that delivers value.
  
  Assign priorities (P1, P2, P3, etc.) to each story, where P1 is the most critical.
  Think of each story as a standalone slice of functionality that can be:
  - Developed independently
  - Tested independently
  - Deployed independently
  - Demonstrated to users independently
-->

### User Story 1 - Developers see the full impact of a code change (Priority: P1)

**Status**: Delivered (2025-10-26) — validated by `tests/integration/us1/codeImpact.test.ts`

Developers commit a change to any source file and immediately see the complete set of files that may be impacted, including direct dependents and inferred transitive ripples.

**Why this priority**: Delivering the definitive change-impact answer for code edits is the core promise of the extension and lays the groundwork for richer artifact coverage.

**Independent Test**: Can be fully tested by editing a code file inside a benchmark workspace, rebuilding the dependency graph, and verifying diagnostics appear on every affected code artifact without involving documentation layers.

**Acceptance Scenarios**:

1. **Given** a module with direct imports depending on it, **When** the developer saves the module, **Then** diagnostics appear on each dependent module explaining the required review.
2. **Given** a workspace with deeper transitive dependencies, **When** an upstream module changes, **Then** the ripple analysis surfaces all downstream dependents within the configured hop limit.
3. **Given** a workspace where AST metadata is available, **When** the graph is rebuilt, **Then** the inferred edges match the canonical AST relationships within the configured tolerance.

---

### User Story 4 - Maintainers explore symbol neighborhoods (Priority: P4)

**Status**: Delivered (2025-10-26) — validated by `tests/integration/us4/inspectSymbolNeighbors.test.ts`

Maintainers and Copilot agents dogfood the graph by selecting any symbol and querying its nearest neighbors across layers to understand dependency context before making changes.

**Why this priority**: Exposing the graph for exploratory queries lets us validate data quality, accelerates internal debugging, and lays the groundwork for AI-assisted explanation workflows.

**Independent Test**: Can be validated by invoking a dedicated command or CLI that resolves a symbol identifier, returns hop-limited neighbors grouped by relationship kind, and surfaces human-readable context without emitting diagnostics.

**Acceptance Scenarios**:

1. **Given** a command palette action to “Inspect symbol neighbors,” **When** a maintainer selects a symbol, **Then** the tool returns first-degree neighbors with relationship labels and canonical file locations.
2. **Given** a hop limit of 2, **When** the maintainer expands the result, **Then** the tool includes second-degree connections while clearly identifying the traversal path.
3. **Given** multiple documentation layers referencing the symbol, **When** the query runs, **Then** the response groups documentation versus implementation neighbors so follow-up is triaged quickly.

---

### User Story 2 - Writers get drift alerts (Priority: P2)

**Status**: Delivered (2025-10-26) — validated by `tests/integration/us2/markdownDrift.test.ts`

Technical writers update requirements or architecture markdown and need a guaranteed signal identifying the code paths and lower-layer docs that require follow-up.

**Why this priority**: Once the code-centric dependency map is trustworthy, extending it to documentation keeps planning artifacts aligned without diluting early focus.

**Independent Test**: Can be fully tested by editing a mapped markdown file inside a prepared workspace and verifying that diagnostics appear on the linked implementation files using the same graph infrastructure that powers code-to-code impact.

**Acceptance Scenarios**:

1. **Given** a requirements document linked to an implementation file through the graph, **When** the writer saves changes, **Then** the implementation file surfaces a diagnostic referencing the updated document.
2. **Given** a documentation stack spanning multiple layers, **When** a higher-layer doc changes, **Then** diagnostics appear on each downstream layer until acknowledged.

---

### User Story 3 - Leads resolve alerts efficiently (Priority: P3)

**Status**: Delivered (2025-10-26) — validated by `tests/integration/us3/acknowledgeDiagnostics.test.ts`

Engineering or documentation leads review outstanding drift diagnostics, assign follow-up, and mark items resolved once verification is complete.

**Why this priority**: Ensures the system can be operationalized within team workflows, turning alerts into trackable actions and preventing alert fatigue.

**Independent Test**: Can be fully tested by clearing diagnostics through the provided acknowledgement flow and confirming they remain cleared until new changes occur.

**Acceptance Scenarios**:

1. **Given** outstanding drift diagnostics, **When** the lead acknowledges a diagnostic, **Then** it disappears from all linked artifacts and remains cleared until a new change is detected.
2. **Given** multiple diagnostics, **When** the lead exports or views a consolidated list, **Then** they can prioritize remediation without opening each file manually.

---

### Edge Cases

- A newly created file has no inferred relationships on first save; the graph must reconcile once sufficient signals exist.
- A file within the graph is renamed or moved outside the workspace.
- Two artifacts reference each other and change in quick succession (potential alert loops).
- Bulk refactors modify dozens of files within seconds.
- Documentation layers are incomplete (e.g., missing Layer 3) but edits still occur.
- Broken-link documentation diagnostics invert the `triggerUri` (missing target) and `targetUri` (referencing document) so quick fixes open the file that needs attention.
- If artifact A triggers a diagnostic on B, reciprocal diagnostics from B to A are suppressed until the first alert is acknowledged or a fresh change occurs after acknowledgement.
- Deleted artifacts or renamed paths automatically prune or prompt re-binding of their relationships to avoid dangling edges.
- External knowledge-graph feeds may become unreachable or provide stale/partial payloads; the system MUST surface a warning diagnostic, pause ingestion for the impacted feed, and fall back to local inference without mutating cached relationships until a valid payload is received.
- Streaming feeds MUST resume gracefully after transient failures by replaying missed deltas, while on-demand snapshot imports MUST preserve the previously ingested snapshot until replacement data passes validation.
- Benchmark workspaces without canonical ASTs MUST fall back to self-similarity accuracy checks and record that limitation alongside the results so pipelines remain informative without blocking on missing ground truth.
- LLM-sourced relationships MUST record model provenance, prompt hash, and chunk identifiers so auditors can reproduce their derivation and revoke edges produced by a misbehaving prompt or provider.

### Inference Inputs by Artifact Type

| Artifact Type | Baseline Signals | Enhanced Signals | External Feeds |
|---------------|------------------|------------------|----------------|
| Code artifacts | Heuristic/LLM parsing of imports/exports, call graphs, and file naming conventions (Tree-sitter fallbacks) | Language-server definition/reference graphs, symbol hierarchies, document highlights, and local AST metadata | External dependency graphs (LSIF/SCIP exports, GitLab Knowledge Graph edges) |
| Markdown documentation (vision, requirements, architecture) | Heuristic/LLM semantic analysis of section headers, headings, inline references | Workspace symbol cross-references (e.g., `executeDocumentSymbolProvider`, `executeReferenceProvider`) that map prose anchors to code symbols | Knowledge graph edges that map documentation nodes to implementation assets |
| Implementation markdown (implementation guides, runbooks) | Heuristic/LLM extraction of code blocks, configuration snippets, referenced module names | Diagnostics emitted by existing language servers when linked code changes | Knowledge graph projections describing implementation-to-code relationships |

“Workspace index data” refers specifically to VS Code’s `execute*Provider` command family (symbols, references, definitions, implementations), `workspace.findFiles`, and live diagnostics streamed from active language servers. These APIs are treated as accelerators layered on top of the heuristic/LLM baseline so that inference remains functional when an index is missing.

### Graph Rebuild Lifecycle

1. **Initial startup**: On extension activation, the server checks for an existing graph cache; if absent, it rebuilds from scratch using the inference inputs above, then persists the snapshot to SQLite.
2. **Cache deletion**: When users delete the cache directory or invoke a “Rebuild Diagnostics Graph” command, the server discards residual data, replays the inference pipeline, and rehydrates the database before diagnostics resume.
3. **Staleness detection**: Background jobs monitor timestamp drift between artifacts and cached relationships; when mismatches exceed configured thresholds, the server schedules incremental refreshes that reconcile edges without blocking diagnostics.
4. **External feed refresh**: Streaming feeds checkpoint their last successful event so they can resume after outages; snapshot imports run through schema validation before replacing existing data, and failures trigger alerts while preserving the prior snapshot.

### Cache Retention & Privacy

Graph projections, override manifests, and drift history live under the workspace storage directory declared in configuration (default: VS Code global storage). Users can redirect the location via `linkAwareDiagnostics.storagePath`. Retention policies follow a rolling window (default 90 days) to keep storage lightweight, and administrators can purge caches without data loss because the graph remains rebuildable. Sensitive metadata inherits VS Code workspace trust rules, and diagnostics stay suppressed until consented provider settings are applied.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST infer and maintain a workspace-wide dependency graph between code artifacts using a layered pipeline that defaults to heuristic/LLM-driven analysis and augments with workspace index data (symbol providers, reference graphs, diagnostics, AST metadata) when available. Manual overrides MUST take precedence over fresh inference until revoked and MUST leave an auditable trail.
- **FR-002**: System MUST detect when any tracked artifact is saved within the workspace and record the change event with enough provenance to query ripples.
- **FR-003**: System MUST answer the question “What files will be impacted by this change?” by raising diagnostics on every artifact reachable through the dependency graph within the configured scope, clearly naming the triggering file and required follow-up action.
- **FR-004**: System MUST let users acknowledge or dismiss a diagnostic once review is complete, persisting that state until a subsequent change occurs.
- **FR-005**: System MUST provide a consolidated view of outstanding diagnostics grouped by dependency cluster and documentation layer when applicable.
- **FR-006**: System MUST highlight dependent code files (based on imports, call graphs, exports, or explicit references) when their upstream file changes, prompting compatibility checks.
- **FR-007**: System MUST offer quick actions from a diagnostic to open any linked artifact in a separate editor tab.
- **FR-008**: System MUST support configurable noise controls (e.g., ignore changes below a threshold, limit hop depth, batch related changes) to prevent alert fatigue.
- **FR-009**: System MUST log historical change-impact events for reporting on how often ripple reviews are required.
- **FR-010**: System MUST expose workspace and user settings for analysis, including noise suppression level, preferred LLM provider mode, diagnostics storage location, and hop depth, and MUST block diagnostics until the user selects an LLM provider or opts into an offline-only mode.
- **FR-011**: System MUST implement hysteresis so reciprocal diagnostics between linked artifacts remain paused until the originating alert is acknowledged or superseded by new changes.
- **FR-012**: System MUST support configurable debounce/batching for rapid change events to avoid redundant diagnostics during batched edits.
- **FR-013**: System MUST offer workflows to repair or remove links when underlying artifacts are deleted or renamed.
- **FR-014**: System MUST extend the dependency graph to documentation artifacts once code-to-code accuracy milestones are met, using the same inference pipeline and override mechanics.
- **FR-015**: System MUST support knowledge-graph-backed monitoring between arbitrary artifacts (beyond code↔code pairs) using external feeds and LLM-assisted ripple analysis, handling both on-demand KnowledgeSnapshot imports and long-lived streaming feeds with consistent validation and storage semantics.
- **FR-016**: System MUST define and enforce a minimal schema for ingesting external knowledge-graph data, including artifact identifiers, edge types, timestamps, and confidence metadata, and MUST validate incoming feeds against this contract before integrating them.
- **FR-017**: Development-time verification MUST compare the inferred code dependency graph against canonical abstract syntax trees for curated benchmark workspaces when ground-truth ASTs are available, and MUST fall back to multi-run self-similarity benchmarks for workspaces lacking authoritative ASTs so accuracy remains measurable in both contexts.
- **FR-018**: System MUST expose a developer-facing symbol neighborhood query (initially dogfooding-only) that, given a symbol or artifact identifier, returns hop-limited neighbors with relationship metadata and is pluggable into future LLM-assisted explanation tools.
- **FR-019**: System MUST provide an LLM-driven ingestion pipeline that extracts relationship candidates from arbitrary workspace text via `vscode.lm`, annotates each candidate with a confidence tier (`High`, `Medium`, `Low`), persists provenance (model id, prompt hash, supporting chunk ids), and honours manual overrides by demoting conflicting edges. Diagnostics MAY only consume `High` edges automatically, while `Medium` and `Low` edges require corroboration or human promotion before surfacing.

### Key Entities *(include if feature involves data)*

- **Knowledge Artifact**: Any markdown or code file participating in the link network; attributes include layer classification, owner, and last synchronized timestamp.
- **Link Relationship**: Association between two or more knowledge artifacts (e.g., Requirement → Implementation file) including link type and direction.
- **Change Event**: Recorded instance of a saved artifact change capturing triggering artifact, timestamp, summary, and affected relationships.
- **Diagnostic Record**: User-facing alert referencing one or more artifacts, storing message text, severity, acknowledgement status, and audit history.
- **Knowledge Snapshot**: Benchmark fixture representing a canonical workspace used to evaluate inference stability; captures expected nodes/edges for reproducibility tests.

## Assumptions

- Link relationships can be regenerated entirely from workspace indexes, diagnostic feeds, and external knowledge graphs; any persisted cache is treated as disposable projection data.
- Heuristic/LLM inference is the baseline when rich language-server signals are unavailable; upstream provider data is a performance optimization, not a prerequisite.
- Dependency analysis for code files can reuse existing project build metadata or simple static analysis without requiring full compilation.
- Users operate within VS Code workspaces where both documentation and implementation artifacts are accessible.
- Users accept a short debounce window (default 1s) before diagnostics fire during rapid edit sessions to balance responsiveness with signal quality.
- External knowledge graphs (e.g., GitLab Knowledge Graph) expose read APIs secured by workspace-managed tokens, refresh at least every 15 minutes, and can be mirrored locally so ingestion remains resilient when remote services degrade.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 95% of linked artifacts display relevant diagnostics within 5 seconds of saving a triggering file during user acceptance tests.
- **SC-002**: Pilot teams report a 50% reduction in undocumented code changes (measured via weekly audit of merged pull requests) within two sprints of adoption.
- **SC-003**: 90% of documentation updates are acknowledged and cleared through the system within two business days.
- **SC-004**: 80% of surveyed users report that the diagnostics help them locate related context faster than manual search during retrospective interviews.
- **SC-005**: In automated latency validation, diagnostics remain suppressed during acknowledgement windows with zero ricochet regressions recorded.
- **SC-006**: On a canonical benchmark workspace, repeated graph rebuilds produce ≥95% identical link edges and flag deviations, ensuring inference reproducibility.
- **SC-007**: On curated AST-backed benchmark workspaces, ≥90% of inferred edges match canonical AST relationships, and variance between runs stays within ±5% when ground-truth ASTs are unavailable, ensuring both validation modes surface actionable accuracy signals.


## Clarifications

### Session 2025-10-16

- Q: What default behavior should apply when selecting an LLM provider for drift analysis? → A: Force selection on first run and keep diagnostics disabled until the user chooses a provider.
- Q: How are links between markdown and code artifacts declared? → A: Default to automatic inference from language-server data and knowledge-graph feeds, with an override command available to pin or adjust relationships when necessary.


## Implementation Traceability
- [`packages/server/src/main.ts`](../../packages/server/src/main.ts) and [`packages/server/src/runtime/changeProcessor.ts`](../../packages/server/src/runtime/changeProcessor.ts) execute the end-to-end flow outlined in the functional requirements.
- [`packages/server/src/features/diagnostics/publishCodeDiagnostics.ts`](../../packages/server/src/features/diagnostics/publishCodeDiagnostics.ts), [`publishDocDiagnostics.ts`](../../packages/server/src/features/diagnostics/publishDocDiagnostics.ts), and [`acknowledgementService.ts`](../../packages/server/src/features/diagnostics/acknowledgementService.ts) implement the diagnostic lifecycle and acknowledgement criteria.
- [`packages/server/src/features/knowledge/knowledgeFeedManager.ts`](../../packages/server/src/features/knowledge/knowledgeFeedManager.ts), [`knowledgeGraphIngestor.ts`](../../packages/server/src/features/knowledge/knowledgeGraphIngestor.ts), and [`workspaceIndexProvider.ts`](../../packages/server/src/features/knowledge/workspaceIndexProvider.ts) realise the knowledge-feed and fallback inference requirements.
- [`packages/extension/src/diagnostics/docDiagnosticProvider.ts`](../../packages/extension/src/diagnostics/docDiagnosticProvider.ts), [`packages/extension/src/views/diagnosticsTree.ts`](../../packages/extension/src/views/diagnosticsTree.ts), and [`packages/extension/src/commands/exportDiagnostics.ts`](../../packages/extension/src/commands/exportDiagnostics.ts) deliver the UX commitments enumerated in the user scenarios.
- [`tests/integration/us1/codeImpact.test.ts`](../../tests/integration/us1/codeImpact.test.ts), [`tests/integration/us3/markdownLinkDrift.test.ts`](../../tests/integration/us3/markdownLinkDrift.test.ts), and [`tests/integration/us5/transformRipple.test.ts`](../../tests/integration/us5/transformRipple.test.ts) enforce the falsifiability metrics and success criteria.


