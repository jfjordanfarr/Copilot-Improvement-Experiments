import { getRuntimeConfig } from "./config/runtime";

export function hydrateApplication(): void {
  const runtimeConfig = getRuntimeConfig();
  Reflect.set(globalThis, "__APP_RUNTIME__", runtimeConfig);
}

hydrateApplication();
