# Safe-to-Commit Script (Layer 4)

## Source Mapping
- Script: [`scripts/safe-to-commit.mjs`](../../../scripts/safe-to-commit.mjs)
- Related npm task: `npm run safe:commit`

## Responsibility
Provide a one-stop pre-commit gate that runs the full verification pipeline—`npm run verify`, graph snapshot/audit, fixture verification, and the SlopCop audits—and summarizes git status. Helps contributors ensure changes are ready before pushing.

## Key Concepts
- **Cross-platform npm**: Detects `npm_execpath` to invoke npm via Node when running inside npm scripts, otherwise falls back to platform-specific `npm` binaries.
- **Step logging**: Wraps each stage with `runStep`, surfacing progress markers and precise failure messages while preserving command output.
- **Git status summary**: Displays `git status -sb` output after verification, highlighting remaining worktree changes.

## Execution Flow
1. Run `npm run verify` (or equivalent via `npm_execpath`) with inherited stdio so underlying tools stream output live.
2. Chain workspace-wide checks: `npm run graph:snapshot`, `npm run graph:audit`, `npm run fixtures:verify`, and the SlopCop markdown/asset/symbol audits.
3. Abort on failure, printing a friendly message before exiting with error code.
4. Invoke `git status -sb` to show resulting worktree summary; prints “Safe to commit? YES” when clean, otherwise reminds to review changes. Pass `--skip-git-status` (or run in CI with `CI=true`) to suppress the git inspection when a detached head or shallow checkout is expected.

## Integration Notes
- Designed for manual execution or automation (e.g., VS Code task palette entry “Safe to Commit”).
- Composes `npm run verify`, `npm run graph:snapshot -- --quiet`, `npm run graph:audit`, `npm run fixtures:verify`, and the SlopCop audits so the modern lint gates run before the git summary.
- Honors platform differences by using `npm.cmd` on Windows while relying on `git` from PATH; `--skip-git-status`/`--ci` allows non-interactive CI runs to reuse the same script without worktree noise.
