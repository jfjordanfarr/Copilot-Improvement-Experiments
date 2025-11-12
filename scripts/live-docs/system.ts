#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";

import {
  DEFAULT_LIVE_DOCUMENTATION_CONFIG,
  type LiveDocumentationConfigInput,
  normalizeLiveDocumentationConfig
} from "@copilot-improvement/shared/config/liveDocumentationConfig";

import { generateSystemLiveDocs } from "../../packages/server/src/features/live-docs/system/generator";

interface ParsedArgs {
  help: boolean;
  version: boolean;
  workspace?: string;
  configPath?: string;
  output?: string;
  format: string;
  dryRun: boolean;
  clean: boolean;
}

interface ChangeCounts {
  created: number;
  updated: number;
  unchanged: number;
}

const SUPPORTED_FORMATS = new Set(["markdown"]);
const DEFAULT_OUTPUT_RELATIVE = path.join("AI-Agent-Workspace", "tmp", "system-cli-output");

function parseArgs(argv: string[]): ParsedArgs {
  const parsed: ParsedArgs = {
    help: false,
    version: false,
    format: "markdown",
    dryRun: false,
    clean: false
  };

  for (let index = 0; index < argv.length; index += 1) {
    const current = argv[index];

    switch (current) {
      case "-h":
      case "--help": {
        parsed.help = true;
        break;
      }
      case "-v":
      case "--version": {
        parsed.version = true;
        break;
      }
      case "--workspace": {
        parsed.workspace = expectValue(argv, ++index, current);
        break;
      }
      case "--config": {
        parsed.configPath = expectValue(argv, ++index, current);
        break;
      }
      case "--output": {
        parsed.output = expectValue(argv, ++index, current);
        break;
      }
      case "--format": {
        parsed.format = expectValue(argv, ++index, current).toLowerCase();
        break;
      }
      case "--dry-run": {
        parsed.dryRun = true;
        break;
      }
      case "--clean": {
        parsed.clean = true;
        break;
      }
      default: {
        if (current.startsWith("-")) {
          throw new Error(`Unknown option: ${current}`);
        }
        throw new Error(`Unexpected argument: ${current}`);
      }
    }
  }

  if (!SUPPORTED_FORMATS.has(parsed.format)) {
    const available = Array.from(SUPPORTED_FORMATS).join(", ");
    throw new Error(`Unsupported format: ${parsed.format}. Supported formats: ${available}`);
  }

  return parsed;
}

function usage(): string {
  return `Usage: npm run live-docs:system -- [options]\n\n` +
    `Options:\n` +
    `  --workspace <path>   Workspace root (defaults to current directory).\n` +
    `  --config <file>      Load configuration from JSON file.\n` +
    `  --output <dir>       Output directory for materialised System docs (defaults to ${DEFAULT_OUTPUT_RELATIVE}).\n` +
    `  --format <name>      Output format (markdown).\n` +
    `  --clean              Remove the output directory before generation.\n` +
    `  --dry-run            Render documents without writing to disk.\n` +
    `  --version            Print CLI version.\n` +
    `  --help               Display this help text.\n` +
    `\nExamples:\n` +
    `  npm run live-docs:system\n` +
    `  npm run live-docs:system -- --output ./AI-Agent-Workspace/tmp/custom --clean\n` +
    `  npm run live-docs:system -- --dry-run --format markdown`;
}

function expectValue(argv: string[], index: number, flag: string): string {
  const value = argv[index];
  if (!value || value.startsWith("-")) {
    throw new Error(`Option ${flag} requires a value.`);
  }
  return value;
}

async function readConfigFile(configPath: string): Promise<LiveDocumentationConfigInput> {
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
    const version = process.env.LIVE_DOCS_SYSTEM_GENERATOR_VERSION ?? "0.1.0";
    console.log(version);
    return;
  }

  const workspaceRoot = path.resolve(args.workspace ?? process.cwd());

  let configInput: LiveDocumentationConfigInput = {};
  if (args.configPath) {
    configInput = await readConfigFile(args.configPath);
  }

  const normalizedConfig = normalizeLiveDocumentationConfig({
    ...DEFAULT_LIVE_DOCUMENTATION_CONFIG,
    ...configInput
  });

  const outputDir = resolveOutputDirectory(workspaceRoot, args.output ?? DEFAULT_OUTPUT_RELATIVE);

  const result = await generateSystemLiveDocs({
    workspaceRoot,
    config: normalizedConfig,
    dryRun: args.dryRun,
    outputDir,
    cleanOutputDir: args.clean
  });

  const dryRunSuffix = args.dryRun ? " (dry-run)" : "";
  const changeCounts = result.files.reduce<ChangeCounts>(
    (acc, record) => {
      acc[record.change] += 1;
      return acc;
    },
    { created: 0, updated: 0, unchanged: 0 }
  );

  if (result.processed === 0 && !result.documents.length) {
    console.log(`[live-docs-system] No System documents generated${dryRunSuffix}.`);
    return;
  }

  console.log(
    `[live-docs-system] Processed ${result.processed} plan(s)${dryRunSuffix}: ` +
      `${changeCounts.created} created, ${changeCounts.updated} updated, ` +
      `${changeCounts.unchanged} unchanged, ${result.skipped} skipped.`
  );

  const changedFiles = result.files.filter((record) => record.change !== "unchanged");
  const listed = changedFiles
    .slice(0, 10)
    .map((record) => record.docPath);

  if (listed.length > 0) {
    const remainder = changedFiles.length - listed.length;
    const suffix = remainder > 0 ? `, +${remainder} more` : "";
    const verb = args.dryRun ? "Would write" : "Wrote";
    console.log(`[live-docs-system] ${verb} ${changedFiles.length} document(s) to ${outputDir}: ${listed.join(", ")}${suffix}`);
  } else {
    const verb = args.dryRun ? "Would retain" : "Retained";
    console.log(`[live-docs-system] ${verb} existing materialised views in ${outputDir}.`);
  }
}

function resolveOutputDirectory(workspaceRoot: string, candidate: string): string {
  if (path.isAbsolute(candidate)) {
    return path.normalize(candidate);
  }
  return path.resolve(workspaceRoot, candidate);
}

main().catch((error) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`live-docs:system failed: ${message}`);
  process.exitCode = 1;
});
