import path from "node:path";

import type { HeuristicArtifact } from "../fallbackHeuristicTypes";
import {
  buildReferenceVariants,
  cleanupReference,
  evaluateVariantMatch,
  isExternalLink,
  toComparablePath,
} from "./shared";

export interface ReferenceResolution {
  target: HeuristicArtifact;
  confidence: number;
  rationale: string;
}

export function resolveReference(
  rawReference: string,
  source: HeuristicArtifact,
  candidates: readonly HeuristicArtifact[],
  rationale: string
): ReferenceResolution | null {
  const reference = cleanupReference(rawReference);
  if (!reference || isExternalLink(reference)) {
    return null;
  }

  const anchorStripped = reference.split("#")[0];
  const sourceDir = path.dirname(source.comparablePath);
  const variants = buildReferenceVariants(anchorStripped, sourceDir);

  let selected: ReferenceResolution | null = null;

  for (const candidate of candidates) {
    if (candidate.artifact.id === source.artifact.id) {
      continue;
    }

    for (const variant of variants) {
      const result = evaluateVariantMatch(variant, anchorStripped, candidate);
      if (!result) {
        continue;
      }

      if (!selected || result.confidence > selected.confidence) {
        selected = {
          target: candidate,
          confidence: result.confidence,
          rationale: `${rationale} → ${result.rationale}`,
        };
      }
    }
  }

  return selected;
}

export function resolveIncludeReference(
  rawReference: string,
  source: HeuristicArtifact,
  candidates: readonly HeuristicArtifact[]
): ReferenceResolution | null {
  const reference = cleanupReference(rawReference);
  if (!reference) {
    return null;
  }

  const sourceDir = path.dirname(source.comparablePath);
  const attempts: string[] = [reference];

  if (!path.isAbsolute(reference)) {
    attempts.push(path.join(sourceDir, reference));
  }

  const match = attempts
    .map((candidatePath) => toComparablePath(candidatePath))
    .map((comparable) => candidates.find((candidate) => candidate.comparablePath === comparable))
    .find((candidate): candidate is HeuristicArtifact => Boolean(candidate));

  if (!match) {
    return null;
  }

  return {
    target: match,
    confidence: 0.85,
    rationale: `#include ${reference} → relative include match`,
  };
}
