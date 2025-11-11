#!/usr/bin/env node
import { glob } from "glob";
import * as fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import ts from "typescript";

import {
  DEFAULT_LIVE_DOCUMENTATION_CONFIG,
  normalizeLiveDocumentationConfig,
  type LiveDocumentationConfig
} from "@copilot-improvement/shared/config/liveDocumentationConfig";
import { normalizeWorkspacePath } from "@copilot-improvement/shared/tooling/pathUtils";

import { __testUtils } from "../../packages/server/src/features/live-docs/generator";

const {
  collectExportedSymbols,
  collectDependencies,
  inferScriptKind
} = __testUtils;

const MIN_SYMBOL_PRECISION = 0.9;
const MIN_DEPENDENCY_RECALL = 0.8;

interface ComparisonMetrics {
  tp: number;
  fp: number;
  fn: number;
  precision: number;
  recall: number;
  f1: number;
}

interface FileMetrics {
  sourcePath: string;
  symbols: ComparisonMetrics;
  dependencies: ComparisonMetrics;
}

interface Report {
  generatedAt: string;
  workspaceRoot: string;
  summary: {
    symbols: ComparisonMetrics;
    dependencies: ComparisonMetrics;
  };
  files: FileMetrics[];
  skipped: string[];
}

interface ParsedDoc {
  metadataPath: string;
  archetype: string;
  publicSymbols: Set<string>;
  dependencies: Set<string>;
}

async function main(): Promise<void> {
  const workspaceRoot = process.cwd();
  const config = normalizeLiveDocumentationConfig({
    ...DEFAULT_LIVE_DOCUMENTATION_CONFIG
  });

  const docGlob = path.join(config.root, config.baseLayer, "**", "*.mdmd.md");
  const docs = await glob(docGlob, {
    cwd: workspaceRoot,
    absolute: true,
    nodir: true,
    windowsPathsNoEscape: true
  });

  if (docs.length === 0) {
    console.error("No Live Docs found; generate them before running the precision report.");
    process.exit(1);
    return;
  }

  const files: FileMetrics[] = [];
  const skipped: string[] = [];

  let symbolsAggregate = initializeMetrics();
  let dependenciesAggregate = initializeMetrics();

  for (const docAbsolutePath of docs) {
    const content = await fs.readFile(docAbsolutePath, "utf8");
    const parsedDoc = parseLiveDoc(content, docAbsolutePath, workspaceRoot, config);
    if (!parsedDoc) {
      skipped.push(relativize(workspaceRoot, docAbsolutePath));
      continue;
    }

    const sourceAbsolutePath = path.resolve(workspaceRoot, parsedDoc.metadataPath);
    if (!SUPPORTED_EXTENSIONS.has(path.extname(sourceAbsolutePath))) {
      skipped.push(parsedDoc.metadataPath);
      continue;
    }

    let sourceContent: string;
    try {
      sourceContent = await fs.readFile(sourceAbsolutePath, "utf8");
    } catch {
      skipped.push(parsedDoc.metadataPath);
      continue;
    }

    const scriptKind = inferScriptKind(path.extname(sourceAbsolutePath).toLowerCase());
    const sourceFile = ts.createSourceFile(
      sourceAbsolutePath,
      sourceContent,
      ts.ScriptTarget.Latest,
      true,
      scriptKind
    );

    const analyzerSymbols = new Set(
      collectExportedSymbols(sourceFile).map((entry) => entry.name)
    );

    const analyzerDependenciesRaw = await collectDependencies({
      sourceFile,
      absolutePath: sourceAbsolutePath,
      workspaceRoot
    });
    const analyzerDependencies = new Set(
      analyzerDependenciesRaw.map((entry) => entry.resolvedPath ?? entry.specifier)
    );

    const symbolsMetrics = compareSets(analyzerSymbols, parsedDoc.publicSymbols);
    const dependencyMetrics = compareSets(analyzerDependencies, parsedDoc.dependencies);

    files.push({
      sourcePath: parsedDoc.metadataPath,
      symbols: symbolsMetrics,
      dependencies: dependencyMetrics
    });

    symbolsAggregate = accumulateMetrics(symbolsAggregate, symbolsMetrics);
    dependenciesAggregate = accumulateMetrics(dependenciesAggregate, dependencyMetrics);
  }

  const summarySymbols = finalizeMetrics(symbolsAggregate);
  const summaryDependencies = finalizeMetrics(dependenciesAggregate);

  const report: Report = {
    generatedAt: new Date().toISOString(),
    workspaceRoot,
    summary: {
      symbols: summarySymbols,
      dependencies: summaryDependencies
    },
    files: files.map((entry) => ({
      sourcePath: entry.sourcePath,
      symbols: finalizeMetrics(entry.symbols),
      dependencies: finalizeMetrics(entry.dependencies)
    })),
    skipped
  };

  const outputPath = path.join(
    workspaceRoot,
    "reports",
    "benchmarks",
    "live-docs",
    "precision.json"
  );
  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, JSON.stringify(report, null, 2), "utf8");

  console.log("Live Docs precision report written to", relativize(workspaceRoot, outputPath));
  console.log(
    `Symbols — precision ${(summarySymbols.precision * 100).toFixed(2)}%, recall ${(summarySymbols.recall * 100).toFixed(2)}%`
  );
  console.log(
    `Dependencies — precision ${(summaryDependencies.precision * 100).toFixed(2)}%, recall ${(summaryDependencies.recall * 100).toFixed(2)}%`
  );

  const thresholdFailures: string[] = [];
  if (summarySymbols.precision < MIN_SYMBOL_PRECISION) {
    thresholdFailures.push(
      `Symbol precision ${summarySymbols.precision.toFixed(3)} fell below ${MIN_SYMBOL_PRECISION.toFixed(3)}`
    );
  }
  if (summaryDependencies.recall < MIN_DEPENDENCY_RECALL) {
    thresholdFailures.push(
      `Dependency recall ${summaryDependencies.recall.toFixed(3)} fell below ${MIN_DEPENDENCY_RECALL.toFixed(3)}`
    );
  }

  if (thresholdFailures.length > 0) {
    console.error("\nLive Docs precision thresholds not met:");
    for (const failure of thresholdFailures) {
      console.error(`- ${failure}`);
    }
    process.exit(1);
  }
}

const SUPPORTED_EXTENSIONS = new Set([
  ".ts",
  ".tsx",
  ".mts",
  ".cts",
  ".js",
  ".jsx",
  ".mjs",
  ".cjs"
]);

function parseLiveDoc(
  content: string,
  docAbsolutePath: string,
  workspaceRoot: string,
  config: LiveDocumentationConfig
): ParsedDoc | undefined {
  const metadataPathMatch = content.match(/-\s+Code Path:\s+(.+)/);
  if (!metadataPathMatch) {
    return undefined;
  }

  const archetypeMatch = content.match(/-\s+Archetype:\s+(\w+)/);
  const archetype = archetypeMatch ? archetypeMatch[1].toLowerCase() : "implementation";

  const publicSymbolsSection = extractSection(content, "Public Symbols");
  const dependenciesSection = extractSection(content, "Dependencies");

  const docDir = path.dirname(docAbsolutePath);

  return {
    metadataPath: metadataPathMatch[1].trim(),
    archetype,
    publicSymbols: parseSymbolSection(publicSymbolsSection),
    dependencies: parseDependencySection(dependenciesSection, docDir, workspaceRoot, config)
  };
}

function parseSymbolSection(section: string): Set<string> {
  const symbols = new Set<string>();
  const lines = section.split(/\r?\n/);
  for (const line of lines) {
    const bulletMatch = line.match(/-\s+`([^`]+)`/);
    if (bulletMatch) {
      symbols.add(bulletMatch[1]);
      continue;
    }

    const headingMatch = line.match(/^####\s+`([^`]+)`/);
    if (headingMatch) {
      symbols.add(headingMatch[1]);
    }
  }
  return symbols;
}

function parseDependencySection(
  section: string,
  docDir: string,
  workspaceRoot: string,
  config: LiveDocumentationConfig
): Set<string> {
  const dependencies = new Set<string>();
  const lines = section.split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed.startsWith("- ")) {
      continue;
    }
    const remainder = trimmed.slice(2).trim();
    if (!remainder || remainder.startsWith("_")) {
      continue;
    }

    const linkMatch = remainder.match(/^\[([^\]]+)\]\(([^)]+)\)/);
    if (linkMatch) {
      const [, label, target] = linkMatch;
      const resolvedTarget = resolveDependencyTarget(target, docDir, workspaceRoot, config);
      if (resolvedTarget) {
        dependencies.add(resolvedTarget);
        continue;
      }

      const sanitizedLabel = stripInlineCode(label);
      if (sanitizedLabel) {
        dependencies.add(sanitizedLabel);
      }
      continue;
    }

    const [firstToken] = remainder.split(/\s+/);
    if (!firstToken) {
      continue;
    }

    const sanitizedToken = stripInlineCode(firstToken);
    if (!sanitizedToken) {
      continue;
    }

    if (sanitizedToken.startsWith(".")) {
      const resolved = resolveDependencyTarget(sanitizedToken, docDir, workspaceRoot, config);
      if (resolved) {
        dependencies.add(resolved);
      }
      continue;
    }

    dependencies.add(sanitizedToken);
  }
  return dependencies;
}

function stripInlineCode(token: string): string {
  let value = token.trim();
  while (value.startsWith("`")) {
    value = value.slice(1);
  }
  while (value.endsWith("`")) {
    value = value.slice(0, -1);
  }
  return value.trim();
}

function resolveDependencyTarget(
  rawTarget: string,
  docDir: string,
  workspaceRoot: string,
  config: LiveDocumentationConfig
): string | undefined {
  const target = rawTarget.trim();
  if (!target || /^[a-z]+:\/\//i.test(target)) {
    return undefined;
  }

  const pathComponent = target.split("#", 1)[0];
  if (!pathComponent) {
    return undefined;
  }

  const absolute = path.resolve(docDir, pathComponent);
  const workspaceResolved = path.resolve(workspaceRoot);
  const absoluteResolved = path.resolve(absolute);
  if (
    absoluteResolved !== workspaceResolved &&
    !absoluteResolved.startsWith(`${workspaceResolved}${path.sep}`)
  ) {
    return undefined;
  }

  const relative = path.relative(workspaceRoot, absoluteResolved);
  if (!relative) {
    return undefined;
  }

  const normalizedRelative = normalizeWorkspacePath(relative);
  const liveDocsPrefix = normalizeWorkspacePath(path.join(config.root, config.baseLayer));

  if (normalizedRelative === liveDocsPrefix) {
    return undefined;
  }

  if (normalizedRelative.startsWith(`${liveDocsPrefix}/`)) {
    const withoutPrefix = normalizedRelative.slice(liveDocsPrefix.length + 1);
    if (!withoutPrefix.endsWith(".mdmd.md")) {
      return undefined;
    }
    return withoutPrefix.slice(0, -".mdmd.md".length);
  }

  return normalizedRelative;
}

function initializeMetrics(): ComparisonMetrics {
  return {
    tp: 0,
    fp: 0,
    fn: 0,
    precision: 0,
    recall: 0,
    f1: 0
  };
}

function compareSets(expected: Set<string>, actual: Set<string>): ComparisonMetrics {
  const tp = new Set<string>();
  const fp = new Set<string>();
  const fn = new Set<string>();

  for (const value of actual) {
    if (expected.has(value)) {
      tp.add(value);
    } else {
      fp.add(value);
    }
  }

  for (const value of expected) {
    if (!actual.has(value)) {
      fn.add(value);
    }
  }

  return {
    tp: tp.size,
    fp: fp.size,
    fn: fn.size,
    precision: 0,
    recall: 0,
    f1: 0
  };
}

function accumulateMetrics(target: ComparisonMetrics, delta: ComparisonMetrics): ComparisonMetrics {
  target.tp += delta.tp;
  target.fp += delta.fp;
  target.fn += delta.fn;
  return target;
}

function finalizeMetrics(metrics: ComparisonMetrics): ComparisonMetrics {
  const precision = metrics.tp + metrics.fp === 0 ? 1 : metrics.tp / (metrics.tp + metrics.fp);
  const recall = metrics.tp + metrics.fn === 0 ? 1 : metrics.tp / (metrics.tp + metrics.fn);
  const f1 = precision + recall === 0 ? 0 : (2 * precision * recall) / (precision + recall);

  return {
    tp: metrics.tp,
    fp: metrics.fp,
    fn: metrics.fn,
    precision,
    recall,
    f1
  };
}

function relativize(root: string, absolute: string): string {
  return path.relative(root, absolute).split(path.sep).join("/");
}

function extractSection(content: string, section: string): string {
  const begin = `<!-- LIVE-DOC:BEGIN ${section} -->`;
  const end = `<!-- LIVE-DOC:END ${section} -->`;
  const startIndex = content.indexOf(begin);
  const endIndex = content.indexOf(end);
  if (startIndex === -1 || endIndex === -1 || endIndex <= startIndex) {
    return "";
  }
  return content.slice(startIndex + begin.length, endIndex).trim();
}

main().catch((error) => {
  console.error("live-docs:report failed");
  if (error instanceof Error) {
    console.error(error.message);
  }
  process.exit(1);
});