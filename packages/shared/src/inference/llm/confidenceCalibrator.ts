import type { RawRelationshipCandidate } from "./relationshipExtractor";

export type ConfidenceTier = "high" | "medium" | "low";

export interface CalibratedRelationship extends RawRelationshipCandidate {
  confidenceTier: ConfidenceTier;
  calibratedConfidence: number;
  diagnosticsEligible: boolean;
  shadowed: boolean;
  promotionCriteria?: string[];
  rawConfidenceLabel?: string;
}

export interface CalibrationContext {
  corroboratedLinks?: Set<string>;
  existingLinks?: Set<string>;
  promoteShadowed?: boolean;
  thresholds?: {
    high: number;
    medium: number;
  };
}

const DEFAULT_THRESHOLDS = {
  high: 0.8,
  medium: 0.5
};

const LABEL_TO_CONFIDENCE: Record<ConfidenceTier, number> = {
  high: 0.9,
  medium: 0.6,
  low: 0.3
};

export function calibrateConfidence(
  candidates: RawRelationshipCandidate[],
  context: CalibrationContext = {}
): CalibratedRelationship[] {
  const thresholds = context.thresholds ?? DEFAULT_THRESHOLDS;
  const corroborated = context.corroboratedLinks ?? new Set<string>();
  const existing = context.existingLinks ?? new Set<string>();

  return candidates.map(candidate => {
    const { tier, confidence } = pickTier(candidate, thresholds);
    const linkKey = createLinkKey(candidate);
    const isCorroborated = corroborated.has(linkKey) || existing.has(linkKey);

    const diagnosticsEligible = tier === "high" || (tier === "medium" && isCorroborated);

    const shadowed = existing.has(linkKey) && tier !== "high" && !context.promoteShadowed;

    const promotionCriteria: string[] = [];
    if (!diagnosticsEligible) {
      promotionCriteria.push("requires corroboration");
    }

    return {
      ...candidate,
      confidenceTier: tier,
      calibratedConfidence: confidence,
      diagnosticsEligible,
      shadowed,
      promotionCriteria: promotionCriteria.length > 0 ? promotionCriteria : undefined,
      rawConfidenceLabel: candidate.confidenceLabel
    } satisfies CalibratedRelationship;
  });
}

function pickTier(
  candidate: RawRelationshipCandidate,
  thresholds: { high: number; medium: number }
): { tier: ConfidenceTier; confidence: number } {
  const label = normalizeLabel(candidate.confidenceLabel);
  if (label) {
    return {
      tier: label,
      confidence: LABEL_TO_CONFIDENCE[label]
    } satisfies { tier: ConfidenceTier; confidence: number };
  }

  const rawConfidence = typeof candidate.confidence === "number" ? candidate.confidence : LABEL_TO_CONFIDENCE.low;
  const candidateConfidence = Math.max(0, Math.min(1, rawConfidence));

  if (candidateConfidence >= thresholds.high) {
    return { tier: "high", confidence: candidateConfidence };
  }

  if (candidateConfidence >= thresholds.medium) {
    return { tier: "medium", confidence: candidateConfidence };
  }

  return { tier: "low", confidence: candidateConfidence };
}

function normalizeLabel(label: string | undefined): ConfidenceTier | undefined {
  if (!label) {
    return undefined;
  }

  const normalized = label.trim().toLowerCase();
  if (normalized === "high" || normalized === "medium" || normalized === "low") {
    return normalized;
  }

  return undefined;
}

function createLinkKey(candidate: RawRelationshipCandidate): string {
  return `${candidate.sourceId}::${candidate.targetId}::${candidate.relationship}`;
}
