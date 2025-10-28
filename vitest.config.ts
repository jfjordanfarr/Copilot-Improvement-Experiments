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
      "packages/server/src/**/*.test.ts",
      "packages/extension/src/**/*.test.ts",
      "tests/integration/slopcop/**/*.test.ts"
    ],
    poolOptions: {
      threads: {
        minThreads: 1,
        maxThreads: 1
      }
    },
    coverage: {
      enabled: true,
      reporter: ["text", "html"],
      reportsDirectory: "coverage",
      exclude: [
        "scripts/**/*.ts",
        "packages/extension/src/extension.ts"
      ]
    }
  }
});
