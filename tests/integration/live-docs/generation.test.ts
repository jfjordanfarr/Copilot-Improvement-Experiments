import * as assert from "node:assert";
import * as fs from "node:fs/promises";
import * as os from "node:os";
import * as path from "node:path";

const LIVE_DOCUMENTATION_FILE_EXTENSION = ".md" as const; // Keep in sync with liveDocumentationConfig

const { generateLiveDocs } = require(
  path.join(
    __dirname,
    "../../../../packages/server/dist/features/live-docs/generator"
  )
) as typeof import("../../../packages/server/dist/features/live-docs/generator");

const {
  DEFAULT_LIVE_DOCUMENTATION_CONFIG,
  normalizeLiveDocumentationConfig
} = require(
  path.join(
    __dirname,
    "../../../../packages/shared/dist/config/liveDocumentationConfig"
  )
) as typeof import("../../../packages/shared/dist/config/liveDocumentationConfig");

suite("Live Docs generator", () => {
  test("preserves authored sections and produces deterministic output", async function () {
    this.timeout(20000);

    const workspaceRoot = await fs.mkdtemp(path.join(os.tmpdir(), "live-docs-generator-"));

    try {
      const sourcePath = path.join(workspaceRoot, "packages", "app", "src");
      await fs.mkdir(sourcePath, { recursive: true });

      const sourceFile = path.join(sourcePath, "example.ts");
      await fs.writeFile(
        sourceFile,
        [
          "export interface Greeter {",
          "  greet(name: string): string;",
          "}",
          "",
          "export function greet(name: string): string {",
          "  return `Hello, ${name}!`;",
          "}"
        ].join("\n"),
        "utf8"
      );

      const docDir = path.join(workspaceRoot, ".live-documentation", "source", "packages", "app", "src");
      await fs.mkdir(docDir, { recursive: true });

      const docPath = path.join(docDir, `example.ts${LIVE_DOCUMENTATION_FILE_EXTENSION}`);
      await fs.writeFile(
        docPath,
        [
          "# packages/app/src/example.ts",
          "",
          "## Metadata",
          "- Layer: 4",
          "- Archetype: implementation",
          "- Code Path: packages/app/src/example.ts",
          "- Live Doc ID: LD-implementation-packages-app-src-example-ts",
          "",
          "## Authored",
          "### Description",
          "Existing description",
          "",
          "### Purpose",
          "Existing purpose",
          "",
          "### Notes",
          "Existing notes",
          "",
          "## Generated",
          "<!-- LIVE-DOC:BEGIN Public Symbols -->",
          "### Public Symbols",
          "_No data provided_",
          "<!-- LIVE-DOC:END Public Symbols -->",
          "",
          "<!-- LIVE-DOC:BEGIN Dependencies -->",
          "### Dependencies",
          "_No data provided_",
          "<!-- LIVE-DOC:END Dependencies -->"
        ].join("\n"),
        "utf8"
      );

      const config = normalizeLiveDocumentationConfig({
        ...DEFAULT_LIVE_DOCUMENTATION_CONFIG,
        root: ".live-documentation",
        baseLayer: "source",
        glob: ["packages/**/*.ts"]
      });

      await generateLiveDocs({
        workspaceRoot,
        config,
        changedOnly: false,
        dryRun: false
      });

      const firstPass = await fs.readFile(docPath, "utf8");
      assert.match(firstPass, /Existing description/);
      assert.match(firstPass, /### Public Symbols/);
      assert.match(firstPass, /greet/);

      await generateLiveDocs({
        workspaceRoot,
        config,
        changedOnly: false,
        dryRun: false
      });

      const secondPass = await fs.readFile(docPath, "utf8");
      assert.strictEqual(firstPass, secondPass, "Regeneration should be deterministic");
    } finally {
      await fs.rm(workspaceRoot, { recursive: true, force: true });
    }
  });
});