import { glob } from "glob";
import * as fs from "node:fs/promises";
import path from "node:path";

import {
  type LiveDocumentationConfig,
  normalizeLiveDocumentationConfig
} from "@copilot-improvement/shared/config/liveDocumentationConfig";
import {
  extractAuthoredBlock,
  renderBeginMarker,
  renderEndMarker,
  renderLiveDocMarkdown,
  type LiveDocRenderSection
} from "@copilot-improvement/shared/live-docs/markdown";
import {
  normalizeLiveDocMetadata,
  type LiveDocMetadata,
  type LiveDocProvenance
} from "@copilot-improvement/shared/live-docs/schema";
import { slug as githubSlug } from "@copilot-improvement/shared/tooling/githubSlugger";
import { normalizeWorkspacePath } from "@copilot-improvement/shared/tooling/pathUtils";

import {
  cleanupEmptyParents,
  directoryExists,
  formatRelativePathFromDoc,
  hasMeaningfulAuthoredContent
} from "../generation/core";

type Layer3Archetype =
  | "component"
  | "interaction"
  | "data-model"
  | "workflow"
  | "integration"
  | "testing";

export interface GenerateSystemLiveDocsOptions {
  workspaceRoot: string;
  config?: LiveDocumentationConfig;
  dryRun?: boolean;
  logger?: SystemGeneratorLogger;
  now?: () => Date;
}

export interface SystemLiveDocWriteRecord {
  id: string;
  archetype: Layer3Archetype;
  docPath: string;
  change: "created" | "updated" | "unchanged";
}

export interface SystemLiveDocGeneratorResult {
  processed: number;
  written: number;
  skipped: number;
  deleted: number;
  files: SystemLiveDocWriteRecord[];
  deletedFiles: string[];
}

interface SystemGeneratorLogger {
  info(message: string): void;
  warn(message: string): void;
  error(message: string): void;
}

interface SystemDocPlan {
  id: string;
  archetype: Layer3Archetype;
  slug: string;
  titleSuffix: string;
  componentPaths: string[];
  edgeTuples: Array<{ from: string; to: string }>;
  virtualNodes?: SystemVirtualNode[];
}

interface SystemVirtualNode {
  key: string;
  label: string;
  archetype: "test-summary";
}

interface Stage0Doc {
  sourcePath: string;
  docAbsolutePath: string;
  docRelativePath: string;
  archetype: string;
  dependencies: string[];
  externalModules: string[];
  publicSymbols: Stage0Symbol[];
}

interface Stage0Symbol {
  name: string;
  type: string;
}

const DEFAULT_LOGGER: SystemGeneratorLogger = {
  info: (message) => console.log(`[live-docs-system] ${message}`),
  warn: (message) => console.warn(`[live-docs-system] ${message}`),
  error: (message) => console.error(`[live-docs-system] ${message}`)
};

const LAYER3_PREFIX: Record<Layer3Archetype, string> = {
  component: "COMP",
  interaction: "INT",
  "data-model": "DATA",
  workflow: "FLOW",
  integration: "INTG",
  testing: "TEST"
};

const SUPPORTED_LAYER3_ARCHETYPES: Layer3Archetype[] = [
  "component",
  "interaction",
  "workflow",
  "testing"
];

const SYSTEM_LAYER_NAME = "system";
const LIVE_DOCS_SEGMENT = "live-docs";
const IMPLEMENTATION_ARCHETYPE = "implementation";
const VIRTUAL_NODE_PREFIX = "virtual::";
const RUN_ALL_SCRIPT_PATH = "scripts/live-docs/run-all.ts";

export async function generateSystemLiveDocs(
  options: GenerateSystemLiveDocsOptions
): Promise<SystemLiveDocGeneratorResult> {
  const logger = options.logger ?? DEFAULT_LOGGER;
  const normalizedConfig = normalizeLiveDocumentationConfig(options.config);
  const workspaceRoot = path.resolve(options.workspaceRoot);
  const now = options.now ?? (() => new Date());

  const stage0Docs = await loadStage0Docs({ workspaceRoot, config: normalizedConfig, logger });
  if (stage0Docs.length === 0) {
    logger.info("No Stage-0 Live Docs found; skipping System layer generation.");
    return {
      processed: 0,
      written: 0,
      skipped: 0,
      deleted: 0,
      files: [],
      deletedFiles: []
    };
  }

  const liveDocsDocs = stage0Docs.filter((doc) => doc.sourcePath.includes("live-docs"));
  if (!liveDocsDocs.length) {
    logger.info("No Live Docs stage documents detected; skipping System layer generation.");
    return {
      processed: 0,
      written: 0,
      skipped: 0,
      deleted: 0,
      files: [],
      deletedFiles: []
    };
  }

  const manifest = await loadTargetManifest(workspaceRoot);

  const plans = await buildSystemDocPlans({
    stage0Docs: liveDocsDocs,
    workspaceRoot,
    manifest
  });

  if (!plans.length) {
    logger.info("No System layer plans computed; nothing to render.");
    return {
      processed: 0,
      written: 0,
      skipped: 0,
      deleted: 0,
      files: [],
      deletedFiles: []
    };
  }

  plans.sort((left, right) => left.id.localeCompare(right.id));

  const docMap = new Map(stage0Docs.map((doc) => [doc.sourcePath, doc] as const));

  const referencedImplementationPaths = new Set<string>();
  for (const plan of plans) {
    for (const componentPath of plan.componentPaths) {
      const componentDoc = docMap.get(componentPath);
      if (componentDoc && isImplementationDoc(componentDoc)) {
        referencedImplementationPaths.add(componentPath);
      }
    }
  }

  const missingImplementationPaths = liveDocsDocs
    .filter((doc) => isImplementationDoc(doc) && !isCompiledArtifactPath(doc.sourcePath))
    .map((doc) => doc.sourcePath)
    .filter((sourcePath) => !referencedImplementationPaths.has(sourcePath));

  if (missingImplementationPaths.length > 0) {
    logger.warn(
      `Implementation Live Docs missing System coverage: ${missingImplementationPaths.join(", ")}`
    );
  }

  const results: SystemLiveDocWriteRecord[] = [];
  const generatedDocPaths = new Set<string>();
  let written = 0;
  let skipped = 0;

  for (const plan of plans) {
    const docPaths = resolveSystemDocPaths({
      workspaceRoot,
      config: normalizedConfig,
      archetype: plan.archetype,
      slug: plan.slug
    });
    generatedDocPaths.add(docPaths.relative);

    const existingContent = await readIfExists(docPaths.absolute);
    const authoredBlock = extractAuthoredBlock(existingContent);

    const componentsSection = renderComponentsSection({
      plan,
      stage0Docs: docMap,
      docDir: path.dirname(docPaths.absolute)
    });

    const topologySection = renderTopologySection({
      plan,
      stage0Docs: docMap,
      docDir: path.dirname(docPaths.absolute)
    });

    const sections: LiveDocRenderSection[] = [componentsSection, topologySection];

    const title = `${plan.id} – ${plan.titleSuffix}`;
    const previousGeneratedAt = extractGeneratedAt(existingContent);
    const timestampNow = now().toISOString();
    const initialGeneratedAt = previousGeneratedAt ?? timestampNow;

    const renderDocument = (generatedAt: string): string => {
      const metadata: LiveDocMetadata = normalizeLiveDocMetadata({
        layer: 3,
        archetype: plan.archetype,
        sourcePath: systemMetadataSourcePath(plan),
        liveDocId: plan.id,
        generatedAt,
        provenance: buildProvenance(generatedAt)
      });

      const document = renderLiveDocMarkdown({
        title,
        metadata,
        authoredBlock,
        sections,
        provenance: metadata.provenance
      });

      return metadata.layer === 4 ? document : stripCodePathLine(document);
    };

    let rendered = renderDocument(initialGeneratedAt);
    let change = classifyChange(existingContent, rendered);

    if (change !== "unchanged" && previousGeneratedAt) {
      rendered = renderDocument(timestampNow);
      change = classifyChange(existingContent, rendered);
    }

    results.push({
      id: plan.id,
      archetype: plan.archetype,
      docPath: docPaths.relative,
      change
    });

    if (change === "unchanged") {
      skipped += 1;
      continue;
    }

    if (options.dryRun) {
      written += 1;
      continue;
    }

    await fs.mkdir(path.dirname(docPaths.absolute), { recursive: true });
    await fs.writeFile(docPaths.absolute, rendered, "utf8");
    written += 1;
  }

  const deletedFiles = await pruneStaleSystemDocs({
    workspaceRoot,
    config: normalizedConfig,
    preservedDocPaths: generatedDocPaths,
    dryRun: options.dryRun ?? false,
    logger
  });

  return {
    processed: plans.length,
    written,
    skipped,
    deleted: deletedFiles.length,
    files: results,
    deletedFiles
  };
}

function buildProvenance(generatedAt: string): LiveDocProvenance {
  return {
    generators: [
      {
        tool: "live-docs-system-generator",
        version: process.env.LIVE_DOCS_SYSTEM_GENERATOR_VERSION ?? "0.1.0",
        generatedAt
      }
    ]
  };
}

async function loadStage0Docs(args: {
  workspaceRoot: string;
  config: LiveDocumentationConfig;
  logger: SystemGeneratorLogger;
}): Promise<Stage0Doc[]> {
  const stage0Root = path.resolve(args.workspaceRoot, args.config.root, args.config.baseLayer);
  const exists = await directoryExists(stage0Root);
  if (!exists) {
    return [];
  }

  const files = await glob("**/*.mdmd.md", {
    cwd: stage0Root,
    absolute: true,
    nodir: true,
    dot: false,
    windowsPathsNoEscape: true
  });

  files.sort();

  const stage0Docs: Stage0Doc[] = [];
  for (const absolute of files) {
    const relative = normalizeWorkspacePath(path.relative(args.workspaceRoot, absolute));
    const content = await fs.readFile(absolute, "utf8");
    const parsed = parseStage0Doc({
      content,
      absolutePath: absolute,
      relativeDocPath: relative,
      stage0Root,
      logger: args.logger
    });
    if (parsed) {
      stage0Docs.push(parsed);
    }
  }

  return stage0Docs;
}

function parseStage0Doc(args: {
  content: string;
  absolutePath: string;
  relativeDocPath: string;
  stage0Root: string;
  logger: SystemGeneratorLogger;
}): Stage0Doc | undefined {
  const metadataBlock = extractSection(args.content, "Metadata");
  if (!metadataBlock) {
    args.logger.warn(`Missing metadata block in ${args.relativeDocPath}`);
    return undefined;
  }

  const metadataEntries = parseMetadataLines(metadataBlock);
  const sourcePath = metadataEntries.get("Code Path");
  const archetype = metadataEntries.get("Archetype") ?? "implementation";

  if (!sourcePath) {
    args.logger.warn(`Stage-0 doc ${args.relativeDocPath} is missing Code Path metadata.`);
    return undefined;
  }

  const normalizedSourcePath = normalizeWorkspacePath(sourcePath);

  const dependenciesBlock = extractGeneratedSection(args.content, "Dependencies");
  const dependencyPaths = dependenciesBlock
    ? parseDependencyLinks({
        block: dependenciesBlock,
        docAbsolutePath: args.absolutePath,
        stage0Root: args.stage0Root
      })
    : { stage0Paths: [], externalModules: [] };

  const publicSymbolsBlock = extractGeneratedSection(args.content, "Public Symbols");
  const publicSymbols = publicSymbolsBlock ? parsePublicSymbols(publicSymbolsBlock) : [];

  return {
    sourcePath: normalizedSourcePath,
    docAbsolutePath: args.absolutePath,
    docRelativePath: args.relativeDocPath,
    archetype,
    dependencies: dependencyPaths.stage0Paths,
    externalModules: dependencyPaths.externalModules,
    publicSymbols
  };
}

function extractSection(content: string, heading: string): string | undefined {
  const headingPattern = new RegExp(`^##\\s+${escapeRegExp(heading)}\\s*$`, "m");
  const match = content.match(headingPattern);
  if (!match || match.index === undefined) {
    return undefined;
  }

  const start = match.index + match[0].length;
  const rest = content.slice(start);
  const nextHeading = rest.search(/^##\s+/m);
  const endIndex = nextHeading === -1 ? content.length : start + nextHeading;
  return content.slice(start, endIndex).trim();
}

function extractGeneratedSection(content: string, name: string): string | undefined {
  const begin = renderBeginMarker(name);
  const end = renderEndMarker(name);
  const beginIndex = content.indexOf(begin);
  if (beginIndex === -1) {
    return undefined;
  }
  const start = beginIndex + begin.length;
  const endIndex = content.indexOf(end, start);
  if (endIndex === -1) {
    return undefined;
  }
  return content.slice(start, endIndex).trim();
}

function parseMetadataLines(block: string): Map<string, string> {
  const entries = new Map<string, string>();
  const lines = block.split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed.startsWith("- ")) {
      continue;
    }
    const separatorIndex = trimmed.indexOf(":");
    if (separatorIndex === -1) {
      continue;
    }
    const key = trimmed.slice(2, separatorIndex).trim();
    const value = trimmed.slice(separatorIndex + 1).trim();
    if (key) {
      entries.set(key, value);
    }
  }
  return entries;
}

function parseDependencyLinks(args: {
  block: string;
  docAbsolutePath: string;
  stage0Root: string;
}): { stage0Paths: string[]; externalModules: string[] } {
  const stage0Paths = new Set<string>();
  const externalModules = new Set<string>();

  const lines = args.block.split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed.startsWith("-")) {
      continue;
    }

    const linkMatch = trimmed.match(/\(([^)]+\.mdmd\.md)(#[^)]+)?\)/);
    if (linkMatch) {
      const reference = linkMatch[1];
      const targetAbsolute = path.resolve(path.dirname(args.docAbsolutePath), reference);
      if (targetAbsolute.startsWith(args.stage0Root)) {
        const stage0Relative = targetAbsolute.slice(args.stage0Root.length + 1).replace(/\\/g, "/");
        const sourcePath = stage0Relative.replace(/\.mdmd\.md$/i, "");
        stage0Paths.add(normalizeWorkspacePath(sourcePath));
        continue;
      }
    }

    const codeMatch = trimmed.match(/`([^`]+)`/);
    if (codeMatch) {
      externalModules.add(codeMatch[1]);
    }
  }

  return {
    stage0Paths: Array.from(stage0Paths).sort(),
    externalModules: Array.from(externalModules).sort()
  };
}

function parsePublicSymbols(block: string): Stage0Symbol[] {
  const symbols: Stage0Symbol[] = [];
  const lines = block.split(/\r?\n/);
  let current: Stage0Symbol | undefined;
  for (const line of lines) {
    if (line.startsWith("#### ")) {
      if (current) {
        symbols.push(current);
      }
      const nameMatch = line.match(/`([^`]+)`/);
      current = {
        name: nameMatch ? nameMatch[1] : line.slice(5).trim(),
        type: "symbol"
      };
      continue;
    }

    if (!current) {
      continue;
    }

    const typeMatch = line.match(/-\s+Type:\s+(.+)/);
    if (typeMatch) {
      current.type = typeMatch[1].trim();
    }
  }

  if (current) {
    symbols.push(current);
  }

  return symbols;
}

async function buildSystemDocPlans(args: {
  stage0Docs: Stage0Doc[];
  workspaceRoot: string;
  manifest?: TargetManifest;
}): Promise<SystemDocPlan[]> {
  const stage0PathSet = new Set(args.stage0Docs.map((doc) => doc.sourcePath));
  const stageDescriptors = await extractRunAllStageDescriptors(args.workspaceRoot);
  const stageSequence = buildStageSequence(stageDescriptors, stage0PathSet);

  const plans: SystemDocPlan[] = [];

  const componentPlans = buildComponentPlans({
    stage0Docs: args.stage0Docs,
    stage0PathSet,
    stageSequence
  });
  plans.push(...componentPlans);

  const workflowPlans = buildWorkflowPlans({
    stage0Docs: args.stage0Docs,
    stage0PathSet,
    stageSequence
  });
  plans.push(...workflowPlans);

  const workflowSources = new Set<string>();
  for (const plan of workflowPlans) {
    if (plan.componentPaths.length) {
      workflowSources.add(plan.componentPaths[0]);
    }
  }

  const interactionPlans = buildInteractionPlans({
    stage0Docs: args.stage0Docs,
    stage0PathSet,
    skipSources: workflowSources,
    stageSequence
  });
  plans.push(...interactionPlans);

  const testingPlans = await buildTestingPlans({
    workspaceRoot: args.workspaceRoot,
    stage0Docs: args.stage0Docs,
    stage0PathSet,
    manifest: args.manifest
  });
  plans.push(...testingPlans);

  return plans.filter((plan) => SUPPORTED_LAYER3_ARCHETYPES.includes(plan.archetype));
}

function buildComponentPlans(args: {
  stage0Docs: Stage0Doc[];
  stage0PathSet: Set<string>;
  stageSequence: StageSequence;
}): SystemDocPlan[] {
  const docMap = new Map(args.stage0Docs.map((doc) => [doc.sourcePath, doc] as const));
  const groups = new Map<string, Stage0Doc[]>();
  for (const doc of args.stage0Docs) {
    if (!doc.sourcePath.includes(LIVE_DOCS_SEGMENT)) {
      continue;
    }
    if (!includeInComponents(doc.sourcePath, args.stage0PathSet)) {
      continue;
    }
    if (!isImplementationDoc(doc)) {
      continue;
    }
    const key = deriveComponentKey(doc.sourcePath);
    const bucket = groups.get(key) ?? [];
    bucket.push(doc);
    groups.set(key, bucket);
  }

  const plans: SystemDocPlan[] = [];
  for (const [groupKey, docs] of groups) {
    if (!docs.length) {
      continue;
    }

    const componentPaths = docs
      .map((doc) => doc.sourcePath)
      .filter((sourcePath) => includeInComponents(sourcePath, args.stage0PathSet))
      .sort();

    if (!componentPaths.length) {
      continue;
    }

    const componentSet = new Set(componentPaths);
    const edgeSet = new Set<string>();

    for (const doc of docs) {
      for (const dependency of doc.dependencies) {
        if (!componentSet.has(dependency)) {
          continue;
        }
        const dependencyDoc = docMap.get(dependency);
        if (!dependencyDoc || !isImplementationDoc(dependencyDoc)) {
          continue;
        }
        edgeSet.add(`${doc.sourcePath}|${dependency}`);
      }
    }

    if (groupKey === "scripts/live-docs") {
      const orchestrationEdges = buildStageSequenceEdges({
        stageSequence: args.stageSequence,
        stage0PathSet: args.stage0PathSet,
        orchestratorPath: RUN_ALL_SCRIPT_PATH
      });
      for (const edge of orchestrationEdges) {
        if (componentSet.has(edge.from) && componentSet.has(edge.to)) {
          edgeSet.add(`${edge.from}|${edge.to}`);
        }
      }
    }

    const slug = layer3Slug(groupKey);
    const id = `${LAYER3_PREFIX.component}-${slug}`;
    const titleSuffix = `${formatDisplayName(groupKey)} Component`;

    plans.push({
      id,
      archetype: "component",
      slug,
      titleSuffix,
      componentPaths,
      edgeTuples: Array.from(edgeSet).map((entry) => {
        const [from, to] = entry.split("|");
        return { from, to } as const;
      })
    });
  }

  return plans;
}

function deriveComponentKey(sourcePath: string): string {
  const segments = sourcePath.split("/");
  const featureIndex = segments.indexOf("features");
  if (featureIndex !== -1 && featureIndex + 1 < segments.length) {
    return segments.slice(0, featureIndex + 2).join("/");
  }

  const scriptsIndex = segments.indexOf("scripts");
  if (scriptsIndex !== -1 && scriptsIndex + 1 < segments.length) {
    return segments.slice(0, scriptsIndex + 2).join("/");
  }

  return segments.slice(0, Math.max(segments.length - 1, 1)).join("/");
}

function buildInteractionPlans(args: {
  stage0Docs: Stage0Doc[];
  stage0PathSet: Set<string>;
  skipSources: Set<string>;
  stageSequence: StageSequence;
}): SystemDocPlan[] {
  const plans: SystemDocPlan[] = [];
  const interactionDocs = args.stage0Docs.filter((doc) =>
    doc.sourcePath.startsWith("scripts/live-docs/")
  );

  for (const doc of interactionDocs) {
    if (doc.sourcePath === RUN_ALL_SCRIPT_PATH) {
      continue;
    }

    if (args.skipSources.has(doc.sourcePath)) {
      continue;
    }
    const slug = layer3Slug(doc.sourcePath);
    const id = `${LAYER3_PREFIX.interaction}-${slug}`;
    const titleSuffix = `${formatDisplayName(doc.sourcePath)} Interaction`;
    const componentSet = new Set<string>();
    componentSet.add(doc.sourcePath);

    const edgeSet = new Set<string>();

    const stageEntry = args.stageSequence.map.get(doc.sourcePath);
    if (stageEntry) {
      for (const next of stageEntry.after) {
        if (includeInComponents(next, args.stage0PathSet)) {
          componentSet.add(next);
          edgeSet.add(`${doc.sourcePath}|${next}`);
        }
      }
      for (const previous of stageEntry.before) {
        if (includeInComponents(previous, args.stage0PathSet)) {
          componentSet.add(previous);
          edgeSet.add(`${previous}|${doc.sourcePath}`);
        }
      }
    }

    for (const dependency of doc.dependencies) {
      if (!dependency.includes(LIVE_DOCS_SEGMENT)) {
        continue;
      }
      if (!includeInComponents(dependency, args.stage0PathSet)) {
        continue;
      }
      componentSet.add(dependency);
      edgeSet.add(`${doc.sourcePath}|${dependency}`);
    }

    if (componentSet.size <= 1 || edgeSet.size === 0) {
      continue;
    }

    const componentPaths = Array.from(componentSet).sort();

    plans.push({
      id,
      archetype: "interaction",
      slug,
      titleSuffix,
      componentPaths,
      edgeTuples: Array.from(edgeSet).map((entry) => {
        const [from, to] = entry.split("|");
        return { from, to };
      })
    });
  }

  return plans;
}

function buildWorkflowPlans(args: {
  stage0Docs: Stage0Doc[];
  stage0PathSet: Set<string>;
  stageSequence: StageSequence;
}): SystemDocPlan[] {
  const plans: SystemDocPlan[] = [];
  const workflowDocs = args.stage0Docs.filter((doc) => doc.sourcePath.endsWith("run-all.ts"));

  for (const doc of workflowDocs) {
    const slug = layer3Slug(doc.sourcePath);
    const id = `${LAYER3_PREFIX.workflow}-${slug}`;
    const titleSuffix = `${formatDisplayName(doc.sourcePath)} Workflow`;

    const componentCandidates = new Set<string>();
    componentCandidates.add(doc.sourcePath);
    for (const dependency of doc.dependencies) {
      if (dependency.includes("live-docs") && includeInComponents(dependency, args.stage0PathSet)) {
        componentCandidates.add(dependency);
      }
    }
    for (const script of args.stageSequence.order) {
      componentCandidates.add(script);
    }

    const componentPaths = Array.from(componentCandidates).sort();

    const sequenceEdges = buildStageSequenceEdges({
      stageSequence: args.stageSequence,
      stage0PathSet: args.stage0PathSet,
      orchestratorPath: doc.sourcePath
    });

    const dependencyEdges = doc.dependencies
      .filter((dependency) => dependency.includes("live-docs") && includeInComponents(dependency, args.stage0PathSet))
      .map((dependency) => ({ from: doc.sourcePath, to: dependency }));
    const edgeSet = new Set<string>(sequenceEdges.map((edge) => `${edge.from}|${edge.to}`));
    for (const edge of dependencyEdges) {
      edgeSet.add(`${edge.from}|${edge.to}`);
    }

    plans.push({
      id,
      archetype: "workflow",
      slug,
      titleSuffix,
      componentPaths,
      edgeTuples: Array.from(edgeSet).map((entry) => {
        const [from, to] = entry.split("|");
        return { from, to };
      })
    });
  }

  return plans;
}

async function buildTestingPlans(args: {
  workspaceRoot: string;
  stage0Docs: Stage0Doc[];
  manifest?: TargetManifest;
  stage0PathSet: Set<string>;
}): Promise<SystemDocPlan[]> {
  const manifest = args.manifest ?? (await loadTargetManifest(args.workspaceRoot));
  if (!manifest) {
    return [];
  }

  const relevantTests = new Set<string>();

  for (const suite of manifest.suites ?? []) {
    for (const test of suite.tests ?? []) {
      const matchesLiveDocs = (test.targets ?? []).some((target) =>
        target.includes("live-docs")
      );
      if (matchesLiveDocs && test.path) {
        relevantTests.add(normalizeWorkspacePath(test.path));
      }
    }
  }

  if (!relevantTests.size) {
    return [];
  }

  const targetPaths = new Set<string>();
  const stage0TestPaths = new Set<string>();
  const virtualNodeStats = new Map<string, { groupKey: string; count: number }>();
  const edgeTuples: Array<{ from: string; to: string }> = [];

  for (const suite of manifest.suites ?? []) {
    for (const test of suite.tests ?? []) {
      if (!test.path || !test.targets) {
        continue;
      }
      const normalizedPath = normalizeWorkspacePath(test.path);
      if (!relevantTests.has(normalizedPath)) {
        continue;
      }

      const normalizedTargets = (test.targets ?? [])
        .filter((target) => target.includes("live-docs"))
        .map((target) => normalizeWorkspacePath(target))
        .filter((target) => includeInComponents(target, args.stage0PathSet));

      if (!normalizedTargets.length) {
        continue;
      }
      const stage0Backed = includeInComponents(normalizedPath, args.stage0PathSet);
      let fromKey: string;

      if (stage0Backed) {
        stage0TestPaths.add(normalizedPath);
        fromKey = normalizedPath;
      } else {
        const groupKey = deriveTestGroupKey(normalizedPath);
        const virtualKey = createVirtualNodeKey(groupKey);
        const existing = virtualNodeStats.get(virtualKey);
        if (existing) {
          existing.count += 1;
        } else {
          virtualNodeStats.set(virtualKey, { groupKey, count: 1 });
        }
        fromKey = virtualKey;
      }

      for (const target of normalizedTargets) {
        targetPaths.add(target);
        edgeTuples.push({ from: fromKey, to: target });
      }
    }
  }

  const componentPaths = Array.from(
    new Set<string>([
      ...Array.from(targetPaths),
      ...Array.from(stage0TestPaths)
    ])
  ).sort();

  const virtualNodes: SystemVirtualNode[] = Array.from(virtualNodeStats.entries())
    .map(([key, value]) => ({
      key,
      label: `${formatDisplayName(value.groupKey)} Suites (${value.count})`,
      archetype: "test-summary" as const
    }))
    .sort((left, right) => left.key.localeCompare(right.key));

  const plan: SystemDocPlan = {
    id: `${LAYER3_PREFIX.testing}-live-docs-coverage`,
    archetype: "testing",
    slug: "live-docs-coverage",
    titleSuffix: "Live Docs Coverage",
    componentPaths,
    edgeTuples,
    virtualNodes: virtualNodes.length ? virtualNodes : undefined
  };

  return [plan];
}

async function pruneStaleSystemDocs(args: {
  workspaceRoot: string;
  config: LiveDocumentationConfig;
  preservedDocPaths: Set<string>;
  dryRun: boolean;
  logger: SystemGeneratorLogger;
}): Promise<string[]> {
  const systemRoot = path.resolve(args.workspaceRoot, args.config.root, SYSTEM_LAYER_NAME);
  const exists = await directoryExists(systemRoot);
  if (!exists) {
    return [];
  }

  const files = await glob("**/*.mdmd.md", {
    cwd: systemRoot,
    absolute: true,
    nodir: true,
    dot: false,
    windowsPathsNoEscape: true
  });

  files.sort();

  const removed: string[] = [];

  for (const absolute of files) {
    const workspaceRelative = normalizeWorkspacePath(path.relative(args.workspaceRoot, absolute));
    if (args.preservedDocPaths.has(workspaceRelative)) {
      continue;
    }

    const content = await fs.readFile(absolute, "utf8");
    const authoredBlock = extractAuthoredBlock(content);
    if (hasMeaningfulAuthoredContent(authoredBlock)) {
      args.logger.warn(`Preserving ${workspaceRelative} (authored content detected)`);
      continue;
    }

    removed.push(workspaceRelative);

    if (args.dryRun) {
      args.logger.info(`(dry-run) Would delete stale System Live Doc ${workspaceRelative}`);
      continue;
    }

    await fs.rm(absolute, { force: true });
    await cleanupEmptyParents(path.dirname(absolute), systemRoot);
    args.logger.info(`Deleted stale System Live Doc ${workspaceRelative}`);
  }

  return removed;
}

function buildStageSequence(stageDescriptors: RunAllStageDescriptor[], stage0PathSet: Set<string>): StageSequence {
  const order: string[] = [];
  const map = new Map<string, StageSequenceMapEntry>();

  for (const descriptor of stageDescriptors) {
    const script = normalizeWorkspacePath(descriptor.script);
    if (!includeInComponents(script, stage0PathSet)) {
      continue;
    }
    if (!map.has(script)) {
      map.set(script, { before: [], after: [] });
      order.push(script);
    }
  }

  for (let index = 0; index < order.length; index += 1) {
    const current = order[index];
    const entry = map.get(current);
    if (!entry) {
      continue;
    }
    if (index > 0) {
      const previous = order[index - 1];
      entry.before.push(previous);
      const previousEntry = map.get(previous);
      if (previousEntry) {
        previousEntry.after.push(current);
      }
    }
  }

  return { order, map };
}

function buildStageSequenceEdges(args: {
  stageSequence: StageSequence;
  stage0PathSet: Set<string>;
  orchestratorPath?: string;
}): Array<{ from: string; to: string }> {
  if (!args.stageSequence.order.length) {
    return [];
  }

  const edges: Array<{ from: string; to: string }> = [];

  if (args.orchestratorPath && includeInComponents(args.orchestratorPath, args.stage0PathSet)) {
    const first = args.stageSequence.order[0];
    if (first && includeInComponents(first, args.stage0PathSet)) {
      edges.push({ from: args.orchestratorPath, to: first });
    }
  }

  for (const script of args.stageSequence.order) {
    const entry = args.stageSequence.map.get(script);
    if (!entry) {
      continue;
    }
    for (const next of entry.after) {
      if (includeInComponents(next, args.stage0PathSet)) {
        edges.push({ from: script, to: next });
      }
    }
  }

  return edges;
}

function createVirtualNodeKey(groupKey: string): string {
  return `${VIRTUAL_NODE_PREFIX}${layer3Slug(groupKey)}`;
}

function stripVirtualNodePrefix(candidate: string): string {
  return candidate.slice(VIRTUAL_NODE_PREFIX.length);
}

function deriveTestGroupKey(testPath: string): string {
  const segments = testPath.split("/").filter(Boolean);
  if (segments.length >= 2 && (segments[0] === "packages" || segments[0] === "tests")) {
    return `${segments[0]}/${segments[1]}`;
  }
  if (segments.length >= 1) {
    return segments[0];
  }
  return testPath;
}

function buildDocNodeLabels(paths: string[]): Map<string, string> {
  const groups = new Map<string, string[]>();
  for (const sourcePath of paths) {
    const base = path.basename(sourcePath);
    const bucket = groups.get(base) ?? [];
    bucket.push(sourcePath);
    groups.set(base, bucket);
  }

  const labels = new Map<string, string>();
  const used = new Set<string>();

  for (const [, groupPaths] of groups) {
    if (groupPaths.length === 1) {
      const [only] = groupPaths;
      const label = path.basename(only);
      labels.set(only, label);
      used.add(label);
      continue;
    }

    for (const sourcePath of groupPaths) {
      const segments = sourcePath.split("/").filter(Boolean);
      let depth = 2;
      let candidate = segments.slice(-depth).join("/");
      while (used.has(candidate) && depth < segments.length) {
        depth += 1;
        candidate = segments.slice(-depth).join("/");
      }
      if (used.has(candidate)) {
        candidate = sourcePath;
      }
      labels.set(sourcePath, candidate);
      used.add(candidate);
    }
  }

  return labels;
}

interface TargetManifest {
  suites?: Array<{
    suite?: string;
    kind?: string;
    tests?: Array<{
      path?: string;
      targets?: string[];
      fixtures?: string[];
    }>;
  }>;
}

async function loadTargetManifest(workspaceRoot: string): Promise<TargetManifest | undefined> {
  const manifestPath = path.resolve(workspaceRoot, "data", "live-docs", "targets.json");
  try {
    const raw = await fs.readFile(manifestPath, "utf8");
    return JSON.parse(raw) as TargetManifest;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return undefined;
    }
    throw error;
  }
}

function layer3Slug(input: string): string {
  const slug = githubSlug(input) || input.replace(/[^a-zA-Z0-9]+/g, "-").toLowerCase();
  return slug.replace(/^-+|-+$/g, "");
}

function formatDisplayName(input: string): string {
  const lastSegment = input.split("/").filter(Boolean).pop() ?? input;
  return lastSegment
    .replace(/[-_]/g, " ")
    .split(" ")
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" ");
}

function renderComponentsSection(args: {
  plan: SystemDocPlan;
  stage0Docs: Map<string, Stage0Doc>;
  docDir: string;
}): LiveDocRenderSection {
  const lines: string[] = [];
  const ordered = args.plan.componentPaths.filter((path) => args.stage0Docs.has(path));

  for (const sourcePath of ordered) {
    const stage0Doc = args.stage0Docs.get(sourcePath)!;
    const relative = formatRelativePathFromDoc(
      args.docDir,
      stage0Doc.docAbsolutePath
    );
    lines.push(`- [${sourcePath}](${relative})`);
  }

  if (!lines.length) {
    lines.push("_No components detected_");
  }

  return {
    name: "Components",
    lines
  };
}

function renderTopologySection(args: {
  plan: SystemDocPlan;
  stage0Docs: Map<string, Stage0Doc>;
  docDir: string;
}): LiveDocRenderSection {
  const docNodes = new Map<string, Stage0Doc>();
  for (const sourcePath of args.plan.componentPaths) {
    const doc = args.stage0Docs.get(sourcePath);
    if (doc) {
      docNodes.set(sourcePath, doc);
    }
  }

  const virtualNodeMap = new Map<string, SystemVirtualNode>();
  for (const virtualNode of args.plan.virtualNodes ?? []) {
    virtualNodeMap.set(virtualNode.key, virtualNode);
  }

  const edges = new Set<string>();
  for (const edge of args.plan.edgeTuples) {
    if ((docNodes.has(edge.from) || virtualNodeMap.has(edge.from)) && (docNodes.has(edge.to) || virtualNodeMap.has(edge.to))) {
      edges.add(`${edge.from}|${edge.to}`);
    }
  }

  const lines: string[] = [];
  lines.push("```mermaid");
  lines.push("graph TD");

  const nodeIds = new Map<string, string>();
  const archetypeSet = new Set<string>();

  const docLabels = buildDocNodeLabels(Array.from(docNodes.keys()));
  const sortedDocNodes = Array.from(docNodes.entries()).sort((left, right) => left[0].localeCompare(right[0]));
  for (const [sourcePath, doc] of sortedDocNodes) {
    const nodeId = `node_doc_${layer3Slug(sourcePath)}`;
    nodeIds.set(sourcePath, nodeId);
    archetypeSet.add(doc.archetype);
    const label = docLabels.get(sourcePath) ?? path.basename(sourcePath);
    const relative = formatRelativePathFromDoc(args.docDir, doc.docAbsolutePath);
    lines.push(`  ${nodeId}["${label}"]`);
    lines.push(`  click ${nodeId} "${relative}" "${label}"`);
  }

  const sortedVirtualNodes = Array.from(virtualNodeMap.values()).sort((left, right) => left.key.localeCompare(right.key));
  for (const node of sortedVirtualNodes) {
    const nodeId = `node_virtual_${layer3Slug(stripVirtualNodePrefix(node.key))}`;
    nodeIds.set(node.key, nodeId);
    archetypeSet.add(node.archetype);
    lines.push(`  ${nodeId}["${node.label}"]`);
  }

  const sortedEdges = Array.from(edges).sort();
  for (const entry of sortedEdges) {
    const [from, to] = entry.split("|");
    const fromId = nodeIds.get(from);
    const toId = nodeIds.get(to);
    if (!fromId || !toId) {
      continue;
    }
    lines.push(`  ${fromId} --> ${toId}`);
  }

  for (const [sourcePath, doc] of sortedDocNodes) {
    const nodeId = nodeIds.get(sourcePath);
    if (!nodeId) {
      continue;
    }
    lines.push(`  class ${nodeId} ${doc.archetype}`);
  }

  for (const node of sortedVirtualNodes) {
    const nodeId = nodeIds.get(node.key);
    if (!nodeId) {
      continue;
    }
    lines.push(`  class ${nodeId} ${node.archetype}`);
  }

  if (archetypeSet.size) {
    lines.push("  %% class definitions");
    if (archetypeSet.has("implementation")) {
      lines.push("  classDef implementation fill:#2563eb,stroke:#0f172a,color:#ffffff");
    }
    if (archetypeSet.has("test")) {
      lines.push("  classDef test fill:#f97316,stroke:#7c2d12,color:#1f2937");
    }
    if (archetypeSet.has("asset")) {
      lines.push("  classDef asset fill:#a855f7,stroke:#581c87,color:#1f2937");
    }
    if (archetypeSet.has("test-summary")) {
      lines.push("  classDef test-summary fill:#facc15,stroke:#92400e,color:#1f2937");
    }
  }

  lines.push("```");

  return {
    name: "Topology",
    lines
  };
}

function resolveSystemDocPaths(args: {
  workspaceRoot: string;
  config: LiveDocumentationConfig;
  archetype: Layer3Archetype;
  slug: string;
}): { absolute: string; relative: string } {
  const docRelative = normalizeWorkspacePath(
    path.join(args.config.root, SYSTEM_LAYER_NAME, args.archetype, `${args.slug}.mdmd.md`)
  );
  const absolute = path.resolve(args.workspaceRoot, docRelative);
  return {
    absolute,
    relative: docRelative
  };
}

function systemMetadataSourcePath(plan: SystemDocPlan): string {
  return normalizeWorkspacePath(path.join(SYSTEM_LAYER_NAME, plan.archetype, plan.slug));
}

function classifyChange(existingContent: string | undefined, rendered: string): "created" | "updated" | "unchanged" {
  if (!existingContent) {
    return "created";
  }
  return existingContent === rendered ? "unchanged" : "updated";
}

function stripCodePathLine(document: string): string {
  return document.replace(/^-\s+Code Path:.*\r?\n/m, "");
}

function extractGeneratedAt(existingContent?: string): string | undefined {
  if (!existingContent) {
    return undefined;
  }

  const match = existingContent.match(/^-\s+Generated At:\s*(.+)$/m);
  if (!match) {
    return undefined;
  }

  const value = match[1]?.trim();
  return value && value.length > 0 ? value : undefined;
}

async function readIfExists(filePath: string): Promise<string | undefined> {
  try {
    return await fs.readFile(filePath, "utf8");
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return undefined;
    }
    throw error;
  }
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

interface RunAllStageDescriptor {
  label: string;
  script: string;
}

interface StageSequenceMapEntry {
  before: string[];
  after: string[];
}

interface StageSequence {
  order: string[];
  map: Map<string, StageSequenceMapEntry>;
}

function includeInComponents(candidate: string, stage0PathSet: Set<string>): boolean {
  const normalized = normalizeWorkspacePath(candidate);
  if (!stage0PathSet.has(normalized)) {
    return false;
  }

  if (!normalized.includes(LIVE_DOCS_SEGMENT)) {
    return false;
  }

  if (isCompiledArtifactPath(normalized)) {
    return false;
  }

  return true;
}

function isCompiledArtifactPath(candidate: string): boolean {
  if (candidate.endsWith(".d.ts")) {
    return true;
  }

  const extension = path.extname(candidate).toLowerCase();
  return extension === ".js" || extension === ".cjs" || extension === ".mjs";
}

function isImplementationDoc(doc: Stage0Doc): boolean {
  return (doc.archetype ?? IMPLEMENTATION_ARCHETYPE).toLowerCase() === IMPLEMENTATION_ARCHETYPE;
}

async function extractRunAllStageDescriptors(workspaceRoot: string): Promise<RunAllStageDescriptor[]> {
  const runAllPath = path.resolve(workspaceRoot, "scripts", "live-docs", "run-all.ts");

  let content: string;
  try {
    content = await fs.readFile(runAllPath, "utf8");
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return [];
    }
    throw error;
  }

  const descriptors: RunAllStageDescriptor[] = [];
  const stageRegex = /label:\s*"([^"]+)"[\s\S]*?script:\s*"([^"]+)"/g;
  for (const match of content.matchAll(stageRegex)) {
    const label = match[1];
    const script = normalizeWorkspacePath(match[2]);
    descriptors.push({ label, script });
  }

  const unique = new Map<string, RunAllStageDescriptor>();
  for (const descriptor of descriptors) {
    if (!unique.has(descriptor.script)) {
      unique.set(descriptor.script, descriptor);
    }
  }

  return Array.from(unique.values());
}
