import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@copilot-improvement/shared": path.resolve(
        __dirname,
        "packages/shared/src/index.ts"
      )
    }
  },
  test: {
    globals: true,
    environment: "node",
    include: [
      "packages/shared/src/**/*.test.ts",
      "packages/server/src/**/*.test.ts"
    ],
    coverage: {
      enabled: true,
      reporter: ["text", "html"],
      reportsDirectory: "coverage"
    }
  }
});
