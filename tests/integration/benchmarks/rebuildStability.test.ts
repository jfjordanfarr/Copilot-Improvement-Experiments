import { strict as assert } from "node:assert";
import { spawn } from "node:child_process";
import { promises as fs } from "node:fs";
import * as os from "node:os";
import * as path from "node:path";

import { writeBenchmarkResult } from "./utils/benchmarkRecorder";
import { getRepoRoot, resolveRepoPath } from "./utils/repoPaths";

const REPO_ROOT = getRepoRoot(__dirname);
const TSX_CLI = resolveRepoPath("node_modules", "tsx", "dist", "cli.mjs");
const TSCONFIG = resolveRepoPath("tsconfig.base.json");
const SNAPSHOT_SCRIPT = resolveRepoPath("scripts", "graph-tools", "snapshot-workspace.ts");
const FIXTURE_WORKSPACE = resolveRepoPath("tests", "integration", "fixtures", "simple-workspace");
const FIXED_TIMESTAMP = "2025-01-01T00:00:00.000Z";
const BENCHMARK_MODE = (process.env.BENCHMARK_MODE ?? "self-similarity").toLowerCase();

interface SnapshotResult {
  durationMs: number;
  snapshot: unknown;
}

suite("T057: Graph rebuild stability", () => {
  test("graph snapshots remain stable across rebuilds", async function () {
    this.timeout(180000);

    const iterations = Math.max(2, Number.parseInt(process.env.BENCHMARK_REBUILD_ITERATIONS ?? "3", 10));
    const snapshots: SnapshotResult[] = [];

    for (let index = 0; index < iterations; index += 1) {
      snapshots.push(await captureSnapshot(FIXTURE_WORKSPACE));
    }

    const [reference, ...others] = snapshots;
    for (const candidate of others) {
      assert.deepStrictEqual(candidate.snapshot, reference.snapshot, "Graph snapshot drift detected");
    }

    const durations = snapshots.map(entry => entry.durationMs);
    const averageDuration = durations.reduce((sum, value) => sum + value, 0) / durations.length;
    const maxDuration = Math.max(...durations);

    await writeBenchmarkResult(
      "rebuild-stability",
      {
        mode: BENCHMARK_MODE,
        workspace: path.basename(FIXTURE_WORKSPACE),
        iterations,
        durationsMs: durations,
        averageDurationMs: averageDuration,
        maxDurationMs: maxDuration,
        driftDetected: false
      },
      {
        mode: BENCHMARK_MODE
      }
    );
  });
});

async function captureSnapshot(workspaceRoot: string): Promise<SnapshotResult> {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "rebuild-stability-"));
  const snapshotPath = path.join(tempDir, "snapshot.json");
  const args = [
    TSX_CLI,
    "--tsconfig",
    TSCONFIG,
    SNAPSHOT_SCRIPT,
    "--workspace",
    workspaceRoot,
    "--output",
    snapshotPath,
    "--skip-db",
    "--timestamp",
    FIXED_TIMESTAMP,
    "--quiet"
  ];

  const durationMs = await runProcess(resolveNodeBinary(), args, REPO_ROOT);
  const raw = await fs.readFile(snapshotPath, "utf8");
  const parsed = JSON.parse(raw);

  await fs.rm(tempDir, { recursive: true, force: true });

  return {
    durationMs,
    snapshot: parsed
  };
}

function runProcess(command: string, args: string[], cwd: string): Promise<number> {
  return new Promise((resolve, reject) => {
    const started = Date.now();
    if (process.env.DEBUG_REBUILD_BENCHMARK === "1") {
      console.log("[rebuild-stability] spawn", command, args);
    }
    const child = spawn(command, args, {
      cwd,
      stdio: "inherit",
      env: {
        ...process.env
      }
    });

    child.on("error", reject);
    child.on("exit", code => {
      if (code === 0) {
        resolve(Date.now() - started);
      } else {
        reject(new Error(`Benchmark process failed with exit code ${code}`));
      }
    });
  });
}

function resolveNodeBinary(): string {
  const execPath = process.execPath;
  const lower = execPath.toLowerCase();
  if (lower.includes("node")) {
    return execPath;
  }

  const inferred = process.env.npm_node_execpath ?? process.env.NODE_BINARY ?? process.env.NODE_EXEC_PATH;
  if (inferred && inferred.length > 0) {
    return inferred;
  }

  return process.platform === "win32" ? "node.exe" : "node";
}
