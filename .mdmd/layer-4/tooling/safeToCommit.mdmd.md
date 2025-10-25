# Safe-to-Commit Script (Layer 4)

## Source Mapping
- Script: [`scripts/safe-to-commit.mjs`](../../../scripts/safe-to-commit.mjs)
- Related npm task: `npm run safe:commit`

## Responsibility
Provide a one-stop pre-commit gate that runs the project’s `npm run verify` pipeline (lint + unit + integration tests) and summarizes git status. Helps contributors ensure changes are ready before pushing.

## Key Concepts
- **Cross-platform npm**: Detects `npm_execpath` to invoke npm via Node when running inside npm scripts, otherwise falls back to platform-specific `npm` binaries.
- **Step logging**: Wraps each stage with `runStep`, surfacing progress markers and precise failure messages while preserving command output.
- **Git status summary**: Displays `git status -sb` output after verification, highlighting remaining worktree changes.

## Execution Flow
1. Run `npm run verify` (or equivalent via `npm_execpath`) with inherited stdio so underlying tools stream output live.
2. Abort on failure, printing a friendly message before exiting with error code.
3. Invoke `git status -sb` to show resulting worktree summary; prints “Safe to commit? YES” when clean, otherwise reminds to review changes.

## Integration Notes
- Designed for manual execution or automation (e.g., VS Code task palette entry “Safe to Commit”).
- Extendable: additional steps (e.g., `npm run graph:audit`) can be composed by adding new `runStep` calls before the git summary.
- Honors platform differences by using `npm.cmd` on Windows while relying on `git` from PATH.
