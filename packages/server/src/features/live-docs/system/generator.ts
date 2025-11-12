import { glob } from "glob";
import * as fs from "node:fs/promises";
import path from "node:path";

import {
  type LiveDocumentationConfig,
  normalizeLiveDocumentationConfig
} from "@copilot-improvement/shared/config/liveDocumentationConfig";
import type {
  CoActivationEdge,
  CoActivationReport
} from "@copilot-improvement/shared/live-docs/analysis/coActivation";
import {
  extractAuthoredBlock,
  renderLiveDocMarkdown,
  type LiveDocRenderSection
} from "@copilot-improvement/shared/live-docs/markdown";
import {
  normalizeLiveDocMetadata,
  type LiveDocMetadata,
  type LiveDocProvenance
} from "@copilot-improvement/shared/live-docs/schema";
import type { Stage0Doc, Stage0Symbol, TargetManifest } from "@copilot-improvement/shared/live-docs/types";
import { slug as githubSlug } from "@copilot-improvement/shared/tooling/githubSlugger";
import { normalizeWorkspacePath } from "@copilot-improvement/shared/tooling/pathUtils";

import {
  cleanupEmptyParents,
  directoryExists,
  formatRelativePathFromDoc,
  hasMeaningfulAuthoredContent
} from "../generation/core";
import { loadStage0Docs } from "../stage0/docLoader";
import { loadTargetManifest } from "../targets/manifest";

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
  outputDir?: string;
  cleanOutputDir?: boolean;
}

export interface SystemLiveDocWriteRecord {
  id: string;
  archetype: Layer3Archetype;
  docPath: string;
  change: "created" | "updated" | "unchanged";
}

export interface GeneratedSystemDocument {
  id: string;
  archetype: Layer3Archetype;
  relativePath: string;
  absolutePath: string;
  content: string;
  change: "created" | "updated" | "unchanged";
}

export interface SystemLiveDocGeneratorResult {
  processed: number;
  written: number;
  skipped: number;
  deleted: number;
  files: SystemLiveDocWriteRecord[];
  deletedFiles: string[];
  documents: GeneratedSystemDocument[];
  outputDir?: string;
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
  activation?: PlanActivationSummary;
  nodeMetrics?: Record<string, NodeMetric>;
}

interface SystemVirtualNode {
  key: string;
  label: string;
  archetype: "test-summary";
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
  "integration",
  "testing"
];

const SYSTEM_LAYER_NAME = "system";
const LIVE_DOCS_SEGMENT = "live-docs";
const IMPLEMENTATION_ARCHETYPE = "implementation";
const VIRTUAL_NODE_PREFIX = "virtual::";
const RUN_ALL_SCRIPT_PATH = "scripts/live-docs/run-all.ts";
const DEFAULT_CO_ACTIVATION_RELATIVE_PATH = path.join("data", "live-docs", "co-activation.json");
const MAX_CLUSTER_COMPONENTS = 25;
const MIN_CLUSTER_MEMBER_COUNT = 4;
const MIN_CLUSTER_TOTAL_WEIGHT = 5;
const MAX_TOPOLOGY_EDGES = 80;
const MAX_ACTIVATION_TOP_EDGES = 12;
const MAX_ACTIVATION_TOP_SOURCES = 10;
const MAX_PUBLIC_SYMBOL_ENTRIES = 20;
const MAX_PUBLIC_SYMBOLS_PER_ENTRY = 5;

interface NodeMetric {
  degree: number;
  strength: number;
  testCount: number;
  zScore: number;
}

interface PlanActivationSourceSummary {
  path: string;
  count: number;
}

interface PlanActivationEdgeSummary {
  source: string;
  target: string;
  weight: number;
  testSources: string[];
  dependencySources: string[];
  sharedTestCount: number;
  pValue: number | null;
  qValue: number | null;
}

interface PlanActivationSignificanceSummary {
  edgeAlpha: number;
  clusterAlpha: number;
  clusterPValue: number;
  clusterQValue: number;
  clusterDensity: number;
  expectedEdgeCount: number;
  observedEdgeCount: number;
  selectedEdgeCount: number;
}

interface PlanActivationSummary {
  clusterId: string;
  memberCount: number;
  coveredMembers: number;
  coverageRatio: number;
  totalWeight: number;
  averageWeight: number;
  edgeCount: number;
  topComponents: Array<{ path: string; strength: number; degree: number; testCount: number; zScore: number }>;
  topEdges: PlanActivationEdgeSummary[];
  topTestSources: PlanActivationSourceSummary[];
  topDependencySources: PlanActivationSourceSummary[];
  significance?: PlanActivationSignificanceSummary;
}

export async function generateSystemLiveDocs(
  options: GenerateSystemLiveDocsOptions
): Promise<SystemLiveDocGeneratorResult> {
  const logger = options.logger ?? DEFAULT_LOGGER;
  const normalizedConfig = normalizeLiveDocumentationConfig(options.config);
  const workspaceRoot = path.resolve(options.workspaceRoot);
  const now = options.now ?? (() => new Date());
  const resolvedOutputDir = options.outputDir
    ? resolveOutputDirectory(workspaceRoot, options.outputDir)
    : undefined;

  if (resolvedOutputDir && options.cleanOutputDir && !options.dryRun) {
    await fs.rm(resolvedOutputDir, { recursive: true, force: true });
  }

  const allStage0Docs = await loadStage0Docs({ workspaceRoot, config: normalizedConfig, logger });
  if (allStage0Docs.length === 0) {
    logger.info("No Stage-0 Live Docs found; skipping System layer generation.");
    return {
      processed: 0,
      written: 0,
      skipped: 0,
      deleted: 0,
      files: [],
      deletedFiles: [],
      documents: [],
      outputDir: resolvedOutputDir
    };
  }

  const liveDocsDocs = allStage0Docs.filter((doc) => doc.sourcePath.includes(LIVE_DOCS_SEGMENT));
  if (!liveDocsDocs.length) {
    logger.info("No Live Docs stage documents detected; relying on analytics-driven plans only.");
  }

  const manifest = await loadTargetManifest(workspaceRoot);

  const coActivation = await loadCoActivationReport({
    workspaceRoot,
    logger
  });

  const plans = await buildSystemDocPlans({
    stage0Docs: liveDocsDocs,
    allStage0Docs,
    workspaceRoot,
    manifest,
    coActivation
  });

  if (!plans.length) {
    logger.info("No System layer plans computed; nothing to render.");
    return {
      processed: 0,
      written: 0,
      skipped: 0,
      deleted: 0,
      files: [],
      deletedFiles: [],
      documents: [],
      outputDir: resolvedOutputDir
    };
  }

  plans.sort((left, right) => left.id.localeCompare(right.id));

  const docMap = new Map(allStage0Docs.map((doc) => [doc.sourcePath, doc] as const));

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
  const documents: GeneratedSystemDocument[] = [];
  const generatedDocPaths = resolvedOutputDir ? undefined : new Set<string>();
  let written = 0;
  let skipped = 0;

  for (const plan of plans) {
    const docPaths = resolveSystemDocPaths({
      workspaceRoot,
      config: normalizedConfig,
      archetype: plan.archetype,
      slug: plan.slug,
      outputRoot: resolvedOutputDir
    });
    generatedDocPaths?.add(docPaths.relative);

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
    const activationSection = renderActivationSection({ plan });
    const publicSymbolsSection = renderPublicSymbolsSection({
      plan,
      stage0Docs: docMap
    });

    const sections: LiveDocRenderSection[] = [componentsSection];
    if (activationSection) {
      sections.push(activationSection);
    }
    if (publicSymbolsSection) {
      sections.push(publicSymbolsSection);
    }
    sections.push(topologySection);

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

    const record: SystemLiveDocWriteRecord = {
      id: plan.id,
      archetype: plan.archetype,
      docPath: docPaths.relative,
      change
    };
    results.push(record);

    documents.push({
      id: plan.id,
      archetype: plan.archetype,
      relativePath: docPaths.relative,
      absolutePath: docPaths.absolute,
      content: rendered,
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

  const deletedFiles = resolvedOutputDir || options.dryRun
    ? []
    : await pruneStaleSystemDocs({
      workspaceRoot,
      config: normalizedConfig,
      preservedDocPaths: generatedDocPaths ?? new Set<string>(),
      dryRun: options.dryRun ?? false,
      logger
    });

  return {
    processed: plans.length,
    written,
    skipped,
    deleted: deletedFiles.length,
    files: results,
    deletedFiles,
    documents,
    outputDir: resolvedOutputDir
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


async function loadCoActivationReport(args: {
  workspaceRoot: string;
  logger: SystemGeneratorLogger;
  reportPath?: string;
}): Promise<CoActivationReport | undefined> {
  const candidateInputs = [args.reportPath, process.env.LIVE_DOCS_CO_ACTIVATION_PATH, DEFAULT_CO_ACTIVATION_RELATIVE_PATH];
  const seen = new Set<string>();

  for (const candidate of candidateInputs) {
    const normalized = candidate?.trim();
    if (!normalized || seen.has(normalized)) {
      continue;
    }
    seen.add(normalized);

    const absolutePath = path.isAbsolute(normalized)
      ? normalized
      : path.resolve(args.workspaceRoot, normalized);

    try {
      const raw = await fs.readFile(absolutePath, "utf8");
      const parsed = JSON.parse(raw) as CoActivationReport;
      if (!Array.isArray(parsed.nodes) || !Array.isArray(parsed.edges) || !Array.isArray(parsed.clusters)) {
        args.logger.warn(`Co-activation report at ${absolutePath} is missing expected collections; ignoring.`);
        continue;
      }
      return parsed;
    } catch (error) {
      const nodeError = error as NodeJS.ErrnoException;
      if (nodeError?.code === "ENOENT") {
        continue;
      }
      const reason = nodeError?.message ?? String(error);
      args.logger.warn(`Failed to load co-activation report at ${absolutePath}: ${reason}`);
    }
  }

  return undefined;
}


async function buildSystemDocPlans(args: {
  stage0Docs: Stage0Doc[];
  allStage0Docs: Stage0Doc[];
  workspaceRoot: string;
  manifest?: TargetManifest;
  coActivation?: CoActivationReport;
}): Promise<SystemDocPlan[]> {
  const stage0PathSet = new Set(args.stage0Docs.map((doc) => doc.sourcePath));
  const allStage0PathSet = new Set(args.allStage0Docs.map((doc) => doc.sourcePath));
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

  const integrationPlans = buildCoActivationPlans({
    stage0Docs: args.allStage0Docs,
    stage0PathSet: allStage0PathSet,
    coActivation: args.coActivation
  });
  plans.push(...integrationPlans);

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

function buildCoActivationPlans(args: {
  stage0Docs: Stage0Doc[];
  stage0PathSet: Set<string>;
  coActivation?: CoActivationReport;
}): SystemDocPlan[] {
  if (!args.coActivation) {
    return [];
  }

  const docMap = new Map(args.stage0Docs.map((doc) => [doc.sourcePath, doc] as const));
  const nodeMetricMap = new Map<string, NodeMetric>();
  for (const node of args.coActivation.nodes ?? []) {
    const normalizedId = normalizeWorkspacePath(node.id);
    nodeMetricMap.set(normalizedId, {
      degree: node.degree,
      strength: node.strength,
      testCount: node.testCount,
      zScore: node.zScore
    });
  }

  const plans: SystemDocPlan[] = [];

  for (const cluster of args.coActivation.clusters ?? []) {
    const normalizedMembers = cluster.members
      .map((member) => normalizeWorkspacePath(member))
      .filter((member) => args.stage0PathSet.has(member));

    const uniqueMembers = Array.from(new Set(normalizedMembers));
    if (uniqueMembers.length < MIN_CLUSTER_MEMBER_COUNT) {
      continue;
    }

    const memberSet = new Set(uniqueMembers);

    if (args.coActivation.metrics && !cluster.isSignificant) {
      continue;
    }

    const clusterEdges: CoActivationEdge[] = [];
    for (const edge of args.coActivation.edges ?? []) {
      const source = normalizeWorkspacePath(edge.source);
      const target = normalizeWorkspacePath(edge.target);
      if (!memberSet.has(source) || !memberSet.has(target)) {
        continue;
      }
      if (!edge.isSignificant) {
        continue;
      }
      const dependencySources = [...edge.dependencySources]
        .map((entry) => normalizeWorkspacePath(entry))
        .sort();
      const testSources = [...edge.testSources]
        .map((entry) => normalizeWorkspacePath(entry))
        .sort();
      clusterEdges.push({
        source,
        target,
        weight: edge.weight,
        dependencySources,
        testSources,
        sharedTestCount: edge.sharedTestCount,
        sourceTestCount: edge.sourceTestCount,
        targetTestCount: edge.targetTestCount,
        pValue: edge.pValue,
        qValue: edge.qValue,
        isSignificant: edge.isSignificant
      });
    }

    if (!clusterEdges.length) {
      continue;
    }

    const totalWeight = clusterEdges.reduce((sum, edge) => sum + edge.weight, 0);
    if (totalWeight < MIN_CLUSTER_TOTAL_WEIGHT) {
      continue;
    }

    const rankedMembers = [...uniqueMembers].sort((left, right) => {
      const leftMetric =
        nodeMetricMap.get(left) ?? {
          degree: 0,
          strength: 0,
          testCount: 0,
          zScore: 0
        };
      const rightMetric =
        nodeMetricMap.get(right) ?? {
          degree: 0,
          strength: 0,
          testCount: 0,
          zScore: 0
        };

      if (leftMetric.zScore !== rightMetric.zScore) {
        return rightMetric.zScore - leftMetric.zScore;
      }
      if (leftMetric.strength !== rightMetric.strength) {
        return rightMetric.strength - leftMetric.strength;
      }
      if (leftMetric.degree !== rightMetric.degree) {
        return rightMetric.degree - leftMetric.degree;
      }
      return left.localeCompare(right);
    });

    const selectedMembers = rankedMembers.slice(0, MAX_CLUSTER_COMPONENTS);
    const componentSet = new Set(selectedMembers);

    const nodeMetrics: Record<string, NodeMetric> = {};
    for (const member of selectedMembers) {
      nodeMetrics[member] =
        nodeMetricMap.get(member) ?? {
          degree: 0,
          strength: 0,
          testCount: 0,
          zScore: 0
        };
    }

    const relevantEdges = clusterEdges.filter((edge) => componentSet.has(edge.source) && componentSet.has(edge.target));
    if (!relevantEdges.length) {
      continue;
    }

    const sortedRelevantEdges = [...relevantEdges].sort((left, right) => {
      if (left.weight === right.weight) {
        if (left.source === right.source) {
          return left.target.localeCompare(right.target);
        }
        return left.source.localeCompare(right.source);
      }
      return right.weight - left.weight;
    });

    const trimmedEdges = sortedRelevantEdges.slice(0, MAX_TOPOLOGY_EDGES);
    const edgeTuples = trimmedEdges
      .map((edge) => ({ from: edge.source, to: edge.target }))
      .sort((left, right) => (left.from === right.from ? left.to.localeCompare(right.to) : left.from.localeCompare(right.from)));

    const { slugBase, displayName } = deriveClusterIdentity(selectedMembers, nodeMetrics, cluster.id);
    const slugSeed = `${cluster.id}-${slugBase}`;
    const slug = layer3Slug(slugSeed);
    const titleSuffix = `${displayName} Integration Cluster`;

    const topComponents = rankedMembers
      .slice(0, Math.min(rankedMembers.length, MAX_ACTIVATION_TOP_SOURCES))
      .map((member) => {
        const metric =
          nodeMetricMap.get(member) ?? {
            degree: 0,
            strength: 0,
            testCount: 0,
            zScore: 0
          };
        return {
          path: member,
          strength: metric.strength,
          degree: metric.degree,
          testCount: metric.testCount,
          zScore: metric.zScore
        };
      });

    const topEdges = sortedRelevantEdges.slice(0, MAX_ACTIVATION_TOP_EDGES).map((edge) => ({
      source: edge.source,
      target: edge.target,
      weight: edge.weight,
      testSources: edge.testSources,
      dependencySources: edge.dependencySources,
      sharedTestCount: edge.sharedTestCount,
      pValue: edge.pValue,
      qValue: edge.qValue
    }));

    const topTestSources = collectTopSources(relevantEdges, "testSources");
    const topDependencySources = collectTopSources(relevantEdges, "dependencySources");

    const componentPaths = [...selectedMembers].sort();
    const averageWeight = relevantEdges.length ? totalWeight / relevantEdges.length : 0;
    const reportMetrics = args.coActivation.metrics;
    const significance = reportMetrics
      ? {
          edgeAlpha: reportMetrics.edgeAlpha ?? 0.01,
          clusterAlpha: reportMetrics.clusterAlpha ?? 0.01,
          clusterPValue: cluster.pValue ?? Number.NaN,
          clusterQValue: cluster.qValue ?? Number.NaN,
          clusterDensity: cluster.density ?? 0,
          expectedEdgeCount: cluster.expectedEdgeCount ?? 0,
          observedEdgeCount: cluster.edgeCount ?? relevantEdges.length,
          selectedEdgeCount: relevantEdges.length
        }
      : undefined;
    const activation: PlanActivationSummary = {
      clusterId: cluster.id,
      memberCount: memberSet.size,
      coveredMembers: selectedMembers.length,
      coverageRatio: selectedMembers.length / memberSet.size,
      totalWeight,
      averageWeight,
      edgeCount: relevantEdges.length,
      topComponents,
      topEdges,
      topTestSources,
      topDependencySources,
      significance
    };

    const hasRenderableDocs = componentPaths.every((path) => docMap.has(path));
    if (!hasRenderableDocs) {
      continue;
    }

    plans.push({
      id: `${LAYER3_PREFIX.integration}-${slug}`,
      archetype: "integration",
      slug,
      titleSuffix,
      componentPaths,
      edgeTuples,
      activation,
      nodeMetrics
    });
  }

  return plans;
}

function deriveClusterIdentity(
  componentPaths: string[],
  nodeMetrics: Record<string, NodeMetric>,
  clusterId: string
): { slugBase: string; displayName: string } {
  if (!componentPaths.length) {
    return {
      slugBase: clusterId,
      displayName: formatDisplayName(clusterId)
    };
  }

  const weightByPrefix = new Map<string, number>();

  for (const pathCandidate of componentPaths) {
    const segments = pathCandidate.split("/").filter(Boolean);
    if (!segments.length) {
      continue;
    }

    const metric = nodeMetrics[pathCandidate];
    const weight = metric?.strength && metric.strength > 0 ? metric.strength : 1;

    const prefixes: string[] = [];
    if (segments.length >= 2) {
      prefixes.push(`${segments[0]}/${segments[1]}`);
    }
    prefixes.push(segments[0]);

    for (const prefix of prefixes) {
      weightByPrefix.set(prefix, (weightByPrefix.get(prefix) ?? 0) + weight);
    }
  }

  if (!weightByPrefix.size) {
    return {
      slugBase: clusterId,
      displayName: formatDisplayName(clusterId)
    };
  }

  const [bestPrefix] = Array.from(weightByPrefix.entries()).sort((left, right) => {
    if (left[1] === right[1]) {
      return left[0].localeCompare(right[0]);
    }
    return right[1] - left[1];
  })[0];

  return {
    slugBase: bestPrefix,
    displayName: formatDisplayName(bestPrefix)
  };
}

function collectTopSources(
  edges: CoActivationEdge[],
  key: "testSources" | "dependencySources"
): PlanActivationSourceSummary[] {
  const counts = new Map<string, number>();
  for (const edge of edges) {
    for (const source of edge[key]) {
      if (!source) {
        continue;
      }
      const normalized = normalizeWorkspacePath(source);
      counts.set(normalized, (counts.get(normalized) ?? 0) + 1);
    }
  }

  return Array.from(counts.entries())
    .sort((left, right) => {
      if (left[1] === right[1]) {
        return left[0].localeCompare(right[0]);
      }
      return right[1] - left[1];
    })
    .slice(0, MAX_ACTIVATION_TOP_SOURCES)
    .map(([path, count]) => ({ path, count }));
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
    const metrics = args.plan.nodeMetrics?.[sourcePath];
    const summaryParts: string[] = [];
    if (metrics) {
      summaryParts.push(`strength ${formatNumber(metrics.strength)}`);
      summaryParts.push(`degree ${metrics.degree}`);
      if (metrics.testCount > 0) {
        summaryParts.push(`${formatNumber(metrics.testCount)} tests`);
      }
      if (Math.abs(metrics.zScore) >= 0.05) {
        summaryParts.push(`z ${formatMean(metrics.zScore, 2)}`);
      }
    }
    const symbolCount = stage0Doc.publicSymbols?.length ?? 0;
    if (symbolCount > 0) {
      summaryParts.push(`${formatNumber(symbolCount)} symbols`);
    }
    const suffix = summaryParts.length ? ` — ${summaryParts.join(" · ")}` : "";
    lines.push(`- [${sourcePath}](${relative})${suffix}`);
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

function renderActivationSection(args: { plan: SystemDocPlan }): LiveDocRenderSection | undefined {
  const activation = args.plan.activation;
  if (!activation) {
    return undefined;
  }

  const lines: string[] = [];
  lines.push(`- Cluster: ${activation.clusterId}`);
  lines.push(
    `- Coverage: ${activation.coveredMembers}/${activation.memberCount} (${formatPercent(activation.coverageRatio)})`
  );
  const trimmedSuffix =
    activation.significance && activation.significance.observedEdgeCount > activation.edgeCount
      ? ` (trimmed from ${formatNumber(activation.significance.observedEdgeCount)})`
      : "";
  lines.push(
    `- Edges Considered: ${formatNumber(activation.edgeCount)}${trimmedSuffix} (avg weight ${formatMean(activation.averageWeight)})`
  );
  lines.push(`- Total Weight: ${formatNumber(activation.totalWeight)}`);

  if (activation.significance) {
    const significance = activation.significance;
    lines.push(
      `- Significance: p=${formatPValue(significance.clusterPValue)}, q=${formatPValue(significance.clusterQValue)} (cluster α=${formatMean(significance.clusterAlpha, 3)})`
    );
    lines.push(
      `- Density: ${formatPercent(significance.clusterDensity)} (expected ${formatMean(significance.expectedEdgeCount, 1)} edges vs ${formatNumber(significance.observedEdgeCount)} observed; edge α=${formatMean(significance.edgeAlpha, 3)})`
    );
  }

  if (activation.topComponents.length) {
    lines.push("");
    lines.push("**Top Components (by strength)**");
    for (const component of activation.topComponents) {
      const qualifiers = [
        `strength ${formatNumber(component.strength)}`,
        `degree ${component.degree}`
      ];
      if (component.testCount > 0) {
        qualifiers.push(`${formatNumber(component.testCount)} tests`);
      }
      if (Math.abs(component.zScore) >= 0.05) {
        qualifiers.push(`z ${formatMean(component.zScore, 2)}`);
      }
      lines.push(`- ${component.path} (${qualifiers.join(", ")})`);
    }
  }

  if (activation.topEdges.length) {
    lines.push("");
    lines.push("**Top Cohesion Edges**");
    for (const edge of activation.topEdges) {
      const qualifiers: string[] = [`weight ${formatNumber(edge.weight)}`];
      if (edge.testSources.length) {
        qualifiers.push(`tests ${edge.testSources.length}`);
      }
      if (edge.sharedTestCount > 0) {
        qualifiers.push(`shared hits ${formatNumber(edge.sharedTestCount)}`);
      }
      if (edge.dependencySources.length) {
        qualifiers.push(`deps ${edge.dependencySources.length}`);
      }
      if (edge.pValue !== null) {
        qualifiers.push(`p=${formatPValue(edge.pValue)}`);
      }
      if (edge.qValue !== null) {
        qualifiers.push(`q=${formatPValue(edge.qValue)}`);
      }
      lines.push(`- ${edge.source} ↔ ${edge.target} (${qualifiers.join(", ")})`);
    }
  }

  if (activation.topTestSources.length) {
    lines.push("");
    lines.push("**Top Test Sources**");
    for (const entry of activation.topTestSources) {
      lines.push(`- ${entry.path} (${formatNumber(entry.count)})`);
    }
  }

  if (activation.topDependencySources.length) {
    lines.push("");
    lines.push("**Top Dependency Sources**");
    for (const entry of activation.topDependencySources) {
      lines.push(`- ${entry.path} (${formatNumber(entry.count)})`);
    }
  }

  return {
    name: "Activation Signals",
    lines
  };
}

function renderPublicSymbolsSection(args: {
  plan: SystemDocPlan;
  stage0Docs: Map<string, Stage0Doc>;
}): LiveDocRenderSection | undefined {
  const entries: Array<{ path: string; symbols: Stage0Symbol[] }> = [];
  for (const sourcePath of args.plan.componentPaths) {
    const doc = args.stage0Docs.get(sourcePath);
    if (!doc?.publicSymbols?.length) {
      continue;
    }
    entries.push({ path: sourcePath, symbols: doc.publicSymbols });
  }

  if (!entries.length) {
    return undefined;
  }

  entries.sort((left, right) => {
    if (left.symbols.length === right.symbols.length) {
      return left.path.localeCompare(right.path);
    }
    return right.symbols.length - left.symbols.length;
  });

  const limited = entries.slice(0, MAX_PUBLIC_SYMBOL_ENTRIES);
  const lines: string[] = [];

  for (const entry of limited) {
    const sample = entry.symbols
      .slice(0, MAX_PUBLIC_SYMBOLS_PER_ENTRY)
      .map((symbol) => symbol.name)
      .join(", ");
    const remainder = entry.symbols.length - Math.min(entry.symbols.length, MAX_PUBLIC_SYMBOLS_PER_ENTRY);
    const suffix = remainder > 0 ? `, ... +${formatNumber(remainder)} more` : "";
    lines.push(`- ${entry.path} (${formatNumber(entry.symbols.length)} symbols) – ${sample}${suffix}`);
  }

  if (entries.length > limited.length) {
    lines.push(
      `- ... ${formatNumber(entries.length - limited.length)} additional components with public symbols`
    );
  }

  return {
    name: "Public Surface",
    lines
  };
}

function formatNumber(value: number): string {
  if (!Number.isFinite(value)) {
    return "0";
  }
  return Math.round(value).toLocaleString("en-US");
}

function formatMean(value: number, digits = 1): string {
  if (!Number.isFinite(value)) {
    return "0.0";
  }
  return value.toFixed(digits);
}

function formatPercent(value: number, digits = 1): string {
  if (!Number.isFinite(value)) {
    return "0%";
  }
  return `${(value * 100).toFixed(digits)}%`;
}

function formatPValue(value: number | null): string {
  if (value === null || !Number.isFinite(value)) {
    return "n/a";
  }
  if (value === 0) {
    return "<1e-12";
  }
  if (value < 1e-4) {
    return value.toExponential(2);
  }
  if (value < 0.01) {
    return trimTrailingZeros(value.toFixed(4));
  }
  return trimTrailingZeros(value.toFixed(3));
}

function trimTrailingZeros(candidate: string): string {
  return candidate.replace(/0+$/u, "").replace(/\.$/u, "");
}

function resolveOutputDirectory(workspaceRoot: string, outputDir: string): string {
  if (path.isAbsolute(outputDir)) {
    return path.normalize(outputDir);
  }

  return path.resolve(workspaceRoot, outputDir);
}

function resolveSystemDocPaths(args: {
  workspaceRoot: string;
  config: LiveDocumentationConfig;
  archetype: Layer3Archetype;
  slug: string;
  outputRoot?: string;
}): { absolute: string; relative: string } {
  const docRelativeFromConfig = path.join(
    args.config.root,
    SYSTEM_LAYER_NAME,
    args.archetype,
    `${args.slug}.mdmd.md`
  );

  const baseRoot = args.outputRoot ?? args.workspaceRoot;
  const absolute = path.resolve(baseRoot, docRelativeFromConfig);
  const relative = path.relative(baseRoot, absolute);

  return {
    absolute,
    relative: normalizeWorkspacePath(relative)
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
