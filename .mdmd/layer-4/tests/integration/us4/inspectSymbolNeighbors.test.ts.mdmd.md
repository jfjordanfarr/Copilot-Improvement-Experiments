# tests/integration/us4/inspectSymbolNeighbors.test.ts

## Metadata
- Layer: 4
- Archetype: test
- Code Path: tests/integration/us4/inspectSymbolNeighbors.test.ts
- Live Doc ID: LD-test-tests-integration-us4-inspectsymbolneighbors-test-ts
- Generated At: 2025-11-16T22:34:14.453Z

## Authored
### Purpose
Dogfoods the US4 Inspect Symbol Neighbors command by driving the extension through the VS Code API and asserting the quick pick UI populates with related artifacts, covering the workflow delivered alongside the server/command wiring ([symbol neighbor command landed](../../../../../AI-Agent-Workspace/ChatHistory/2025/10/Summarized/2025-10-23.SUMMARIZED.md#turn-24-lsp--command-implementation-kickoff-lines-2701-3000)).

### Notes
- Uses the dedicated test hooks added when we abandoned ad-hoc window monkey patches, ensuring the suite verifies real quick pick invocations instead of relying on brittle proxies ([stub infrastructure & proxy discovery](../../../../../AI-Agent-Workspace/ChatHistory/2025/10/Summarized/2025-10-23.SUMMARIZED.md#turn-29-stub-infrastructure--proxy-discovery-lines-4701-5600)).
- Reconfirmed green in the pipeline once knowledge feeds, persistence dedupe, and the command all stabilized together ([green pipeline & release wrap-up](../../../../../AI-Agent-Workspace/ChatHistory/2025/10/Summarized/2025-10-23.SUMMARIZED.md#turn-30-green-pipeline--release-wrap-up-lines-5601-6577)).

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-16T22:34:14.453Z","inputHash":"182865dc92d27621"}]} -->
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
