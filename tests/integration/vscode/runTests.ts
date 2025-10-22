import { downloadAndUnzipVSCode, runTests } from "@vscode/test-electron";
import { spawnSync } from "child_process";
import * as fs from "fs";
import * as os from "os";
import * as path from "path";

function findRepoRoot(startDir: string): string {
  let current = startDir;
  const { root } = path.parse(current);

  while (current !== root) {
    if (fs.existsSync(path.join(current, "package.json"))) {
      return current;
    }

    current = path.dirname(current);
  }

  throw new Error("Unable to locate repository root");
}

async function main(): Promise<void> {
  try {
    const repoRoot = findRepoRoot(__dirname);
    const extensionDevelopmentPath = path.join(repoRoot, "packages", "extension");
    const extensionTestsPath = path.resolve(__dirname, "suite", "index");
    const integrationWorkspace = path.join(
      repoRoot,
      "tests",
      "integration",
      "fixtures",
      "simple-workspace"
    );
    const { workspacePath, cleanup } = await prepareIntegrationWorkspace(integrationWorkspace);

    if (process.env.SKIP_EXTENSION_BUILD !== "1") {
      buildWorkspace(repoRoot);
    }

    const vscodeExecutablePath = await downloadAndUnzipVSCode({ version: process.env.VSCODE_VERSION ?? "stable" });
    const electronVersion = await readElectronVersion(vscodeExecutablePath);

    if (!process.env.SKIP_NATIVE_REBUILD) {
      rebuildNativeModules(repoRoot, electronVersion);
    }

    if (!process.env.LINK_AWARE_PROVIDER_MODE) {
      process.env.LINK_AWARE_PROVIDER_MODE = "local-only";
    }

    try {
      await runTests({
        vscodeExecutablePath,
        extensionDevelopmentPath,
        extensionTestsPath,
        launchArgs: [workspacePath, "--disable-extensions"]
      });
    } finally {
      await cleanup();
    }
  } catch (error) {
    console.error("Failed to run extension tests", error);
    process.exit(1);
  }
}

void main();

function buildWorkspace(repoRoot: string): void {
  console.log("Building extension and language server bundles...");
  const npmCli = getNpmCliPath();
  const result = spawnSync(process.execPath, [npmCli, "run", "build"], {
    cwd: repoRoot,
    stdio: "inherit"
  });

  if (result.status !== 0) {
    const detail = result.error ? ` (${result.error.message})` : "";
    throw new Error(`npm run build failed with exit code ${result.status ?? "unknown"}${detail}`);
  }
}

async function readElectronVersion(vscodeExecutablePath: string): Promise<string> {
  const appPackagePath = path.resolve(
    path.dirname(vscodeExecutablePath),
    "resources",
    "app",
    "package.json"
  );

  const packageJsonRaw = await fs.promises.readFile(appPackagePath, "utf8");
  const packageJson = JSON.parse(packageJsonRaw) as { devDependencies?: Record<string, string> };
  const electronVersion = packageJson.devDependencies?.electron;

  if (!electronVersion) {
    throw new Error(`Unable to determine Electron version from ${appPackagePath}`);
  }

  return electronVersion.replace(/^\^/, "");
}

function rebuildNativeModules(repoRoot: string, electronVersion: string): void {
  const npmCli = getNpmCliPath();
  const npmArgsPrefix = [npmCli];
  const rebuildArgs = [
    "rebuild",
    "better-sqlite3",
    `--runtime=electron`,
    `--target=${electronVersion}`,
    "--dist-url=https://electronjs.org/headers",
    "--build-from-source"
  ];

  console.log(
    `Rebuilding better-sqlite3 for Electron ${electronVersion} (override with SKIP_NATIVE_REBUILD=1 to skip).`
  );

  const result = spawnSync(process.execPath, [...npmArgsPrefix, ...rebuildArgs], {
    cwd: repoRoot,
    stdio: "inherit",
    env: {
      ...process.env,
      npm_config_build_from_source: "true"
    }
  });

  if (result.status !== 0) {
    const detail = result.error ? ` (${result.error.message})` : "";
    throw new Error(`npm rebuild better-sqlite3 failed with exit code ${result.status ?? "unknown"}${detail}`);
  }
}

function getNpmCliPath(): string {
  return path.resolve(
    path.dirname(process.execPath),
    "node_modules",
    "npm",
    "bin",
    "npm-cli.js"
  );
}

async function prepareIntegrationWorkspace(
  sourceWorkspace: string
): Promise<{ workspacePath: string; cleanup: () => Promise<void> }> {
  const tempRoot = await fs.promises.mkdtemp(path.join(os.tmpdir(), "link-aware-tests-"));
  const workspacePath = path.join(tempRoot, path.basename(sourceWorkspace));
  await fs.promises.cp(sourceWorkspace, workspacePath, { recursive: true });

  return {
    workspacePath,
    cleanup: async () => {
      await fs.promises.rm(tempRoot, { recursive: true, force: true });
    }
  };
}
