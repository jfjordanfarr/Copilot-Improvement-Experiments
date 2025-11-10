# Relationship Rule Engine

## Metadata
- Layer: 4
- Implementation ID: IMP-401
- Code Path: [`packages/shared/src/rules/relationshipRuleEngine.ts`](../../../packages/shared/src/rules/relationshipRuleEngine.ts)
- Exports: loadRelationshipRuleConfig, compileRelationshipRules, generateRelationshipEvidences, GenerateRelationshipEvidencesOptions, RelationshipEvidenceGenerationResult

## Purpose
Implements the runtime that loads the workspace `link-relationship-rules.json`, compiles its declarative rule chains, and evaluates them against collected artifact seeds so graph snapshot runs emit deterministic relationship evidences for every satisfied rule.

## Public Symbols

### loadRelationshipRuleConfig
Reads and validates the configuration file, applying defaults, emitting structured warnings, and returning the raw rule set along with its resolved file location.

### compileRelationshipRules
Normalises glob patterns relative to the workspace root, binds resolver strategies, and produces an execution-ready `CompiledRelationshipRules` object that can be reused across snapshot and audit passes.

### generateRelationshipEvidences
Walks the compiled rules over artifact seeds, producing `LinkEvidence` entries (and optional execution traces) whenever a rule chain resolves all of its hops.

### GenerateRelationshipEvidencesOptions
Typed contract describing the inputs required to execute the engine, including workspace root, artifact seeds, compiled rules, and optional provenance metadata.

### RelationshipEvidenceGenerationResult
Wraps the generated evidences with the execution chains that justified them so downstream tooling can surface rule traces or reuse the chains for propagation analysis.

## Collaborators
- `packages/shared/src/rules/relationshipResolvers.ts` supplies built-in resolver implementations for markdown links, MDMD metadata code paths, and generic path references.
- `packages/shared/src/tooling/pathUtils.ts` handles workspace-relative normalisation when chasing rule matches.

## Linked Components
- [COMP-010 – Relationship Rule Engine](/.mdmd/layer-3/relationship-rule-engine.mdmd.md#comp010-relationship-rule-engine)

## Evidence
- Unit tests planned for `packages/shared/src/rules/relationshipRuleEngine.test.ts` covering config parsing, rule compilation, and execution happy-path/edge cases.
- Integration: running `npm run graph:snapshot` with the sample MDMD rule chain should produce `implements` links from Layer 3 docs to the code they govern.
