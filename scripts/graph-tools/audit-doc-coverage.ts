#!/usr/bin/env node
import * as fs from "node:fs";
import * as path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

import {
  GraphStore,
  type ArtifactLayer,
  type KnowledgeArtifact,
  type LinkedArtifactSummary
} from "@copilot-improvement/shared";

interface ParsedArgs {
  helpRequested: boolean;
  jsonOutput: boolean;
  dbPath?: string;
  workspace?: string;
}

interface ArtifactSummary {
  id: string;
  uri: string;
  layer: ArtifactLayer;
}

interface AuditReport {
  totals: {
    artifacts: number;
    code: number;
    documentation: number;
  };
  missingDocumentation: ArtifactSummary[];
  orphanDocuments: ArtifactSummary[];
}

interface GroupedArtifacts {
  group: string;
  entries: ArtifactSummary[];
}

const EXIT_SUCCESS = 0;
const EXIT_INVALID_ARGS = 1;
const EXIT_MISSING_DB = 2;
const EXIT_COVERAGE_GAPS = 3;
const EXIT_UNCAUGHT_ERROR = 4;

const DOCUMENTATION_LAYERS: Set<ArtifactLayer> = new Set([
  "vision",
  "requirements",
  "architecture",
  "implementation"
]);

const KNOWN_ROOT_SEGMENTS = new Set([
  "packages",
  "tests",
  "scripts",
  ".mdmd",
  "specs",
  "data",
  "AI-Agent-Workspace"
]);

function parseArgs(argv: string[]): ParsedArgs {
  const parsed: ParsedArgs = {
    helpRequested: false,
    jsonOutput: false
  };

  for (let index = 0; index < argv.length; index += 1) {
    const current = argv[index];

    switch (current) {
      case "-h":
      case "--help": {
        parsed.helpRequested = true;
        break;
      }

      case "--json": {
        parsed.jsonOutput = true;
        break;
      }

      case "--db": {
        parsed.dbPath = expectValue(argv, ++index, current);
        break;
      }

      case "--workspace": {
        parsed.workspace = expectValue(argv, ++index, current);
        break;
      }

      default: {
        if (current.startsWith("-")) {
          throw new Error(`Unrecognised option: ${current}`);
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
  return (
    "Usage: npm run graph:audit -- [options]\n\n" +
    "Database discovery:\n" +
    "  --db <path>                   Explicit SQLite database path.\n" +
    "  --workspace <path>            Workspace root used to locate .link-aware-diagnostics storage.\n\n" +
    "Output controls:\n" +
    "  --json                       Emit raw JSON instead of formatted text.\n" +
    "  --help                       Display this help text.\n\n" +
    "Examples:\n" +
    "  npm run graph:audit -- --workspace .\n" +
    "  npm run graph:audit -- --db ../.link-aware-diagnostics/link-aware-diagnostics.db --json\n"
  );
}

function resolveReadablePath(uri: string): string {
  if (!uri.startsWith("file://")) {
    return uri;
  }

  const decoded = fileURLToPath(uri);
  const normalized = path.normalize(decoded);
  const segments = normalized.split(path.sep).filter(Boolean);

  const rootIndex = segments.findIndex(segment => KNOWN_ROOT_SEGMENTS.has(segment));
  if (rootIndex === -1) {
    return normalized;
  }

  return segments.slice(rootIndex).join("/");
}

function deriveGroupLabel(artifact: ArtifactSummary): string {
  const readable = resolveReadablePath(artifact.uri);
  const segments = readable.split("/");

  if (segments.length === 0) {
    return "(unknown)";
  }

  const root = segments[0];
  const secondary = segments[1];

  if (root === "packages" && secondary) {
    return `${root}/${secondary}`;
  }

  if (root === "tests" && secondary) {
    return `${root}/${secondary}`;
  }

  if (root === ".mdmd" && secondary) {
    return `${root}/${secondary}`;
  }

  return root;
}

function groupArtifacts(artifacts: ArtifactSummary[]): GroupedArtifacts[] {
  const buckets = new Map<string, ArtifactSummary[]>();

  for (const artifact of artifacts) {
    const label = deriveGroupLabel(artifact);
    const entries = buckets.get(label);
    if (entries) {
      entries.push(artifact);
    } else {
      buckets.set(label, [artifact]);
    }
  }

  return [...buckets.entries()]
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([group, entries]) => ({
      group,
      entries: entries.sort((left, right) => resolveReadablePath(left.uri).localeCompare(resolveReadablePath(right.uri)))
    }));
}

function resolveDatabasePath(options: ParsedArgs): string {
  if (options.dbPath) {
    return path.resolve(options.dbPath);
  }

  const workspace = options.workspace ? path.resolve(options.workspace) : process.cwd();
  return path.join(workspace, ".link-aware-diagnostics", "link-aware-diagnostics.db");
}

function auditCoverage(store: GraphStore): AuditReport {
  const artifacts = store.listArtifacts();
  const cache = new Map<string, LinkedArtifactSummary[]>();

  function getNeighbors(id: string): LinkedArtifactSummary[] {
    let neighbors = cache.get(id);
    if (!neighbors) {
      neighbors = store.listLinkedArtifacts(id);
      cache.set(id, neighbors);
    }
    return neighbors;
  }

  const missingDocumentation: ArtifactSummary[] = [];
  const orphanDocuments: ArtifactSummary[] = [];

  let codeCount = 0;
  let docCount = 0;

  for (const artifact of artifacts) {
    if (artifact.layer === "code") {
      codeCount += 1;
      const neighbors = getNeighbors(artifact.id);
      const hasDocLink = neighbors.some(neighbor => {
        if (neighbor.kind !== "documents") {
          return false;
        }
        return DOCUMENTATION_LAYERS.has(neighbor.artifact.layer as ArtifactLayer);
      });

      if (!hasDocLink) {
        missingDocumentation.push(toSummary(artifact));
      }

      continue;
    }

    if (DOCUMENTATION_LAYERS.has(artifact.layer)) {
      docCount += 1;
      const neighbors = getNeighbors(artifact.id);
      const touchesCode = neighbors.some(neighbor => {
        if (neighbor.kind !== "documents") {
          return false;
        }
        return neighbor.artifact.layer === "code";
      });

      if (!touchesCode) {
        orphanDocuments.push(toSummary(artifact));
      }
    }
  }

  return {
    totals: {
      artifacts: artifacts.length,
      code: codeCount,
      documentation: docCount
    },
    missingDocumentation,
    orphanDocuments
  };
}

function toSummary(artifact: KnowledgeArtifact): ArtifactSummary {
  return {
    id: artifact.id,
    uri: artifact.uri,
    layer: artifact.layer
  };
}

function printReport(report: AuditReport, json: boolean): number {
  if (json) {
    console.log(JSON.stringify(report, null, 2));
    if (report.missingDocumentation.length === 0 && report.orphanDocuments.length === 0) {
      return EXIT_SUCCESS;
    }
    return EXIT_COVERAGE_GAPS;
  }

  console.log("Graph coverage audit");
  console.log(`  Total artifacts: ${report.totals.artifacts}`);
  console.log(`  Code artifacts: ${report.totals.code}`);
  console.log(`  Documentation artifacts: ${report.totals.documentation}`);

  if (report.missingDocumentation.length === 0 && report.orphanDocuments.length === 0) {
    console.log("  ✔ No gaps detected");
    return EXIT_SUCCESS;
  }

  if (report.missingDocumentation.length > 0) {
    console.log("\nCode artifacts missing documentation links:");
    const grouped = groupArtifacts(report.missingDocumentation);
    for (const { group, entries } of grouped) {
      console.log(`  ${group} (${entries.length})`);
      for (const artifact of entries) {
        console.log(`    - ${resolveReadablePath(artifact.uri)} (${artifact.id})`);
      }
    }
  }

  if (report.orphanDocuments.length > 0) {
    console.log("\nLayer 4 documents lacking code relationships:");
    const grouped = groupArtifacts(report.orphanDocuments);
    for (const { group, entries } of grouped) {
      console.log(`  ${group} (${entries.length})`);
      for (const artifact of entries) {
        console.log(`    - ${resolveReadablePath(artifact.uri)} (${artifact.id}) [${artifact.layer}]`);
      }
    }
  }

  return EXIT_COVERAGE_GAPS;
}

function main(): void {
  let parsed: ParsedArgs;
  try {
    parsed = parseArgs(process.argv.slice(2));
  } catch (error) {
    console.error((error as Error).message);
    console.error(usage());
    process.exit(EXIT_INVALID_ARGS);
    return;
  }

  if (parsed.helpRequested) {
    console.log(usage());
    process.exit(EXIT_SUCCESS);
    return;
  }

  const dbPath = resolveDatabasePath(parsed);
  if (!fs.existsSync(dbPath)) {
    console.error(`Graph database not found at ${dbPath}.`);
    console.error("Run the extension or language server once to generate the SQLite cache, or pass --db.");
    process.exit(EXIT_MISSING_DB);
    return;
  }

  const store = new GraphStore({ dbPath });
  try {
    const report = auditCoverage(store);
    const exitCode = printReport(report, parsed.jsonOutput);
    process.exit(exitCode);
  } catch (error) {
    console.error("Failed to audit graph coverage.");
    if (error instanceof Error) {
      console.error(error.stack ?? error.message);
    } else {
      console.error(String(error));
    }
    process.exit(EXIT_UNCAUGHT_ERROR);
  } finally {
    store.close();
  }
}

main();
