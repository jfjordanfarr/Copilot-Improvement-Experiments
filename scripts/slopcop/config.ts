import fs from "node:fs";
import path from "node:path";

export interface SlopcopConfigSection {
  includeGlobs?: string[];
  ignoreGlobs?: string[];
  ignoreTargets?: string[];
  rootDirectories?: string[];
}

export interface SlopcopConfig {
  ignoreGlobs?: string[];
  ignoreTargets?: string[];
  rootDirectories?: string[];
  markdown?: SlopcopConfigSection;
  assets?: SlopcopConfigSection;
  [key: string]: unknown;
}

export const CONFIG_FILE_NAME = "slopcop.config.json";

type SectionKey = "markdown" | "assets";

export function loadSlopcopConfig(workspaceRoot: string): SlopcopConfig {
  const configPath = path.join(workspaceRoot, CONFIG_FILE_NAME);
  if (!fs.existsSync(configPath)) {
    return {};
  }

  try {
    const raw = fs.readFileSync(configPath, "utf8");
    const parsed = JSON.parse(raw);
    if (!isPlainObject(parsed)) {
      throw new Error("Configuration must be an object");
    }

    return normalizeConfig(parsed as Record<string, unknown>);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to read ${CONFIG_FILE_NAME}: ${message}`);
  }
}

export function resolveIgnoreGlobs(
  config: SlopcopConfig,
  section: SectionKey,
  defaults: string[]
): string[] {
  const globalExtras = config.ignoreGlobs ?? [];
  const sectionExtras = config[section]?.ignoreGlobs ?? [];
  return [...defaults, ...globalExtras, ...sectionExtras];
}

export function resolveIncludeGlobs(
  config: SlopcopConfig,
  section: SectionKey,
  defaults: string[]
): string[] {
  const include = config[section]?.includeGlobs;
  if (Array.isArray(include) && include.length > 0) {
    return include.map(String);
  }
  return defaults;
}

export function compileIgnorePatterns(
  config: SlopcopConfig,
  section: SectionKey
): RegExp[] {
  const patterns: string[] = [];
  if (Array.isArray(config.ignoreTargets)) {
    patterns.push(...config.ignoreTargets.map(String));
  }
  const sectionPatterns = config[section]?.ignoreTargets;
  if (Array.isArray(sectionPatterns)) {
    patterns.push(...sectionPatterns.map(String));
  }

  const compiled: RegExp[] = [];
  for (const pattern of patterns) {
    try {
      compiled.push(new RegExp(pattern));
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      throw new Error(`Invalid ignore pattern "${pattern}": ${message}`);
    }
  }
  return compiled;
}

export function resolveRootDirectories(
  config: SlopcopConfig,
  section: SectionKey
): string[] {
  const directories: string[] = [];
  if (Array.isArray(config.rootDirectories)) {
    directories.push(...config.rootDirectories.map(String));
  }
  const sectionDirectories = config[section]?.rootDirectories;
  if (Array.isArray(sectionDirectories)) {
    directories.push(...sectionDirectories.map(String));
  }
  return directories;
}

function normalizeConfig(raw: Record<string, unknown>): SlopcopConfig {
  const normalized: SlopcopConfig = {};

  if (Array.isArray(raw.ignoreGlobs)) {
    normalized.ignoreGlobs = raw.ignoreGlobs.map(String);
  }
  if (Array.isArray(raw.ignoreTargets)) {
    normalized.ignoreTargets = raw.ignoreTargets.map(String);
  }
  if (Array.isArray(raw.rootDirectories)) {
    normalized.rootDirectories = raw.rootDirectories.map(String);
  }

  if (isPlainObject(raw.markdown)) {
    normalized.markdown = normalizeSection(raw.markdown as Record<string, unknown>);
  }
  if (isPlainObject(raw.assets)) {
    normalized.assets = normalizeSection(raw.assets as Record<string, unknown>);
  }

  return normalized;
}

function normalizeSection(section: Record<string, unknown>): SlopcopConfigSection {
  const normalized: SlopcopConfigSection = {};

  if (Array.isArray(section.includeGlobs)) {
    normalized.includeGlobs = section.includeGlobs.map(String);
  }
  if (Array.isArray(section.ignoreGlobs)) {
    normalized.ignoreGlobs = section.ignoreGlobs.map(String);
  }
  if (Array.isArray(section.ignoreTargets)) {
    normalized.ignoreTargets = section.ignoreTargets.map(String);
  }
  if (Array.isArray(section.rootDirectories)) {
    normalized.rootDirectories = section.rootDirectories.map(String);
  }

  return normalized;
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
