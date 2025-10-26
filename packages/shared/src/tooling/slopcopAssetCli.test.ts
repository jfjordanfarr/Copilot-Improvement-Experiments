import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import process from "node:process";
import { spawnSync } from "node:child_process";

import { describe, expect, it } from "vitest";

const ROOT = path.resolve(__dirname, "../../../..");
const CLI = path.resolve(ROOT, "scripts/slopcop/check-asset-paths.ts");
const TSX = require.resolve("tsx/cli");
const TSCONFIG = path.resolve(ROOT, "tsconfig.base.json");
const FIXTURE = path.resolve(ROOT, "tests/integration/fixtures/slopcop-assets/workspace");

describe("SlopCop asset CLI", () => {
  it("reports missing assets and exits successfully once repaired", () => {
    withFixtureWorkspace((workspace) => {
      const firstRun = runCli(workspace);
      expect(firstRun.status).toBe(3);
      const parsed = JSON.parse(firstRun.stdout.trim() || "{}");
      expect(parsed.scannedFiles).toBeGreaterThan(0);
      const missingTargets = parsed.issues.map((issue: { target: string }) => issue.target);
      expect(missingTargets).toEqual(
        expect.arrayContaining([
          "/images/banner@2x.png",
          "/images/missing.png",
          "/images/gallery.png",
          "/images/trailer.jpg",
          "/videos/intro.mp4",
          "/styles/missing.css"
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
  const target = fs.mkdtempSync(path.join(os.tmpdir(), "slopcop-assets-fixture-"));
  fs.cpSync(FIXTURE, target, { recursive: true });
  try {
    callback(target);
  } finally {
    fs.rmSync(target, { recursive: true, force: true });
  }
}

function hydrateWorkspace(workspace: string): void {
  const additions: Array<[string, string]> = [
    ["public/images/banner@2x.png", ""],
    ["public/images/missing.png", ""],
    ["public/images/gallery.png", ""],
    ["public/images/trailer.jpg", ""],
    ["public/images/background.png", ""],
    ["public/fonts/ghost.woff2", ""],
    ["public/videos/intro.mp4", ""],
    ["styles/missing.css", "body {}\n"]
  ];

  for (const [relativePath, content] of additions) {
    const fullPath = path.join(workspace, relativePath);
    fs.mkdirSync(path.dirname(fullPath), { recursive: true });
    fs.writeFileSync(fullPath, content);
  }
}
