# Polyglot Oracles & Sampling Harness

## Metadata
- Layer: 3
- Component IDs: COMP-013, COMP-014

## Components
### COMP 013 Polyglot Fixture Oracles
Orchestrates deterministic AST-grounded expectations for C, Rust, Java, Ruby, Python, and TypeScript fixtures so benchmark pipelines can quantify inference accuracy without relying on probabilistic models. Supports REQ-030 by guaranteeing every curated workspace exposes a compiler-verified baseline before telemetry rolls up into adoption reports.

### COMP 014 LLM Sampling Harness
Provides an optional, confidence-gated sampling layer that augments deterministic oracle data with LLM proposals while preserving provenance, reviewer control, and falsifiable telemetry. Supports REQ-020 and REQ-030 by ensuring any AI-derived relationship first passes through explicit consent, scoring, and drift reporting.

## Responsibilities
### Deterministic Coverage (COMP-013)
- Discover project-local toolchains (compiler, interpreter, or build metadata) and normalise them into a consistent oracle interface.
- Produce ordered, reproducible edge lists with provenance annotations and override hooks so fixture regeneration remains reviewable.
- Surface per-language coverage metrics back to benchmark reporters and telemetry so gaps trigger operational alerts.

### Confidence-Gated Sampling (COMP-014)
- Collect multiple LLM responses per prompt, score each proposal, and emit only edges meeting configured agreement thresholds.
- Attach provenance metadata (model, prompt template, sampled tokens) so downstream reviewers can replay or audit suggestions.
- Record divergence between deterministic oracles and sampled edges, flagging disagreements for manual review instead of auto-merging.

## Interfaces
### Fixture Oracle Registry
- Exposes a registry keyed by language that loads implementations from `packages/shared/src/testing/fixtureOracles/*FixtureOracle.ts`.
- Provides a shared options schema (paths, include/exclude globs, override manifests, toolchain hints) consumed by regeneration CLIs under `scripts/fixture-tools/`.
- Emits structured results consumed by `tests/integration/benchmarks/astAccuracy.test.ts` and `reports/benchmarks/**/*`.

### Sampling Harness API
- Defines `runSamplingSession(options)` within `packages/shared/src/inference/llmSampling.ts`, accepting prompt variants, seed edges, and stopping conditions.
- Produces a scored edge bundle with agreement metadata that `packages/shared/src/inference/linkInference.ts` can merge behind configurable confidence thresholds.
- Streams telemetry hooks into `packages/shared/src/telemetry/inferenceAccuracy.ts` so sampling outcomes appear alongside deterministic totals.

### Telemetry Hooks
- Emits per-language oracle coverage, runtime duration, and toolchain provenance into benchmark reports for reproducibility.
- Captures sampling agreement, rejection reasons, and reviewer decisions so operators can triage noisy models quickly.

## Linked Implementations
- [IMP-509 TypeScript Fixture Oracle](../layer-4/testing/benchmarks/typeScriptFixtureOracle.mdmd.md)
- [IMP-510 Python Fixture Oracle](../layer-4/testing/benchmarks/pythonFixtureOracle.mdmd.md)
- [IMP-521 C Fixture Oracle](../layer-4/testing/benchmarks/cFixtureOracle.mdmd.md)
- [IMP-522 Rust Fixture Oracle](../layer-4/testing/benchmarks/rustFixtureOracle.mdmd.md)
- [IMP-523 Java Fixture Oracle](../layer-4/testing/benchmarks/javaFixtureOracle.mdmd.md)
- [IMP-524 Ruby Fixture Oracle](../layer-4/testing/benchmarks/rubyFixtureOracle.mdmd.md)
- [IMP-530 LLM Sampling Harness](../layer-4/shared/llmSampling.mdmd.md)
- [IMP-510 Benchmark Fixture Regenerator](../layer-4/tooling/benchmarkFixtureRegenerator.mdmd.md)

## Evidence
- `npm run test:benchmarks -- --suite ast` produces precision/recall figures per language, verifying deterministic oracle parity across curated fixtures.
- `reports/benchmarks/ast/ast-accuracy.json` records oracle coverage deltas, highlighting gaps before new languages ship.
- Upcoming sampling reliability suite (Phase 8) will capture agreement metrics between deterministic edges and LLM proposals, providing falsifiable evidence before enabling auto-suggest flows.

## Operational Notes
- Polyglot oracles must fail soft when toolchains are unavailable, preserving prior expectations and surfacing actionable remediation guidance.
- Sampling harness defaults to "observe" mode; promotion to "guard" or "apply" requires explicit product decisions captured in Layer 1/2 roadmaps.
- Telemetry events for both components should route through existing safe-to-commit reporters so regressions appear during pre-commit validation.
