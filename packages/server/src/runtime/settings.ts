import { ExtensionSettings } from "../features/settings/providerGuard";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isLlmProviderMode(
  value: unknown
): value is NonNullable<ExtensionSettings["llmProviderMode"]> {
  return value === "prompt" || value === "local-only" || value === "disabled";
}

function isNoiseSuppressionLevel(value: unknown): value is "low" | "medium" | "high" {
  return value === "low" || value === "medium" || value === "high";
}

export function extractExtensionSettings(source: unknown): ExtensionSettings | undefined {
  if (!isRecord(source)) {
    return undefined;
  }

  const sourceRecord = source;

  const base =
    "settings" in sourceRecord && isRecord(sourceRecord.settings)
      ? sourceRecord.settings
      : sourceRecord;

  if (!isRecord(base)) {
    return undefined;
  }

  const container =
    "linkAwareDiagnostics" in base && isRecord(base.linkAwareDiagnostics)
      ? base.linkAwareDiagnostics
      : base;

  if (!isRecord(container)) {
    return undefined;
  }

  const record = container;
  const settings: ExtensionSettings = {};

  if (typeof record.storagePath === "string") {
    settings.storagePath = record.storagePath;
  }

  if (typeof record.enableDiagnostics === "boolean") {
    settings.enableDiagnostics = record.enableDiagnostics;
  }

  if (typeof record.debounceMs === "number") {
    settings.debounceMs = record.debounceMs;
  }

  if (isLlmProviderMode(record.llmProviderMode)) {
    settings.llmProviderMode = record.llmProviderMode;
  }

  if (isRecord(record.noiseSuppression) && isNoiseSuppressionLevel(record.noiseSuppression.level)) {
    settings.noiseSuppression = { level: record.noiseSuppression.level };
  }

  return settings;
}

export function extractTestModeOverrides(source: unknown): ExtensionSettings | undefined {
  if (!isRecord(source)) {
    return undefined;
  }

  const candidate = "testModeOverrides" in source ? source.testModeOverrides : undefined;
  if (!isRecord(candidate)) {
    return undefined;
  }

  const overrides: ExtensionSettings = {};

  if (typeof candidate.enableDiagnostics === "boolean") {
    overrides.enableDiagnostics = candidate.enableDiagnostics;
  }

  if (isLlmProviderMode(candidate.llmProviderMode)) {
    overrides.llmProviderMode = candidate.llmProviderMode;
  }

  return overrides;
}

export function mergeExtensionSettings(
  base: ExtensionSettings | undefined,
  overrides: ExtensionSettings | undefined
): ExtensionSettings {
  return { ...(base ?? {}), ...(overrides ?? {}) };
}
