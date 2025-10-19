const js = require("@eslint/js");
const tseslint = require("typescript-eslint");
const eslintPluginImport = require("eslint-plugin-import");
const eslintConfigPrettier = require("eslint-config-prettier");

module.exports = tseslint.config(
  {
    ignores: [
      "dist/**",
      "**/dist/**",
      "out/**",
      "**/out/**",
      ".vscode-test/**",
      "tests/integration/dist/**",
      "node_modules/**",
      "**/*.d.ts",
      "eslint.config.js"
    ]
  },
  {
    files: ["**/*.{js,cjs,mjs,ts,tsx}"],
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
      eslintConfigPrettier
    ],
    languageOptions: {
      parserOptions: {
        sourceType: "module"
      }
    },
    plugins: {
      import: eslintPluginImport
    },
    settings: {
      "import/resolver": {
        typescript: {
          project: [
            "./packages/shared/tsconfig.json",
            "./packages/server/tsconfig.json",
            "./packages/extension/tsconfig.json"
          ],
          alwaysTryTypes: true
        }
      },
      "import/core-modules": ["vscode"],
      "import/internal-regex": "^@copilot-improvement/"
    },
    rules: {
      "import/order": [
        "error",
        {
          alphabetize: { order: "asc", caseInsensitive: true },
          "newlines-between": "always",
          groups: [["builtin", "external"], "internal", ["parent", "sibling", "index"]]
        }
      ],
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }
      ]
    }
  },
  {
    files: ["packages/**/*.ts"],
    extends: [...tseslint.configs.recommendedTypeChecked],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: __dirname
      }
    },
    rules: {
      "@typescript-eslint/no-floating-promises": "error"
    }
  },
  {
    files: ["**/*.{test,spec}.ts"],
    rules: {
      "@typescript-eslint/no-floating-promises": "off"
    }
  }
);
