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
  const record = {
    benchmark: name,
    recordedAt: new Date().toISOString(),
    environment: {
      nodeVersion: process.version,
      platform: process.platform,
      arch: process.arch,
      providerMode: process.env.LINK_AWARE_PROVIDER_MODE ?? null,
      ollamaModel: process.env.LINK_AWARE_OLLAMA_MODEL ?? process.env.OLLAMA_MODEL ?? null,
      ollamaEndpoint: process.env.LINK_AWARE_OLLAMA_ENDPOINT ?? process.env.OLLAMA_ENDPOINT ?? null
    },
    data: payload
  };

  const content = JSON.stringify(record, null, 2);
  await fs.writeFile(filePath, content, "utf8");
}
