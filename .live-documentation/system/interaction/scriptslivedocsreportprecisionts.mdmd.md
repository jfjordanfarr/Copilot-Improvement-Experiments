# INT-scriptslivedocsreportprecisionts – Report Precision.ts Interaction

## Metadata
- Layer: 3
- Archetype: interaction
- Live Doc ID: INT-scriptslivedocsreportprecisionts
- Generated At: 2025-11-11T03:49:33.723Z

## Authored
### Purpose
_Pending authored purpose_

### Notes
_Pending notes_

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-system-generator","version":"0.1.0","generatedAt":"2025-11-11T03:49:33.723Z"}]} -->
<!-- LIVE-DOC:BEGIN Components -->
### Components
- [packages/server/src/features/live-docs/generator.ts](../../source/packages/server/src/features/live-docs/generator.ts.mdmd.md)
- [scripts/live-docs/lint.ts](../../source/scripts/live-docs/lint.ts.mdmd.md)
- [scripts/live-docs/report-precision.ts](../../source/scripts/live-docs/report-precision.ts.mdmd.md)
<!-- LIVE-DOC:END Components -->

<!-- LIVE-DOC:BEGIN Topology -->
### Topology
```mermaid
graph TD
  node_doc_packagesserversrcfeatureslivedocsgeneratorts["generator.ts"]
  click node_doc_packagesserversrcfeatureslivedocsgeneratorts "../../source/packages/server/src/features/live-docs/generator.ts.mdmd.md" "generator.ts"
  node_doc_scriptslivedocslintts["lint.ts"]
  click node_doc_scriptslivedocslintts "../../source/scripts/live-docs/lint.ts.mdmd.md" "lint.ts"
  node_doc_scriptslivedocsreportprecisionts["report-precision.ts"]
  click node_doc_scriptslivedocsreportprecisionts "../../source/scripts/live-docs/report-precision.ts.mdmd.md" "report-precision.ts"
  node_doc_scriptslivedocslintts --> node_doc_scriptslivedocsreportprecisionts
  node_doc_scriptslivedocsreportprecisionts --> node_doc_packagesserversrcfeatureslivedocsgeneratorts
  class node_doc_packagesserversrcfeatureslivedocsgeneratorts implementation
  class node_doc_scriptslivedocslintts implementation
  class node_doc_scriptslivedocsreportprecisionts implementation
  %% class definitions
  classDef implementation fill:#2563eb,stroke:#0f172a,color:#ffffff
```
<!-- LIVE-DOC:END Topology -->
