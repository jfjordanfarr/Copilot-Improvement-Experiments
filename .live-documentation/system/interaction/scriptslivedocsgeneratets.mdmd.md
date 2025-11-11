# INT-scriptslivedocsgeneratets – Generate.ts Interaction

## Metadata
- Layer: 3
- Archetype: interaction
- Live Doc ID: INT-scriptslivedocsgeneratets
- Generated At: 2025-11-11T03:49:33.717Z

## Authored
### Purpose
_Pending authored purpose_

### Notes
_Pending notes_

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-system-generator","version":"0.1.0","generatedAt":"2025-11-11T03:49:33.717Z"}]} -->
<!-- LIVE-DOC:BEGIN Components -->
### Components
- [packages/server/src/features/live-docs/generator.ts](../../source/packages/server/src/features/live-docs/generator.ts.mdmd.md)
- [packages/server/src/features/live-docs/system/generator.ts](../../source/packages/server/src/features/live-docs/system/generator.ts.mdmd.md)
- [scripts/live-docs/build-target-manifest.ts](../../source/scripts/live-docs/build-target-manifest.ts.mdmd.md)
- [scripts/live-docs/generate.ts](../../source/scripts/live-docs/generate.ts.mdmd.md)
- [scripts/live-docs/lint.ts](../../source/scripts/live-docs/lint.ts.mdmd.md)
<!-- LIVE-DOC:END Components -->

<!-- LIVE-DOC:BEGIN Topology -->
### Topology
```mermaid
graph TD
  node_doc_packagesserversrcfeatureslivedocsgeneratorts["live-docs/generator.ts"]
  click node_doc_packagesserversrcfeatureslivedocsgeneratorts "../../source/packages/server/src/features/live-docs/generator.ts.mdmd.md" "live-docs/generator.ts"
  node_doc_packagesserversrcfeatureslivedocssystemgeneratorts["system/generator.ts"]
  click node_doc_packagesserversrcfeatureslivedocssystemgeneratorts "../../source/packages/server/src/features/live-docs/system/generator.ts.mdmd.md" "system/generator.ts"
  node_doc_scriptslivedocsbuildtargetmanifestts["build-target-manifest.ts"]
  click node_doc_scriptslivedocsbuildtargetmanifestts "../../source/scripts/live-docs/build-target-manifest.ts.mdmd.md" "build-target-manifest.ts"
  node_doc_scriptslivedocsgeneratets["generate.ts"]
  click node_doc_scriptslivedocsgeneratets "../../source/scripts/live-docs/generate.ts.mdmd.md" "generate.ts"
  node_doc_scriptslivedocslintts["lint.ts"]
  click node_doc_scriptslivedocslintts "../../source/scripts/live-docs/lint.ts.mdmd.md" "lint.ts"
  node_doc_scriptslivedocsbuildtargetmanifestts --> node_doc_scriptslivedocsgeneratets
  node_doc_scriptslivedocsgeneratets --> node_doc_packagesserversrcfeatureslivedocsgeneratorts
  node_doc_scriptslivedocsgeneratets --> node_doc_packagesserversrcfeatureslivedocssystemgeneratorts
  node_doc_scriptslivedocsgeneratets --> node_doc_scriptslivedocslintts
  class node_doc_packagesserversrcfeatureslivedocsgeneratorts implementation
  class node_doc_packagesserversrcfeatureslivedocssystemgeneratorts implementation
  class node_doc_scriptslivedocsbuildtargetmanifestts implementation
  class node_doc_scriptslivedocsgeneratets implementation
  class node_doc_scriptslivedocslintts implementation
  %% class definitions
  classDef implementation fill:#2563eb,stroke:#0f172a,color:#ffffff
```
<!-- LIVE-DOC:END Topology -->
