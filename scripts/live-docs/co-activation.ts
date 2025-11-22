#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";

import {
  DEFAULT_LIVE_DOCUMENTATION_CONFIG,
  type LiveDocumentationConfigInput,
  normalizeLiveDocumentationConfig
} from "@live-documentation/shared/config/liveDocumentationConfig";
import { buildCoActivationReport, serializeCoActivationReport } from "@live-documentation/shared/live-docs/analysis/coActivation";
import type { Stage0DocLogger } from "@live-documentation/shared/live-docs/types";

import { loadStage0Docs } from "../../packages/server/src/features/live-docs/stage0/docLoader";
import { loadTargetManifest } from "../../packages/server/src/features/live-docs/targets/manifest";

interface ParsedArgs {
  help: boolean;
  version: boolean;
  workspace?: string;
  output?: string;
  dependencyWeight?: number;
  testWeight?: number;
  minWeight?: number;
  configPath?: string;
}

function parseArgs(argv: string[]): ParsedArgs {
  const parsed: ParsedArgs = {
    help: false,
    version: false
  };

  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    switch (token) {
      case "-h":
      case "--help":
        parsed.help = true;
        break;

      case "-v":
      case "--version":
        parsed.version = true;
        break;

      case "--workspace":
        parsed.workspace = expectValue(argv, ++index, token);
        break;

      case "--output":
        parsed.output = expectValue(argv, ++index, token);
        break;

      case "--dependency-weight":
        parsed.dependencyWeight = expectNumeric(argv, ++index, token);
        break;

      case "--test-weight":
        parsed.testWeight = expectNumeric(argv, ++index, token);
        break;

      case "--min-weight":
        parsed.minWeight = expectNumeric(argv, ++index, token);
        break;

      case "--config":
        parsed.configPath = expectValue(argv, ++index, token);
        break;

      default:
        if (token.startsWith("-")) {
          throw new Error(`Unknown option: ${token}`);
        }
    }
  }

  return parsed;
}

function expectValue(argv: string[], index: number, flag: string): string {
  const value = argv[index];
  if (!value || value.startsWith("-")) {
    throw new Error(`Option ${flag} requires a value.`);
  }
  return value;
}

function expectNumeric(argv: string[], index: number, flag: string): number {
  const candidate = expectValue(argv, index, flag);
  const value = Number(candidate);
  if (Number.isNaN(value)) {
    throw new Error(`Option ${flag} requires a numeric value.`);
  }
  return value;
}

function usage(): string {
  return `Usage: npm run live-docs:co-activation -- [options]\n\n` +
    `Options:\n` +
    `  --workspace <path>        Workspace root (defaults to current directory).\n` +
    `  --output <file>           Output path for the report (defaults to data/live-docs/co-activation.json).\n` +
    `  --config <file>           Load live-docs configuration overrides from JSON.\n` +
    `  --dependency-weight <n>   Weight assigned to dependency co-activations (default 1).\n` +
    `  --test-weight <n>         Weight assigned to shared test co-activations (default 1).\n` +
    `  --min-weight <n>          Filter out edges with weight below this threshold (default 0).\n` +
    `  --version                 Print script version.\n` +
    `  --help                    Display this help text.\n`;
}

async function readConfig(configPath: string): Promise<LiveDocumentationConfigInput> {
  const resolved = path.resolve(configPath);
  const raw = await fs.readFile(resolved, "utf8");
  return JSON.parse(raw) as LiveDocumentationConfigInput;
}

async function main(): Promise<void> {
  const args = parseArgs(process.argv.slice(2));

  if (args.help) {
    console.log(usage());
    return;
  }

  if (args.version) {
    const version = process.env.LIVE_DOCS_CO_ACTIVATION_VERSION ?? "0.1.0";
    console.log(version);
    return;
  }

  const workspaceRoot = path.resolve(args.workspace ?? process.cwd());

  let configInput: LiveDocumentationConfigInput = {};
  if (args.configPath) {
    configInput = await readConfig(args.configPath);
  }

  const normalizedConfig = normalizeLiveDocumentationConfig({
    ...DEFAULT_LIVE_DOCUMENTATION_CONFIG,
    ...configInput
  });

  const logger: Stage0DocLogger = {
    warn(message: string) {
      console.warn(`[live-docs-co-activation] ${message}`);
    }
  };

  const stage0Docs = await loadStage0Docs({
    workspaceRoot,
    config: normalizedConfig,
    logger
  });

  if (stage0Docs.length === 0) {
    console.warn("[live-docs-co-activation] No Stage-0 Live Docs found.");
  }

  const manifest = await loadTargetManifest(workspaceRoot);

  const report = buildCoActivationReport({
    stage0Docs,
    manifest,
    dependencyWeight: args.dependencyWeight,
    testWeight: args.testWeight,
    minWeight: args.minWeight
  });

  const outputPath = path.resolve(
    workspaceRoot,
    args.output ?? path.join("data", "live-docs", "co-activation.json")
  );

  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, serializeCoActivationReport(report), "utf8");

  console.log(
    `[live-docs-co-activation] wrote ${report.edges.length} edges, ${report.nodes.length} nodes, ${report.clusters.length} clusters -> ${path.relative(workspaceRoot, outputPath)}`
  );
}

main().catch((error) => {
  console.error("[live-docs-co-activation] Failed:", error);
  process.exitCode = 1;
});
