# tests/integration/us1/codeImpact.test.ts

## Metadata
- Layer: 4
- Archetype: test
- Code Path: tests/integration/us1/codeImpact.test.ts
- Live Doc ID: LD-test-tests-integration-us1-codeimpact-test-ts
- Generated At: 2025-11-16T22:34:14.391Z

## Authored
### Purpose
Proves US1’s code-impact promise by editing the shared workspace fixtures and asserting that direct, transitive, and debounced ripple diagnostics reach downstream modules with actionable quick fixes ([code ripple foundations](../../../../../AI-Agent-Workspace/ChatHistory/2025/10/Summarized/2025-10-19.SUMMARIZED.md#turn-28-build-code-ripple-foundations-lines-2779-2904)).

### Notes
- Hardened during the first real-model dogfooding pass to accommodate slower inference by raising the diagnostic polling budget and aligning Mocha timeouts ([real-model runs expose timeouts](../../../../../AI-Agent-Workspace/ChatHistory/2025/10/Summarized/2025-10-29.SUMMARIZED.md#turn-15-real-model-runs-expose-timeouts-lines-2066-2249) · [mocha timeout alignment](../../../../../AI-Agent-Workspace/ChatHistory/2025/10/Summarized/2025-10-29.SUMMARIZED.md#turn-16-mocha-timeout-alignment-lines-2250-2329)).
- Leverages the diagnostic reset notification and poller instrumentation that stabilized ripple detection after multiple VS Code restart cycles ([reset notification and successful ripple](../../../../../AI-Agent-Workspace/ChatHistory/2025/10/Summarized/2025-10-29.SUMMARIZED.md#turn-22-reset-notification-and-successful-ripple-lines-3701-4040)).

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-16T22:34:14.391Z","inputHash":"d8d777892dbc5c78"}]} -->
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
