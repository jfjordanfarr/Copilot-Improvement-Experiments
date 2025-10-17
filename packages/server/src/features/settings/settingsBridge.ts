import { ExtensionSettings } from "./providerGuard";

export type NoiseSuppressionLevel = "low" | "medium" | "high";

export interface NoiseSuppressionRuntime {
  level: NoiseSuppressionLevel;
  maxDiagnosticsPerBatch: number;
  hysteresisMs: number;
}

export interface RuntimeSettings {
  debounceMs: number;
  noiseSuppression: NoiseSuppressionRuntime;
}

export const DEFAULT_RUNTIME_SETTINGS: RuntimeSettings = {
  debounceMs: 1000,
  noiseSuppression: {
    level: "medium",
    maxDiagnosticsPerBatch: 20,
    hysteresisMs: 1500
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

  return {
    debounceMs: debounceOverride,
    noiseSuppression: {
      level,
      maxDiagnosticsPerBatch: preset.maxDiagnosticsPerBatch,
      hysteresisMs: preset.hysteresisMs
    }
  };
}
