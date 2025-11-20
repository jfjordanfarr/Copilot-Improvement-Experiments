# tests/integration/fixtures/simple-workspace/data/knowledge-feeds/001-doc-links.json

## Metadata
- Layer: 4
- Archetype: asset
- Code Path: tests/integration/fixtures/simple-workspace/data/knowledge-feeds/001-doc-links.json
- Live Doc ID: LD-asset-tests-integration-fixtures-simple-workspace-data-knowledge-feeds-001-doc-links-json
- Generated At: 2025-11-18T20:51:26.589Z

## Authored
### Purpose
Seed Live Documentation link evidence for the simple workspace fixture so diagnostics can reason about authored markdown without running full analyzers.

### Notes
- Provides deterministic document→code relationships consumed during integration runs to verify that link ingestion behaves consistently.
- Loaded by `staticFeedWorkspaceProvider` whenever the simple workspace suite boots, ensuring doc drift alerts have baseline evidence.
- Update alongside the fixture markdown and regenerate the Stage‑0 mirror whenever new documents or sections are introduced.

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-18T20:51:26.589Z","inputHash":"c46d18d045f22c62"}]} -->
<!-- LIVE-DOC:BEGIN Public Symbols -->
### Public Symbols
_No public symbols detected_
<!-- LIVE-DOC:END Public Symbols -->

<!-- LIVE-DOC:BEGIN Dependencies -->
### Dependencies
_No dependencies documented yet_
<!-- LIVE-DOC:END Dependencies -->
