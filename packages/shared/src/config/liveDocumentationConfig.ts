// Live Documentation: .live-documentation/source/packages/shared/src/config/liveDocumentationConfig.md

export type LiveDocumentationSlugDialect = "github" | "azure-devops" | "gitlab";

export type LiveDocumentationArchetype =
  | "implementation"
  | "test"
  | "asset"
  | "stub"
  | "component"
  | "interaction"
  | "data-model"
  | "workflow"
  | "integration"
  | "testing";

export type LiveDocumentationEvidenceStrictMode = "off" | "warning" | "error";

export interface LiveDocumentationEvidenceConfig {
  strict: LiveDocumentationEvidenceStrictMode;
}

export interface LiveDocumentationConfig {
  /** Filesystem root where staged Live Docs are written. */
  root: string;
  /** Mirror folder inside the root that represents the base layer (Layer-4 by default). */
  baseLayer: string;
  /** Glob patterns that select source artefacts which should receive Live Docs. */
  glob: string[];
  /** Optional overrides that assign archetypes to matching paths. */
  archetypeOverrides: Record<string, LiveDocumentationArchetype>;
  /** Enforce workspace-relative markdown links for wiki portability. */
  requireRelativeLinks: boolean;
  /** Header-slug dialect used when generating anchors. */
  slugDialect: LiveDocumentationSlugDialect;
  /** Toggle for docstring bridge reconciliation once adapters are configured. */
  enableDocstringBridge: boolean;
  /** Evidence configuration controlling lint severity when evidence is missing. */
  evidence: LiveDocumentationEvidenceConfig;
}

export type LiveDocumentationConfigInput = Partial<LiveDocumentationConfig> & {
  evidence?: Partial<LiveDocumentationEvidenceConfig>;
};

export const LIVE_DOCUMENTATION_DEFAULT_ROOT = ".live-documentation";
export const LIVE_DOCUMENTATION_DEFAULT_BASE_LAYER = "source";
export const LIVE_DOCUMENTATION_FILE_EXTENSION = ".md";
export const LIVE_DOCUMENTATION_DEFAULT_GLOBS = [
  "packages/**/src/**/*.ts",
  "packages/**/src/**/*.tsx",
  "packages/**/src/**/*.js",
  "packages/**/src/**/*.jsx",
  "packages/**/src/**/*.mjs",
  "packages/**/src/**/*.cjs",
  "packages/**/src/**/*.mts",
  "packages/**/src/**/*.cts",
  "scripts/**/*.ts",
  "scripts/**/*.tsx",
  "scripts/**/*.mjs",
  "scripts/**/*.cjs",
  "tests/**/*.ts"
];

export const DEFAULT_LIVE_DOCUMENTATION_CONFIG: LiveDocumentationConfig = {
  root: LIVE_DOCUMENTATION_DEFAULT_ROOT,
  baseLayer: LIVE_DOCUMENTATION_DEFAULT_BASE_LAYER,
  glob: [...LIVE_DOCUMENTATION_DEFAULT_GLOBS],
  archetypeOverrides: {},
  requireRelativeLinks: true,
  slugDialect: "github",
  enableDocstringBridge: false,
  evidence: {
    strict: "warning"
  }
};

export function normalizeLiveDocumentationConfig(
  input?: LiveDocumentationConfigInput
): LiveDocumentationConfig {
  const inputGlobs = Array.isArray(input?.glob) ? input?.glob : undefined;
  const glob = inputGlobs && inputGlobs.length
    ? dedupeStrings(inputGlobs)
    : [...DEFAULT_LIVE_DOCUMENTATION_CONFIG.glob];

  const archetypeOverrides = input?.archetypeOverrides
    ? { ...input.archetypeOverrides }
    : {};

  const evidence: LiveDocumentationEvidenceConfig = {
    strict: input?.evidence?.strict ?? DEFAULT_LIVE_DOCUMENTATION_CONFIG.evidence.strict
  };

  return {
    root: normalizeStringOption(input?.root, DEFAULT_LIVE_DOCUMENTATION_CONFIG.root),
    baseLayer: normalizeStringOption(
      input?.baseLayer,
      DEFAULT_LIVE_DOCUMENTATION_CONFIG.baseLayer
    ),
    glob,
    archetypeOverrides,
    requireRelativeLinks:
      input?.requireRelativeLinks ?? DEFAULT_LIVE_DOCUMENTATION_CONFIG.requireRelativeLinks,
    slugDialect: input?.slugDialect ?? DEFAULT_LIVE_DOCUMENTATION_CONFIG.slugDialect,
    enableDocstringBridge:
      input?.enableDocstringBridge ?? DEFAULT_LIVE_DOCUMENTATION_CONFIG.enableDocstringBridge,
    evidence
  };
}

function normalizeStringOption(value: string | undefined, fallback: string): string {
  const normalized = value?.trim();
  return normalized && normalized.length > 0 ? normalized : fallback;
}

function dedupeStrings(source: string[]): string[] {
  const seen = new Set<string>();
  for (const value of source) {
    const normalized = value.trim();
    if (!normalized) {
      continue;
    }
    seen.add(normalized);
  }
  return Array.from(seen);
}
