# Link-Aware Diagnostics Roadmap

## Metadata
- Layer: 2
- Requirement IDs: REQ-001, REQ-020, REQ-030, REQ-040

## Requirements

### REQ-001 Ripple Observability Foundations
Supports CAP-001 and CAP-002 by ensuring cross-file impact detection is fast, reproducible, and instrumentation-ready.

#### Stream T04x – Diagnostics Fundamentals *(complete)*
- Lock down cross-file diagnostics for code and documentation via falsifiability suites US1 to US5 ([spec](/specs/001-link-aware-diagnostics/spec.md), [tests/integration](/tests/integration)).
- Harden hysteresis, batching, and acknowledgement flows before expanding to UX polish.

#### Stream T05x – Knowledge Graph Enrichment *(in progress)*
- Ingest external feeds (LSIF, SCIP, GitLab knowledge graph) with schema validation and resumable checkpoints ([functional requirements](../../specs/001-link-aware-diagnostics/spec.md#functional-requirements)).
- Surface provenance inside diagnostics so users know whether edges are inferred or imported.

#### Stream T06x – Operational UX *(in progress)*
- Provide lead-friendly dashboards, export CLI, and acknowledgement audit trails.
- Integrate ripple metadata into Copilot prompts and Problems hover tooltips.

### REQ-020 Documentation Bridges and LLM Surfaces
Supports CAP-003 and CAP-004 by pairing documentation integrity with narrative outputs that copilots can reuse.

#### Stream T07x – Documentation Bridges and Asset Integrity *(in motion)*
- Ship SlopCop linting passes (markdown in production, asset paths with root-directory support and hashed-ignore ergonomics) so documentation remains a trustworthy proxy for ripple analysis.
- Introduce workspace-local docstring bridges that keep Layer 4 MDMD sections in sync with public symbol docstrings while remaining configurable for other doc ecosystems (TSDoc, Sphinx, Rustdoc).
- Deliver symbol-level lint stage zero (markdown anchor integrity with GitHub slug parity) while designing higher stages for knowledge-graph-backed code symbols.
- Promote lint findings into safe-to-commit and CI pipelines, keeping hallucinated links from landing while publishing fixture-backed examples future iterations can dogfood.

#### Stream T09x – LLM-Oriented Surfaces *(planned)*
- Standardise ASCII ripple diagrams, markdown tables, and structured JSON payloads so extension commands and diagnostics feed humans and copilots equally.
- Add configuration knobs for diagram width, depth, and focus targets so workspaces can tailor outputs for prompts versus dashboards.
- Bundle presets that align with common repo archetypes while keeping computation local to the workspace.

### REQ-030 Adoption Profiles and Auto-Repair
Supports CAP-004 and CAP-005 by giving teams a staged adoption path plus tooling to keep profiles healthy over time.

#### Stream T08x – Auto-Repair Tooling *(planned)*
- Offer guided workflows to rebind or prune stale links after rename or delete events.
- Explore safe auto-fix suggestions when diagnostics identify simple drifts (for example, markdown link updates).

#### Stream T12x – Compiler-Oracled Benchmarks *(planned)*
- Generate TypeScript benchmark expectations via a deterministic compiler oracle while retaining hand-authored cross-language edges for polyglot scenarios.
- Ship a fixture regeneration CLI that writes oracle-derived edges to temp artefacts, compares them against curated baselines, and emits review-ready diffs instead of mutating manual expectations.
- Capture oracle coverage and drift metrics in benchmark reports so compiler upgrades or analyzer regressions fail loudly and surface rationale inside `reports/benchmarks/*`.
- Document override semantics so authored expectations (for example, cross-runtime ripple edges) persist unchanged during automated regeneration.

#### Adoption Programme *(Observe → Sustain)*
- Stage 0 Observe: extension defaults to read-only insight—graph diagnostics, ASCII or markdown narratives, and audit CLIs scoped by path.
- Stage 1 Guard: workspaces declare profiles binding code and doc globs to lint or audit suites; findings stay informational until the enforce flag flips.
- Stage 2 Bridge: profiles opt into docstring, schema, or telemetry bridges with explicit preview or apply commands so drift fixes remain intentional.
- Stage 3 Sustain: profiles graduate to contractual status, wiring safe-to-commit and CI gates plus ripple narratives that document health for copilots and humans alike.

### REQ-040 Symbol Correctness Profiles (in design)
Supports CAP-003 and CAP-004 by making documentation ↔ code traceability a configurable contract rather than a hard-coded convention.

#### Stream T10x – Declarative Rule Chains *(in progress)*
- Define a JSON profile language that composes glob-matched artifacts, rule chains, identifier formats, and evidence expectations (CAP → REQ → COMP → IMP → code).
- Extend the relationship rule engine so rule execution and propagation produce the coverage signals profiles require.
- Deliver schema, editor snippets, and instructions files so new workspaces can bootstrap profiles without bespoke LLM prompts.

#### Stream T11x – Profile Enforcement & Reporting *(planned)*
- Integrate profile evaluation with `graph:snapshot`, `graph:audit`, and the extension diagnostics provider, emitting actionable findings plus markdown/ASCII summaries.
- Provide JSON coverage reports suitable for CI gates and external dashboards.
- Offer starter presets (MDMD layers, conventional README ↔ code contracts) so teams can adapt the system to non-MDMD documentation stacks.

## Acceptance Criteria

### REQ-001 Acceptance Criteria
- US1 to US5 integration suites remain green, covering developer, writer, acknowledgement, scope collision, and transform ripple flows.
- `npm run safe:commit` must complete hysteresis checks without unacknowledged regressions.
- Knowledge graph snapshots rebuild deterministically across local and CI environments.

### REQ-020 Acceptance Criteria
- SlopCop markdown, asset, and symbol audits run inside safe-to-commit and block hallucinated links.
- Docstring bridge adapters emit drift diagnostics and ASCII or markdown narratives consumable by copilots.
- LLM surfaces mirror workspace diagnostics without introducing external service dependencies.

### REQ-030 Acceptance Criteria
- Profiles record Observe → Sustain progress per path scope, with violations emitted as diagnostics when enforcement is active.
- Auto-repair tooling produces actionable plans or safe auto-fixes for link drift.
- Telemetry confirms ripple adoption metrics for stakeholder reporting.

### REQ-040 Acceptance Criteria
- `link-relationship-rules.json` captures profile definitions (chains, identifier contracts, evidence expectations) validated by schema tooling.
- `npm run graph:snapshot` produces rule execution traces including transitive relationships declared by profiles.
- `npm run graph:audit -- --profiles` reports zero outstanding profile violations once documentation and code coverage are aligned.
- VS Code diagnostics surface profile violations with quick navigation to the offending artifacts and rule chains.

## Linked Components

### COMP-001 Diagnostics Pipeline
Supports REQ-001. [Diagnostics Pipeline Architecture](../layer-3/diagnostics-pipeline.mdmd.md)

### COMP-002 Extension Surfaces
Supports REQ-001 and REQ-020. [Extension Surfaces Architecture](../layer-3/extension-surfaces.mdmd.md)

### COMP-003 Language Server Runtime
Supports REQ-001. [Language Server Architecture](../layer-3/language-server-architecture.mdmd.md)

### COMP-004 SlopCop Tooling
Supports REQ-020 and REQ-030. [SlopCop Architecture](../layer-3/slopcop.mdmd.md)

### COMP-005 Knowledge Graph Ingestion
Supports REQ-020. [Knowledge Graph Ingestion Architecture](../layer-3/knowledge-graph-ingestion.mdmd.md)

### COMP-006 LLM Ingestion Pipeline
Supports REQ-020. [LLM Ingestion Pipeline](../layer-3/llm-ingestion-pipeline.mdmd.md)

### COMP-007 Diagnostics Benchmarking
Supports REQ-030. [Benchmark Telemetry Pipeline](../layer-3/benchmark-telemetry-pipeline.mdmd.md)

### COMP-008 Integration Test Architecture
Supports REQ-030. [Integration Testing Architecture](../layer-3/testing-integration-architecture.mdmd.md)

### COMP-010 Relationship Rule Engine
Supports REQ-040. [Relationship Rule Engine Architecture](../layer-3/relationship-rule-engine.mdmd.md#comp010-relationship-rule-engine)

### COMP-011 Relationship Coverage Auditor
Supports REQ-040. [Relationship Rule Engine Architecture](../layer-3/relationship-rule-engine.mdmd.md#comp011-relationship-coverage-auditor)

### COMP-012 Symbol Correctness Profile Evaluator
Supports REQ-040. [Relationship Rule Engine Architecture](../layer-3/relationship-rule-engine.mdmd.md#comp012-symbol-correctness-profile-evaluator)

## Linked Implementations

### IMP-101 docDiagnosticProvider
Supports REQ-001. [Extension Diagnostic Provider](../layer-4/extension-diagnostics/docDiagnosticProvider.mdmd.md)

### IMP-102 publishDocDiagnostics
Supports REQ-001. [Server Diagnostics Publisher](../layer-4/server-diagnostics/publishDocDiagnostics.mdmd.md)

### IMP-103 changeProcessor
Supports REQ-001 and REQ-030. [Change Processor Runtime](../layer-4/language-server-runtime/changeProcessor.mdmd.md)

### IMP-201 slopcopMarkdownLinks CLI
Supports REQ-020. [SlopCop Markdown Audit](../layer-4/tooling/slopcopMarkdownLinks.mdmd.md)

### IMP-202 slopcopAssetPaths CLI
Supports REQ-020. [SlopCop Asset Audit](../layer-4/tooling/slopcopAssetPaths.mdmd.md)

### IMP-203 documentationBridge Schema
Supports REQ-020. [Workspace Graph Snapshot](../layer-4/tooling/workspaceGraphSnapshot.mdmd.md)

### IMP-301 safe-to-commit Orchestrator
Supports REQ-030. [Safe to Commit Pipeline](../layer-4/tooling/safeToCommit.mdmd.md)

### IMP-302 graphCoverageAudit CLI
Supports REQ-030. [Graph Coverage Audit](../layer-4/tooling/graphCoverageAudit.mdmd.md)

### IMP-303 inspectSymbolNeighbors CLI
Supports REQ-030. [Inspect Symbol Neighbors CLI](../layer-4/tooling/inspectSymbolNeighborsCli.mdmd.md)

### IMP-401 Relationship Rule Engine
Supports REQ-040. [Relationship Rule Engine](../layer-4/tooling/relationshipRuleEngine.mdmd.md)

### IMP-402 Relationship Rule Audit
Supports REQ-040. [Relationship Rule Audit](../layer-4/tooling/relationshipRuleAudit.mdmd.md)

### IMP-403 Relationship Rule Resolvers
Supports REQ-040. [Relationship Rule Resolvers](../layer-4/tooling/relationshipRuleResolvers.mdmd.md)

### IMP-404 Relationship Rule Types
Supports REQ-040. [Relationship Rule Types](../layer-4/tooling/relationshipRuleTypes.mdmd.md)

### IMP-480 Symbol Correctness Profiles
Supports REQ-040. [Symbol Correctness Profiles](../layer-4/tooling/symbolCorrectnessProfiles.mdmd.md)

### IMP-481 Symbol Correctness Validator
Supports REQ-040. [Symbol Correctness Validator](../layer-4/server-diagnostics/symbolCorrectnessValidator.mdmd.md)

## Evidence

### REQ-001 Evidence
- Integration suites US1 to US5 under `tests/integration` remain green.
- Server and extension unit tests for diagnostics pipeline (`publishDocDiagnostics.test.ts`, `docDiagnosticProvider.test.ts`) pass on CI.
- Graph snapshot fixture `data/graph-snapshots/workspace.snapshot.json` rebuilds deterministically.

### REQ-020 Evidence
- SlopCop CLI test suites (`markdownLinks.test.ts`, `assetPaths.test.ts`, `slopcopSymbolsCli.test.ts`) pass and cover regression fixtures.
- Prototype docstring bridge fixtures recorded in `tests/integration/fixtures/slopcop-symbols` stay synchronized with Layer 4 MDMD exports.
- ASCII and markdown export commands produce up-to-date narratives stored under `coverage/extension/src`.

### REQ-030 Evidence
- `npm run safe:commit` executes cleanly across recent commits, demonstrating staged enforcement.
- Adoption telemetry snapshots in `data/knowledge-feeds/bootstrap.json` show profile progression.
- Auto-repair spike logs under `AI-Agent-Workspace/Notes` document pending workflow automation.

### REQ-040 Evidence
- Schema validation snapshots under `data/graph-snapshots/relationship-rule-profiles.json` capture compiled chains and profiles.
- Profile-focused unit suites (`symbolCorrectnessProfiles.test.ts`, `symbolCorrectnessValidator.test.ts`) cover validation, execution, and diagnostics flows.
- CI retains `graph:audit -- --profiles --json` fixtures demonstrating zero violations before release.

## Verification Strategy
- Pre-commit guard: [`npm run safe:commit`](/scripts/safe-to-commit.mjs) chaining lint, tests, graph snapshot or audit, and the SlopCop suite (markdown, asset, symbol audits).
- Integration coverage: US1 to US5 suites emulate writer, developer, rename, and template ripple flows.
- Knowledge feed diffs: snapshot JSON fixtures under [`tests/integration/fixtures/simple-workspace/data/knowledge-feeds`](/tests/integration/fixtures/simple-workspace/data/knowledge-feeds).
- Benchmark placeholder: introduce curated workspaces with canonical ASTs (per FR-017) before closing T05x.

## Traceability Links
- Vision alignment: [Layer 1 Vision](../layer-1/link-aware-diagnostics-vision.mdmd.md)
- Stakeholder prompts: [User Intent Census](/AI-Agent-Workspace/Notes/user-intent-census.md)
- Architecture docs: see linked components above.
- Implementation summaries: see linked implementations above.

## Active Questions
- Which external feed (LSIF, SCIP, GitLab knowledge graph) should open the T05x MVP pipeline?
- What coverage threshold do we need before promoting SlopCop asset and symbol lint beyond markdown?
- Do we gate Copilot metadata exposure until acknowledgement UX is complete?
- How do we package MDMD artefacts into the extension for future telemetry?
- Which ASCII or markdown diagram presets best serve both humans and Copilot prompts without overwhelming diagnostics surfaces?
