#!/usr/bin/env node
import { spawn } from "node:child_process";
import { promises as fs } from "node:fs";
import * as os from "node:os";
import * as path from "node:path";
import process from "node:process";

import {
  extractVendorInventory,
  renderVendorInventory,
  resolveAstFixtureDocPath
} from "./benchmark-doc";
import {
  BenchmarkFixtureDefinition,
  computeIntegrityDigest,
  loadBenchmarkManifest
} from "./benchmark-manifest";
import { materializeFixture } from "./fixtureMaterializer";

type SlopcopSuite = "markdown" | "assets" | "symbols";

interface FixtureDefinition {
  id: string;
  label: string;
  path: string;
  stories?: string[];
  languages?: string[];
  slopcopConfig?: string;
  skipGraphAudit?: boolean;
  slopcopSuites?: SlopcopSuite[];
}

interface FixtureContext {
  definition: FixtureDefinition;
  absolutePath: string;
  slopcopConfigPath: string;
  slopcopSuites: SlopcopSuite[];
}

const REPO_ROOT = path.resolve(path.join(__dirname, "..", ".."));
const FIXTURE_TIMESTAMP = "2025-01-01T00:00:00.000Z";
const TSX_CLI = path.join(REPO_ROOT, "node_modules", "tsx", "dist", "cli.mjs");
const DEFAULT_SLOPCOP_SUITES: readonly SlopcopSuite[] = ["markdown", "assets", "symbols"];
const QUIET_MODE =
  resolveBool(process.env.FIXTURES_VERIFY_QUIET) ??
  resolveBool(process.env.npm_config_quiet) ??
  false;

async function main(): Promise<void> {
  const repoRoot = REPO_ROOT;
  await assertFileExists(TSX_CLI, "tsx CLI entry not found; run npm install before verifying fixtures.");
  const manifest = await loadManifest(repoRoot);
  const contexts = manifest.map(definition => toContext(repoRoot, definition));

  const benchmarkFixtures = await loadBenchmarkManifest(repoRoot);
  const resolveWorkspace = createWorkspaceResolver(repoRoot);

  for (const context of contexts) {
    console.log(`\n=== Fixture: ${context.definition.label} (${context.definition.id}) ===`);
    await verifyFixture(repoRoot, context);
  }

  await verifyBenchmarkIntegrity(repoRoot, benchmarkFixtures, resolveWorkspace);
  await ensureVendorDocsAligned(repoRoot, benchmarkFixtures);

  console.log("\nAll fixture audits completed successfully.");
}

async function loadManifest(repoRoot: string): Promise<FixtureDefinition[]> {
  const manifestPath = path.join(repoRoot, "tests", "integration", "fixtures", "fixtures.manifest.json");
  const raw = await fs.readFile(manifestPath, "utf8");
  const parsed = JSON.parse(raw);

  if (!Array.isArray(parsed)) {
    throw new Error("Fixture manifest must be an array");
  }

  return parsed as FixtureDefinition[];
}

function toContext(repoRoot: string, definition: FixtureDefinition): FixtureContext {
  const absolutePath = path.resolve(repoRoot, definition.path);
  const slopcopConfigPath = path.resolve(
    repoRoot,
    definition.slopcopConfig ?? "slopcop.config.json"
  );
  const requestedSuites = definition.slopcopSuites ?? DEFAULT_SLOPCOP_SUITES;
  const suites = requestedSuites.filter((suite, index, all) =>
    DEFAULT_SLOPCOP_SUITES.includes(suite) && all.indexOf(suite) === index
  );
  const normalizedSuites = suites.length > 0 ? suites : [...DEFAULT_SLOPCOP_SUITES];

  return {
    definition,
    absolutePath,
    slopcopConfigPath,
    slopcopSuites: normalizedSuites
  };
}

async function verifyFixture(repoRoot: string, context: FixtureContext): Promise<void> {
  await ensureDirectory(context.absolutePath);

  const tempRoot = await fs.mkdtemp(path.join(os.tmpdir(), `fixture-${context.definition.id}-`));
  try {
    const dbPath = path.join(tempRoot, `${context.definition.id}.db`);
    const snapshotPath = path.join(tempRoot, `${context.definition.id}.json`);

    await runSnapshot(repoRoot, context.absolutePath, dbPath, snapshotPath);
    if (context.definition.skipGraphAudit) {
      console.log("→ graph:audit (skipped)");
    } else {
      await runAudit(repoRoot, dbPath, context.absolutePath);
    }
    await runSlopcopSuites(repoRoot, context);
  } finally {
    await fs.rm(tempRoot, { recursive: true, force: true });
  }
}

async function ensureDirectory(candidate: string): Promise<void> {
  const stats = await fs.stat(candidate).catch(() => undefined);
  if (!stats || !stats.isDirectory()) {
    throw new Error(`Fixture directory missing: ${candidate}`);
  }
}

async function assertFileExists(filePath: string, message: string): Promise<void> {
  try {
    const stats = await fs.stat(filePath);
    if (!stats.isFile()) {
      throw new Error(message);
    }
  } catch {
    throw new Error(message);
  }
}

async function runSnapshot(
  repoRoot: string,
  workspaceRoot: string,
  dbPath: string,
  outputPath: string
): Promise<void> {
  const tsxCli = TSX_CLI;
  const tsconfig = path.join(repoRoot, "tsconfig.base.json");
  const scriptPath = path.join(repoRoot, "scripts", "graph-tools", "snapshot-workspace.ts");

  await runProcess(
    "graph:snapshot",
    process.execPath,
    [
      tsxCli,
      "--tsconfig",
      tsconfig,
      scriptPath,
      "--workspace",
      workspaceRoot,
      "--db",
      dbPath,
      "--output",
      outputPath,
      "--timestamp",
      FIXTURE_TIMESTAMP,
      "--quiet"
    ],
    workspaceRoot
  );
}

async function runAudit(repoRoot: string, dbPath: string, workspaceRoot: string): Promise<void> {
  const tsxCli = TSX_CLI;
  const tsconfig = path.join(repoRoot, "tsconfig.base.json");
  const scriptPath = path.join(repoRoot, "scripts", "graph-tools", "audit-doc-coverage.ts");

  const args = [
    tsxCli,
    "--tsconfig",
    tsconfig,
    scriptPath,
    "--db",
    dbPath,
    "--workspace",
    workspaceRoot
  ];

  if (!QUIET_MODE) {
    args.push("--json");
  }

  await runProcess("graph:audit", process.execPath, args, workspaceRoot);
}

async function runSlopcopSuites(repoRoot: string, context: FixtureContext): Promise<void> {
  const tsxCli = TSX_CLI;
  const tsconfig = path.join(repoRoot, "tsconfig.base.json");
  if (context.slopcopSuites.length === 0) {
    console.log("→ slopcop (skipped)");
    return;
  }

  const suiteScripts: Record<SlopcopSuite, string> = {
    markdown: path.join(repoRoot, "scripts", "slopcop", "check-markdown-links.ts"),
    assets: path.join(repoRoot, "scripts", "slopcop", "check-asset-paths.ts"),
    symbols: path.join(repoRoot, "scripts", "slopcop", "check-symbols.ts")
  } as const;

  for (const suite of context.slopcopSuites) {
    const args = [
      tsxCli,
      "--tsconfig",
      tsconfig,
      suiteScripts[suite],
      "--workspace",
      context.absolutePath,
      "--config",
      context.slopcopConfigPath
    ];

    if (!QUIET_MODE) {
      args.push("--json");
    }

    await runProcess(`slopcop:${suite}`, process.execPath, args, context.absolutePath);
  }
}

type WorkspaceResolver = (fixture: BenchmarkFixtureDefinition) => Promise<string>;

async function verifyBenchmarkIntegrity(
  repoRoot: string,
  fixtures: BenchmarkFixtureDefinition[],
  resolveWorkspace: WorkspaceResolver
): Promise<void> {
  const candidates = fixtures.filter(fixture => fixture.integrity);
  if (candidates.length === 0) {
    return;
  }

  console.log("\n=== Benchmark Fixture Integrity ===");
  for (const fixture of candidates) {
    const workspaceRoot = await resolveWorkspace(fixture);
    const digest = await computeIntegrityDigest(repoRoot, fixture, workspaceRoot);
    const expected = fixture.integrity!;
    if (digest.rootHash !== expected.rootHash) {
      throw new Error(
        `Integrity mismatch for fixture ${fixture.id}. Expected root ${expected.rootHash} but computed ${digest.rootHash}.`
      );
    }
    console.log(`→ integrity:${fixture.id} (${digest.fileCount} files)`);
  }
}

function createWorkspaceResolver(repoRoot: string): WorkspaceResolver {
  const cache = new Map<string, string>();

  return async fixture => {
    const cached = cache.get(fixture.id);
    if (cached) {
      return cached;
    }

    const { workspaceRoot } = await materializeFixture(repoRoot, fixture);
    cache.set(fixture.id, workspaceRoot);
    return workspaceRoot;
  };
}

async function ensureVendorDocsAligned(
  repoRoot: string,
  fixtures: BenchmarkFixtureDefinition[]
): Promise<void> {
  const docPath = resolveAstFixtureDocPath(repoRoot);

  const vendorBlock = renderVendorInventory(fixtures, { repoRoot, docPath }).trim();
  const docContent = await fs.readFile(docPath, "utf8");
  const currentBlock = extractVendorInventory(docContent).trim();

  if (normalizeNewlines(vendorBlock) !== normalizeNewlines(currentBlock)) {
    throw new Error(
      "Vendored AST fixture inventory is out of sync with manifest integrity metadata. Run `npm run fixtures:sync-docs`."
    );
  }

  console.log("→ docs:vendor-inventory");
}

function normalizeNewlines(candidate: string): string {
  return candidate.replace(/\r\n/g, "\n");
}

function resolveBool(value: string | undefined): boolean | undefined {
  if (value === undefined) {
    return undefined;
  }
  const normalized = value.trim().toLowerCase();
  if (["", "1", "true", "yes", "on"].includes(normalized)) {
    return true;
  }
  if (["0", "false", "no", "off"].includes(normalized)) {
    return false;
  }
  return undefined;
}

async function runProcess(
  label: string,
  command: string,
  args: string[],
  cwd: string
): Promise<void> {
  await new Promise<void>((resolve, reject) => {
    console.log(`→ ${label}`);
    const child = spawn(command, args, {
      cwd,
      stdio: "inherit"
    });

    child.on("error", reject);
    child.on("exit", code => {
      if (code === 0) {
        resolve();
        return;
      }
      reject(new Error(`${label} failed with exit code ${code ?? "null"}`));
    });
  });
}

void main().catch(error => {
  console.error("Fixture verification failed.");
  if (error instanceof Error) {
    console.error(error.message);
  }
  process.exit(1);
});
