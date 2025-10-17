# Feature Specification: Link-Aware Diagnostics

**Feature Branch**: `001-link-aware-diagnostics`  
**Created**: 2025-10-16  
**Status**: Draft  
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

### User Story 1 - Writers get drift alerts (Priority: P1)

Technical writers update a requirements or architecture markdown document and immediately see a lint-like alert pointing to the linked implementation artifact that now needs review.

**Why this priority**: Preventing documentation drift at the planning layers is the core promise of the feature and delivers value even without deeper automation.

**Independent Test**: Can be fully tested by editing a mapped markdown file and verifying that diagnostics appear in the linked implementation file and documentation layer.

**Acceptance Scenarios**:

1. **Given** a requirements document linked to an implementation file, **When** the writer saves changes to the document, **Then** the linked implementation file surfaces a diagnostic referencing the updated doc.
2. **Given** a four-layer documentation chain, **When** a writer updates a higher-layer document, **Then** each downstream layer receives a diagnostic until acknowledged.

---

### User Story 2 - Developers see linked impacts (Priority: P2)

Developers modifying an implementation file are warned about related documentation and dependent code modules so they can coordinate updates before merging.

**Why this priority**: Reduces rework and production issues by ensuring code changes stay aligned with both documentation and dependent components.

**Independent Test**: Can be fully tested by editing a mapped code file and confirming diagnostics appear in associated markdown layers and dependent code files.

**Acceptance Scenarios**:

1. **Given** a code file with registered documentation links, **When** the developer changes and saves the file, **Then** the linked documentation files display diagnostics describing the potential divergence.
2. **Given** a module imported by other modules, **When** the module changes, **Then** the dependent modules receive diagnostics instructing the developer to confirm compatibility.

---

### User Story 3 - Leads resolve alerts efficiently (Priority: P3)

Engineering or documentation leads review outstanding drift diagnostics, assign follow-up, and mark items resolved once verification is complete.

**Why this priority**: Ensures the system can be operationalized within team workflows, turning alerts into trackable actions and preventing alert fatigue.

**Independent Test**: Can be fully tested by clearing diagnostics through the provided acknowledgement flow and confirming they remain cleared until new changes occur.

**Acceptance Scenarios**:

1. **Given** outstanding drift diagnostics, **When** the lead acknowledges a diagnostic, **Then** it disappears from all linked artifacts and remains cleared until a new change is detected.
2. **Given** multiple diagnostics, **When** the lead exports or views a consolidated list, **Then** they can prioritize remediation without opening each file manually.

---

### Edge Cases

- A newly created document or code file has no inferred relationships when first saved.
- A file within the link network is renamed or moved outside the workspace.
- Two artifacts reference each other and change in quick succession (potential alert loops).
- Bulk refactors modify dozens of files within seconds.
- Documentation layers are incomplete (e.g., missing Layer 3) but edits still occur.
- If artifact A triggers a diagnostic on B, reciprocal diagnostics from B to A are suppressed until the first alert is acknowledged or a fresh change occurs after acknowledgement.
- Deleted artifacts or renamed paths automatically prune or prompt re-binding of their link relationships to avoid dangling references.
- External knowledge-graph feeds may become unreachable or provide stale/partial payloads; the system MUST surface a warning diagnostic, pause ingestion for the impacted feed, and fall back to local inference without mutating cached relationships until a valid payload is received.
- Streaming feeds MUST resume gracefully after transient failures by replaying missed deltas, while on-demand snapshot imports MUST preserve the previously ingested snapshot until replacement data passes validation.
- Benchmark workspaces without canonical ASTs MUST fall back to self-similarity accuracy checks and record that limitation alongside the results so pipelines remain informative without blocking on missing ground truth.

### Inference Inputs by Artifact Type

| Artifact Type | Baseline Signals | Enhanced Signals | External Feeds |
|---------------|------------------|------------------|----------------|
| Markdown documentation (vision, requirements, architecture) | Heuristic/LLM semantic analysis of section headers, headings, and inline link targets | Workspace symbol cross-references (e.g., `executeDocumentSymbolProvider`, `executeReferenceProvider`) that point from prose anchors to code symbols | Knowledge graph edges that map documentation nodes to implementation assets |
| Implementation markdown (implementation guides, runbooks) | Heuristic/LLM extraction of code blocks, configuration snippets, and referenced module names | Diagnostics emitted by existing language servers when linked code changes | Knowledge graph projections describing implementation-to-code relationships |
| Code artifacts | Heuristic/LLM parsing of import statements, comments, and file naming conventions (Tree-sitter fallbacks) | Language-server definition/reference graphs, symbol hierarchies, and document highlights | External dependency graphs (LSIF/SCIP exports, GitLab Knowledge Graph edges) |

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

- **FR-001**: System MUST infer and maintain links between markdown layers (Vision, Requirements, Architecture, Implementation) and their corresponding code artifacts using a layered pipeline that defaults to heuristic/LLM-driven analysis and augments with workspace index data (symbol providers, reference graphs, diagnostics) when available, while providing optional overrides through lightweight manifests or commands when inference requires correction. Manual overrides MUST take precedence over fresh inference results until explicitly revoked and MUST leave an auditable trail so operators can understand why a relationship persists.
- **FR-002**: System MUST detect when any linked markdown or code artifact is saved within the workspace and record the change event.
- **FR-003**: System MUST raise diagnostics in every artifact linked to a changed file, clearly naming the source file and required follow-up action.
- **FR-004**: System MUST let users acknowledge or dismiss a diagnostic once review is complete, persisting that state until a subsequent change occurs.
- **FR-005**: System MUST provide a consolidated view of outstanding diagnostics grouped by documentation layer and code module.
- **FR-006**: System MUST highlight dependent code files (based on imports or explicit references) when their upstream file changes, prompting compatibility checks.
- **FR-007**: System MUST offer quick actions from a diagnostic to open the linked artifact or documentation layer in a separate editor tab.
- **FR-008**: System MUST support configurable noise controls (e.g., ignore changes below a threshold, batch related changes) to prevent alert fatigue.
- **FR-009**: System MUST log historical drift events for reporting on how often documentation or dependent modules fall out of sync.
- **FR-010**: System MUST expose workspace and user settings for drift analysis, including noise suppression level, preferred LLM provider mode, and diagnostics storage location, and MUST block diagnostics until the user selects an LLM provider.
- **FR-011**: System MUST implement hysteresis so reciprocal diagnostics between linked artifacts remain paused until the originating alert is acknowledged or superseded by new changes.
- **FR-012**: System MUST support configurable debounce/batching for rapid change events to avoid redundant diagnostics during batched edits.
- **FR-013**: System MUST offer workflows to repair or remove links when underlying artifacts are deleted or renamed.
- **FR-014**: System MUST support knowledge-graph-backed monitoring between arbitrary artifacts (beyond markdown↔code pairs) using external graph feeds and LLM-assisted ripple analysis to surface multi-hop change impacts, handling both on-demand KnowledgeSnapshot imports and long-lived streaming feeds with consistent validation and storage semantics.
- **FR-015**: System MUST define and enforce a minimal schema for ingesting external knowledge-graph data, including artifact identifiers, edge types, timestamps, and confidence metadata, and MUST validate incoming feeds against this contract before integrating them.
- **FR-016**: Development-time verification MUST compare the inferred link graph against canonical abstract syntax trees for curated benchmark workspaces when ground-truth ASTs are available, and MUST fall back to multi-run self-similarity benchmarks for workspaces lacking authoritative ASTs so accuracy remains measurable in both contexts.

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


