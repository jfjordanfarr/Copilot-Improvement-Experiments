#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const nodeAbi = require("node-abi");

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..");
const moduleDir = path.join(repoRoot, "node_modules", "better-sqlite3");
const buildReleaseDir = path.join(moduleDir, "build", "Release");
const defaultBinaryPath = path.join(buildReleaseDir, "better_sqlite3.node");

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
const nodeAbiVersion = nodeAbi.getAbi(nodeVersion, "node");

console.log(`[better-sqlite3] ensuring native binary for Node ${nodeVersion} (ABI ${nodeAbiVersion})`);

const electronAbiVersion = detectElectronAbi();
const electronTarget = nodeAbi.getTarget(electronAbiVersion, "electron");

if (!electronTarget) {
  console.error(
    `[better-sqlite3] unable to resolve Electron target for ABI ${electronAbiVersion}. ` +
      "Set VSCODE_ELECTRON_ABI or VSCODE_ELECTRON_VERSION explicitly."
  );
  process.exit(1);
}

const electronLabel = `Electron ABI ${electronAbiVersion}`;

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

function tryLocalPrebuild(runtime, target) {
  const candidateBins = [
    path.join(moduleDir, "node_modules", "prebuild-install", "bin.js"),
    path.join(repoRoot, "node_modules", "prebuild-install", "bin.js")
  ];

  for (const bin of candidateBins) {
    if (!fs.existsSync(bin)) {
      continue;
    }

    console.log(
      `[better-sqlite3] attempting prebuild-install via ${path.relative(
        repoRoot,
        bin
      )} (runtime=${runtime}, target=${target})`
    );
    const succeeded = runNode([bin, `--runtime=${runtime}`, `--target=${target}`], {
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

function tryNpxPrebuild(runtime, target) {
  const npxCmd = process.platform === "win32" ? "npx.cmd" : "npx";
  if (!fs.existsSync(path.join(path.dirname(process.execPath), "../npx"))) {
    // npx ships with npm; rely on PATH fallback
  }

  console.log(
    `[better-sqlite3] attempting npx prebuild-install (runtime=${runtime}, target=${target})`
  );
  return run(npxCmd, ["--yes", "prebuild-install", `--runtime=${runtime}`, `--target=${target}`], {
    cwd: moduleDir,
    env: {
      ...process.env,
      npm_config_build_from_source: "false"
    }
  });
}

function rebuildFromSource(runtime, target) {
  console.log(
    `[better-sqlite3] falling back to npm rebuild from source (runtime=${runtime}, target=${target})`
  );
  const npmCli = path.resolve(path.dirname(process.execPath), "node_modules", "npm", "bin", "npm-cli.js");
  const env = {
    ...process.env,
    npm_config_build_from_source: "true",
    npm_config_runtime: runtime,
    npm_config_target: target,
    npm_config_arch: process.arch
  };
  if (runtime === "electron") {
    env.npm_config_disturl = "https://electronjs.org/headers";
  }
  return runNode([npmCli, "rebuild", "better-sqlite3"], {
    cwd: repoRoot,
    env
  });
}

function installPrebuilt(runtime, target) {
  return tryLocalPrebuild(runtime, target) || tryNpxPrebuild(runtime, target);
}

function copyCurrentBinaryToAbiDirectory(abiVersion) {
  const abiDir = path.join(buildReleaseDir, `abi-${abiVersion}`);
  fs.mkdirSync(abiDir, { recursive: true });
  const dest = path.join(abiDir, "better_sqlite3.node");
  fs.copyFileSync(defaultBinaryPath, dest);
  return dest;
}

function ensureBinaryForRuntime(runtime, target, abiVersion, label) {
  console.log(`[better-sqlite3] preparing ${label}`);
  const prepared = installPrebuilt(runtime, target) || rebuildFromSource(runtime, target);
  if (!prepared) {
    throw new Error(`[better-sqlite3] failed to prepare ${label}`);
  }
  const storedPath = copyCurrentBinaryToAbiDirectory(abiVersion);
  console.log(
    `[better-sqlite3] stored ${label} at ${path.relative(moduleDir, storedPath).replace(/\\/g, "/")}`
  );
  return storedPath;
}

let nodeBinaryPath;
try {
  nodeBinaryPath = ensureBinaryForRuntime(
    "node",
    nodeVersion,
    nodeAbiVersion,
    `Node ABI ${nodeAbiVersion}`
  );

  const electronBinaryPath = ensureBinaryForRuntime(
    "electron",
    electronTarget,
    electronAbiVersion,
    electronLabel
  );

  if (nodeBinaryPath && fs.existsSync(nodeBinaryPath)) {
    fs.copyFileSync(nodeBinaryPath, defaultBinaryPath);
    console.log("[better-sqlite3] restored default Node runtime binary");
  }

  console.log(
    `[better-sqlite3] Electron binding ready at ${path
      .relative(moduleDir, electronBinaryPath)
      .replace(/\\/g, "/")}`
  );
  process.exit(0);
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  if (nodeBinaryPath && fs.existsSync(nodeBinaryPath)) {
    try {
      fs.copyFileSync(nodeBinaryPath, defaultBinaryPath);
    } catch (restoreError) {
      console.error("[better-sqlite3] failed to restore Node binary", restoreError);
    }
  }
  process.exit(1);
}

function detectElectronAbi() {
  if (process.env.VSCODE_ELECTRON_ABI) {
    return process.env.VSCODE_ELECTRON_ABI;
  }

  if (process.env.VSCODE_ELECTRON_VERSION) {
    const inferred = nodeAbi.getAbi(process.env.VSCODE_ELECTRON_VERSION, "electron");
    console.log(
      `[better-sqlite3] inferred Electron ABI ${inferred} from VSCODE_ELECTRON_VERSION=${process.env.VSCODE_ELECTRON_VERSION}`
    );
    return inferred;
  }

  const discoveredVersion = findElectronVersionFromInstall();
  if (discoveredVersion) {
    const inferred = nodeAbi.getAbi(discoveredVersion, "electron");
    console.log(
      `[better-sqlite3] detected local VS Code Electron ${discoveredVersion} (ABI ${inferred})`
    );
    return inferred;
  }

  const fallbackAbi = "136"; // Electron 37.x
  console.warn(
    `[better-sqlite3] unable to detect VS Code Electron version automatically; using ABI ${fallbackAbi}. ` +
      "Set VSCODE_ELECTRON_ABI or VSCODE_ELECTRON_VERSION to override."
  );
  return fallbackAbi;
}

function findElectronVersionFromInstall() {
  const candidates = new Set();

  const pushCandidate = candidate => {
    if (candidate) {
      candidates.add(candidate);
    }
  };

  const portable = process.env.VSCODE_PORTABLE;
  if (portable) {
    pushCandidate(path.join(portable, "data", "user-data", "package.json"));
    pushCandidate(path.join(portable, "resources", "app", "package.json"));
  }

  if (process.platform === "win32") {
    const localAppData = process.env.LOCALAPPDATA;
    const programFiles = process.env.PROGRAMFILES;
    const programFilesX86 = process.env["PROGRAMFILES(X86)"];

    pushCandidate(
      localAppData &&
        path.join(localAppData, "Programs", "Microsoft VS Code", "resources", "app", "package.json")
    );
    pushCandidate(
      localAppData &&
        path.join(localAppData, "Programs", "Microsoft VS Code Insiders", "resources", "app", "package.json")
    );
    pushCandidate(
      programFiles &&
        path.join(programFiles, "Microsoft VS Code", "resources", "app", "package.json")
    );
    pushCandidate(
      programFilesX86 &&
        path.join(programFilesX86, "Microsoft VS Code", "resources", "app", "package.json")
    );
  } else if (process.platform === "darwin") {
    pushCandidate(
      "/Applications/Visual Studio Code.app/Contents/Resources/app/package.json"
    );
    pushCandidate(
      "/Applications/Visual Studio Code - Insiders.app/Contents/Resources/app/package.json"
    );
  } else {
    // Linux / others
    pushCandidate("/usr/share/code/resources/app/package.json");
    pushCandidate("/usr/lib/code/resources/app/package.json");
    pushCandidate("/opt/visual-studio-code/resources/app/package.json");
    pushCandidate(path.join(process.env.HOME ?? "", ".vscode-oss", "resources", "app", "package.json"));
  }

  for (const candidate of candidates) {
    if (!candidate) {
      continue;
    }
    try {
      if (!fs.existsSync(candidate)) {
        continue;
      }
      const packageJson = JSON.parse(fs.readFileSync(candidate, "utf8"));
      const versionString =
        typeof packageJson?.devDependencies?.electron === "string"
          ? packageJson.devDependencies.electron
          : typeof packageJson?.dependencies?.electron === "string"
            ? packageJson.dependencies.electron
            : undefined;
      if (!versionString) {
        continue;
      }
      return normaliseVersionSpecifier(versionString);
    } catch (error) {
      // ignore and continue
      console.debug?.("[better-sqlite3] failed to read", candidate, error);
    }
  }

  return undefined;
}

function normaliseVersionSpecifier(raw) {
  if (typeof raw !== "string") {
    return undefined;
  }
  const match = raw.match(/\d+(?:\.\d+){0,2}/);
  return match ? match[0] : undefined;
}
