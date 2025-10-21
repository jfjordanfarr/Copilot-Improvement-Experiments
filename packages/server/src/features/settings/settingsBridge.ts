import type { LinkRelationshipKind } from "@copilot-improvement/shared";

import { ExtensionSettings } from "./providerGuard";

export type NoiseSuppressionLevel = "low" | "medium" | "high";

export interface NoiseSuppressionRuntime {
  level: NoiseSuppressionLevel;
  maxDiagnosticsPerBatch: number;
  hysteresisMs: number;
}

export interface RippleRuntimeSettings {
  maxDepth: number;
  maxResults: number;
  allowedKinds: LinkRelationshipKind[];
  documentKinds: LinkRelationshipKind[];
  codeKinds: LinkRelationshipKind[];
}

export interface RuntimeSettings {
  debounceMs: number;
  noiseSuppression: NoiseSuppressionRuntime;
  ripple: RippleRuntimeSettings;
}

export const DEFAULT_RUNTIME_SETTINGS: RuntimeSettings = {
  debounceMs: 1000,
  noiseSuppression: {
    level: "medium",
    maxDiagnosticsPerBatch: 20,
    hysteresisMs: 1500
  },
  ripple: {
    maxDepth: 3,
    maxResults: 50,
    allowedKinds: ["depends_on", "implements", "documents", "references"],
    documentKinds: ["documents"],
    codeKinds: ["depends_on", "implements", "references"]
  }
};

const NOISE_PRESETS: Record<NoiseSuppressionLevel, Omit<NoiseSuppressionRuntime, "level">> = {
  low: {
    maxDiagnosticsPerBatch: 50,
    hysteresisMs: 750
  },
  medium: {
    maxDiagnosticsPerBatch: 20,
    hysteresisMs: 1500
  },
  high: {
    maxDiagnosticsPerBatch: 10,
    hysteresisMs: 2500
  }
};

const LINK_KIND_VALUES = new Set<LinkRelationshipKind>([
  "depends_on",
  "implements",
  "documents",
  "references"
]);

function normaliseLinkKinds(
  input: LinkRelationshipKind[] | undefined,
  fallback: LinkRelationshipKind[]
): LinkRelationshipKind[] {
  if (!input?.length) {
    return fallback;
  }

  const filtered = input.filter(kind => LINK_KIND_VALUES.has(kind));
  return filtered.length > 0 ? Array.from(new Set(filtered)) : fallback;
}

// Normalise extension configuration into concrete runtime settings used by the server.
export function deriveRuntimeSettings(settings?: ExtensionSettings): RuntimeSettings {
  const debounceOverride =
    typeof settings?.debounceMs === "number" && settings.debounceMs >= 0
      ? settings.debounceMs
      : DEFAULT_RUNTIME_SETTINGS.debounceMs;

  const levelCandidate = settings?.noiseSuppression?.level;
  const level: NoiseSuppressionLevel =
    levelCandidate === "low" || levelCandidate === "medium" || levelCandidate === "high"
      ? levelCandidate
      : DEFAULT_RUNTIME_SETTINGS.noiseSuppression.level;

  const preset = NOISE_PRESETS[level];

  const rippleSettings = settings?.ripple;
  const maxDepth =
    typeof rippleSettings?.maxDepth === "number" && rippleSettings.maxDepth > 0
      ? Math.floor(rippleSettings.maxDepth)
      : DEFAULT_RUNTIME_SETTINGS.ripple.maxDepth;
  const maxResults =
    typeof rippleSettings?.maxResults === "number" && rippleSettings.maxResults > 0
      ? Math.floor(rippleSettings.maxResults)
      : DEFAULT_RUNTIME_SETTINGS.ripple.maxResults;

  const allowedKinds = normaliseLinkKinds(
    rippleSettings?.allowedKinds,
    DEFAULT_RUNTIME_SETTINGS.ripple.allowedKinds
  );
  const filterByAllowed = (kinds: LinkRelationshipKind[]): LinkRelationshipKind[] =>
    kinds.filter(kind => allowedKinds.includes(kind));

  const documentKindsCandidate = filterByAllowed(
    normaliseLinkKinds(
      rippleSettings?.documentKinds,
      DEFAULT_RUNTIME_SETTINGS.ripple.documentKinds
    )
  );
  const documentKinds =
    documentKindsCandidate.length > 0
      ? documentKindsCandidate
      : filterByAllowed(DEFAULT_RUNTIME_SETTINGS.ripple.documentKinds);

  const codeKindsCandidate = filterByAllowed(
    normaliseLinkKinds(rippleSettings?.codeKinds, DEFAULT_RUNTIME_SETTINGS.ripple.codeKinds)
  );
  const codeKinds =
    codeKindsCandidate.length > 0
      ? codeKindsCandidate
      : filterByAllowed(DEFAULT_RUNTIME_SETTINGS.ripple.codeKinds);

  return {
    debounceMs: debounceOverride,
    noiseSuppression: {
      level,
      maxDiagnosticsPerBatch: preset.maxDiagnosticsPerBatch,
      hysteresisMs: preset.hysteresisMs
    },
    ripple: {
      maxDepth,
      maxResults,
      allowedKinds,
      documentKinds,
      codeKinds
    }
  };
}
