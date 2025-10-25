# Clean Dist Utility (Layer 4)

## Source Mapping
- Implementation: [`tests/integration/clean-dist.mjs`](../../../../tests/integration/clean-dist.mjs)
- Collaborators: [`packages/extension/package.json`](../../../../packages/extension/package.json), [`packages/server/package.json`](../../../../packages/server/package.json) (for `npm run build` outputs)

## Responsibility
Remove stale `dist/` directories for the extension and server packages before integration suites execute. Ensures tests run against freshly compiled artifacts and prevents file residue from influencing scenario expectations.

## Workflow
1. Resolve the repository root relative to the script location.
2. Identify `packages/extension/dist` and `packages/server/dist` (plus additional subdirectories when present).
3. Delete the directories recursively using Node’s filesystem APIs, ignoring missing paths to keep the script idempotent.
4. Emit console logs summarising deletions so test logs show which artifacts were cleared.

## Usage
- Invoked implicitly by `npm run test:integration` prior to spawning the VS Code harness.
- Can be executed manually to prepare a clean slate when debugging integration failures locally.

## Follow-ups
- Extend coverage to generated SQLite caches if future suites require a clean knowledge graph.
- Add an environment flag to skip deletion for faster iterative runs when developers knowingly changed only test code.
