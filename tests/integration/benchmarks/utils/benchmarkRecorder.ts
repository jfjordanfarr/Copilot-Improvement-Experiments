import { promises as fs } from "node:fs";
import * as path from "node:path";

import { resolveRepoPath } from "./repoPaths";

const DEFAULT_OUTPUT_DIR = resolveRepoPath("AI-Agent-Workspace", "tmp", "benchmarks");

export async function writeBenchmarkResult(name: string, payload: unknown): Promise<void> {
  const outputDir = process.env.BENCHMARK_OUTPUT_DIR
    ? path.resolve(process.env.BENCHMARK_OUTPUT_DIR)
    : DEFAULT_OUTPUT_DIR;

  await fs.mkdir(outputDir, { recursive: true });
  const filePath = path.join(outputDir, `${name}.json`);
  const content = JSON.stringify(payload, null, 2);
  await fs.writeFile(filePath, content, "utf8");
}
