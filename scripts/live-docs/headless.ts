#!/usr/bin/env node
import path from "node:path";
import process from "node:process";

import { runHeadlessHarness } from "../../packages/server/src/features/live-docs/harness/headlessHarness";
import { getScenarioByName, listScenarios } from "../../packages/server/src/features/live-docs/harness/scenarios";

interface ParsedArgs {
  help: boolean;
  list: boolean;
  scenarios: string[];
  output?: string;
  workspace?: string;
  containerSpec: boolean;
  skipSystem: boolean;
  keepWorkspace: boolean;
  dryRun: boolean;
}

function parseArgs(argv: string[]): ParsedArgs {
  const parsed: ParsedArgs = {
    help: false,
    list: false,
    scenarios: [],
    containerSpec: false,
    skipSystem: false,
    keepWorkspace: false,
    dryRun: false
  };

  for (let index = 0; index < argv.length; index += 1) {
    const current = argv[index];
    switch (current) {
      case "-h":
      case "--help": {
        parsed.help = true;
        break;
      }
      case "-l":
      case "--list": {
        parsed.list = true;
        break;
      }
      case "--scenario": {
        parsed.scenarios.push(expectValue(argv, ++index, current));
        break;
      }
      case "--output": {
        parsed.output = expectValue(argv, ++index, current);
        break;
      }
      case "--workspace": {
        parsed.workspace = expectValue(argv, ++index, current);
        break;
      }
      case "--container-spec": {
        parsed.containerSpec = true;
        break;
      }
      case "--skip-system": {
        parsed.skipSystem = true;
        break;
      }
      case "--keep-workspace": {
        parsed.keepWorkspace = true;
        break;
      }
      case "--dry-run": {
        parsed.dryRun = true;
        break;
      }
      default: {
        if (current.startsWith("-")) {
          throw new Error(`Unknown option: ${current}`);
        }
        parsed.scenarios.push(current.trim());
        break;
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
  return [
    "Usage: npm run live-docs:headless -- [options]",
    "",
    "Options:",
    "  --scenario <name>      Scenario to execute (can repeat or provide bare names).",
    "  --list                 List available scenarios and exit.",
    "  --output <dir>         Directory for harness reports (default AI-Agent-Workspace/tmp/headless-harness).",
    "  --workspace <path>     Use an existing workspace instead of copying the fixture.",
    "  --container-spec       Emit a container specification JSON next to the report.",
    "  --skip-system          Skip System Layer materialisation for faster runs.",
    "  --keep-workspace       Preserve copied workspaces for manual inspection.",
    "  --dry-run              Run generator in dry-run mode.",
    "  --help                 Show this help message."
  ].join("\n");
}

async function main(): Promise<void> {
  const args = parseArgs(process.argv.slice(2));

  if (args.help) {
    console.log(usage());
    return;
  }

  if (args.list) {
    console.log("Available headless scenarios:\n");
    for (const scenario of listScenarios()) {
      console.log(`- ${scenario.name}: ${scenario.description}`);
    }
    return;
  }

  if (!args.scenarios.length) {
    console.error("No scenarios provided. Use --scenario <name> or --list to inspect options.");
    process.exitCode = 1;
    return;
  }

  const repoRoot = path.resolve(process.cwd());
  const outputRoot = path.resolve(
    repoRoot,
    args.output ?? path.join("AI-Agent-Workspace", "tmp", "headless-harness")
  );

  for (const name of args.scenarios) {
    const scenario = getScenarioByName(name);
    if (!scenario) {
      console.error(`Unknown scenario '${name}'. Use --list to view options.`);
      process.exitCode = 1;
      return;
    }

    const result = await runHeadlessHarness({
      scenario,
      repoRoot,
      outputRoot,
      workspaceOverride: args.workspace,
      keepWorkspace: args.keepWorkspace,
      emitContainerSpec: args.containerSpec,
      skipSystem: args.skipSystem,
      dryRun: args.dryRun
    });

    console.log(
      `Scenario '${scenario.name}' complete: ${result.generator.written} written, ${result.generator.skipped} skipped.`
    );
    console.log(`Report: ${result.reportPath}`);
    if (result.containerSpecPath) {
      console.log(`Container spec: ${result.containerSpecPath}`);
    }
  }
}

main().catch((error) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`live-docs:headless failed: ${message}`);
  process.exitCode = 1;
});
