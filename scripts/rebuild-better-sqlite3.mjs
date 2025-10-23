#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..");
const moduleDir = path.join(repoRoot, "node_modules", "better-sqlite3");

const argv = process.argv.slice(2);
const FORCE = argv.includes("--force") || process.env.BETTER_SQLITE3_REBUILD_FORCE === "1";

if (!FORCE && process.env.SKIP_BETTER_SQLITE3_REBUILD === "1") {
  console.log("[better-sqlite3] SKIP_BETTER_SQLITE3_REBUILD=1 set; skipping native binary preparation");
  process.exit(0);
}

if (!fs.existsSync(moduleDir)) {
  console.error("better-sqlite3 is not installed. Run 'npm install' before rebuilding.");
  process.exit(1);
}

const nodeVersion = process.versions.node;

console.log(`[better-sqlite3] ensuring native binary for Node ${nodeVersion}`);

function run(command, args, options) {
  const result = spawnSync(command, args, {
    stdio: "inherit",
    ...options
  });
  return result.status === 0;
}

function runNode(args, options) {
  return run(process.execPath, args, options);
}

function tryLocalPrebuild() {
  const candidateBins = [
    path.join(moduleDir, "node_modules", "prebuild-install", "bin.js"),
    path.join(repoRoot, "node_modules", "prebuild-install", "bin.js")
  ];

  for (const bin of candidateBins) {
    if (!fs.existsSync(bin)) {
      continue;
    }

    console.log(`[better-sqlite3] attempting prebuild-install via ${path.relative(repoRoot, bin)}`);
    const succeeded = runNode([bin, "--runtime=node", `--target=${nodeVersion}`], {
      cwd: moduleDir,
      env: {
        ...process.env,
        npm_config_build_from_source: "false"
      }
    });

    if (succeeded) {
      return true;
    }
  }

  return false;
}

function tryNpxPrebuild() {
  const npxCmd = process.platform === "win32" ? "npx.cmd" : "npx";
  if (!fs.existsSync(path.join(path.dirname(process.execPath), "../npx"))) {
    // npx ships with npm; rely on PATH fallback
  }

  console.log("[better-sqlite3] attempting npx prebuild-install (fetching published binaries)");
  return run(npxCmd, ["--yes", "prebuild-install", "--runtime=node", `--target=${nodeVersion}`], {
    cwd: moduleDir,
    env: {
      ...process.env,
      npm_config_build_from_source: "false"
    }
  });
}

function rebuildFromSource() {
  console.log("[better-sqlite3] falling back to npm rebuild (from source)");
  const npmCli = path.resolve(path.dirname(process.execPath), "node_modules", "npm", "bin", "npm-cli.js");
  return runNode([npmCli, "rebuild", "better-sqlite3"], {
    cwd: repoRoot,
    env: {
      ...process.env,
      npm_config_build_from_source: "true"
    }
  });
}

const usedPrebuild = tryLocalPrebuild() || tryNpxPrebuild();

if (usedPrebuild) {
  console.log("[better-sqlite3] prebuilt binary installed successfully");
  process.exit(0);
}

if (rebuildFromSource()) {
  console.log("[better-sqlite3] native module rebuilt from source successfully");
  process.exit(0);
}

console.error("[better-sqlite3] failed to prepare native binary for Node runtimes");
process.exit(1);
