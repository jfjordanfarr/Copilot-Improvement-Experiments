# Relationship Rule Engine Architecture

## Metadata
- Layer: 3
- Component IDs: COMP-010, COMP-011

## Components

### COMP010 Relationship Rule Engine
Orchestrates declarative rule chains that describe how workspace artifacts must connect (for example, Layer 1 Capability → Layer 2 Requirement → Layer 3 Component → Layer 4 Implementation → code). Compiles the rule configuration, resolves file matches, and materialises inferred link evidence that the graph snapshot pipeline ingests.

### COMP011 Relationship Coverage Auditor
Consumes the same compiled rules during audit runs, verifies each rule has at least one satisfied chain per source artifact, and emits diagnostics that name the specific rule and broken hop when coverage is missing.

### COMP012 Symbol Correctness Profile Evaluator
Evaluates profile contracts that declare the upstream and downstream guarantees for each artifact glob. Aggregates rule execution results, enforces identifier matching (CAP → REQ → COMP → IMP), and surfaces actionable diagnostics and JSON reports for both human reviewers and automated tooling.

## Responsibilities

### Declarative Rule Chains
- Express rule chains in `link-relationship-rules.json` using ordered glob hops, resolver hints, and emitted relationship kinds. Each chain can target any combination of artifacts—MDMD layers, prompt files, conventional Markdown—making layering an opt-in convention.
- Support hop-level filters (identifier prefixes, metadata keys, heading anchors) so workspaces can reuse the same chain across multiple documentation families without hard-coding behaviour.

### Config Compilation and Hot Reload
- Normalise globs relative to the workspace root, validate resolver references, and produce reusable matcher objects for snapshot, server, and audit passes.
- Rebuild the compiled cache whenever the configuration or resolver catalogue changes, surfacing human-readable diagnostics and JSON traces so editors can refresh in place.

### Rule Execution and Relationship Propagation
- Evaluate rule chains during `npm run graph:snapshot`, producing `documents`, `implements`, or custom relationship evidences for every satisfied hop.
- Materialise optional transitive edges (for example, inherit Layer 3 → code from Layer 3 → Layer 4 + Layer 4 → code) when a chain declares propagation targets.
- Record execution traces so downstream tooling can explain why a link exists and how it satisfied the chain.

### Symbol Correctness Profiles
- Interpret profile definitions that map artifact globs to required chain IDs, identifier formats (CAP-###, REQ-###, COMP-###, IMP-###), and evidence expectations.
- Aggregate rule execution results per profile, flagging missing upstream/downstream edges, mismatched identifiers, and absent evidence blocks in MDMD metadata.

### Profile-Driven Coverage Auditing
- During `npm run graph:audit`, resolve rule execution history against the persisted graph to confirm profile contracts are satisfied.
- Emit diagnostics that cite the profile ID, failing hop, and offending artifact, and provide machine-readable JSON for editor diagnostics and CI enforcement.
- Document every exported profile type (`SymbolProfileRequirementDirection`, `SymbolProfileSourceConfig`, `SymbolProfileTargetConfig`, `SymbolProfileRequirementConfig`, `SymbolCorrectnessProfileConfig`, `CompiledSymbolProfileSource`, `CompiledSymbolProfileRequirement`, `CompiledSymbolProfileTarget`, `CompiledSymbolProfile`, `SymbolProfileLookup`) within Layer-4 MDMD briefs so symbol coverage remains synchronized with relationship rule types.

### Extensible Resolver Catalogue
- Ship built-in resolvers for markdown links, MDMD metadata, exported TypeScript symbols, and generic path references.
- Allow workspaces to register additional resolver plugins via relative module imports, making the rule engine applicable to other documentation systems (Sphinx, MkDocs, prompt files) without modifying core code.

## Interfaces

### Inbound Interfaces
- `link-relationship-rules.json`: Workspace contract defining rule chains, propagation settings, and symbol correctness profiles.
- Artifact seeds from `LinkInferenceOrchestrator` (documents, code, scripts) enriched with MDMD metadata, exported symbol lists, and resolver-specific attributes.
- Resolver plugin registry exposing custom hop evaluators that the engine can dynamically load.

### Outbound Interfaces
- Link evidences emitted to the orchestrator so the snapshot pipeline persists edges that satisfy configured chains.
- Profile coverage reports (JSON + markdown summaries) consumed by `graph:audit`, continuous integration, and the VS Code extension diagnostics provider.
- Telemetry hooks that emit rule execution and profile coverage stats for observability dashboards.

## Linked Implementations

### IMP-401 relationshipRuleEngine
Evaluates link-rule chains during graph snapshot generation and produces evidences. [Relationship Rule Engine](../layer-4/tooling/relationshipRuleEngine.mdmd.md)

Code: [`packages/shared/src/rules/relationshipRuleEngine.ts`](../../packages/shared/src/rules/relationshipRuleEngine.ts)

### IMP-402 relationshipRuleAudit
Loads compiled rules within `graph:audit` and maps unsatisfied chains to actionable diagnostics. [Relationship Rule Audit](../layer-4/tooling/relationshipRuleAudit.mdmd.md)

Code: [`packages/shared/src/rules/relationshipRuleAudit.ts`](../../packages/shared/src/rules/relationshipRuleAudit.ts)

### IMP-403 relationshipRuleResolvers
Ships the built-in resolver catalogue (`markdown-links`, `mdmd-code-paths`) that interprets rule hops. [Relationship Rule Resolvers](../layer-4/tooling/relationshipRuleResolvers.mdmd.md)

Code: [`packages/shared/src/rules/relationshipResolvers.ts`](../../packages/shared/src/rules/relationshipResolvers.ts)

### IMP-404 relationshipRuleTypes
Defines the JSON configuration schema, compiled rule structures, and resolver contracts. [Relationship Rule Types](../layer-4/tooling/relationshipRuleTypes.mdmd.md)

Code: [`packages/shared/src/rules/relationshipRuleTypes.ts`](../../packages/shared/src/rules/relationshipRuleTypes.ts)

### IMP-405 relationshipRuleProvider
Exposes the rule engine as a workspace link provider so snapshots and the language server can emit inferred links. [Relationship Rule Provider](../layer-4/tooling/relationshipRuleProvider.mdmd.md)

Code: [`packages/shared/src/rules/relationshipRuleProvider.ts`](../../packages/shared/src/rules/relationshipRuleProvider.ts)

### IMP-406 pathUtils
Supplies URI and path normalisation helpers shared by the rule engine and auditor. [Workspace Path Utilities](../layer-4/tooling/pathUtils.mdmd.md)

Code: [`packages/shared/src/tooling/pathUtils.ts`](../../packages/shared/src/tooling/pathUtils.ts)

### IMP-480 symbolCorrectnessProfiles
Parses profile definitions, validates identifier formats, and emits compiled profile contracts. [Symbol Correctness Profiles](../layer-4/tooling/symbolCorrectnessProfiles.mdmd.md)

Code: [`packages/shared/src/rules/symbolCorrectnessProfiles.ts`](../../packages/shared/src/rules/symbolCorrectnessProfiles.ts)

### IMP-481 symbolCorrectnessValidator
Evaluates compiled profiles against the persisted graph and surfaces diagnostics. [Symbol Correctness Validator](../layer-4/server-diagnostics/symbolCorrectnessValidator.mdmd.md)

Code: [`packages/server/src/features/diagnostics/symbolCorrectnessValidator.ts`](../../packages/server/src/features/diagnostics/symbolCorrectnessValidator.ts)

## Evidence
- Snapshot + audit pipeline: `npm run graph:snapshot` followed by `npm run graph:audit -- --workspace . --profiles` exercises the engine, provider, and auditor end-to-end.
- Unit suites: `relationshipRuleEngine.test.ts`, `relationshipRuleProvider.test.ts`, `relationshipRuleAudit.test.ts`, and `symbolCorrectnessValidator.test.ts` cover config parsing, resolver execution, diagnostics formatting, and profile evaluation.
- Fixture coverage: integration fixtures under `tests/integration/slopcop` validate that documentation link rules propagate as expected and surface Problems panel diagnostics when coverage drifts.
