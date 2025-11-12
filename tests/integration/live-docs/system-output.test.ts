import * as assert from "node:assert";
import * as fs from "node:fs/promises";
import * as os from "node:os";
import * as path from "node:path";

const { generateSystemLiveDocs } = require(
  path.join(
    __dirname,
    "../../../../packages/server/dist/features/live-docs/system/generator"
  )
) as typeof import("../../../packages/server/dist/features/live-docs/system/generator");

const {
  DEFAULT_LIVE_DOCUMENTATION_CONFIG,
  normalizeLiveDocumentationConfig
} = require(
  path.join(
    __dirname,
    "../../../../packages/shared/dist/config/liveDocumentationConfig"
  )
) as typeof import("../../../packages/shared/dist/config/liveDocumentationConfig");

suite("System Live Docs generator", () => {
  test("writes materialised views to a custom output directory", async function () {
    this.timeout(20000);

    const workspaceRoot = await fs.mkdtemp(path.join(os.tmpdir(), "system-live-docs-generator-"));

    try {
      const stage0Root = path.join(
        workspaceRoot,
        ".live-documentation",
        "source",
        "packages",
        "shared",
        "src",
        "live-docs"
      );
      await fs.mkdir(stage0Root, { recursive: true });

      await fs.writeFile(
        path.join(stage0Root, "a.ts.mdmd.md"),
        createStage0Doc({
          codePath: "packages/shared/src/live-docs/a.ts",
          dependencyFile: "b.ts.mdmd.md"
        }),
        "utf8"
      );

      await fs.writeFile(
        path.join(stage0Root, "b.ts.mdmd.md"),
        createStage0Doc({
          codePath: "packages/shared/src/live-docs/b.ts",
          dependencyFile: "a.ts.mdmd.md"
        }),
        "utf8"
      );

      const config = normalizeLiveDocumentationConfig({
        ...DEFAULT_LIVE_DOCUMENTATION_CONFIG,
        root: ".live-documentation",
        baseLayer: "source"
      });

      const outputDir = path.join(workspaceRoot, "tmp", "system-output");

      const result = await generateSystemLiveDocs({
        workspaceRoot,
        config,
        outputDir,
        cleanOutputDir: true,
        dryRun: false
      });

      assert.strictEqual(result.outputDir, outputDir);
      assert.ok(result.documents.length > 0, "Expected at least one generated document");

      const materialisedDoc = path.join(
        outputDir,
        ".live-documentation",
        "system",
        "component",
        "packagessharedsrclivedocs.mdmd.md"
      );

      const docContent = await fs.readFile(materialisedDoc, "utf8");
      assert.match(docContent, /### Components/);
      assert.match(docContent, /live-docs\/a\.ts/);
      assert.match(docContent, /live-docs\/b\.ts/);

      const systemMirror = path.join(workspaceRoot, ".live-documentation", "system");
      const mirrorExists = await directoryExists(systemMirror);
      assert.strictEqual(mirrorExists, false, "System mirror should not be written under the workspace root");
    } finally {
      await fs.rm(workspaceRoot, { recursive: true, force: true });
    }
  });
});

function createStage0Doc(args: { codePath: string; dependencyFile?: string }): string {
  const dependencySection = args.dependencyFile
    ? `- [${args.codePath.replace(/[^/]+$/, args.dependencyFile.replace(/\.mdmd\.md$/, ""))}](./${args.dependencyFile})`
    : "_No data provided_";

  return [
    `# ${args.codePath}`,
    "",
    "## Metadata",
    "- Layer: 4",
    "- Archetype: implementation",
    `- Code Path: ${args.codePath}`,
    `- Live Doc ID: LD-implementation-${normalizeId(args.codePath)}`,
    "",
    "## Authored",
    "### Purpose",
    "_Pending purpose_",
    "",
    "### Notes",
    "_Pending notes_",
    "",
    "## Generated",
    "<!-- LIVE-DOC:BEGIN Dependencies -->",
    "### Dependencies",
    dependencySection,
    "<!-- LIVE-DOC:END Dependencies -->"
  ].join("\n");
}

function normalizeId(codePath: string): string {
  return codePath.replace(/[^a-zA-Z0-9]+/g, "-");
}

async function directoryExists(candidate: string): Promise<boolean> {
  try {
    await fs.access(candidate);
    return true;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return false;
    }
    throw error;
  }
}
