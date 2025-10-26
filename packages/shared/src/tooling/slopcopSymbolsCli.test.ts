import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import process from "node:process";
import { spawnSync } from "node:child_process";

import { describe, expect, it } from "vitest";

const ROOT = path.resolve(__dirname, "../../../..");
const CLI = path.resolve(ROOT, "scripts/slopcop/check-symbols.ts");
const TSX = require.resolve("tsx/cli");
const TSCONFIG = path.resolve(ROOT, "tsconfig.base.json");
const FIXTURE = path.resolve(ROOT, "tests/integration/fixtures/slopcop-symbols/workspace");

describe("SlopCop symbol CLI", () => {
  it("reports missing anchors and duplicates, then passes once repaired", () => {
    withFixtureWorkspace((workspace) => {
      const firstRun = runCli(workspace);
      expect(firstRun.status).toBe(3);
      const parsed = JSON.parse(firstRun.stdout.trim() || "{}");
      expect(parsed.scannedFiles).toBeGreaterThan(0);
      expect(parsed.issues).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ kind: "duplicate-heading", slug: "overview-1" }),
          expect.objectContaining({ kind: "missing-anchor", slug: "missing" }),
          expect.objectContaining({ kind: "missing-anchor", slug: "unknown" })
        ])
      );

      hydrateWorkspace(workspace);

      const secondRun = runCli(workspace);
      expect(secondRun.status).toBe(0);
      const repaired = JSON.parse(secondRun.stdout.trim() || "{}");
      expect(repaired.issues).toHaveLength(0);
    });
  });
});

function runCli(workspace: string) {
  return spawnSync(process.execPath, [TSX, "--tsconfig", TSCONFIG, CLI, "--workspace", workspace, "--json"], {
    cwd: ROOT,
    encoding: "utf8"
  });
}

function withFixtureWorkspace(callback: (workspace: string) => void): void {
  const target = fs.mkdtempSync(path.join(os.tmpdir(), "slopcop-symbols-fixture-"));
  fs.cpSync(FIXTURE, target, { recursive: true });
  try {
    callback(target);
  } finally {
    fs.rmSync(target, { recursive: true, force: true });
  }
}

function hydrateWorkspace(workspace: string): void {
  const overviewPath = path.join(workspace, "docs/overview.md");
  fs.writeFileSync(
    overviewPath,
    ["# Overview", "", "## Details", "", "# Overview Summary", ""].join("\n"),
    "utf8"
  );

  const indexPath = path.join(workspace, "docs/index.md");
  fs.writeFileSync(
    indexPath,
    [
      "# Home",
      "",
      "See the [Overview](overview.md#overview).",
      "",
      "Repaired [details link](overview.md#details).",
      "",
      "Local [anchor](#unknown).",
      "",
      "## Unknown",
      ""
    ].join("\n"),
    "utf8"
  );
}
