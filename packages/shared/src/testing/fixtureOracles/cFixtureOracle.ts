import fs from "node:fs";
import path from "node:path";

export type COracleEdgeRelation = "includes" | "calls";

export type COracleProvenance = "source-include" | "function-call" | "manual-override";

export interface COracleEdge {
  source: string;
  target: string;
  relation: COracleEdgeRelation;
  provenance: COracleProvenance;
}

export interface COracleEdgeRecord {
  source: string;
  target: string;
  relation: string;
}

export interface CFixtureOracleOptions {
  fixtureRoot: string;
  include?: string[];
  exclude?: string[];
}

export interface COracleOverrideEntry {
  source: string;
  target: string;
  relation: string;
}

export interface COracleOverrideConfig {
  manualEdges?: COracleOverrideEntry[];
}

export interface COracleSegmentPartition {
  autoEdges: COracleEdge[];
  matchedManualEdges: COracleEdge[];
  manualEntries: COracleOverrideEntry[];
  missingManualEntries: COracleOverrideEntry[];
}

export interface COracleMergeResult {
  autoEdges: COracleEdge[];
  autoRecords: COracleEdgeRecord[];
  manualRecords: COracleEdgeRecord[];
  matchedManualRecords: COracleEdgeRecord[];
  mergedRecords: COracleEdgeRecord[];
  missingManualEntries: COracleOverrideEntry[];
}

const SOURCE_EXTENSIONS = new Set([".c", ".h"]);
const KEYWORDS = new Set([
  "if",
  "else",
  "for",
  "while",
  "switch",
  "return",
  "sizeof",
  "do",
  "case",
  "break",
  "continue",
  "goto"
]);

const DEFAULT_IGNORE_DIRECTORIES = new Set([
  ".git",
  "node_modules",
  "__pycache__",
  ".idea",
  ".vscode",
  "build",
  "dist",
  "out"
]);

export function generateCFixtureGraph(options: CFixtureOracleOptions): COracleEdge[] {
  const fixtureRoot = path.resolve(options.fixtureRoot);
  const fileMap = collectSourceFiles(fixtureRoot, options.include, options.exclude);
  const functionIndex = buildFunctionIndex(fileMap, fixtureRoot);

  const edges = new Map<string, COracleEdge>();

  for (const [absolutePath, content] of fileMap) {
    const relativePath = toFixtureRelative(absolutePath, fixtureRoot);
    const isTranslationUnit = absolutePath.endsWith(".c");

    if (isTranslationUnit) {
      for (const includeTarget of discoverIncludes(absolutePath, content, fixtureRoot)) {
        const key = edgeKey(relativePath, includeTarget, "includes");
        if (!edges.has(key)) {
          edges.set(key, {
            source: relativePath,
            target: includeTarget,
            relation: "includes",
            provenance: "source-include"
          });
        }
      }
    }

    if (!isTranslationUnit) {
      continue;
    }

    const calls = discoverCalls(content, functionIndex, relativePath);
    for (const target of calls) {
      const key = edgeKey(relativePath, target, "calls");
      if (!edges.has(key)) {
        edges.set(key, {
          source: relativePath,
          target,
          relation: "calls",
          provenance: "function-call"
        });
      }
    }
  }

  return Array.from(edges.values()).sort(compareEdges);
}

export function serializeCOracleEdges(edges: COracleEdge[]): string {
  const payload = edges.map(toRecordFromEdge).sort(compareRecords);
  return JSON.stringify(payload, null, 2) + "\n";
}

export function partitionCOracleSegments(
  edges: COracleEdge[],
  overrides?: COracleOverrideConfig
): COracleSegmentPartition {
  const overrideEntries = overrides?.manualEdges ?? [];
  const overrideMap = new Map<string, COracleOverrideEntry>();
  for (const entry of overrideEntries) {
    overrideMap.set(edgeKey(entry.source, entry.target, entry.relation), entry);
  }

  const autoEdges: COracleEdge[] = [];
  const matchedManualEdges: COracleEdge[] = [];
  const encountered = new Set<string>();

  for (const edge of edges) {
    const key = edgeKey(edge.source, edge.target, edge.relation);
    if (overrideMap.has(key)) {
      matchedManualEdges.push(edge);
      encountered.add(key);
    } else {
      autoEdges.push(edge);
    }
  }

  const missingManualEntries = overrideEntries.filter(entry =>
    !encountered.has(edgeKey(entry.source, entry.target, entry.relation))
  );

  return {
    autoEdges,
    matchedManualEdges,
    manualEntries: overrideEntries,
    missingManualEntries
  };
}

export function mergeCOracleEdges(
  edges: COracleEdge[],
  overrides?: COracleOverrideConfig
): COracleMergeResult {
  const partition = partitionCOracleSegments(edges, overrides);
  const autoRecords = collectRecords(edges.map(toRecordFromEdge));
  const manualRecords = collectRecords(
    (overrides?.manualEdges ?? []).map(toRecordFromOverride)
  );
  const matchedManualRecords = collectRecords(
    partition.matchedManualEdges.map(toRecordFromEdge)
  );

  const merged = new Map<string, COracleEdgeRecord>();
  for (const record of autoRecords) {
    merged.set(edgeKey(record.source, record.target, record.relation), record);
  }
  for (const record of manualRecords) {
    merged.set(edgeKey(record.source, record.target, record.relation), record);
  }

  const mergedRecords = Array.from(merged.values()).sort(compareRecords);

  return {
    autoEdges: edges,
    autoRecords,
    manualRecords,
    matchedManualRecords,
    mergedRecords,
    missingManualEntries: partition.missingManualEntries
  };
}

function collectSourceFiles(
  root: string,
  include?: string[],
  exclude?: string[]
): Map<string, string> {
  const files = new Map<string, string>();
  const includeSet = new Set((include ?? []).map(candidate => path.resolve(root, candidate)));
  const excludeSet = new Set((exclude ?? []).map(candidate => path.resolve(root, candidate)));

  const visit = (current: string): void => {
    const entries = fs.readdirSync(current, { withFileTypes: true });
    for (const entry of entries) {
      const resolved = path.join(current, entry.name);
      if (entry.isDirectory()) {
        if (!DEFAULT_IGNORE_DIRECTORIES.has(entry.name)) {
          visit(resolved);
        }
        continue;
      }

      if (!entry.isFile()) {
        continue;
      }

      const extension = path.extname(entry.name).toLowerCase();
      if (!SOURCE_EXTENSIONS.has(extension)) {
        continue;
      }

      if (includeSet.size > 0 && !includeSet.has(resolved)) {
        continue;
      }

      if (excludeSet.has(resolved)) {
        continue;
      }

      files.set(resolved, fs.readFileSync(resolved, "utf8"));
    }
  };

  visit(root);
  return files;
}

interface FunctionDefinition {
  name: string;
  body: string;
}

function buildFunctionIndex(fileMap: Map<string, string>, root: string): Map<string, string> {
  const index = new Map<string, string>();
  for (const [filePath, content] of fileMap) {
    if (!filePath.endsWith(".c")) {
      continue;
    }
    const stripped = stripComments(content);
    for (const definition of extractFunctionDefinitions(stripped)) {
      index.set(definition.name, toFixtureRelative(filePath, root));
    }
  }
  return index;
}

function discoverIncludes(
  filePath: string,
  content: string,
  root: string
): string[] {
  const includes: string[] = [];
  const directory = path.dirname(filePath);
  const stripped = stripComments(content);
  const pattern = /#include\s+"([^"]+)"/g;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(stripped))) {
    const candidate = match[1];
    const resolved = path.normalize(path.join(directory, candidate));
    if (!resolved.startsWith(root)) {
      continue;
    }
    if (!fs.existsSync(resolved)) {
      continue;
    }
    const relative = toFixtureRelative(resolved, root);
    includes.push(relative);
  }

  return includes;
}

function discoverCalls(
  content: string,
  functionIndex: Map<string, string>,
  sourceRelative: string
): string[] {
  const stripped = stripComments(content);
  const definitions = extractFunctionDefinitions(stripped);
  const bodies = definitions.map(definition => definition.body);
  const calls: string[] = [];

  for (const body of bodies) {
    const callPattern = /\b([A-Za-z_][A-Za-z0-9_]*)\s*\(/g;
    let match: RegExpExecArray | null;

    while ((match = callPattern.exec(body))) {
      const name = match[1];
      if (KEYWORDS.has(name) || name === "sizeof") {
        continue;
      }
      const target = functionIndex.get(name);
      if (!target) {
        continue;
      }
      if (target === sourceRelative) {
        continue;
      }
      calls.push(target);
    }
  }

  const deduped = new Set(calls);
  return Array.from(deduped.values()).sort((left, right) => left.localeCompare(right));
}

function stripComments(content: string): string {
  const withoutBlock = content.replace(/\/\*[\s\S]*?\*\//g, " ");
  return withoutBlock.replace(/\/\/.*$/gm, " ");
}

function extractFunctionDefinitions(content: string): FunctionDefinition[] {
  const results: FunctionDefinition[] = [];
  const pattern = /([A-Za-z_][A-Za-z0-9_\s*]*?)\b([A-Za-z_][A-Za-z0-9_]*)\s*\([^;{}]*\)\s*\{/gm;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(content)) !== null) {
    const name = match[2];
    if (KEYWORDS.has(name)) {
      continue;
    }

    const braceIndex = pattern.lastIndex - 1;
    const body = extractBlock(content, braceIndex);
    if (!body) {
      continue;
    }

    results.push({
      name,
      body
    });
  }

  return results;
}

function extractBlock(content: string, braceIndex: number): string | null {
  let depth = 0;
  let index = braceIndex;
  let end = braceIndex;

  for (; index < content.length; index += 1) {
    const char = content[index];
    if (char === '{') {
      depth += 1;
    } else if (char === '}') {
      depth -= 1;
      if (depth === 0) {
        end = index + 1;
        break;
      }
    }
  }

  if (depth !== 0) {
    return null;
  }

  return content.slice(braceIndex, end);
}

function toFixtureRelative(candidate: string, root: string): string {
  return path.relative(root, candidate).replace(/\\/g, "/");
}

function edgeKey(source: string, target: string, relation: string): string {
  return `${source}→${target}#${relation}`;
}

function toRecordFromEdge(edge: COracleEdge): COracleEdgeRecord {
  return {
    source: edge.source,
    target: edge.target,
    relation: edge.relation
  } satisfies COracleEdgeRecord;
}

function toRecordFromOverride(entry: COracleOverrideEntry): COracleEdgeRecord {
  return {
    source: entry.source,
    target: entry.target,
    relation: entry.relation
  } satisfies COracleEdgeRecord;
}

function collectRecords(records: COracleEdgeRecord[]): COracleEdgeRecord[] {
  const map = new Map<string, COracleEdgeRecord>();
  for (const record of records) {
    const normalized = normalizeRecord(record);
    map.set(edgeKey(normalized.source, normalized.target, normalized.relation), normalized);
  }
  return Array.from(map.values()).sort(compareRecords);
}

function normalizeRecord(record: COracleEdgeRecord): COracleEdgeRecord {
  return {
    source: record.source.replace(/\\/g, "/"),
    target: record.target.replace(/\\/g, "/"),
    relation: record.relation
  } satisfies COracleEdgeRecord;
}

function compareRecords(left: COracleEdgeRecord, right: COracleEdgeRecord): number {
  if (left.source !== right.source) {
    return left.source.localeCompare(right.source);
  }
  if (left.target !== right.target) {
    return left.target.localeCompare(right.target);
  }
  return left.relation.localeCompare(right.relation);
}

function compareEdges(left: COracleEdge, right: COracleEdge): number {
  const recordComparison = compareRecords(toRecordFromEdge(left), toRecordFromEdge(right));
  if (recordComparison !== 0) {
    return recordComparison;
  }
  return left.provenance.localeCompare(right.provenance);
}
