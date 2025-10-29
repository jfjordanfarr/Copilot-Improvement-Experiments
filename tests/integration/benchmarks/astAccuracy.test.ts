import { strict as assert } from "node:assert";
import { existsSync, promises as fs } from "node:fs";
import { createRequire } from "node:module";
import * as path from "node:path";

import { writeBenchmarkResult } from "./utils/benchmarkRecorder";
import { getRepoRoot, resolveRepoPath } from "./utils/repoPaths";

interface EdgeDefinition {
  source: string;
  target: string;
  relation?: string;
}

const REPO_ROOT = getRepoRoot(__dirname);
const FIXTURE_ROOT = resolveRepoPath("tests", "integration", "benchmarks", "fixtures", "ts-basic");
const PRECISION_THRESHOLD = Number(process.env.BENCHMARK_PRECISION_THRESHOLD ?? "0.6");
const RECALL_THRESHOLD = Number(process.env.BENCHMARK_RECALL_THRESHOLD ?? "0.6");

const requireModule = createRequire(__filename);

suite("T061: AST accuracy benchmark", () => {
  test("computes inference accuracy metrics against ground truth", async () => {
    const expected = await loadEdges(path.join(FIXTURE_ROOT, "expected.json"));
    const inferred = await loadEdges(path.join(FIXTURE_ROOT, "inferred.json"));

    const tracker = new (getInferenceAccuracyTracker())();
    const expectedMap = new Map<string, EdgeDefinition>();
    const inferredSet = new Set<string>();

    for (const edge of expected) {
      const key = edgeKey(edge);
      expectedMap.set(key, edge);
    }

    for (const edge of inferred) {
      const key = edgeKey(edge);
      inferredSet.add(key);
    }

    const falseNegatives: EdgeDefinition[] = [];
    const falsePositives: EdgeDefinition[] = [];
    const truePositives: EdgeDefinition[] = [];

    for (const edge of expected) {
      const key = edgeKey(edge);
      if (inferredSet.has(key)) {
        tracker.recordOutcome({ benchmarkId: "ts-basic", outcome: "truePositive", artifactUri: edge.source, relation: edge.relation });
        truePositives.push(edge);
      } else {
        tracker.recordOutcome({ benchmarkId: "ts-basic", outcome: "falseNegative", artifactUri: edge.source, relation: edge.relation });
        falseNegatives.push(edge);
      }
    }

    for (const edge of inferred) {
      const key = edgeKey(edge);
      if (!expectedMap.has(key)) {
        tracker.recordOutcome({ benchmarkId: "ts-basic", outcome: "falsePositive", artifactUri: edge.source, relation: edge.relation });
        falsePositives.push(edge);
      }
    }

    const summary = tracker.snapshot({ reset: true });
    const metrics = summary.totals;

    assert.ok(metrics.precision !== null && metrics.precision >= PRECISION_THRESHOLD, `Precision ${metrics.precision ?? 0} fell below threshold ${PRECISION_THRESHOLD}`);
    assert.ok(metrics.recall !== null && metrics.recall >= RECALL_THRESHOLD, `Recall ${metrics.recall ?? 0} fell below threshold ${RECALL_THRESHOLD}`);

    await writeBenchmarkResult("ast-accuracy", {
      benchmarkId: "ts-basic",
      totals: metrics,
      truePositives,
      falsePositives,
      falseNegatives
    });
  });
});

async function loadEdges(filePath: string): Promise<EdgeDefinition[]> {
  const raw = await fs.readFile(filePath, "utf8");
  const parsed = JSON.parse(raw);
  if (!Array.isArray(parsed)) {
    throw new Error(`Edge fixture must be an array: ${filePath}`);
  }
  return parsed.map(entry => normalizeEdge(entry));
}

function normalizeEdge(entry: EdgeDefinition): EdgeDefinition {
  if (!entry || typeof entry.source !== "string" || typeof entry.target !== "string") {
    throw new Error("Edge entries must include 'source' and 'target'");
  }
  return {
    source: normalizePath(entry.source),
    target: normalizePath(entry.target),
    relation: entry.relation ?? "default"
  };
}

function edgeKey(edge: EdgeDefinition): string {
  return `${edge.source}→${edge.target}#${edge.relation ?? "default"}`;
}

function normalizePath(candidate: string): string {
  return candidate.replace(/\\/g, "/");
}

type TrackerCtor = new (...args: any[]) => TrackerInstance;

interface TrackerInstance {
  recordOutcome(options: {
    benchmarkId: string;
    outcome: "truePositive" | "falsePositive" | "falseNegative";
    artifactUri?: string;
    relation?: string;
  }): void;
  snapshot(options?: { reset?: boolean }): {
    totals: {
      precision: number | null;
      recall: number | null;
      f1Score: number | null;
    };
  };
}

let cachedTracker: TrackerCtor | undefined;

function getInferenceAccuracyTracker(): TrackerCtor {
  if (cachedTracker) {
    return cachedTracker;
  }

  const modulePath = path.join(REPO_ROOT, "packages", "shared", "dist", "telemetry", "inferenceAccuracy.js");
  if (!existsSync(modulePath)) {
    throw new Error(`Expected inference accuracy tracker at ${modulePath}. Run npm run build before integration benchmarks.`);
  }

  const trackerModule = requireModule(modulePath) as { InferenceAccuracyTracker?: TrackerCtor };
  if (!trackerModule?.InferenceAccuracyTracker) {
    throw new Error(`Module at ${modulePath} does not export InferenceAccuracyTracker`);
  }

  cachedTracker = trackerModule.InferenceAccuracyTracker;
  return cachedTracker;
}
