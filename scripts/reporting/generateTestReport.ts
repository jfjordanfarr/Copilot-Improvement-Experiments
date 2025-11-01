#!/usr/bin/env tsx
import { execSync } from "node:child_process";
import { promises as fs } from "node:fs";
import { readdirSync } from "node:fs";
import * as path from "node:path";

import {
  buildTestReportMarkdown,
  type BenchmarkRecord,
  type BenchmarkEnvironment
} from "@copilot-improvement/shared/reporting/testReport";

interface CliOptions {
  outputPath: string;
  benchmarkDir: string;
}

const DEFAULT_OUTPUT = path.resolve(process.cwd(), "docs", "test-report.md");
const DEFAULT_BENCHMARK_DIR = path.resolve(process.cwd(), "AI-Agent-Workspace", "tmp", "benchmarks");

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const benchmarks = await loadBenchmarks(options.benchmarkDir);
  const context = buildReportContext();
  const markdown = buildTestReportMarkdown(context, benchmarks);

  await fs.mkdir(path.dirname(options.outputPath), { recursive: true });
  await fs.writeFile(options.outputPath, markdown, "utf8");

  console.log(`Wrote test report to ${options.outputPath}`);
}

function parseArgs(argv: string[]): CliOptions {
  let outputPath: string | undefined;
  let benchmarkDir: string | undefined;

  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    switch (token) {
      case "--out":
      case "--output": {
        const value = argv[index + 1];
        if (!value) {
          throw new Error(`${token} requires a path`);
        }
        outputPath = path.resolve(process.cwd(), value);
        index += 1;
        break;
      }
      case "--benchmarks": {
        const value = argv[index + 1];
        if (!value) {
          throw new Error(`${token} requires a path`);
        }
        benchmarkDir = path.resolve(process.cwd(), value);
        index += 1;
        break;
      }
      default: {
        throw new Error(`Unknown argument: ${token}`);
      }
    }
  }

  return {
    outputPath: outputPath ?? DEFAULT_OUTPUT,
    benchmarkDir: benchmarkDir ?? DEFAULT_BENCHMARK_DIR
  };
}

async function loadBenchmarks(dir: string): Promise<BenchmarkRecord[]> {
  if (!exists(dir)) {
    return [];
  }

  const entries = readdirSync(dir).filter(entry => entry.endsWith(".json"));
  const records: BenchmarkRecord[] = [];

  for (const entry of entries) {
    const diskPath = path.join(dir, entry);
    const raw = await fs.readFile(diskPath, "utf8");
    try {
      const parsed = JSON.parse(raw) as {
        benchmark?: string;
        recordedAt?: string;
        environment?: BenchmarkEnvironment;
        data?: unknown;
      };

      if (!parsed.benchmark || !parsed.recordedAt || typeof parsed.data === "undefined") {
        continue;
      }

      records.push({
        benchmark: parsed.benchmark,
        recordedAt: parsed.recordedAt,
        environment: parsed.environment ?? {},
        data: parsed.data,
        sourcePath: path.relative(process.cwd(), diskPath)
      });
    } catch {
      // Skip unreadable files
    }
  }

  return records.sort((left, right) => left.benchmark.localeCompare(right.benchmark));
}

function buildReportContext() {
  const generatedAt = new Date().toISOString();
  let gitCommit = "unknown";
  let gitBranch: string | undefined;

  try {
    gitCommit = execSync("git rev-parse HEAD", { encoding: "utf8" }).trim();
    gitBranch = execSync("git rev-parse --abbrev-ref HEAD", { encoding: "utf8" }).trim();
  } catch {
    // ignore git errors (detached HEAD or workspace not initialised)
  }

  const benchmarkMode = process.env.BENCHMARK_MODE ?? undefined;

  return {
    generatedAt,
    gitCommit,
    gitBranch,
    benchmarkMode
  };
}

function exists(candidate: string): boolean {
  try {
    readdirSync(candidate);
    return true;
  } catch {
    return false;
  }
}

main().catch(error => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
