// Live Documentation: .live-documentation/source/packages/shared/src/live-docs/schema.mdmd.md

import type { LiveDocumentationArchetype } from "../config/liveDocumentationConfig";

export type LiveDocLayer = 1 | 2 | 3 | 4;

export interface LiveDocDocstringProvenance {
  status: "in-sync" | "drifted" | "waived";
  lastComparedAt?: string;
  waivedReason?: string;
}

export interface LiveDocGeneratorProvenance {
  tool: string;
  version?: string;
  generatedAt: string;
  benchmarkHash?: string;
  inputHash?: string;
}

export interface LiveDocProvenance {
  generators: LiveDocGeneratorProvenance[];
  docstrings?: LiveDocDocstringProvenance;
}

export interface LiveDocMetadata {
  layer: LiveDocLayer;
  archetype?: LiveDocumentationArchetype;
  /** Workspace-relative path to the source asset represented by this Live Doc. */
  sourcePath: string;
  /** Stable identifier for audits and cross-references. */
  liveDocId: string;
  /** ISO timestamp describing when generated sections were last refreshed. */
  generatedAt?: string;
  /** Optional provenance payload emitted by generators and bridges. */
  provenance?: LiveDocProvenance;
  /** Arbitrary metadata produced by enrichers (e.g., churn metrics, reference counts). */
  enrichers?: Record<string, unknown>;
}

export type LiveDocMetadataInput = Partial<LiveDocMetadata> & {
  sourcePath: string;
  liveDocId: string;
};

export const DEFAULT_LIVE_DOC_LAYER: LiveDocLayer = 4;

export function normalizeLiveDocMetadata(input: LiveDocMetadataInput): LiveDocMetadata {
  const layer = input.layer ?? DEFAULT_LIVE_DOC_LAYER;
  return {
    layer,
    archetype: input.archetype,
    sourcePath: normalizePath(input.sourcePath),
    liveDocId: input.liveDocId.trim(),
    generatedAt: normalizeOptionalString(input.generatedAt),
    provenance: normalizeProvenance(input.provenance),
    enrichers: input.enrichers
  };
}

function normalizeProvenance(provenance?: LiveDocProvenance): LiveDocProvenance | undefined {
  if (!provenance) {
    return undefined;
  }

  const generators = Array.isArray(provenance.generators)
    ? provenance.generators
        .map((entry) => normalizeGenerator(entry))
        .filter((entry): entry is LiveDocGeneratorProvenance => !!entry)
    : [];

  const docstrings = provenance.docstrings
    ? {
        status: provenance.docstrings.status,
        lastComparedAt: normalizeOptionalString(provenance.docstrings.lastComparedAt),
        waivedReason: normalizeOptionalString(provenance.docstrings.waivedReason)
      }
    : undefined;

  if (!generators.length && !docstrings) {
    return undefined;
  }

  return {
    generators,
    docstrings
  };
}

function normalizeGenerator(
  entry: LiveDocGeneratorProvenance | undefined
): LiveDocGeneratorProvenance | undefined {
  if (!entry?.tool?.trim()) {
    return undefined;
  }

  const generatedAt = normalizeOptionalString(entry.generatedAt);
  if (!generatedAt) {
    return undefined;
  }

  return {
    tool: entry.tool.trim(),
    version: normalizeOptionalString(entry.version),
    generatedAt,
    benchmarkHash: normalizeOptionalString(entry.benchmarkHash),
    inputHash: normalizeOptionalString(entry.inputHash)
  };
}

function normalizePath(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) {
    throw new Error("Live Doc metadata requires a non-empty sourcePath");
  }
  return trimmed.replace(/\\/g, "/");
}

function normalizeOptionalString(value: string | undefined): string | undefined {
  const trimmed = value?.trim();
  return trimmed && trimmed.length > 0 ? trimmed : undefined;
}
