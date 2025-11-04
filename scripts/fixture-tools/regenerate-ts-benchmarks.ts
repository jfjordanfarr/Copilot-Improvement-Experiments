#!/usr/bin/env node
import { promises as fs } from "node:fs";
import * as path from "node:path";
import process from "node:process";

import {
  BENCHMARK_MANIFEST_SEGMENTS,
  loadBenchmarkManifest
} from "./benchmark-manifest";
import type { BenchmarkFixtureDefinition as ManifestFixtureDefinition } from "./benchmark-manifest";
import { materializeFixture } from "./fixtureMaterializer";
import {
  generateTypeScriptFixtureGraph,
  mergeOracleEdges,
  serializeOracleEdges,
  type OracleEdgeRecord,
  type OracleOverrideConfig
} from "../../packages/shared/src/testing/fixtureOracles/typeScriptFixtureOracle";

type OracleFixtureDefinition = ManifestFixtureDefinition & {
  oracle?: OracleFixtureConfig;
};

interface OracleFixtureConfig {
  kind: "typescript";
  root?: string;
  manualOverrides?: string;
}

interface CliOptions {
  fixtureIds: Set<string>;
  suite?: string;
  helpRequested?: boolean;
}

interface EdgeRecord {
  source: string;
  target: string;
  relation: string;
}

const REPO_ROOT = path.resolve(path.join(__dirname, "..", ".."));
const FIXTURE_ROOT = path.join(REPO_ROOT, ...BENCHMARK_MANIFEST_SEGMENTS.slice(0, -1));
const OUTPUT_ROOT = path.join(REPO_ROOT, "AI-Agent-Workspace", "tmp", "fixture-regeneration");

export async function runRegenerationCli(argv: string[]): Promise<void> {
  const options = parseArgs(argv);
  if (options.helpRequested) {
    printHelp();
    return;
  }

  const manifest = (await loadBenchmarkManifest(REPO_ROOT)) as OracleFixtureDefinition[];
  const candidates = manifest.filter(entry => entry.oracle?.kind === "typescript");
  if (candidates.length === 0) {
    console.log("No TypeScript fixtures declare an oracle configuration.");
    return;
  }

  const fixtureMap = new Map<string, OracleFixtureDefinition>();
  for (const entry of candidates) {
    fixtureMap.set(entry.id, entry);
  }

  let targets: OracleFixtureDefinition[];
  if (options.fixtureIds.size > 0) {
    const missing: string[] = [];
    targets = [];
    for (const id of options.fixtureIds) {
      const fixture = fixtureMap.get(id);
      if (fixture) {
        targets.push(fixture);
      } else {
        missing.push(id);
      }
    }

    if (missing.length > 0) {
      throw new Error(`Unknown fixture ids requested: ${missing.join(", ")}`);
    }
  } else if (options.suite) {
    const normalizedSuite = options.suite.toLowerCase();
    if (["ts", "typescript"].includes(normalizedSuite)) {
      targets = candidates;
    } else {
      throw new Error(`Unsupported suite '${options.suite}'. Try '--suite ts'.`);
    }
  } else {
    targets = candidates;
  }

  if (targets.length === 0) {
    console.log("No fixtures matched the requested filters.");
    return;
  }

  await fs.mkdir(OUTPUT_ROOT, { recursive: true });

  for (const fixture of targets) {
    console.log(`\n=== ${fixture.id} (${fixture.label ?? fixture.id}) ===`);
    await regenerateFixture(fixture).catch(error => {
      throw contextualizeError(fixture.id, error);
    });
  }

  console.log("\nOracle regeneration completed.");
}

function parseArgs(argv: string[]): CliOptions {
  const fixtureIds = new Set<string>();
  let suite: string | undefined;
  let helpRequested = false;

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--help" || arg === "-h") {
      helpRequested = true;
      continue;
    }
    if (arg === "--fixture" || arg === "-f") {
      const value = argv[index + 1];
      if (!value) {
        throw new Error("--fixture requires an identifier");
      }
      fixtureIds.add(value);
      index += 1;
      continue;
    }
    if (arg.startsWith("--fixture=")) {
      fixtureIds.add(arg.slice("--fixture=".length));
      continue;
    }
    if (arg === "--suite" || arg === "-s") {
      const value = argv[index + 1];
      if (!value) {
        throw new Error("--suite requires a value");
      }
      suite = value;
      index += 1;
      continue;
    }
    if (arg.startsWith("--suite=")) {
      suite = arg.slice("--suite=".length);
      continue;
    }

    if (arg.startsWith("-")) {
      throw new Error(`Unrecognized argument '${arg}'. Use --help for usage.`);
    }

    fixtureIds.add(arg);
  }

  return { fixtureIds, suite, helpRequested };
}

function printHelp(): void {
  console.log(`Usage: npm run fixtures:regenerate -- [options] [fixtureIds...]\n\n` +
    `Options:\n` +
    `  --suite ts          Regenerate all TypeScript fixtures with compiler oracles\n` +
    `  --fixture <id>      Regenerate a specific fixture (can repeat)\n` +
    `  -h, --help          Show this help message\n`);
}

async function regenerateFixture(fixture: OracleFixtureDefinition): Promise<void> {
  const oracleConfig = fixture.oracle as OracleFixtureConfig;
  if (!oracleConfig || oracleConfig.kind !== "typescript") {
    throw new Error(`Fixture ${fixture.id} is missing TypeScript oracle configuration.`);
  }

  const fixtureRoot = path.join(FIXTURE_ROOT, fixture.path);
  const expectedPath = path.join(fixtureRoot, fixture.expected);
  const overridesPath = path.join(
    fixtureRoot,
    oracleConfig.manualOverrides ?? "oracle.overrides.json"
  );

  const overrides = await readOverrideConfig(overridesPath);
  const expectedEdges = await loadEdgeRecords(expectedPath);

  const { workspaceRoot, dispose } = await materializeFixture(REPO_ROOT, fixture, {
    workspaceMode: "ephemeral"
  });

  try {
    const oracleRoot = path.resolve(workspaceRoot, oracleConfig.root ?? ".");
    const autoEdges = generateTypeScriptFixtureGraph({ fixtureRoot: oracleRoot });
    const merge = mergeOracleEdges(autoEdges, overrides);

    const additions = computeEdgeDifferences(merge.mergedRecords, expectedEdges);
    const removals = computeEdgeDifferences(expectedEdges, merge.mergedRecords);

    const outputRoot = path.join(OUTPUT_ROOT, fixture.id);
    await fs.mkdir(outputRoot, { recursive: true });

    await fs.writeFile(
      path.join(outputRoot, "oracle.json"),
      serializeOracleEdges(autoEdges),
      "utf8"
    );

    await fs.writeFile(
      path.join(outputRoot, "merged.json"),
      JSON.stringify(merge.mergedRecords, null, 2) + "\n",
      "utf8"
    );

    const diffReport = renderDiffReport({
      fixture,
      expectedEdges,
      merge,
      overridesPath,
      additions,
      removals
    });

    await fs.writeFile(path.join(outputRoot, "diff.md"), diffReport, "utf8");

    console.log(`→ oracle edges: ${merge.autoRecords.length}`);
    console.log(`→ manual overrides: ${merge.manualRecords.length}`);
    console.log(`→ merged edges: ${merge.mergedRecords.length}`);
    console.log(`→ additions vs expected: ${additions.length}`);
    console.log(`→ removals vs expected: ${removals.length}`);
    if (merge.missingManualEntries.length > 0) {
      console.log(
        `→ missing manual overrides: ${merge.missingManualEntries.length} (see diff.md)`
      );
    }
    console.log(`Artifacts written to ${outputRoot}`);
  } finally {
    if (typeof dispose === "function") {
      await dispose();
    }
  }
}

async function readOverrideConfig(filePath: string): Promise<OracleOverrideConfig | undefined> {
  const exists = await fileExists(filePath);
  if (!exists) {
    return undefined;
  }

  const raw = await fs.readFile(filePath, "utf8");
  const parsed = JSON.parse(raw);
  return parsed as OracleOverrideConfig;
}

async function fileExists(candidate: string): Promise<boolean> {
  try {
    await fs.access(candidate);
    return true;
  } catch {
    return false;
  }
}

async function loadEdgeRecords(filePath: string): Promise<EdgeRecord[]> {
  const raw = await fs.readFile(filePath, "utf8");
  const parsed = JSON.parse(raw);
  if (!Array.isArray(parsed)) {
    throw new Error(`Edge fixture must be an array: ${filePath}`);
  }

  const records = parsed.map(normalizeEdgeRecord);
  return sortRecords(dedupeRecords(records));
}

function normalizeEdgeRecord(entry: unknown): EdgeRecord {
  if (typeof entry !== "object" || entry === null) {
    throw new Error("Edge entries must be objects");
  }

  const candidate = entry as { source?: unknown; target?: unknown; relation?: unknown };
  if (typeof candidate.source !== "string" || typeof candidate.target !== "string") {
    throw new Error("Edge entries must include 'source' and 'target'");
  }

  return {
    source: normalizePath(candidate.source),
    target: normalizePath(candidate.target),
    relation:
      typeof candidate.relation === "string" && candidate.relation.length > 0
        ? candidate.relation
        : "default"
  };
}

function normalizePath(candidate: string): string {
  return candidate.replace(/\\/g, "/");
}

function dedupeRecords(records: EdgeRecord[]): EdgeRecord[] {
  const map = new Map<string, EdgeRecord>();
  for (const record of records) {
    map.set(edgeKey(record), record);
  }
  return Array.from(map.values());
}

function sortRecords(records: EdgeRecord[]): EdgeRecord[] {
  return [...records].sort((left, right) => {
    if (left.source !== right.source) {
      return left.source.localeCompare(right.source);
    }
    if (left.target !== right.target) {
      return left.target.localeCompare(right.target);
    }
    return left.relation.localeCompare(right.relation);
  });
}

function computeEdgeDifferences(left: EdgeRecord[], right: EdgeRecord[]): EdgeRecord[] {
  const rightKeys = new Set(right.map(edgeKey));
  return left.filter(record => !rightKeys.has(edgeKey(record)));
}

function edgeKey(record: EdgeRecord | OracleEdgeRecord): string {
  return `${record.source}→${record.target}#${record.relation}`;
}

function renderDiffReport(input: {
  fixture: OracleFixtureDefinition;
  expectedEdges: EdgeRecord[];
  merge: ReturnType<typeof mergeOracleEdges>;
  overridesPath: string;
  additions: EdgeRecord[];
  removals: EdgeRecord[];
}): string {
  const { fixture, expectedEdges, merge, overridesPath, additions, removals } = input;
  const lines: string[] = [];
  const label = fixture.label ? `${fixture.id} – ${fixture.label}` : fixture.id;

  lines.push(`# ${label}`);
  lines.push("");
  lines.push("## Summary");
  lines.push(`- expected edges: ${expectedEdges.length}`);
  lines.push(`- oracle edges: ${merge.autoRecords.length}`);
  lines.push(`- manual overrides (${path.relative(REPO_ROOT, overridesPath)}): ${merge.manualRecords.length}`);
  lines.push(`  - matched manual overrides: ${merge.matchedManualRecords.length}`);
  lines.push(`  - missing manual overrides: ${merge.missingManualEntries.length}`);
  lines.push(`- merged edges: ${merge.mergedRecords.length}`);
  lines.push(`- additions vs expected: ${additions.length}`);
  lines.push(`- removals vs expected: ${removals.length}`);
  lines.push("");

  if (additions.length > 0) {
    lines.push("## Additions");
    for (const record of additions) {
      lines.push(`- ${formatRecord(record)}`);
    }
    lines.push("");
  }

  if (removals.length > 0) {
    lines.push("## Removals");
    for (const record of removals) {
      lines.push(`- ${formatRecord(record)}`);
    }
    lines.push("");
  }

  if (merge.missingManualEntries.length > 0) {
    lines.push("## Missing Manual Overrides");
    for (const entry of merge.missingManualEntries) {
      lines.push(`- ${entry.source} → ${entry.target} (#${entry.relation})`);
    }
    lines.push("");
  }

  lines.push("## Next Steps");
  lines.push("- Review oracle.json and merged.json under AI-Agent-Workspace/tmp/fixture-regeneration.");
  lines.push("- If the merged output is correct, replace expected.json with merged.json.");
  lines.push("- Commit manual override updates if new cross-language edges are required.");
  lines.push("");

  return lines.join("\n");
}

function formatRecord(record: EdgeRecord | OracleEdgeRecord): string {
  return `${record.source} → ${record.target} (#${record.relation})`;
}

function contextualizeError(fixtureId: string, error: unknown): Error {
  if (error instanceof Error) {
    return new Error(`Fixture ${fixtureId}: ${error.message}`);
  }
  return new Error(`Fixture ${fixtureId}: ${String(error)}`);
}

void runRegenerationCli(process.argv.slice(2)).catch(error => {
  console.error("TypeScript benchmark regeneration failed.");
  if (error instanceof Error) {
    console.error(error.message);
  } else {
    console.error(error);
  }
  process.exitCode = 1;
});
