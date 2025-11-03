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
  outputPath?: string;
  benchmarkDir: string;
  mode?: string | null;
}

const DEFAULT_BENCHMARK_DIR = path.resolve(process.cwd(), "AI-Agent-Workspace", "tmp", "benchmarks");
const REPORTS_ROOT = path.resolve(process.cwd(), "reports");

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const mode = normalizeMode(
    options.mode ?? process.env.BENCHMARK_REPORT_MODE ?? process.env.BENCHMARK_MODE
  );
  const benchmarks = await loadBenchmarks(options.benchmarkDir, mode);
  const context = buildReportContext(mode ?? undefined);
  const markdown = buildTestReportMarkdown(context, benchmarks);
  const outputPath = options.outputPath ?? defaultOutputPath(mode);

  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, markdown, "utf8");

  console.log(`Wrote test report to ${outputPath}`);
}

function parseArgs(argv: string[]): CliOptions {
  let outputPath: string | undefined;
  let benchmarkDir: string | undefined;
  let mode: string | undefined;

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
      case "--mode": {
        const value = argv[index + 1];
        if (!value) {
          throw new Error(`${token} requires a value`);
        }
        mode = value;
        index += 1;
        break;
      }
      default: {
        if (token.startsWith("--mode=")) {
          const [, value] = token.split("=", 2);
          if (!value) {
            throw new Error("--mode requires a value");
          }
          mode = value;
          break;
        }
        throw new Error(`Unknown argument: ${token}`);
      }
    }
  }

  return {
    outputPath,
    benchmarkDir: benchmarkDir ?? DEFAULT_BENCHMARK_DIR,
    mode
  };
}

async function loadBenchmarks(dir: string, targetMode?: string | null): Promise<BenchmarkRecord[]> {
  if (!exists(dir)) {
    return [];
  }

  const entries = readdirSync(dir).filter(entry => entry.endsWith(".json"));
  const records: BenchmarkRecord[] = [];
  const normalizedTargetMode = normalizeMode(targetMode);

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

      const recordMode = inferRecordMode(parsed);
      if (normalizedTargetMode && recordMode !== normalizedTargetMode) {
        continue;
      }

      records.push({
        benchmark: parsed.benchmark,
        mode: recordMode,
        recordedAt: parsed.recordedAt,
        environment: parsed.environment ?? {},
        data: parsed.data,
        sourcePath: path.relative(process.cwd(), diskPath)
      });
    } catch {
      // Skip unreadable files
    }
  }

  return records.sort((left, right) => {
    const benchmarkComparison = left.benchmark.localeCompare(right.benchmark);
    if (benchmarkComparison !== 0) {
      return benchmarkComparison;
    }
    return right.recordedAt.localeCompare(left.recordedAt);
  });
}

function buildReportContext(mode?: string | null) {
  const generatedAt = new Date().toISOString();
  let gitCommit = "unknown";
  let gitBranch: string | undefined;

  try {
    gitCommit = execSync("git rev-parse HEAD", { encoding: "utf8" }).trim();
    gitBranch = execSync("git rev-parse --abbrev-ref HEAD", { encoding: "utf8" }).trim();
  } catch {
    // ignore git errors (detached HEAD or workspace not initialised)
  }

  const benchmarkMode = mode ?? process.env.BENCHMARK_MODE ?? undefined;

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

function normalizeMode(candidate?: string | null): string | null {
  if (!candidate) {
    return null;
  }
  const normalized = candidate.trim().toLowerCase();
  return normalized.length === 0 ? null : normalized;
}

function slugifyMode(mode?: string | null): string {
  const normalized = normalizeMode(mode);
  if (!normalized) {
    return "default";
  }
  return normalized.replace(/[^a-z0-9]+/g, "-");
}

function defaultOutputPath(mode?: string | null): string {
  const slug = slugifyMode(mode);
  if (slug === "default") {
    return path.join(REPORTS_ROOT, "test-report.md");
  }
  if (slug === "self-similarity") {
    return path.join(REPORTS_ROOT, "test-report.self-similarity.md");
  }
  return path.join(REPORTS_ROOT, `test-report.${slug}.md`);
}

function inferRecordMode(record: {
  mode?: unknown;
  data?: unknown;
}): string | null {
  if (typeof record.mode === "string") {
    return normalizeMode(record.mode);
  }

  if (record.data && typeof record.data === "object") {
    const candidate = (record.data as { mode?: unknown }).mode;
    if (typeof candidate === "string") {
      return normalizeMode(candidate);
    }
  }

  return null;
}

main().catch(error => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
