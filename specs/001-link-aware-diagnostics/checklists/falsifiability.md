# Checklist: Live Documentation Falsifiability Guarantees

**Purpose**: Ensure Live Documentation requirements (REQ-F1–REQ-F6) are covered by deterministic lint, regeneration, and provenance checks before implementation proceeds.
**Created**: 2025-11-08

## Structural Integrity (REQ-F1)
- [ ] Do instructions and generator templates guarantee `## Metadata`, `## Authored`, and `## Generated` sections exist with HTML markers? (Refs: `.github/instructions/mdmd.layer4*.instructions.md`, FR-LD1)
- [ ] Does the lint plan block merges when markers are edited manually or headings are missing? (Refs: `scripts/live-docs/lint.ts`, LD-302)
- [ ] Are waivers for empty sections captured via HTML comments (`<!-- evidence-waived -->`, etc.) and echoed in authored `### Notes`?

## Deterministic Generation (REQ-F2)
- [ ] Does the generator write `Public Symbols` and `Dependencies` deterministically across repeated runs (same hash unless analyzer output changes)? (Refs: LD-200–LD-205, `reports/benchmarks/live-docs`)
- [ ] Are provenance fields (`generatedAt`, analyzer tool/version, benchmark hash) recorded for each regeneration cycle? (Refs: `packages/shared/src/live-docs/schema.ts`, LD-203)
- [ ] Do benchmarks confirm ≥0.9 export precision and ≥0.8 dependency recall for supported languages after regeneration? (Refs: `reports/benchmarks/ast`, LD-305)

## Evidence & Coverage (REQ-F3)
- [ ] Will implementation Live Docs emit `Observed Evidence` whenever linked tests/benchmarks or waivers exist, defaulting to `_No automated evidence found_` with waivers when automated coverage is unavailable? (Refs: LD-300–LD-304)
- [ ] Do test Live Docs populate `Targets`/`Supporting Fixtures`, and does lint escalate when they remain empty? (Refs: `.github/instructions/mdmd.layer4.test.instructions.md`)
- [ ] Are coverage ingestion paths (Vitest, pytest, dotnet) captured with reproducible fixtures and telemetry? (Refs: LD-300, WI-LD102)

## Diagnostics & Exports (REQ-F4)
- [ ] When diagnostics fire, do they reference the Live Doc path, generated timestamp, and evidence summary? (Refs: LD-400–LD-401)
- [ ] Does the CLI (`scripts/live-docs/inspect.ts`) output the same data as the UI, validated by snapshot tests? (Refs: LD-402, LD-403)
- [ ] Are drift regressions caught by integration suites comparing CLI/diagnostic output before and after regeneration? (Refs: `tests/integration/live-docs/generation.test.ts`)

## Markdown Hygiene (REQ-F5)
- [ ] Are staged Live Docs included in SlopCop markdown/asset/symbol audits with relative-link enforcement and configurable slug dialect? (Refs: `slopcop.config.json`, LD-302–LD-303)
- [ ] Do lint gates fail when markdown links point to missing assets or anchors? (Refs: `npm run slopcop:markdown`, `npm run slopcop:assets`)
- [ ] Are asset references tracked either through Live Docs or direct markdown links with validation coverage? (Refs: `.github/instructions/mdmd.layer4.implementation.instructions.md`)

## Docstring Drift (REQ-F6)
- [ ] Is docstring bridge metadata emitted during regeneration and normalised by the schema? (Refs: `packages/shared/src/live-docs/schema.ts`, LD-500)
- [ ] Do diagnostics/CLI commands surface drift and provide remediation (sync or waive) with integration coverage? (Refs: LD-501–LD-503)
- [ ] Are safe-commit gates configured to fail when unresolved drift exceeds zero without waivers? (Refs: LD-503–LD-504)

## Evidence & Traceability
- [ ] Safe-to-commit transcript captures lint/regeneration failures and provenance deltas for audit.
- [ ] Benchmark reports (`reports/benchmarks/live-docs/*.json`) retain analyzer accuracy snapshots post-regeneration.
- [ ] Integration suites under `tests/integration/live-docs/` cover happy path and failure injections for all REQ-F requirements.
