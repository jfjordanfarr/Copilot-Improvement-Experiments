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
  strictSymbols: boolean;
  dbPath?: string;
  workspace?: string;
}

interface ArtifactSummary {
  id: string;
  uri: string;
  layer: ArtifactLayer;
}

interface ExportedSymbol {
  name: string;
  kind?: string;
  isDefault?: boolean;
  isTypeOnly?: boolean;
}

interface SymbolCoverageGap {
  artifact: ArtifactSummary;
  symbol: ExportedSymbol;
}

interface SymbolCoverageTotals {
  total: number;
  documented: number;
  undocumented: number;
}

interface AuditReport {
  totals: {
    artifacts: number;
    code: number;
    documentation: number;
  };
  missingDocumentation: ArtifactSummary[];
  orphanDocuments: ArtifactSummary[];
  symbolCoverage: {
    totals: SymbolCoverageTotals;
    gaps: SymbolCoverageGap[];
  };
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
const EXIT_SYMBOL_GAPS = 5;

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

interface SymbolCoverageIgnoreConfig {
  artifactGlobs: string[];
}

interface CompiledGlobPattern {
  original: string;
  regex: RegExp;
}

interface AuditOptions {
  symbolIgnorePatterns: CompiledGlobPattern[];
}

const EMPTY_AUDIT_OPTIONS: AuditOptions = {
  symbolIgnorePatterns: []
};

function parseArgs(argv: string[]): ParsedArgs {
  const parsed: ParsedArgs = {
    helpRequested: false,
    jsonOutput: false,
    strictSymbols: false
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

      case "--strict-symbols": {
        parsed.strictSymbols = true;
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
    "  --strict-symbols             Treat undocumented exported symbols as fatal gaps.\n" +
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

function auditCoverage(store: GraphStore, options: AuditOptions = EMPTY_AUDIT_OPTIONS): AuditReport {
  const artifacts = store.listArtifacts();
  const cache = new Map<string, LinkedArtifactSummary[]>();
  const docSymbolCache = new Map<string, Set<string>>();

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
  const symbolGaps: SymbolCoverageGap[] = [];

  let codeCount = 0;
  let docCount = 0;
  let totalSymbols = 0;
  let documentedSymbols = 0;

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

      const exportedSymbols = readExportedSymbols(artifact.metadata);
      const ignoreSymbols = shouldIgnoreSymbolCoverage(artifact, options.symbolIgnorePatterns);
      if (exportedSymbols.length && !ignoreSymbols) {
        const docNeighbors = neighbors.filter(neighbor => {
          if (neighbor.kind !== "documents") {
            return false;
          }

          return DOCUMENTATION_LAYERS.has(neighbor.artifact.layer as ArtifactLayer);
        });

        const referencedSymbols = collectReferencedSymbols(docNeighbors, docSymbolCache);

        for (const symbol of exportedSymbols) {
          if (!symbol.name || symbol.name === "default") {
            continue;
          }

          totalSymbols += 1;
          if (referencedSymbols.has(symbol.name)) {
            documentedSymbols += 1;
          } else {
            symbolGaps.push({
              artifact: toSummary(artifact),
              symbol
            });
          }
        }
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
    orphanDocuments,
    symbolCoverage: {
      totals: {
        total: totalSymbols,
        documented: documentedSymbols,
        undocumented: Math.max(totalSymbols - documentedSymbols, 0)
      },
      gaps: symbolGaps
    }
  };
}

function toSummary(artifact: KnowledgeArtifact): ArtifactSummary {
  return {
    id: artifact.id,
    uri: artifact.uri,
    layer: artifact.layer
  };
}

function printReport(report: AuditReport, options: { json: boolean; strictSymbols: boolean }): number {
  const { json, strictSymbols } = options;

  if (json) {
    console.log(JSON.stringify(report, null, 2));
    if (
      report.missingDocumentation.length === 0 &&
      report.orphanDocuments.length === 0 &&
      (report.symbolCoverage.gaps.length === 0 || !strictSymbols)
    ) {
      return EXIT_SUCCESS;
    }
    if (strictSymbols && report.symbolCoverage.gaps.length > 0) {
      return EXIT_SYMBOL_GAPS;
    }
    if (report.missingDocumentation.length === 0 && report.orphanDocuments.length === 0) {
      return EXIT_SUCCESS;
    }
    return EXIT_COVERAGE_GAPS;
  }

  console.log("Graph coverage audit");
  console.log(`  Total artifacts: ${report.totals.artifacts}`);
  console.log(`  Code artifacts: ${report.totals.code}`);
  console.log(`  Documentation artifacts: ${report.totals.documentation}`);

  const hasDocGaps = report.missingDocumentation.length > 0 || report.orphanDocuments.length > 0;
  const hasSymbolGaps = report.symbolCoverage.gaps.length > 0;

  if (!hasDocGaps) {
    console.log("  ✔ No file-level documentation gaps detected");
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

  const symbolTotals = report.symbolCoverage.totals;
  if (symbolTotals.total > 0) {
    const coveragePercentage = symbolTotals.total === 0 ? 100 : Math.round((symbolTotals.documented / symbolTotals.total) * 100);
    console.log("\nSymbol coverage preview:");
    console.log(
      `  Documented exports: ${symbolTotals.documented}/${symbolTotals.total} (${coveragePercentage}% coverage)`
    );
  }

  if (report.symbolCoverage.gaps.length > 0) {
    console.log("\nExports lacking MDMD symbol references:");
    const grouped = groupSymbolGaps(report.symbolCoverage.gaps);
    for (const { group, entries } of grouped) {
      console.log(`  ${group}`);
      for (const gap of entries) {
        const readable = resolveReadablePath(gap.artifact.uri);
        const kindLabel = gap.symbol.kind ? ` (${gap.symbol.kind})` : "";
        console.log(`    - ${readable} :: ${gap.symbol.name}${kindLabel}`);
      }
    }
  }

  if (!hasDocGaps && (!hasSymbolGaps || !strictSymbols)) {
    return EXIT_SUCCESS;
  }

  if (strictSymbols && hasSymbolGaps) {
    return EXIT_SYMBOL_GAPS;
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

  const workspaceRoot = parsed.workspace ? path.resolve(parsed.workspace) : process.cwd();
  const ignoreConfig = loadSymbolCoverageIgnoreConfig(workspaceRoot);
  const compiledIgnores = compileGlobPatterns(ignoreConfig.artifactGlobs);

  const dbPath = resolveDatabasePath(parsed);
  if (!fs.existsSync(dbPath)) {
    console.error(`Graph database not found at ${dbPath}.`);
    console.error("Run the extension or language server once to generate the SQLite cache, or pass --db.");
    process.exit(EXIT_MISSING_DB);
    return;
  }

  const store = new GraphStore({ dbPath });
  try {
    const report = auditCoverage(store, { symbolIgnorePatterns: compiledIgnores });
    const exitCode = printReport(report, { json: parsed.jsonOutput, strictSymbols: parsed.strictSymbols });
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

function loadSymbolCoverageIgnoreConfig(workspaceRoot: string): SymbolCoverageIgnoreConfig {
  const configPath = path.join(workspaceRoot, "symbol-coverage.ignore.json");
  if (!fs.existsSync(configPath)) {
    return { artifactGlobs: [] };
  }

  try {
    const contents = fs.readFileSync(configPath, "utf8");
    const parsed = JSON.parse(contents) as Partial<SymbolCoverageIgnoreConfig>;
    if (!parsed || typeof parsed !== "object") {
      throw new Error("Ignore config must be a JSON object");
    }

    const artifactGlobs = Array.isArray(parsed.artifactGlobs)
      ? parsed.artifactGlobs.filter((entry): entry is string => typeof entry === "string" && entry.trim().length > 0)
      : [];

    return { artifactGlobs };
  } catch (error) {
    console.warn(
      `Failed to read symbol coverage ignore config at ${configPath}: ${error instanceof Error ? error.message : String(error)}.`
    );
    return { artifactGlobs: [] };
  }
}

function compileGlobPatterns(patterns: string[]): CompiledGlobPattern[] {
  return patterns.map(pattern => ({
    original: pattern,
    regex: globToRegExp(pattern)
  }));
}

function globToRegExp(glob: string): RegExp {
  let regex = "";
  for (let index = 0; index < glob.length; index += 1) {
    const char = glob[index];
    if (char === "*") {
      const next = glob[index + 1];
      if (next === "*") {
        regex += ".*";
        index += 1;
        continue;
      }
      regex += "[^/]*";
      continue;
    }

    if (char === "?") {
      regex += "[^/]";
      continue;
    }

    regex += escapeRegex(char);
  }

  return new RegExp(`^${regex}$`);
}

function escapeRegex(character: string): string {
  return character.replace(/[|\\{}()[\]^$+*?.]/g, "\\$&");
}

function shouldIgnoreSymbolCoverage(
  artifact: KnowledgeArtifact,
  patterns: CompiledGlobPattern[]
): boolean {
  if (patterns.length === 0) {
    return false;
  }

  const readable = resolveReadablePath(artifact.uri).replace(/\\/g, "/");
  return patterns.some(pattern => pattern.regex.test(readable));
}

function readExportedSymbols(metadata: Record<string, unknown> | undefined): ExportedSymbol[] {
  if (!metadata) {
    return [];
  }

  const candidate = (metadata as { exportedSymbols?: unknown }).exportedSymbols;
  if (!Array.isArray(candidate)) {
    return [];
  }

  const symbols: ExportedSymbol[] = [];
  for (const entry of candidate) {
    if (!entry || typeof entry !== "object") {
      continue;
    }

    const name = (entry as { name?: unknown }).name;
    if (typeof name !== "string" || name.trim() === "") {
      continue;
    }

    const kind = typeof (entry as { kind?: unknown }).kind === "string" ? String((entry as { kind?: unknown }).kind) : undefined;
    const isDefault = Boolean((entry as { isDefault?: unknown }).isDefault);
    const isTypeOnly = Boolean((entry as { isTypeOnly?: unknown }).isTypeOnly);

    symbols.push({
      name,
      kind,
      isDefault,
      isTypeOnly
    });
  }

  return symbols;
}

function collectReferencedSymbols(
  neighbors: LinkedArtifactSummary[],
  cache: Map<string, Set<string>>
): Set<string> {
  const aggregated = new Set<string>();

  for (const neighbor of neighbors) {
    const artifactId = neighbor.artifact.id;
    let symbols = cache.get(artifactId);
    if (!symbols) {
      symbols = readDocumentSymbolReferences(neighbor.artifact.metadata);
      cache.set(artifactId, symbols);
    }

    for (const symbol of symbols) {
      aggregated.add(symbol);
    }
  }

  return aggregated;
}

function readDocumentSymbolReferences(metadata: Record<string, unknown> | undefined): Set<string> {
  if (!metadata) {
    return new Set();
  }

  const candidate = (metadata as { symbolReferences?: unknown }).symbolReferences;
  if (!Array.isArray(candidate)) {
    return new Set();
  }

  const references = new Set<string>();
  for (const entry of candidate) {
    if (!entry || typeof entry !== "object") {
      continue;
    }

    const symbol = (entry as { symbol?: unknown }).symbol;
    if (typeof symbol === "string" && symbol.trim() !== "") {
      references.add(symbol.trim());
    }
  }

  return references;
}

function groupSymbolGaps(gaps: SymbolCoverageGap[]): GroupedSymbolGaps[] {
  const buckets = new Map<string, SymbolCoverageGap[]>();

  for (const gap of gaps) {
    const key = deriveGroupLabel(gap.artifact);
    const entry = buckets.get(key);
    if (entry) {
      entry.push(gap);
    } else {
      buckets.set(key, [gap]);
    }
  }

  return [...buckets.entries()]
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([group, entries]) => ({
      group,
      entries: entries.sort((left, right) => {
        const leftKey = `${resolveReadablePath(left.artifact.uri)}:${left.symbol.name}`;
        const rightKey = `${resolveReadablePath(right.artifact.uri)}:${right.symbol.name}`;
        return leftKey.localeCompare(rightKey);
      })
    }));
}

interface GroupedSymbolGaps {
  group: string;
  entries: SymbolCoverageGap[];
}
