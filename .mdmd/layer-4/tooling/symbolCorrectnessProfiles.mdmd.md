# Symbol Correctness Profiles

## Metadata
- Layer: 4
- Implementation ID: IMP-480
- Code Path: [`packages/shared/src/rules/symbolCorrectnessProfiles.ts`](../../../packages/shared/src/rules/symbolCorrectnessProfiles.ts)
- Exports: loadSymbolCorrectnessProfiles, compileSymbolProfiles, SymbolProfileLoadResult, CompileSymbolProfilesResult

## Purpose
Parses the `profiles` portion of `link-relationship-rules.json`, validates identifier formats (for example CAP-###, REQ-###, COMP-###, IMP-###), and produces compiled profile contracts that both the relationship rule engine and coverage auditor consume. Serves as the authoritative source for mapping documentation globs to required rule chains, evidence checks, and identifier propagation rules.

## Public Symbols

### loadSymbolCorrectnessProfiles
Reads the workspace configuration, extracts the `profiles` definition, and emits structured validation errors when required fields (profile id, source globs, required chain IDs) are missing or malformed.

### compileSymbolProfiles
Normalises glob patterns relative to the workspace root, binds identifier matchers, and resolves rule/chain references so the runtime and auditor can evaluate coverage without reparsing JSON.

### SymbolProfileLoadResult
Represents the raw configuration load output, capturing the parsed profile definitions alongside validation warnings for missing identifiers, malformed globs, or empty requirement sets.

### CompileSymbolProfilesResult
Returned by `compileSymbolProfiles`, containing the filtered list of valid profile contracts, an indexed lookup helper, and any compilation warnings (unused profiles, invalid requirements).

## Collaborators
- `packages/shared/src/rules/relationshipRuleTypes.ts` supplies shared schema definitions and exposes `CompiledSymbolProfile` plus `SymbolProfileLookup` types returned by the compiler.
- `packages/shared/src/tooling/pathUtils.ts` provides glob helpers and workspace-relative normalisation routines shared across rule compilation.

## Linked Components
- [COMP-012 – Symbol Correctness Profile Evaluator](/.mdmd/layer-3/relationship-rule-engine.mdmd.md#comp012-symbol-correctness-profile-evaluator)
- [COMP-010 – Relationship Rule Engine](/.mdmd/layer-3/relationship-rule-engine.mdmd.md#comp010-relationship-rule-engine)

## Evidence
- Upcoming unit tests in `packages/shared/src/rules/symbolCorrectnessProfiles.test.ts` verifying config validation, glob compilation, and identifier pattern enforcement.
- Integration: `npm run graph:snapshot` followed by `npm run graph:audit -- --profiles` should enumerate each profile and report coverage status using the compiled profile cache.
