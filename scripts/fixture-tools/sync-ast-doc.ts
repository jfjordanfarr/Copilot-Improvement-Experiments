import * as path from "node:path";

import { ensureVendorSection } from "./benchmark-doc";
import { loadBenchmarkManifest } from "./benchmark-manifest";

async function main(): Promise<void> {
  const repoRoot = path.resolve(path.join(__dirname, "..", ".."));
  const manifest = await loadBenchmarkManifest(repoRoot);
  const docPath = path.join(
    repoRoot,
    ".live-documentation",
    "source",
    "benchmarks",
    "astAccuracyFixtures.md"
  );

  await ensureVendorSection(docPath, manifest, {
    repoRoot,
    docPath
  });

  console.log("Updated vendor fixture inventory based on manifest integrity metadata.");
}

void main().catch(error => {
  console.error("Failed to synchronize AST fixture documentation.");
  if (error instanceof Error) {
    console.error(error.message);
  }
  process.exit(1);
});
