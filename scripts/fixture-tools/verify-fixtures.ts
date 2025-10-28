#!/usr/bin/env node
import { spawn } from "node:child_process";
import { promises as fs } from "node:fs";
import * as os from "node:os";
import * as path from "node:path";
import process from "node:process";

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

async function main(): Promise<void> {
  const repoRoot = REPO_ROOT;
  await assertFileExists(TSX_CLI, "tsx CLI entry not found; run npm install before verifying fixtures.");
  const manifest = await loadManifest(repoRoot);
  const contexts = manifest.map(definition => toContext(repoRoot, definition));

  for (const context of contexts) {
    console.log(`\n=== Fixture: ${context.definition.label} (${context.definition.id}) ===`);
    await verifyFixture(repoRoot, context);
  }

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

  await runProcess(
    "graph:audit",
    process.execPath,
    [tsxCli, "--tsconfig", tsconfig, scriptPath, "--db", dbPath, "--workspace", workspaceRoot, "--json"],
    workspaceRoot
  );
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
    await runProcess(
      `slopcop:${suite}`,
      process.execPath,
      [
        tsxCli,
        "--tsconfig",
        tsconfig,
        suiteScripts[suite],
        "--workspace",
        context.absolutePath,
        "--config",
        context.slopcopConfigPath,
        "--json"
      ],
      context.absolutePath
    );
  }
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
