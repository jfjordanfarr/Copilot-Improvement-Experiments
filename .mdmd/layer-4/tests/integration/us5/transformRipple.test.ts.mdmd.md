# tests/integration/us5/transformRipple.test.ts

## Metadata
- Layer: 4
- Archetype: test
- Code Path: tests/integration/us5/transformRipple.test.ts
- Live Doc ID: LD-test-tests-integration-us5-transformripple-test-ts
- Generated At: 2025-11-16T22:34:14.475Z

## Authored
### Purpose
Validates that a template edit produces doc-drift diagnostics for both the transform script and generated config, enforcing multi-hop ripple metadata (depth/path) promised by the falsifiability suite ([US5 integration scaffolding](../../../../../AI-Agent-Workspace/ChatHistory/2025/10/Summarized/2025-10-21.SUMMARIZED.md#turn-10-implement-falsifiability-suites-lines-3701-4100) · [reset-aware ripple confirmation](../../../../../AI-Agent-Workspace/ChatHistory/2025/10/Summarized/2025-10-29.SUMMARIZED.md#turn-22-reset-notification-and-successful-ripple-lines-3701-4040)).

### Notes
- Exercises the template → transform → generated-config chain to ensure ripple diagnostics carry depth/path metadata as introduced in the analyzer contract ([ripple intelligence rollout](../../../../../AI-Agent-Workspace/ChatHistory/2025/10/Summarized/2025-10-20.SUMMARIZED.md#ripple-intelligence)).
- Depends on the URI normalization and feed propagation fixes that restored the web.config hop during harness hardening ([static provider & ripple path fixes](../../../../../AI-Agent-Workspace/ChatHistory/2025/10/Summarized/2025-10-22.SUMMARIZED.md#turn-07-static-feed-provider--ripple-path-fixes-lines-3601-4300)).
- Confirms the reset-notification handshake keeps diagnostics watchers in sync so both direct and transitive ripples surface within the polling budget ([reset-aware ripple confirmation](../../../../../AI-Agent-Workspace/ChatHistory/2025/10/Summarized/2025-10-29.SUMMARIZED.md#turn-22-reset-notification-and-successful-ripple-lines-3701-4040)).

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-16T22:34:14.475Z","inputHash":"9e0e0005e1c3c601"}]} -->
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
