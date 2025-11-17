# tests/integration/perf/diagnosticLatency.test.ts

## Metadata
- Layer: 4
- Archetype: test
- Code Path: tests/integration/perf/diagnosticLatency.test.ts
- Live Doc ID: LD-test-tests-integration-perf-diagnosticlatency-test-ts
- Generated At: 2025-11-16T22:34:14.351Z

## Authored
### Purpose
Measures queue-to-diagnostic latency end to end inside the VS Code harness so p95 stays within the telemetry thresholds established for T052/T053 ([latency command & perf test delivery](../../../../AI-Agent-Workspace/ChatHistory/2025/10/Summarized/2025-10-28.SUMMARIZED.md#turn-21-latency-command--perf-test-lines-2321-2385)).

### Notes
- Windows tolerance multipliers were relaxed during the Roslyn benchmark rollout to absorb rebuild jitter without masking real regressions, keeping the perf guard meaningful across machines ([Roslyn stability tweaks](../../../../AI-Agent-Workspace/ChatHistory/2025/11/Summarized/2025-11-06.SUMMARIZED.md#turn-34-final-documentation--stability-tweaks-lines-6241-6520)).

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-16T22:34:14.351Z","inputHash":"be5aad85d0b96afa"}]} -->
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
