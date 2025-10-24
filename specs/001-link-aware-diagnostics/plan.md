# Implementation Plan: Link-Aware Diagnostics

**Branch**: `001-link-aware-diagnostics` | **Date**: 2025-10-16 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-link-aware-diagnostics/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Deliver a VS Code-based experience that answers, for any saved file, “What else will this change impact?” The extension’s lightweight client pairs with a Node-based language server that builds and maintains a workspace-wide dependency graph persisted in SQLite. The pipeline begins with code-to-code dependency inference—combining heuristic/LLM analysis, Tree-sitter fallbacks, and VS Code symbol/provider data when available—then gradually layers in documentation and external knowledge-graph edges once the core graph is trustworthy. Manual overrides always take precedence over fresh inference and leave an auditable trail, while optional LLM reasoning via `vscode.lm` refines multi-hop ripple predictions. Diagnostics stay disabled until the user selects an LLM provider (or explicitly opts into offline-only heuristics), respecting Responsible Intelligence commitments. Hysteresis, configurable debounce windows, and hop-depth controls keep signals actionable. Development-time validation leans on dual benchmarks (AST-aligned accuracy checks plus multi-run self-similarity) and now incorporates internal dogfooding tooling—like the symbol neighbor explorer—to interrogate graph quality before we expose richer LLM experiences. The upcoming iteration adds an LLM ingestion pipeline that can synthesize relationship candidates from arbitrary text, record provenance, and grade confidence so diagnostic consumers can decide how aggressively to trust AI-suggested edges.

## Technical Context

<!--
  ACTION REQUIRED: Replace the content in this section with the technical details
  for the project. The structure here is presented in advisory capacity to guide
  the iteration process.
-->

**Language/Version**: TypeScript 5.x targeting Node.js 22 for extension + LSP, SQL schema for SQLite 3  
**Primary Dependencies**: VS Code Extension API, `vscode-languageclient`/`vscode-languageserver`, `better-sqlite3`, Tree-sitter parsers where gaps remain, optional LLM access via `vscode.lm`  
**Storage**: Embedded SQLite property-graph tables persisted under workspace storage for diagnostics history  
**Testing**: `@vscode/test-electron` for extension integration, `vitest` for shared modules, contract smoke tests for custom LSP requests  
**Target Platform**: VS Code desktop (Windows/macOS/Linux) with optional headless language server for CI  
**Project Type**: Multi-package workspace (extension client, language server, shared graph utilities)  
**Performance Goals**: Surface 95% of relevant diagnostics within 5 seconds of file save; background graph updates complete within 10 seconds for 1k-node graphs  
**Constraints**: Minimize false positives via confidence scoring, operate offline with local storage, block diagnostics until an LLM provider or explicit opt-out is chosen, respect user-configured model/provider policies, uphold acknowledgement-driven hysteresis, and support configurable debounce windows for change batching  
**Scale/Scope**: Initial pilot teams (<20 contributors) with codebases up to ~1M LOC and documentation sets spanning the four-layer hierarchy

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- Constitution v1.0.0 principles (Documentation-Implementation Unity, Tooling Leverage & Reuse, Responsible Intelligence & Consent, Fast Feedback & Verification, Simplicity & Stewardship) are observed. ✅ No violations detected; onboarding requirement for LLM consent is captured in design and Complexity Tracking remains empty.

## Project Structure

### Documentation (this feature)

```
specs/[###-feature]/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)
<!--
  ACTION REQUIRED: Replace the placeholder tree below with the concrete layout
  for this feature. Delete unused options and expand the chosen structure with
  real paths (e.g., apps/admin, packages/something). The delivered plan must
  not include Option labels.
-->

```
packages/
├── extension/             # VS Code client (activation, UI, settings)
├── server/                # Language server (graph builder, diagnostics engine)
└── shared/                # Reusable graph/domain logic, models, telemetry

data/
└── migrations/            # SQLite schema migrations if required

tests/
├── integration/           # Extension + server end-to-end scenarios
└── unit/                  # Shared utilities, graph calculations
```

**Structure Decision**: Adopt a multi-package workspace to keep client, server, and shared logic isolated yet reusable. Tests live alongside packages with integration coverage ensuring extension↔server coordination.

## Complexity Tracking

## Phases & Key Deliverables

- **Phase 0 – Research**: Finalize heuristic/LLM inference strategy (including GraphRAG-style generation when no language server is present), confirm reliance on VS Code providers vs. Tree-sitter fallbacks as optimizations, document LLM consent/onboarding flow, and evaluate external knowledge graph providers (GitLab Knowledge Graph, LSIF-derived graphs) for cross-artifact monitoring along with the schema contract they must satisfy.
- **Phase 1 – Domain & Contracts**: Ship data model, SQLite schema, language server contracts (including `workspace/selectLLMProvider` handshake), and quickstart instructions emphasising first-run provider selection.
- **Phase 2 – Foundations**: Scaffold extension/server packages, implement configuration surfaces (LLM provider selection gating, storage path, noise suppression), and build graph persistence primitives that run the baseline heuristic/LLM inference, incorporate VS Code workspace index data when available, enforce the external knowledge-graph schema contract alongside override manifests to populate the rebuildable link graph, and record override provenance so manual decisions supersede subsequent inference passes until revoked.
- **Phase 3 – User Story 1 (Developers)**: Detect code edits, build the dependency graph, surface ripple diagnostics with hysteresis, and validate accuracy against benchmark workspaces (with and without AST metadata).
- **Phase 4 – User Story 2 (Writers)**: Extend the unified graph to documentation layers so markdown edits raise diagnostics on linked implementation files and downstream docs using the same infrastructure.
- **Phase 5 – User Story 3 (Leads)**: Build acknowledgement workflows, consolidated views, telemetry that tracks acknowledgement latency without breaking hysteresis or consent rules, and drift history persistence/reporting so leads can audit long-term divergence trends.
- **Phase 6 – User Story 4 (Maintainers)**: Deliver exploratory graph tooling so maintainers can select a symbol/artifact, enumerate nearest neighbors within an adjustable hop depth, group results by relationship layer, and export summaries for future LLM prompts.
- **Phase 7 – Hardening & Ops**: Add delete/rename repair tooling, performance validation (latency + ricochet metrics), inference accuracy benchmarking using a canonical repo, onboarding polish, documentation for governance/compliance, chaos-style exercises that verify knowledge-graph feed failure handling (retry budget, stale snapshot retention, recovery alerts), and an AST-backed accuracy suite for curated benchmark workspaces with a fallback self-similarity track when canonical ASTs are unavailable.
- **Phase 8 – LLM Ingestion**: Design and implement the GraphRAG-inspired ingestion pipeline that chunkifies artifacts, prompts `vscode.lm` providers for relationship candidates, calibrates confidence tiers, records provenance metadata, and integrates results through the existing `KnowledgeGraphBridge`. Ship dry-run tooling, consent-aware throttling, and telemetry needed to audit LLM-sourced edges before promoting them into diagnostics.

*Fill ONLY if Constitution Check has violations that must be justified*

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |

