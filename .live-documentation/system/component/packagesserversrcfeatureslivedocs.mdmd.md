# COMP-packagesserversrcfeatureslivedocs – Live Docs Component

## Metadata
- Layer: 3
- Archetype: component
- Live Doc ID: COMP-packagesserversrcfeatureslivedocs
- Generated At: 2025-11-11T03:38:40.682Z

## Authored
### Purpose
_Pending authored purpose_

### Notes
_Pending notes_

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-system-generator","version":"0.1.0","generatedAt":"2025-11-11T03:38:40.682Z"}]} -->
<!-- LIVE-DOC:BEGIN Components -->
### Components
- [packages/server/src/features/live-docs/evidenceBridge.ts](../../source/packages/server/src/features/live-docs/evidenceBridge.ts.mdmd.md)
- [packages/server/src/features/live-docs/generation/core.ts](../../source/packages/server/src/features/live-docs/generation/core.ts.mdmd.md)
- [packages/server/src/features/live-docs/generator.ts](../../source/packages/server/src/features/live-docs/generator.ts.mdmd.md)
- [packages/server/src/features/live-docs/system/generator.ts](../../source/packages/server/src/features/live-docs/system/generator.ts.mdmd.md)
<!-- LIVE-DOC:END Components -->

<!-- LIVE-DOC:BEGIN Topology -->
### Topology
```mermaid
graph TD
  node_doc_packagesserversrcfeatureslivedocsevidencebridgets["evidenceBridge.ts"]
  click node_doc_packagesserversrcfeatureslivedocsevidencebridgets "../../source/packages/server/src/features/live-docs/evidenceBridge.ts.mdmd.md" "evidenceBridge.ts"
  node_doc_packagesserversrcfeatureslivedocsgenerationcorets["core.ts"]
  click node_doc_packagesserversrcfeatureslivedocsgenerationcorets "../../source/packages/server/src/features/live-docs/generation/core.ts.mdmd.md" "core.ts"
  node_doc_packagesserversrcfeatureslivedocsgeneratorts["live-docs/generator.ts"]
  click node_doc_packagesserversrcfeatureslivedocsgeneratorts "../../source/packages/server/src/features/live-docs/generator.ts.mdmd.md" "live-docs/generator.ts"
  node_doc_packagesserversrcfeatureslivedocssystemgeneratorts["system/generator.ts"]
  click node_doc_packagesserversrcfeatureslivedocssystemgeneratorts "../../source/packages/server/src/features/live-docs/system/generator.ts.mdmd.md" "system/generator.ts"
  node_doc_packagesserversrcfeatureslivedocsgeneratorts --> node_doc_packagesserversrcfeatureslivedocsevidencebridgets
  node_doc_packagesserversrcfeatureslivedocsgeneratorts --> node_doc_packagesserversrcfeatureslivedocsgenerationcorets
  node_doc_packagesserversrcfeatureslivedocssystemgeneratorts --> node_doc_packagesserversrcfeatureslivedocsgenerationcorets
  class node_doc_packagesserversrcfeatureslivedocsevidencebridgets implementation
  class node_doc_packagesserversrcfeatureslivedocsgenerationcorets implementation
  class node_doc_packagesserversrcfeatureslivedocsgeneratorts implementation
  class node_doc_packagesserversrcfeatureslivedocssystemgeneratorts implementation
  %% class definitions
  classDef implementation fill:#2563eb,stroke:#0f172a,color:#ffffff
```
<!-- LIVE-DOC:END Topology -->
