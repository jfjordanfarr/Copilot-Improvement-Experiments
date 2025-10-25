# Knowledge Graph Schema

The link-aware diagnostics prototype relies on a lightweight knowledge graph that can be populated by multiple providers (LLM, heuristics, import hooks, external tools). This document snapshots the agreed upon schema so every ingest path produces a consistent, mergeable payload.

## Artifact

| Field | Type | Notes |
| --- | --- | --- |
| `id` | string | Stable identifier for the artifact. Providers should prefer deterministic IDs (URI hash, database primary key) to limit churn. |
| `uri` | string | Canonical URI or file path. `file://` URIs are preferred for workspace files; absolute paths are acceptable when URIs are unavailable. |
| `layer` | `vision | requirements | architecture | implementation | code` | Declares which stage of the delivery stack the artifact belongs to. Used to choose link semantics. |
| `language` | string? | Programming or prose language hint (`typescript`, `markdown`, etc.). Optional. |
| `owner` | string? | Author or owning team, when known. Optional. |
| `lastSynchronizedAt` | ISO string? | Timestamp of the last known sync. Optional; providers may omit when unknown. |
| `hash` | string? | Content fingerprint to help detect drift. Optional. |
| `metadata` | object? | Arbitrary provider-specific metadata; must be JSON serialisable. Optional. |

## Link Relationship

| Field | Type | Notes |
| --- | --- | --- |
| `id` | string | Unique per `(sourceId, targetId, kind)` tuple. Deterministic IDs make merges easier. |
| `sourceId` | string | Artifact identifier for the edge source. |
| `targetId` | string | Artifact identifier for the edge destination. |
| `kind` | `documents | implements | depends_on | references` | Encodes the semantic of the relationship. Providers should pick the closest match from this closed set. |
| `confidence` | number | Floating-point value between `0` and `1`. `1` means authoritative; values below `0.5` are treated as informational. |
| `createdAt` | ISO string | Timestamp describing when the edge was created. |
| `createdBy` | string | Attribution for the producing system (`fallback-heuristic`, `test-llm`, etc.). |

### Link semantics cheat sheet

- `documents`: Higher-level guidance (vision/requirements) that covers an implementation detail.
- `implements`: Implementation artifact that realises an architectural element, or the reverse edge from architecture to implementation.
- `depends_on`: Code-level dependency: imports, requires, or runtime references.
- `references`: Catch-all for mention-level links when none of the above apply.

## Snapshot payload

External providers can ship a complete snapshot using the following envelope:

```jsonc
{
  "id": "optional-snapshot-id",
  "label": "Descriptive label",
  "createdAt": "2025-10-17T12:34:56.000Z",
  "artifacts": [ /* ...ExternalArtifact */ ],
  "links": [ /* ...ExternalLink */ ],
  "metadata": { /* optional */ }
}
```

### Supported Feed Formats

The knowledge graph ingestion pipeline supports multiple input formats through automatic format detection:

1. **Native ExternalSnapshot** (JSON): The canonical format described above
2. **LSIF** (Language Server Index Format): Newline-delimited JSON dumps from LSP-based indexers
   - Auto-detected via `type`/`label`/`id` fields in first line
   - Documents become `code`-layer artifacts
   - Definition/reference edges become `references`-kind links
3. **SCIP** (SCIP Code Intelligence Protocol): JSON indexes from Sourcegraph tooling
   - Auto-detected via `metadata.version` + `documents` array
   - Symbol occurrences with definition role become artifact anchors
   - Cross-document references become `references`-kind links (write access → `depends_on`)

Place feeds as `.json` files in `data/knowledge-feeds/` and the system will auto-detect and parse them during startup. See `packages/server/src/features/knowledge/feedFormatDetector.ts` for detection logic.

Snapshots should be self-consistent: every link references artifacts that exist in the same payload. Providers may omit `id` and `createdAt`; the bridge will inject defaults.

## Stream events

Incremental updates use the `ExternalStreamEvent` contract:

```jsonc
{
  "kind": "artifact-upsert | artifact-remove | link-upsert | link-remove",
  "sequenceId": "monotonic-identifier",
  "detectedAt": "ISO timestamp",
  "artifact": { /* ExternalArtifact */ },
  "artifactId": "id used when removing artifacts by identifier",
  "link": { /* ExternalLink */ },
  "linkId": "id used when removing links by identifier",
  "metadata": { /* optional */ }
}
```

Events must be strictly ordered per provider and every payload must include either the inline entity (`artifact`/`link`) or the identifier (`artifactId`/`linkId`) as dictated by the event kind.

## Confidence and provenance guidelines

- Confidence values are clamped to `[0, 1]`. Use `0.9+` for human-curated facts, `0.6-0.8` for strong heuristics, and `<= 0.55` for weak inferences.
- Always include a `createdBy` label so downstream diagnostics can attribute recommendations.
- Providers should supply rationales when possible. While the core schema does not store free-form rationales, they can be conveyed via `metadata` or auxiliary trace collections.

## Fallback inference expectations

The fallback inference pipeline (T054) runs when rich language server signals are unavailable. It must:

- Normalise artifacts to deterministic IDs using URI hashes when IDs are missing.
- Inspect document layers (vision/requirements/architecture) for markdown-style links, wiki links, and `@link` directives.
- Inspect implementation or code layers for `import` / `require` statements and convert them into `depends_on` edges.
- Produce `documents` links from higher- to lower-layer references, `implements` between architecture and implementation/code, and fallback to `references` otherwise.
- Deduplicate edges by keeping the highest-confidence evidence per `(sourceId, targetId, kind)` tuple while recording trace metadata for diagnostics.
- Support optional LLM enrichers that can propose additional links. LLM suggestions retain their own `createdBy` label but share the same edge schema.

Future providers must adhere to this schema so the `KnowledgeGraphBridge` can merge incoming data without additional migration code.

## Implementation Traceability
- [`packages/server/src/features/knowledge/feedFormatDetector.ts`](../../packages/server/src/features/knowledge/feedFormatDetector.ts) implements the feed detection behaviours described above.
- [`packages/server/src/features/knowledge/knowledgeGraphIngestor.ts`](../../packages/server/src/features/knowledge/knowledgeGraphIngestor.ts) validates and persists the `ExternalSnapshot` payloads.
- [`packages/shared/src/knowledge/knowledgeGraphBridge.ts`](../../packages/shared/src/knowledge/knowledgeGraphBridge.ts) exposes the typed contracts to both extension and server clients.
- [`tests/integration/us5/transformRipple.test.ts`](../../tests/integration/us5/transformRipple.test.ts) and [`tests/integration/us3/markdownLinkDrift.test.ts`](../../tests/integration/us3/markdownLinkDrift.test.ts) confirm schema compatibility across fallback and knowledge-feed pipelines.
