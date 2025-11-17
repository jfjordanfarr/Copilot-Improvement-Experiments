import * as assert from "node:assert";
import * as fs from "node:fs";
import { spawnSync } from "node:child_process";
import * as path from "node:path";

interface InspectRunResult {
  exitCode: number;
  stdout: string;
  stderr: string;
}

const repoRoot = findRepoRoot(__dirname);
const tsxCli = path.join(repoRoot, "node_modules", "tsx", "dist", "cli.mjs");
const tsconfigPath = path.join(repoRoot, "tsconfig.base.json");
const inspectScript = path.join(repoRoot, "scripts", "live-docs", "inspect.ts");
const fixtureWorkspace = path.join(
  repoRoot,
  "tests",
  "integration",
  "fixtures",
  "webforms-appsettings",
  "workspace"
);

function runInspectCli(args: string[]): InspectRunResult {
  const result = spawnSync(
    process.execPath,
    [
      tsxCli,
      "--tsconfig",
      tsconfigPath,
      inspectScript,
      "--workspace",
      fixtureWorkspace,
      ...args
    ],
    {
      encoding: "utf8",
      env: {
        ...process.env,
        ELECTRON_RUN_AS_NODE: "1"
      }
    }
  );

  if (result.error) {
    throw result.error;
  }

  return {
    exitCode: result.status ?? 0,
    stdout: result.stdout ?? "",
    stderr: result.stderr ?? ""
  };
}

function findRepoRoot(startDir: string): string {
  let current = path.resolve(startDir);

  while (true) {
    const candidate = path.join(current, "package.json");
    if (fs.existsSync(candidate)) {
      return current;
    }

    const parent = path.dirname(current);
    if (parent === current) {
      throw new Error("Unable to locate repository root from inspect CLI integration test.");
    }
    current = parent;
  }
}

suite("Live Docs inspect CLI", () => {
  test("finds a dependency path from the WebForms telemetry script to Web.config", () => {
    const run = runInspectCli([
      "--from",
      "packages/site/Scripts/app-insights.js",
      "--to",
      "Web.config",
      "--json"
    ]);

    assert.strictEqual(run.exitCode, 0, `inspect exited ${run.exitCode}:\n${run.stderr || run.stdout}`);
    const payload = JSON.parse(run.stdout) as {
      kind: string;
      direction: string;
      length: number;
      nodes: Array<{ codePath: string }>;
      hops: unknown[];
    };

    assert.strictEqual(payload.kind, "path");
    assert.strictEqual(payload.direction, "outbound");
    assert.strictEqual(payload.length, 3);
    assert.deepStrictEqual(
      payload.nodes.map(node => node.codePath),
      [
        "packages/site/Scripts/app-insights.js",
        "packages/site/Default.aspx",
        "packages/site/Default.aspx.cs",
        "Web.config"
      ]
    );
    assert.strictEqual(payload.hops.length, 3);
  });

  test("enumerates terminal outbound paths when no --to target is supplied", () => {
    const run = runInspectCli([
      "--from",
      "packages/site/Scripts/app-insights.js",
      "--direction",
      "outbound",
      "--json"
    ]);

    assert.strictEqual(run.exitCode, 0, `inspect exited ${run.exitCode}:\n${run.stderr || run.stdout}`);
    const payload = JSON.parse(run.stdout) as {
      kind: string;
      direction: string;
      terminalPaths: Array<{ nodes: Array<{ codePath: string }> }>;
    };

    assert.strictEqual(payload.kind, "fanout");
    assert.strictEqual(payload.direction, "outbound");
    assert.ok(payload.terminalPaths.length > 0);

    const terminalPath = payload.terminalPaths.find(entry =>
      entry.nodes.some(node => node.codePath === "Web.config")
    );

    assert.ok(terminalPath, "expected to discover Web.config terminal path");
    assert.deepStrictEqual(
      terminalPath!.nodes.map(node => node.codePath),
      [
        "packages/site/Scripts/app-insights.js",
        "packages/site/Default.aspx",
        "packages/site/Default.aspx.cs",
        "Web.config"
      ]
    );
  });
});
