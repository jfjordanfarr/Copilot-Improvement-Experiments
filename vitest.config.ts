import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: [
      {
        find: /^@copilot-improvement\/shared$/,
        replacement: path.resolve(__dirname, "packages/shared/src/index.ts")
      },
      {
        find: /^@copilot-improvement\/shared\/(.*)$/,
        replacement: path.resolve(__dirname, "packages/shared/src/$1")
      }
    ]
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
      reporter: ["text-summary", "html"],
      reportsDirectory: "coverage",
      include: [
        "packages/**/src/**/*.{ts,tsx}"
      ],
      exclude: [
        "scripts/**/*.ts",
        "tests/**",
        "AI-Agent-Workspace/**",
        ".vscode-test/**",
        "coverage/**",
        "packages/extension/src/extension.ts"
      ]
    }
  }
});
