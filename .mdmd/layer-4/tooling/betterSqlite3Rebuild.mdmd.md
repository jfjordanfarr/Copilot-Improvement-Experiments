# better-sqlite3 Rebuild Script (Layer 4)

## Source Mapping
- Script: [`scripts/rebuild-better-sqlite3.mjs`](../../../scripts/rebuild-better-sqlite3.mjs)
- Related tooling: [`package.json` postinstall hook]

## Responsibility
Prepare the native `better-sqlite3` binary for the current Node runtime by preferring prebuilt artifacts and falling back to source compilation when necessary. Ensures GraphStore’s native dependency works across developer machines and CI environments.

## Key Concepts
- **Prebuild install**: Attempts to run `prebuild-install` from local dependencies or via `npx` to download matching binaries.
- **Force flags**: `--force` CLI argument or `BETTER_SQLITE3_REBUILD_FORCE=1` environment variable pushes a rebuild even when cached binaries exist; `SKIP_BETTER_SQLITE3_REBUILD=1` short-circuits the script.
- **Source rebuild**: Uses `npm rebuild better-sqlite3` as a last resort, setting `npm_config_build_from_source=true` so node-gyp compiles the module.

## Execution Flow
1. Resolve repository paths and abort early when the module directory is missing.
2. Attempt local `prebuild-install` binaries within the workspace; bail out early on success.
3. Fallback to `npx prebuild-install` to fetch community-published binaries.
4. When no prebuild exists, run `npm rebuild` in source mode and exit with an error if compilation fails.

## Integration Notes
- Invoked automatically as part of native dependency setup; can be run manually when Node versions change.
- Emits progress logs prefixed with `[better-sqlite3]` for traceability in CI logs.
- Extend the script with additional detection logic (e.g., caching compiled binaries) if future environments require it.
