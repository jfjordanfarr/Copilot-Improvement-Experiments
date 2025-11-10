#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";

import {
  DEFAULT_LIVE_DOCUMENTATION_CONFIG,
  type LiveDocumentationConfig,
  type LiveDocumentationConfigInput,
  normalizeLiveDocumentationConfig
} from "@copilot-improvement/shared/config/liveDocumentationConfig";

import { generateLiveDocs } from "../../packages/server/src/features/live-docs/generator";

interface ParsedArgs {
  help: boolean;
  version: boolean;
  workspace?: string;
  root?: string;
  baseLayer?: string;
  globs: string[];
  include: string[];
  configPath?: string;
  dryRun: boolean;
  changedOnly: boolean;
}

type ChangeCounts = Record<"created" | "updated" | "unchanged" | "skipped", number>;

function parseArgs(argv: string[]): ParsedArgs {
  const parsed: ParsedArgs = {
    help: false,
    version: false,
    globs: [],
    include: [],
    dryRun: false,
    changedOnly: false
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

      case "--root": {
        parsed.root = expectValue(argv, ++index, current);
        break;
      }

      case "--base-layer": {
        parsed.baseLayer = expectValue(argv, ++index, current);
        break;
      }

      case "--glob": {
        parsed.globs.push(expectValue(argv, ++index, current));
        break;
      }

      case "--include": {
        parsed.include.push(expectValue(argv, ++index, current));
        break;
      }

      case "--config": {
        parsed.configPath = expectValue(argv, ++index, current);
        break;
      }

      case "--dry-run": {
        parsed.dryRun = true;
        break;
      }

      case "--changed": {
        parsed.changedOnly = true;
        break;
      }

      default: {
        if (current.startsWith("-")) {
          throw new Error(`Unknown option: ${current}`);
        }

        // Treat bare arguments as glob patterns
        const candidate = current.trim();
        if (candidate) {
          parsed.globs.push(candidate);
        }
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

function usage(): string {
  return `Usage: npm run live-docs:generate -- [options]\n\n` +
    `Options:\n` +
    `  --workspace <path>        Workspace root (defaults to current directory).\n` +
    `  --root <path>             Override liveDocumentation.root.\n` +
    `  --base-layer <name>       Override liveDocumentation.baseLayer.\n` +
    `  --glob <pattern>          Additional glob pattern (can repeat).\n` +
    `  --include <pattern>       Target a specific file or glob (can repeat).\n` +
    `  --config <file>           Load configuration from JSON file.\n` +
    `  --dry-run                 Preview changes without writing files.\n` +
    `  --changed                 Limit regeneration to changed files (git status).\n` +
    `  --version                 Print generator version.\n` +
    `  --help                    Display this help text.\n` +
    `\nExamples:\n` +
    `  npm run live-docs:generate\n` +
    `  npm run live-docs:generate -- --dry-run --changed\n` +
    `  npm run live-docs:generate -- --glob packages/**/*.ts --include tests/**/*.ts\n`;
}

async function readConfigFile(configPath: string): Promise<LiveDocumentationConfigInput> {
  const resolved = path.resolve(configPath);
  const raw = await fs.readFile(resolved, "utf8");
  const parsed = JSON.parse(raw) as LiveDocumentationConfigInput;
  return parsed;
}

async function main(): Promise<void> {
  const args = parseArgs(process.argv.slice(2));

  if (args.help) {
    console.log(usage());
    return;
  }

  if (args.version) {
    const version = process.env.LIVE_DOCS_GENERATOR_VERSION ?? "0.1.0";
    console.log(version);
    return;
  }

  const workspaceRoot = path.resolve(args.workspace ?? process.cwd());

  let configInput: LiveDocumentationConfigInput = {};
  if (args.configPath) {
    configInput = await readConfigFile(args.configPath);
  }

  if (args.root) {
    configInput.root = args.root;
  }

  if (args.baseLayer) {
    configInput.baseLayer = args.baseLayer;
  }

  if (args.globs.length > 0) {
    configInput.glob = args.globs;
  }

  const normalizedConfig: LiveDocumentationConfig = normalizeLiveDocumentationConfig({
    ...DEFAULT_LIVE_DOCUMENTATION_CONFIG,
    ...configInput
  });

  const includePatterns = args.include
    .map((entry) => entry.trim())
    .filter(Boolean)
    .map((pattern) => {
      if (path.isAbsolute(pattern)) {
        const relative = path.relative(workspaceRoot, pattern);
        return relative.startsWith("..") ? pattern : relative;
      }
      return pattern;
    });

  const result = await generateLiveDocs({
    workspaceRoot,
    config: normalizedConfig,
    dryRun: args.dryRun,
    changedOnly: args.changedOnly,
    include: includePatterns
  });

  const counts = result.files.reduce<ChangeCounts>(
    (acc, record) => {
      acc[record.change] += 1;
      return acc;
    },
    { created: 0, updated: 0, unchanged: 0, skipped: 0 }
  );

  const dryRunSuffix = args.dryRun ? " (dry-run)" : "";
  console.log(
    `[live-docs] Processed ${result.processed} file(s)${dryRunSuffix}: ${counts.created} created, ${counts.updated} updated, ${counts.unchanged} unchanged, ${counts.skipped} skipped.`
  );

  if (counts.created === 0) {
    return;
  }

  const createdDocs = result.files.filter((record) => record.change === "created");
  const verb = args.dryRun ? "Would create" : "Created";
  const MAX_LISTED = 10;
  const listed = createdDocs.slice(0, MAX_LISTED).map((record) => record.docPath ?? record.sourcePath);
  const remainder = createdDocs.length - listed.length;
  const suffix = remainder > 0 ? `, +${remainder} more` : "";
  console.log(`[live-docs] ${verb} ${createdDocs.length} Live Doc(s): ${listed.join(", ")}${suffix}`);
}

main().catch((error) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`live-docs:generate failed: ${message}`);
  process.exitCode = 1;
});