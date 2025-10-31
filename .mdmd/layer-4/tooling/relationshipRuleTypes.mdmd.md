# Relationship Rule Types

## Metadata
- Layer: 4
- Implementation ID: IMP-404
- Code Path: [`packages/shared/src/rules/relationshipRuleTypes.ts`](../../../packages/shared/src/rules/relationshipRuleTypes.ts)
- Exports: RelationshipRuleStepConfig, RelationshipRulePropagationConfig, RelationshipRuleConfig, RelationshipRulesConfig, RelationshipRuleConfigLoadResult, RelationshipRuleWarning, RelationshipResolverResult, RelationshipResolverOptions, RelationshipResolver, CompiledRelationshipRuleStep, CompiledRelationshipRulePropagation, CompiledRelationshipRule, CompiledRelationshipRules, RelationshipRuleChain, RelationshipRuleChainStep, SymbolProfileRequirementDirection, SymbolProfileSourceConfig, SymbolProfileTargetConfig, SymbolProfileRequirementConfig, SymbolCorrectnessProfileConfig, CompiledSymbolProfileSource, CompiledSymbolProfileRequirement, CompiledSymbolProfileTarget, CompiledSymbolProfile, SymbolProfileLookup

## Purpose
Defines the configuration schema and compiled data structures that the relationship rule engine consumes. These types bridge the JSON workspace configuration, resolver contracts, and runtime execution so both snapshot and audit pipelines share a consistent, type-safe model.

## Public Symbols

### RelationshipRuleStepConfig
Declares a single hop in a declarative rule sequence, including the glob matcher, expected layer, resolver identifier, and optional link metadata.

### RelationshipRulePropagationConfig
Describes derived edges that should be emitted once a rule chain succeeds, referencing step names and overriding link semantics when needed.

### RelationshipRuleConfig
Groups ordered steps and propagations under a unique rule identifier, plus optional labels and descriptions for diagnostics.

### RelationshipRulesConfig
Wraps the entire configuration file so loaders can validate top-level structure before compilation.

### RelationshipRuleConfigLoadResult
Represents the loader output, returning the resolved file path, parsed configuration, and any validation warnings raised during IO.

### RelationshipRuleWarning
Standardises warning messages emitted during load or compilation phases, optionally scoped to specific rule IDs.

### RelationshipResolverResult
Models the outcome of a resolver hop, capturing the matched artifact seed and any rationale text used for traces.

### RelationshipResolverOptions
Provides runtime context to resolvers, including the workspace root, source artifact seed, resolver chain metadata, and candidate targets.

### RelationshipResolver
Interface that custom resolver implementations must satisfy so they can be registered with the engine.

### CompiledRelationshipRuleStep
Runtime-ready representation of a rule step containing the compiled glob matcher, resolver binding, and resolved link semantics.

### CompiledRelationshipRulePropagation
Runtime structure for derived edges, mapping compiled step indices to link metadata after validation.

### CompiledRelationshipRule
Holds the compiled step list and propagation definitions for a single rule, plus human-readable metadata.

### CompiledRelationshipRules
Aggregates all compiled rules alongside warnings, enabling consumers to evaluate the entire rule set without re-validating the configuration.

### RelationshipRuleChain
Describes the sequence of artifact seeds that satisfied each hop during rule evaluation, enabling diagnostics and propagation checks.

### RelationshipRuleChainStep
Captures the artifact seed and resolver rationale for each hop executed in a rule chain, providing traceability for diagnostics and profile evaluations.

### SymbolProfileRequirementDirection
Enumerates the allowed link orientations (`outbound`, `incoming`) when evaluating symbol correctness profile requirements.

### SymbolProfileSourceConfig
Schema describing which artifacts a profile applies to, including glob patterns, MDMD layer filters, and identifier extraction hints.

### SymbolProfileTargetConfig
Configuration fragment that defines the acceptable target artifacts for a profile requirement, supporting glob and layer constraints.

### SymbolProfileRequirementConfig
Declares the mandatory relationship chain for a profile, including link kind, direction, minimum counts, target filters, and optional identifier matching.

### SymbolCorrectnessProfileConfig
Top-level structure mapping source globs to requirement collections, enforce flags, and optional human-readable labels.

### CompiledSymbolProfileSource
Runtime representation of a profile source after glob compilation, identifier pattern parsing, and metadata normalisation.

### CompiledSymbolProfileRequirement
Validated requirement metadata ready for execution, ensuring link kinds, directions, targets, and identifier rules are consistent.

### CompiledSymbolProfileTarget
Prepared target matcher that resolves glob patterns into efficient workspace-relative checks for profile evaluation.

### CompiledSymbolProfile
Aggregates the compiled source and requirements for a profile, including enforcement flags and metadata used during diagnostics.

### SymbolProfileLookup
Helper that indexes compiled profiles by glob matcher and identifier signature, enabling rapid lookup during audit and runtime enforcement.

## Collaborators
- `packages/shared/src/rules/relationshipRuleEngine.ts` transforms these types into executable rule chains and evidence payloads.
- `packages/shared/src/rules/relationshipRuleAudit.ts` reuses the compiled structures to validate persisted graph edges.

## Linked Components
- [COMP-010 – Relationship Rule Engine](/.mdmd/layer-3/relationship-rule-engine.mdmd.md#comp010-relationship-rule-engine)
- [COMP-011 – Relationship Coverage Auditor](/.mdmd/layer-3/relationship-rule-engine.mdmd.md#comp011-relationship-coverage-auditor)

## Evidence
- TypeScript compilation ensures config parsing and runtime components align via shared generics.
- Follow-up: targeted unit tests covering extreme combinations of resolver bindings and propagation fan-out.
