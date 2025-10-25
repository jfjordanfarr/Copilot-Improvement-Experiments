# FeedFormatDetector (Layer 4)

## Source Mapping
- Implementation: [`packages/server/src/features/knowledge/feedFormatDetector.ts`](../../../packages/server/src/features/knowledge/feedFormatDetector.ts)
- Tests: [`packages/server/src/features/knowledge/feedFormatDetector.test.ts`](../../../packages/server/src/features/knowledge/feedFormatDetector.test.ts)
- Parent design: [Knowledge Graph Ingestion Architecture](../knowledge-graph-ingestion.mdmd.md)
- Related runtime: [KnowledgeFeedManager](./knowledgeFeedManager.mdmd.md)
- Spec references: [FR-014](../../../specs/001-link-aware-diagnostics/spec.md#functional-requirements), [T036](../../../specs/001-link-aware-diagnostics/tasks.md)

## Responsibility
Normalize heterogeneous knowledge feed payloads into the internal `ExternalSnapshot` shape. Detects whether incoming files are newline-delimited LSIF, SCIP indexes, or already-conforming external snapshots, enabling downstream ingestion to treat all feeds uniformly.

## Key Concepts
- **FeedFormat**: Categorizes payloads as `lsif`, `scip`, `external-snapshot`, or `unknown` alongside a confidence score.
- **Detection heuristics**: Lightweight structural checks on raw content (newline JSON for LSIF, strongly typed arrays for snapshots, metadata/documents block for SCIP) to avoid full parsing when possible.
- **Parser adapters**: Bridges to `parseLSIF` and `parseSCIP`, which convert format-specific structures into `ExternalSnapshot` instances.

## Public API
- `detectFormat(content: string): FormatDetectionResult`
- `parseFeedFile(options: ParseFeedFileOptions): Promise<ExternalSnapshot | null>`

## Internal Flow
1. Read feed file contents via `node:fs/promises`.
2. Run `detectFormat` to classify the payload using JSON probes and schema guards.
3. Dispatch to the appropriate parser: LSIF parser for newline JSON, SCIP parser for indexed protobuf JSON, or direct `ExternalSnapshot` hydration when the payload already matches the contract.
4. Return a normalized `ExternalSnapshot`, or `null` when the format is unknown or parsing fails.

## Error Handling
- JSON parse failures or format mismatches fall back to `{ format: "unknown", confidence: 0 }` to prevent throwing in the detection path.
- Any exception during file IO or parsing is caught; the function logs a structured error and returns `null`, allowing the caller to emit diagnostics without crashing the ingestion pipeline.

## Observability Hooks
- Structured error logging identifies the feed file path and surfaced error message when parsing cannot complete. Success paths remain quiet to avoid noisy telemetry.

## Integration Notes
- `KnowledgeFeedManager` invokes `parseFeedFile` while bootstrapping snapshots and during backoff retries, routing failures through `FeedDiagnosticsGateway`.
- Detection heuristics can be extended to future formats (e.g., SARIF, CodeGraph) by adding discriminators prior to the default branch without affecting existing callers.
- Confidence thresholds are fed by upstream configuration; default of `0.95` ensures downstream components only trust parsers when the detector has high certainty.
