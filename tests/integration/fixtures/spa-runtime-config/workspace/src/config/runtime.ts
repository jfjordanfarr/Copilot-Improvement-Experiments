interface RuntimeConfig {
  apiBaseUrl: string;
  instrumentationKey: string;
}

const RUNTIME_CONFIG: RuntimeConfig = {
  apiBaseUrl: "/api",
  instrumentationKey: "spa-telemetry-0001"
};

export function getRuntimeConfig(): RuntimeConfig {
  return RUNTIME_CONFIG;
}
