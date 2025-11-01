#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, "..");
const CLEAN_DIST = path.join(REPO_ROOT, "tests", "integration", "clean-dist.mjs");
const TSC_BIN = path.join(REPO_ROOT, "node_modules", "typescript", "lib", "tsc.js");
const TSCONFIG = path.join(REPO_ROOT, "tests", "integration", "tsconfig.json");
const DIST_ROOT = path.join(REPO_ROOT, "tests", "integration", "dist");
const MOCHA_BIN = path.join(REPO_ROOT, "node_modules", "mocha", "bin", "mocha.js");

const SUITES = new Map([
  ["ast", "benchmarks/astAccuracy.test.js"],
  ["rebuild", "benchmarks/rebuildStability.test.js"]
]);

function isTruthyConfig(value) {
  if (value === undefined) {
    return false;
  }
  const normalized = String(value).toLowerCase();
  return ["", "1", "true", "yes", "on"].includes(normalized);
}

function printUsage() {
  console.log(`Usage: npm run test:benchmarks [-- <options>]

Options:
  --ast-only              Run only the AST accuracy benchmark suite.
  --rebuild-only          Run only the rebuild stability benchmark suite.
  --suite <name>          Run a named suite (ast, rebuild). Can be repeated.
  --mode <name>           Override BENCHMARK_MODE (ast, self-similarity, all).
  --all                   Run all benchmark suites (default).
  --show-suites, --list   List available suites and exit.
  -h, --help              Show this help message.
`);
}

function listSuites() {
  console.log("Available benchmark suites:");
  for (const [name, relativePath] of SUITES) {
    console.log(`  ${name.padEnd(8)} ${relativePath}`);
  }
}

function parseArgs(argv) {
  let mode = normalizeMode(process.env.BENCHMARK_MODE ?? process.env.npm_config_mode);
  let suites = null;
  let showSuites = false;
  let help = false;

  if (isTruthyConfig(process.env.npm_config_ast_only)) {
    suites = new Set(["ast"]);
    if (!mode) {
      mode = "ast";
    }
  }

  if (isTruthyConfig(process.env.npm_config_rebuild_only)) {
    suites = new Set(["rebuild"]);
  }

  if (isTruthyConfig(process.env.npm_config_all)) {
    suites = new Set(SUITES.keys());
  }

  const suiteConfig = process.env.npm_config_suite;
  if (suiteConfig) {
    suites = addSuite(suites, suiteConfig);
  }

  const suitesConfig = process.env.npm_config_suites;
  if (suitesConfig) {
    for (const candidate of suitesConfig.split(",")) {
      if (candidate.trim().length > 0) {
        suites = addSuite(suites, candidate.trim());
      }
    }
  }

  if (isTruthyConfig(process.env.npm_config_show_suites) || isTruthyConfig(process.env.npm_config_list)) {
    showSuites = true;
  }

  if (isTruthyConfig(process.env.npm_config_help)) {
    help = true;
  }

  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];

    if (token === "--mode") {
      const value = argv[index + 1];
      if (!value) {
        throw new Error("--mode requires a value");
      }
      mode = normalizeMode(value);
      if (!mode) {
        throw new Error(`Invalid mode: ${value}`);
      }
      index += 1;
      continue;
    }

    if (token.startsWith("--mode=")) {
      const [, value] = token.split("=", 2);
      if (!value) {
        throw new Error("--mode requires a value");
      }
      mode = normalizeMode(value);
      if (!mode) {
        throw new Error(`Invalid mode: ${value}`);
      }
      continue;
    }

    if (token === "--ast-only") {
      suites = new Set(["ast"]);
      if (!mode) {
        mode = "ast";
      }
      continue;
    }

    if (token === "--rebuild-only") {
      suites = new Set(["rebuild"]);
      continue;
    }

    if (token === "--suite") {
      const value = argv[index + 1];
      if (!value) {
        throw new Error("--suite requires a value");
      }
      suites = addSuite(suites, value);
      index += 1;
      continue;
    }

    if (token.startsWith("--suite=")) {
      const [, value] = token.split("=", 2);
      if (!value) {
        throw new Error("--suite requires a value");
      }
      suites = addSuite(suites, value);
      continue;
    }

    if (token === "--all") {
      suites = new Set(SUITES.keys());
      continue;
    }

    if (token === "--show-suites" || token === "--list") {
      showSuites = true;
      continue;
    }

    if (token === "--help" || token === "-h") {
      help = true;
      continue;
    }

    if (token === "--") {
      break;
    }

    throw new Error(`Unknown argument: ${token}`);
  }

  if (suites === null) {
    suites = new Set(SUITES.keys());
  }

  if (suites.size === 0) {
    throw new Error("No benchmark suites selected");
  }

  return { mode, suites, showSuites, help };
}

function addSuite(current, candidate) {
  const normalized = candidate.toLowerCase();
  if (!SUITES.has(normalized)) {
    throw new Error(`Unknown suite: ${candidate}`);
  }
  if (current === null) {
    current = new Set();
  }
  current.add(normalized);
  return current;
}

function normalizeMode(candidate) {
  if (!candidate) {
    return undefined;
  }
  const normalized = String(candidate).toLowerCase();
  if (["ast", "self-similarity", "all"].includes(normalized)) {
    return normalized;
  }
  return undefined;
}

function runStep(label, command, args, options = {}) {
  console.log(`\n=== ${label} ===`);
  const result = spawnSync(command, args, {
    cwd: REPO_ROOT,
    stdio: "inherit",
    ...options
  });
  if (result.error) {
    throw result.error;
  }
  if (result.status !== 0) {
    throw new Error(`${label} failed with exit code ${result.status ?? 1}`);
  }
}

function resolveMode(requestedMode, suites) {
  if (requestedMode) {
    return requestedMode;
  }
  if (suites.size === 1 && suites.has("ast")) {
    return "ast";
  }
  return "self-similarity";
}

function ensureArtifacts(paths) {
  for (const entry of paths) {
    if (!existsSync(entry)) {
      throw new Error(`Expected artifact missing: ${entry}`);
    }
  }
}

function main() {
  let parsed;
  try {
    parsed = parseArgs(process.argv.slice(2));
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
    }
    printUsage();
    process.exit(1);
  }

  if (parsed.help) {
    printUsage();
    process.exit(0);
  }

  if (parsed.showSuites) {
    listSuites();
    process.exit(0);
  }

  const mode = resolveMode(parsed.mode, parsed.suites);
  const env = { ...process.env, BENCHMARK_MODE: mode };

  try {
    runStep("Clean integration dist", process.execPath, [CLEAN_DIST]);
    runStep("Compile integration tests", process.execPath, [TSC_BIN, "-p", TSCONFIG]);

    const suitePaths = Array.from(parsed.suites, name => {
      const relativePath = SUITES.get(name);
      return path.join(DIST_ROOT, relativePath);
    });

    ensureArtifacts([MOCHA_BIN, ...suitePaths]);
    runStep(
      "Run benchmark suites",
      process.execPath,
      [MOCHA_BIN, "--ui", "tdd", "--timeout", "180000", ...suitePaths],
      { env }
    );
  } catch (error) {
    if (error instanceof Error) {
      console.error(`\nBenchmark execution failed: ${error.message}`);
    }
    process.exit(1);
  }
}

main();
