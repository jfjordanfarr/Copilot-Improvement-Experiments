# RelationshipTemplate (Layer 4)

## Source Mapping
- Implementation: [`packages/server/src/prompts/llm-ingestion/relationshipTemplate.ts`](../../../packages/server/src/prompts/llm-ingestion/relationshipTemplate.ts)
- Parent design: [LLM Ingestion Pipeline](../../layer-3/llm-ingestion-pipeline.mdmd.md)
- Spec references: [FR-019](../../../specs/001-link-aware-diagnostics/spec.md#functional-requirements), [T070](../../../specs/001-link-aware-diagnostics/tasks.md)

## Exported Symbols

#### ConfidenceLabel
`ConfidenceLabel` defines the coarse confidence tiers (`"high"`, `"medium"`, `"low"`) that calibrated responses return in the JSON schema.

#### PromptArtifactSummary
`PromptArtifactSummary` captures root and neighbouring artifact metadata (id, uri, layer, optional title/description) injected into prompts.

#### PromptChunkSummary
`PromptChunkSummary` records chunk ranges, hashes, text, and optional summaries for context windows passed to the LLM.

#### RelationshipPromptOptions
`RelationshipPromptOptions` collects all rendering inputs—root artifact, known artifacts, chunks, allowed relationship kinds, version overrides, and timestamp factory.

#### RenderedRelationshipPrompt
`RenderedRelationshipPrompt` is the output structure containing the prompt text, template identifiers, prompt hash, and issuance timestamp.

#### renderRelationshipExtractionPrompt
`renderRelationshipExtractionPrompt` composes the markdown instructions, injects artifacts/chunks, and returns a `RenderedRelationshipPrompt` with a deterministic hash.

#### RELATIONSHIP_RESPONSE_SCHEMA
`RELATIONSHIP_RESPONSE_SCHEMA` exposes the JSON schema used to validate LLM responses before ingesting relationships.

## Responsibility
Generate deterministic prompt text and validation schema for the LLM ingestion pipeline. Ensures ingestion requests share the same structure, makes templates versionable, and records hashes for provenance.

## Prompt Structure
1. **Task framing** – instructs the model to emit JSON relationships using allowed kinds only.
2. **Root artifact section** – lists id/uri/layer plus optional title and description.
3. **Known artifacts** – enumerates additional artifacts for grounding when available.
4. **Allowed relationship kinds** – spells out the acceptable values, matching `LinkRelationshipKind`.
5. **Artifact chunks** – embeds chunk metadata and text fences to anchor rationales.
6. **Output schema** – inline JSON schema reminder ensuring responses can be parsed deterministically.

## Observability
- Prompt hash (`promptHash`) is computed with SHA-256 (truncated) to detect drift when template text changes.
- Template ID/version constants enable back-compat when future revisions modify instructions.

## Follow-ups
- Expand schema with rationale token limits once telemetry reveals common failure cases.
- Add localization hooks if prompts need to adapt to non-English source content.
