# Fixture Verification Harness

## Purpose

The fixture verification harness keeps every sample workspace in a reproducible, lint-clean state. It bundles the end-to-end checks we rely on before shipping—graph snapshotting, documentation coverage, and every SlopCop audit—into a single command so regressions surface immediately.

## Entry Points

- Command: `npm run fixtures:verify`
- Implementation: [`scripts/fixture-tools/verify-fixtures.ts`](../../scripts/fixture-tools/verify-fixtures.ts)
- Manifest: [`tests/integration/fixtures/fixtures.manifest.json`](../../tests/integration/fixtures/fixtures.manifest.json)

## Workflow

1. The manifest enumerates each fixture workspace, its stories, optional SlopCop configuration, and the specific SlopCop suites that should run.
2. For every entry the harness copies the workspace into an isolated temp directory, runs `graph:snapshot` and (unless disabled) `graph:audit`, and then executes just the declared SlopCop suites with the fixture’s config.
3. Any non-zero exit code aborts the run and surfaces the failing command, preserving console output for triage.

## Expectations

- Fixture sources must remain "green"—tests that need broken conditions should mutate temporary copies instead of the manifest baseline.
- New fixtures should extend the manifest and document their intent so the harness can cover them automatically.
- When SlopCop or graph tooling evolves, update the harness first; the `safe:commit` gate depends on it for workspace-wide integrity.
- Declare only the SlopCop suites that matter for each fixture so the harness remains fast and avoids redundant scans.
