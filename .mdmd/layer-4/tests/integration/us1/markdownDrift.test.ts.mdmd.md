# tests/integration/us1/markdownDrift.test.ts

## Metadata
- Layer: 4
- Archetype: test
- Code Path: tests/integration/us1/markdownDrift.test.ts
- Live Doc ID: LD-test-tests-integration-us1-markdowndrift-test-ts
- Generated At: 2025-11-16T22:34:14.403Z

## Authored
### Purpose
Exercises US1’s markdown-to-code watchdog by editing the architecture brief and asserting diagnostics, quick actions, and hysteresis behaviours that defined the original acceptance test for the drift story ([integration test seeded](../../../../AI-Agent-Workspace/ChatHistory/2025/10/Summarized/2025-10-17.SUMMARIZED.md#turn-10-plan-next-steps-via-speckit-lines-455-514)).

### Notes
- Hardened alongside the harness cleanup that added diagnostic flushes and reset calls so Windows runs no longer flake on lingering Problems entries ([integration cleanup & fixture hygiene](../../../../AI-Agent-Workspace/ChatHistory/2025/10/Summarized/2025-10-29.SUMMARIZED.md#turn-14-integration-cleanup--fixture-hygiene-lines-1833-2065)).
- Raised the debounce window and corrected the workspace setting name after safe-commit pipelines revealed the original key mismatch, keeping rapid-edit batching reliable on thicker fixtures ([debounce window raised](../../../../AI-Agent-Workspace/ChatHistory/2025/11/Summarized/2025-11-06.SUMMARIZED.md#turn-28-debounce-window-raised--c-sharp-docs-added-lines-4801-5040) · [workspace setting name corrected](../../../../AI-Agent-Workspace/ChatHistory/2025/11/Summarized/2025-11-06.SUMMARIZED.md#turn-29-correct-workspace-setting-name-lines-5041-5260)).

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-16T22:34:14.403Z","inputHash":"f6b934e984e14d77"}]} -->
<!-- LIVE-DOC:BEGIN Public Symbols -->
### Public Symbols
_No public symbols detected_
<!-- LIVE-DOC:END Public Symbols -->

<!-- LIVE-DOC:BEGIN Dependencies -->
### Dependencies
- `node:assert` - `assert`
- `vscode` - `vscode`
<!-- LIVE-DOC:END Dependencies -->

<!-- LIVE-DOC:BEGIN Targets -->
### Targets
_No targets documented yet_
<!-- LIVE-DOC:END Targets -->

<!-- LIVE-DOC:BEGIN Supporting Fixtures -->
### Supporting Fixtures
_No supporting fixtures documented yet_
<!-- LIVE-DOC:END Supporting Fixtures -->
