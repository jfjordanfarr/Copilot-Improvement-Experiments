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

interface FixtureManifestEntry {
  id: string;
  label?: string;
  language?: string;
  path: string;
  modes?: string[];
  expected: string;
  inferred: string;
}

interface FixtureManifest {
  fixtures: FixtureManifestEntry[];
}

interface FixtureTotals {
  truePositives: number;
  falsePositives: number;
  falseNegatives: number;
  precision: number | null;
  recall: number | null;
  f1Score: number | null;
}

interface FixtureResult {
  id: string;
  label?: string;
  language?: string;
  totals: FixtureTotals;
  truePositives: EdgeDefinition[];
  falsePositives: EdgeDefinition[];
  falseNegatives: EdgeDefinition[];
}

const REPO_ROOT = getRepoRoot(__dirname);
const FIXTURE_ROOT = resolveRepoPath("tests", "integration", "benchmarks", "fixtures");
const MANIFEST_PATH = path.join(FIXTURE_ROOT, "fixtures.manifest.json");
const PRECISION_THRESHOLD = Number(process.env.BENCHMARK_PRECISION_THRESHOLD ?? "0.6");
const RECALL_THRESHOLD = Number(process.env.BENCHMARK_RECALL_THRESHOLD ?? "0.6");
const BENCHMARK_MODE = (process.env.BENCHMARK_MODE ?? "self-similarity").toLowerCase();

const requireModule = createRequire(__filename);

suite("T061: AST accuracy benchmark", () => {
  test("computes inference accuracy metrics against ground truth", async function () {
    const manifest = await loadManifest(MANIFEST_PATH);
    const fixtures = selectFixtures(manifest, BENCHMARK_MODE);

    if (fixtures.length === 0) {
      this.skip();
      return;
    }

    const tracker = new (getInferenceAccuracyTracker())();
    const fixtureResults: FixtureResult[] = [];

    for (const fixture of fixtures) {
      const comparison = await evaluateFixture(fixture, tracker);
      fixtureResults.push(comparison);
    }

    const snapshot = tracker.snapshot({ reset: true });
    const totals = snapshot.totals;

    assert.ok(
      totals.precision !== null && totals.precision >= PRECISION_THRESHOLD,
      `Precision ${totals.precision ?? 0} fell below threshold ${PRECISION_THRESHOLD}`
    );
    assert.ok(
      totals.recall !== null && totals.recall >= RECALL_THRESHOLD,
      `Recall ${totals.recall ?? 0} fell below threshold ${RECALL_THRESHOLD}`
    );

    await writeBenchmarkResult("ast-accuracy", {
      mode: BENCHMARK_MODE,
      thresholds: {
        precision: PRECISION_THRESHOLD,
        recall: RECALL_THRESHOLD
      },
      totals,
      fixtures: fixtureResults
    });
  });
});

async function evaluateFixture(fixture: FixtureManifestEntry, tracker: TrackerInstance): Promise<FixtureResult> {
  const root = path.join(FIXTURE_ROOT, fixture.path);
  const expected = await loadEdges(path.join(root, fixture.expected));
  const inferred = await loadEdges(path.join(root, fixture.inferred));

  const expectedMap = new Map<string, EdgeDefinition>();
  const inferredSet = new Set<string>();

  for (const edge of expected) {
    expectedMap.set(edgeKey(edge), edge);
  }

  for (const edge of inferred) {
    inferredSet.add(edgeKey(edge));
  }

  const falseNegatives: EdgeDefinition[] = [];
  const falsePositives: EdgeDefinition[] = [];
  const truePositives: EdgeDefinition[] = [];

  for (const edge of expected) {
    const key = edgeKey(edge);
    if (inferredSet.has(key)) {
      tracker.recordOutcome({
        benchmarkId: fixture.id,
        outcome: "truePositive",
        artifactUri: edge.source,
        relation: edge.relation
      });
      truePositives.push(edge);
    } else {
      tracker.recordOutcome({
        benchmarkId: fixture.id,
        outcome: "falseNegative",
        artifactUri: edge.source,
        relation: edge.relation
      });
      falseNegatives.push(edge);
    }
  }

  for (const edge of inferred) {
    const key = edgeKey(edge);
    if (!expectedMap.has(key)) {
      tracker.recordOutcome({
        benchmarkId: fixture.id,
        outcome: "falsePositive",
        artifactUri: edge.source,
        relation: edge.relation
      });
      falsePositives.push(edge);
    }
  }

  const totals: FixtureTotals = calculateTotals(truePositives.length, falsePositives.length, falseNegatives.length);

  return {
    id: fixture.id,
    label: fixture.label,
    language: fixture.language,
    totals,
    truePositives,
    falsePositives,
    falseNegatives
  };
}

async function loadManifest(filePath: string): Promise<FixtureManifest> {
  const raw = await fs.readFile(filePath, "utf8");
  const parsed = JSON.parse(raw) as FixtureManifest;
  if (!parsed || !Array.isArray(parsed.fixtures)) {
    throw new Error(`Invalid AST benchmark manifest at ${filePath}`);
  }
  return parsed;
}

function selectFixtures(manifest: FixtureManifest, mode: string): FixtureManifestEntry[] {
  if (mode === "all") {
    return manifest.fixtures;
  }

  return manifest.fixtures.filter(entry => {
    const modes = entry.modes?.map(candidate => candidate.toLowerCase()) ?? [];
    if (mode === "self-similarity") {
      return modes.length === 0 || modes.includes("self-similarity");
    }
    return modes.includes(mode);
  });
}

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

function calculateTotals(truePositives: number, falsePositives: number, falseNegatives: number): FixtureTotals {
  const precision = ratio(truePositives, truePositives + falsePositives);
  const recall = ratio(truePositives, truePositives + falseNegatives);
  const f1Score = computeF1(precision, recall);

  return {
    truePositives,
    falsePositives,
    falseNegatives,
    precision,
    recall,
    f1Score
  };
}

function ratio(numerator: number, denominator: number): number | null {
  if (denominator === 0) {
    return null;
  }
  return numerator / denominator;
}

function computeF1(precision: number | null, recall: number | null): number | null {
  if (precision === null || recall === null || (precision + recall) === 0) {
    return null;
  }
  return (2 * precision * recall) / (precision + recall);
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
