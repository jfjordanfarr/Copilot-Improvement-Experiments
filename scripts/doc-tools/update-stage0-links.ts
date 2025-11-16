import { globSync } from "glob";
import fs from "node:fs";
import path from "node:path";

import { DEFAULT_LIVE_DOCUMENTATION_CONFIG } from "../../packages/shared/src/config/liveDocumentationConfig";

const args = process.argv.slice(2);

interface CliOptions {
  globPatterns: string[];
  fileArguments: string[];
}

function parseArgs(raw: string[]): CliOptions {
  const globPatterns: string[] = [];
  const fileArguments: string[] = [];

  for (let index = 0; index < raw.length; index += 1) {
    const token = raw[index];

    if (token === "--glob") {
      const next = raw[index + 1];
      if (!next) {
        throw new Error("--glob option requires a pattern argument");
      }
      globPatterns.push(next);
      index += 1;
      continue;
    }

    if (token.startsWith("--glob=")) {
      const pattern = token.slice("--glob=".length);
      if (!pattern) {
        throw new Error("--glob requires a non-empty pattern");
      }
      globPatterns.push(pattern);
      continue;
    }

    fileArguments.push(token);
  }

  return { globPatterns, fileArguments };
}

let options: CliOptions;
try {
  options = parseArgs(args);
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
  process.exit();
}

if (options.globPatterns.length === 0 && options.fileArguments.length === 0) {
  console.error(
    "Usage: tsx scripts/doc-tools/update-stage0-links.ts [--glob <pattern> ...] <file> [more files]"
  );
  process.exitCode = 1;
  process.exit();
}

const config = DEFAULT_LIVE_DOCUMENTATION_CONFIG;
const stagePrefix = buildStagePrefix(config.root, config.baseLayer);
const stagePrefixWindows = stagePrefix.replace(/\//g, "\\");
const extension = ensureLeadingDot(config.extension);

const legacyPrefixRegex = /\.live-documentation\/source\//g;
const legacyPrefixWindowsRegex = /\\\.live-documentation\\source\\/g;
const extensionRegex = new RegExp(
  `${escapeRegExp(stagePrefix)}[^)\\s]+?\\.md(?!${escapeRegExp(extension)})`,
  "g"
);
const extensionWindowsRegex = new RegExp(
  `${escapeRegExp(stagePrefixWindows)}[^)\\s]+?\\.md(?!${escapeRegExp(extension)})`,
  "g"
);

const filesToProcess = collectFiles(options);

if (filesToProcess.size === 0) {
  console.warn("No files matched the provided arguments.");
  process.exit();
}

for (const absolutePath of filesToProcess) {
  const relativePath = path.relative(process.cwd(), absolutePath);

  if (!fs.existsSync(absolutePath)) {
    console.warn(`Skipping ${relativePath} (not found)`);
    continue;
  }

  const original = fs.readFileSync(absolutePath, "utf8");
  const updated = rewriteStageLinks(original);

  if (original === updated) {
    console.log(`No Stage-0 link updates applied to ${relativePath}`);
    continue;
  }

  fs.writeFileSync(absolutePath, updated, "utf8");
  console.log(`Updated Stage-0 links in ${relativePath}`);
}

function collectFiles(parsed: CliOptions): Set<string> {
  const files = new Set<string>();
  const cwd = process.cwd();

  for (const file of parsed.fileArguments) {
    const absolute = path.resolve(cwd, file);
    files.add(absolute);
  }

  for (const pattern of parsed.globPatterns) {
    const matches = globSync(pattern, {
      cwd,
      nodir: true,
      windowsPathsNoEscape: true,
      dot: true
    });
    for (const match of matches) {
      files.add(path.resolve(cwd, match));
    }
  }

  return files;
}

function rewriteStageLinks(content: string): string {
  let next = content
    .replace(legacyPrefixRegex, stagePrefix)
    .replace(legacyPrefixWindowsRegex, stagePrefixWindows);

  next = next.replace(extensionRegex, match => match.replace(/\.md$/, extension));
  next = next.replace(extensionWindowsRegex, match => match.replace(/\.md$/, extension));

  return next;
}

function ensureLeadingDot(candidate: string): string {
  return candidate.startsWith(".") ? candidate : `.${candidate}`;
}

function buildStagePrefix(root: string, baseLayer: string): string {
  const normalizedRoot = normalizePathSegment(root);
  const normalizedLayer = normalizePathSegment(baseLayer).replace(/^\./, "");
  return `${normalizedRoot}/${normalizedLayer}/`;
}

function normalizePathSegment(segment: string): string {
  const trimmed = segment.trim().replace(/\\/g, "/");
  if (!trimmed) {
    return "";
  }
  const withoutTrailing = trimmed.replace(/\/+$/, "");
  return withoutTrailing.length > 0 ? withoutTrailing : trimmed;
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
