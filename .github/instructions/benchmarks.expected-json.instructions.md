---
applyTo: "tests/integration/benchmarks/fixtures/**/expected.json"
---

# Benchmark Expected Graphs

- Regenerate these files via `npm run fixtures:regenerate -- --fixture <id> --write` or the full `npm run safe:commit -- --benchmarks` pipeline. Manual edits should be limited to documented bridge edges that cannot be derived from the language oracle.
- When adding manual edges, capture them in the fixture's `oracle.overrides.json` so future regeneration replays them automatically. Do not inline ad-hoc edits into `expected.json`.
- Verify paired `inferred.json` files by running `npm run fixtures:record-fallback -- --fixture <id> --write` (or the full safe:commit path) so benchmarks compare deterministic outputs.
- After modifying expected/inferred graphs, re-run `npm run test:integration -- --runInBand` or `node scripts/run-benchmarks.mjs --suite ast` to confirm accuracy thresholds remain above the enforced per-fixture gates.
