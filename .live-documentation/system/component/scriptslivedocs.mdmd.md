# COMP-scriptslivedocs – Live Docs Component

## Metadata
- Layer: 3
- Archetype: component
- Live Doc ID: COMP-scriptslivedocs
- Generated At: 2025-11-11T03:38:40.692Z

## Authored
### Purpose
_Pending authored purpose_

### Notes
_Pending notes_

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-system-generator","version":"0.1.0","generatedAt":"2025-11-11T03:38:40.692Z"}]} -->
<!-- LIVE-DOC:BEGIN Components -->
### Components
- [scripts/live-docs/build-target-manifest.ts](../../source/scripts/live-docs/build-target-manifest.ts.mdmd.md)
- [scripts/live-docs/find-orphans.ts](../../source/scripts/live-docs/find-orphans.ts.mdmd.md)
- [scripts/live-docs/generate.ts](../../source/scripts/live-docs/generate.ts.mdmd.md)
- [scripts/live-docs/lint.ts](../../source/scripts/live-docs/lint.ts.mdmd.md)
- [scripts/live-docs/report-precision.ts](../../source/scripts/live-docs/report-precision.ts.mdmd.md)
- [scripts/live-docs/run-all.ts](../../source/scripts/live-docs/run-all.ts.mdmd.md)
<!-- LIVE-DOC:END Components -->

<!-- LIVE-DOC:BEGIN Topology -->
### Topology
```mermaid
graph TD
  node_doc_scriptslivedocsbuildtargetmanifestts["build-target-manifest.ts"]
  click node_doc_scriptslivedocsbuildtargetmanifestts "../../source/scripts/live-docs/build-target-manifest.ts.mdmd.md" "build-target-manifest.ts"
  node_doc_scriptslivedocsfindorphansts["find-orphans.ts"]
  click node_doc_scriptslivedocsfindorphansts "../../source/scripts/live-docs/find-orphans.ts.mdmd.md" "find-orphans.ts"
  node_doc_scriptslivedocsgeneratets["generate.ts"]
  click node_doc_scriptslivedocsgeneratets "../../source/scripts/live-docs/generate.ts.mdmd.md" "generate.ts"
  node_doc_scriptslivedocslintts["lint.ts"]
  click node_doc_scriptslivedocslintts "../../source/scripts/live-docs/lint.ts.mdmd.md" "lint.ts"
  node_doc_scriptslivedocsreportprecisionts["report-precision.ts"]
  click node_doc_scriptslivedocsreportprecisionts "../../source/scripts/live-docs/report-precision.ts.mdmd.md" "report-precision.ts"
  node_doc_scriptslivedocsrunallts["run-all.ts"]
  click node_doc_scriptslivedocsrunallts "../../source/scripts/live-docs/run-all.ts.mdmd.md" "run-all.ts"
  node_doc_scriptslivedocsbuildtargetmanifestts --> node_doc_scriptslivedocsgeneratets
  node_doc_scriptslivedocsgeneratets --> node_doc_scriptslivedocslintts
  node_doc_scriptslivedocslintts --> node_doc_scriptslivedocsreportprecisionts
  node_doc_scriptslivedocsrunallts --> node_doc_scriptslivedocsbuildtargetmanifestts
  class node_doc_scriptslivedocsbuildtargetmanifestts implementation
  class node_doc_scriptslivedocsfindorphansts implementation
  class node_doc_scriptslivedocsgeneratets implementation
  class node_doc_scriptslivedocslintts implementation
  class node_doc_scriptslivedocsreportprecisionts implementation
  class node_doc_scriptslivedocsrunallts implementation
  %% class definitions
  classDef implementation fill:#2563eb,stroke:#0f172a,color:#ffffff
```
<!-- LIVE-DOC:END Topology -->
