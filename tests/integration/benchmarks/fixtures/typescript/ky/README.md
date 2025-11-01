# Ky Benchmark Fixture

This directory vendorizes a trimmed snapshot of the [Ky](https://github.com/sindresorhus/ky) HTTP client to exercise the AST accuracy benchmark against a real-world TypeScript project.

- Upstream repository: `sindresorhus/ky`
- Commit: `5d3684ed0e27c1a89f9d13f09523367d86cbabfe` (cloned 2025-11-01)
- License: MIT (see `LICENSE`)
- Source subset: files copied from `source/` in the upstream repository

### Curation Notes
- The fixture preserves Ky's module structure (core, errors, types, utils) so dependency edges match the production library.
- Tests, media assets, build configuration, and distribution artifacts were intentionally omitted to keep the benchmark lean and deterministic.
- When updating this fixture, re-run `npm run test:benchmarks -- --ast-only --suite ast-accuracy` and refresh the Layer-4 documentation under `.mdmd/layer-4/benchmarks/`.

### Expected/Inferred Graphs
Populate `expected.json` with canonical AST edges and `inferred.json` with the pipeline output prior to committing updates. The benchmark harness asserts precision/recall using these snapshots.
