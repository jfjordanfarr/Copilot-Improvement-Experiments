# Feed Format Detector

## Metadata
- Layer: 4
- Implementation ID: IMP-206
- Code Path: [`packages/server/src/features/knowledge/feedFormatDetector.ts`](../../../packages/server/src/features/knowledge/feedFormatDetector.ts)
- Exports: detectFormat, parseFeedFile, FeedFormat, FormatDetectionResult, ParseFeedFileOptions

## Purpose
Classify knowledge feed payloads (LSIF, SCIP, external snapshots) and normalise them into `ExternalSnapshot` structures so the ingestion pipeline accepts heterogeneous sources without bespoke plumbing.

## Public Symbols

### detectFormat
Lightweight structural probe that inspects raw file content to determine LSIF, SCIP, or external snapshot formats and returns a confidence score so callers can decide whether automatic parsing is safe.

### parseFeedFile
End-to-end parser that reads a feed file, runs `detectFormat`, and dispatches to LSIF or SCIP parsers (or returns the original snapshot) to produce a normalised `ExternalSnapshot` for ingestion.

### FeedFormat
Union of supported feed formats (`lsif`, `scip`, `external-snapshot`, `unknown`) used to gate downstream parser selection and diagnostics.

### FormatDetectionResult
Return type from `detectFormat`, pairing the detected `FeedFormat` with a confidence metric (0–1) consumed by ingestion decision logic.

### ParseFeedFileOptions
Parameter object accepted by `parseFeedFile`, encapsulating file path, project root, feed identifier, and optional detection confidence override.

## Responsibilities
- Quickly determine the likely format of incoming feed files without loading heavy parsers unnecessarily.
- Convert LSIF and SCIP payloads into `ExternalSnapshot` records using shared parsers.
- Surface `null` for unknown or malformed feeds so callers can degrade gracefully and emit diagnostics.
- Provide extension points for new feed formats by extending detection heuristics before the default branch.

## Collaborators
- [`packages/server/src/features/knowledge/lsifParser.ts`](../../../packages/server/src/features/knowledge/lsifParser.ts) converts newline-delimited LSIF JSON into graph snapshots.
- [`packages/server/src/features/knowledge/scipParser.ts`](../../../packages/server/src/features/knowledge/scipParser.ts) normalises SCIP indexes into snapshot form.
- [`packages/server/src/features/knowledge/knowledgeFeedManager.ts`](../../../packages/server/src/features/knowledge/knowledgeFeedManager.ts) invokes the detector during feed bootstrap and retries.

## Linked Components
- [COMP-005 – Knowledge Graph Ingestion](../../layer-3/knowledge-graph-ingestion.mdmd.md#imp206-feedformatdetector)

## Evidence
- Unit tests: [`packages/server/src/features/knowledge/feedFormatDetector.test.ts`](../../../packages/server/src/features/knowledge/feedFormatDetector.test.ts) validate detection heuristics and parsing dispatch.
- Integration coverage: feed bootstrap flows exercised in US5 ingestion suites rely on this detector to parse LSIF fixtures.
- Manual verification: running `npm run graph:snapshot` on workspaces with LSIF/SCIP fixtures confirms format detection emits snapshots without errors.

## Operational Notes
- Detection prioritises external snapshots before SCIP to avoid misclassifying JSON snapshots that also contain `documents` arrays.
- Confidence defaults (0.95) align with knowledge-feed tolerances; override in options when experimenting with new formats.
- Parser errors are logged to stderr but suppressed from bubbling to callers, enabling retry/backoff without crashing ingest loops.
