const DEFAULT_OLLAMA_ENDPOINT = "http://localhost:11434";

export interface ResolveOllamaEndpointOptions {
  configuration?: WorkspaceConfigurationLike;
  env?: Record<string, string | undefined>;
  fallbackEndpoint?: string;
}

export interface WorkspaceConfigurationLike {
  get<T>(section: string, defaultValue?: T): T | undefined;
}

/**
 * Resolve the Ollama endpoint that Link-Aware Diagnostics should talk to.
 * Priority order:
 * 1. Explicit environment variables (`LINK_AWARE_OLLAMA_ENDPOINT`, `OLLAMA_ENDPOINT`).
 * 2. VS Code setting `github.copilot.chat.byok.ollamaEndpoint` (if configuration is provided).
 * 3. Callers may supply a custom fallback endpoint.
 * 4. Default to `http://localhost:11434`.
 */
export function resolveOllamaEndpoint(options: ResolveOllamaEndpointOptions = {}): string {
  const { configuration, fallbackEndpoint } = options;
  const envSource = options.env ?? (typeof process !== "undefined" ? process.env : undefined) ?? {};

  const envCandidate = pickFirstNonEmpty([
    envSource.LINK_AWARE_OLLAMA_ENDPOINT,
    envSource.OLLAMA_ENDPOINT
  ]);
  if (envCandidate) {
    return envCandidate;
  }

  if (configuration) {
    const configCandidate = configuration.get<string>("github.copilot.chat.byok.ollamaEndpoint");
    if (isNonEmpty(configCandidate)) {
      return configCandidate.trim();
    }
  }

  if (isNonEmpty(fallbackEndpoint)) {
    return fallbackEndpoint.trim();
  }

  return DEFAULT_OLLAMA_ENDPOINT;
}

function pickFirstNonEmpty(candidates: Array<string | undefined | null>): string | undefined {
  for (const candidate of candidates) {
    if (isNonEmpty(candidate)) {
      return candidate.trim();
    }
  }
  return undefined;
}

function isNonEmpty(value: string | undefined | null): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

export { DEFAULT_OLLAMA_ENDPOINT };
