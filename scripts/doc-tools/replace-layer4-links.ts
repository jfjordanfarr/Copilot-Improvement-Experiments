import * as fs from "node:fs/promises";
import * as path from "node:path";

import { DEFAULT_LIVE_DOCUMENTATION_CONFIG } from "../../packages/shared/src/config/liveDocumentationConfig";

const liveDocConfig = DEFAULT_LIVE_DOCUMENTATION_CONFIG;
const liveDocRoot = buildStagePrefix(liveDocConfig.root, liveDocConfig.baseLayer);
const liveDocExtension = ensureLeadingDot(liveDocConfig.extension);

interface ReplacementResult {
  filePath: string;
  replaced: number;
}

function toLiveDocPath(relativeSourcePath: string): string {
  const normalisedSource = relativeSourcePath.replace(/\\/g, "/").replace(/^\.\//, "").replace(/^\//, "");
  const basePath = `${liveDocRoot}/${normalisedSource}`.replace(/\/+/g, "/");
  if (basePath.endsWith(liveDocExtension)) {
    return basePath;
  }
  if (basePath.endsWith(".md")) {
    return basePath.slice(0, -3) + liveDocExtension;
  }
  return `${basePath}${liveDocExtension}`;
}

function buildStagePrefix(root: string, baseLayer: string): string {
  const normalisedRoot = root.replace(/\\/g, "/").replace(/\/+/g, "/").replace(/\/+$/, "");
  const normalisedLayer = baseLayer.replace(/\\/g, "/").replace(/\/+/g, "/").replace(/^\//, "");
  return `${normalisedRoot}/${normalisedLayer}`.replace(/\/+/g, "/");
}

function ensureLeadingDot(extension: string): string {
  return extension.startsWith(".") ? extension : `.${extension}`;
}

const slugMap = new Map<string, string>([
  ["knowledge-graph-ingestion/knowledgeFeedManager", toLiveDocPath("packages/server/src/features/knowledge/knowledgeFeedManager.ts")],
  ["extension-views/diagnosticsTree", toLiveDocPath("packages/extension/src/views/diagnosticsTree.ts")],
  ["extension-commands/exportDiagnostics", toLiveDocPath("packages/extension/src/commands/exportDiagnostics.ts")],
  ["tooling/slopcopMarkdownLinks", toLiveDocPath("scripts/slopcop/check-markdown-links.ts")],
  ["tooling/slopcopAssetPaths", toLiveDocPath("scripts/slopcop/check-asset-paths.ts")],
  ["tooling/slopcopSymbolReferences", toLiveDocPath("scripts/slopcop/check-symbols.ts")],
  ["language-server-runtime/changeProcessor", toLiveDocPath("packages/server/src/runtime/changeProcessor.ts")],
  ["tooling/workspaceGraphSnapshot", toLiveDocPath("scripts/graph-tools/snapshot-workspace.ts")],
  ["knowledge-graph-ingestion/feedCheckpointStore", toLiveDocPath("packages/server/src/features/knowledge/feedCheckpointStore.ts")],
  ["knowledge-graph-ingestion/feedDiagnosticsGateway", toLiveDocPath("packages/server/src/features/knowledge/feedDiagnosticsGateway.ts")],
  ["extension-diagnostics/dependencyQuickPick", toLiveDocPath("packages/extension/src/diagnostics/dependencyQuickPick.ts")],
  ["shared/fallbackInference", toLiveDocPath("packages/shared/src/inference/fallbackInference.ts")],
  ["language-server-runtime/linkInferenceOrchestrator", toLiveDocPath("packages/shared/src/inference/linkInference.ts")],
  ["extension-diagnostics/docDiagnosticProvider", toLiveDocPath("packages/extension/src/diagnostics/docDiagnosticProvider.ts")],
  ["server-diagnostics/publishDocDiagnostics", toLiveDocPath("packages/server/src/features/diagnostics/publishDocDiagnostics.ts")],
  ["server-diagnostics/publishCodeDiagnostics", toLiveDocPath("packages/server/src/features/diagnostics/publishCodeDiagnostics.ts")],
  ["tooling/safeToCommit", toLiveDocPath("scripts/safe-to-commit.mjs")],
  ["tooling/graphCoverageAudit", toLiveDocPath("scripts/graph-tools/audit-doc-coverage.ts")],
  ["tooling/inspectSymbolNeighborsCli", toLiveDocPath("scripts/graph-tools/inspect-symbol.ts")],
  ["tooling/relationshipRuleEngine", toLiveDocPath("packages/shared/src/rules/relationshipRuleEngine.ts")],
  ["tooling/relationshipRuleAudit", toLiveDocPath("packages/shared/src/rules/relationshipRuleAudit.ts")],
  ["tooling/relationshipRuleResolvers", toLiveDocPath("packages/shared/src/rules/relationshipResolvers.ts")],
  ["tooling/relationshipRuleTypes", toLiveDocPath("packages/shared/src/rules/relationshipRuleTypes.ts")],
  ["tooling/relationshipRuleProvider", toLiveDocPath("packages/shared/src/rules/relationshipRuleProvider.ts")],
  ["tooling/symbolCorrectnessProfiles", toLiveDocPath("packages/shared/src/rules/symbolCorrectnessProfiles.ts")],
  ["server-diagnostics/symbolCorrectnessValidator", toLiveDocPath("packages/server/src/features/diagnostics/symbolCorrectnessValidator.ts")],
  ["testing/benchmarks/pythonFixtureOracle", toLiveDocPath("packages/shared/src/testing/fixtureOracles/pythonFixtureOracle.ts")],
  ["testing/benchmarks/cFixtureOracle", toLiveDocPath("packages/shared/src/testing/fixtureOracles/cFixtureOracle.ts")],
  ["testing/benchmarks/rustFixtureOracle", toLiveDocPath("packages/shared/src/testing/fixtureOracles/rustFixtureOracle.ts")],
  ["testing/benchmarks/javaFixtureOracle", toLiveDocPath("packages/shared/src/testing/fixtureOracles/javaFixtureOracle.ts")],
  ["testing/benchmarks/rubyFixtureOracle", toLiveDocPath("packages/shared/src/testing/fixtureOracles/rubyFixtureOracle.ts")],
  ["testing/benchmarks/csharpFixtureOracle", toLiveDocPath("packages/shared/src/testing/fixtureOracles/csharpFixtureOracle.ts")],
  ["shared/llmSampling", toLiveDocPath("packages/shared/src/inference/llmSampling.ts")],
  ["tooling/testReportGenerator", toLiveDocPath("packages/shared/src/reporting/testReport.ts")],
  ["testing/benchmarks/benchmarkRecorder", toLiveDocPath("tests/integration/benchmarks/utils/benchmarkRecorder.ts")],
  ["telemetry/inferenceAccuracyTracker", toLiveDocPath("packages/shared/src/telemetry/inferenceAccuracy.ts")],
  ["server-diagnostics/acknowledgementService", toLiveDocPath("packages/server/src/features/diagnostics/acknowledgementService.ts")],
  ["server-diagnostics/listOutstandingDiagnostics", toLiveDocPath("packages/server/src/features/diagnostics/listOutstandingDiagnostics.ts")],
  ["language-server-runtime/artifactWatcher", toLiveDocPath("packages/server/src/features/watchers/artifactWatcher.ts")],
  ["knowledge-graph-ingestion/rippleAnalyzer", toLiveDocPath("packages/server/src/features/knowledge/rippleAnalyzer.ts")],
  ["testing/integration/us1-codeImpactSuite", toLiveDocPath("tests/integration/us1/codeImpact.test.ts")],
  ["testing/integration/us2-markdownDriftSuite", toLiveDocPath("tests/integration/us2/markdownDrift.test.ts")],
  ["testing/integration/us3-acknowledgeDiagnosticsSuite", toLiveDocPath("tests/integration/us3/acknowledgeDiagnostics.test.ts")],
  ["testing/integration/us4-symbolNeighborsSuite", toLiveDocPath("tests/integration/us4/inspectSymbolNeighbors.test.ts")],
  ["testing/integration/us5-llmIngestionSuite", toLiveDocPath("tests/integration/us5/llmIngestionDryRun.test.ts")],
  ["change-events/changeQueue", toLiveDocPath("packages/server/src/features/changeEvents/changeQueue.ts")],
  ["knowledge-graph-ingestion/knowledgeGraphIngestor", toLiveDocPath("packages/server/src/features/knowledge/knowledgeGraphIngestor.ts")],
  ["knowledge-graph-ingestion/knowledgeGraphBridge", toLiveDocPath("packages/server/src/features/knowledge/knowledgeGraphBridge.ts")],
  ["server-settings/providerGuard", toLiveDocPath("packages/server/src/features/settings/providerGuard.ts")],
  ["dependencies/inspectDependencies", toLiveDocPath("packages/server/src/features/dependencies/inspectDependencies.ts")],
  ["dependencies/symbolNeighbors", toLiveDocPath("packages/server/src/features/dependencies/symbolNeighbors.ts")],
  ["llm-ingestion/llmIngestionManager", toLiveDocPath("packages/server/src/runtime/llmIngestion.ts")],
  ["llm-ingestion/llmIngestionOrchestrator", toLiveDocPath("packages/server/src/features/knowledge/llmIngestionOrchestrator.ts")],
  ["llm-ingestion/relationshipExtractor", toLiveDocPath("packages/shared/src/inference/llm/relationshipExtractor.ts")],
  ["llm-ingestion/confidenceCalibrator", toLiveDocPath("packages/shared/src/inference/llm/confidenceCalibrator.ts")],
  ["tooling/ollamaBridge", toLiveDocPath("packages/extension/src/services/localOllamaBridge.ts")],
  ["testing/benchmarks/typeScriptFixtureOracle", toLiveDocPath("packages/shared/src/testing/fixtureOracles/typeScriptFixtureOracle.ts")],
  ["tooling/benchmarkFixtureRegenerator", toLiveDocPath("scripts/fixture-tools/regenerate-benchmarks.ts")],
  ["tooling/pathUtils", toLiveDocPath("packages/shared/src/tooling/pathUtils.ts")],
  ["testing/integration/vscodeIntegrationHarness", toLiveDocPath("tests/integration/vscode/runTests.ts")],
  ["testing/integration/simpleWorkspaceFixture", toLiveDocPath("tests/integration/fixtures/simple-workspace/scripts/applyTemplate.ts")],
  ["testing/integration/cleanDistUtility", toLiveDocPath("tests/integration/clean-dist.mjs")],
  ["server-telemetry/latencyTracker", toLiveDocPath("packages/server/src/telemetry/latencyTracker.ts")],
  ["server-settings/settingsBridge", toLiveDocPath("packages/server/src/features/settings/settingsBridge.ts")],
  ["extension-commands/latencySummary", toLiveDocPath("packages/extension/src/commands/latencySummary.ts")],
  ["extension-services/llmInvoker", toLiveDocPath("packages/extension/src/services/llmInvoker.ts")]
]);

async function main(): Promise<void> {
  const repoRoot = process.cwd();
  const mdmdRoot = path.join(repoRoot, ".mdmd");
  const results: ReplacementResult[] = [];
  const missingSlugs = new Set<string>();

  await walk(mdmdRoot, async filePath => {
    if (!filePath.endsWith(".mdmd.md")) {
      return;
    }

    const original = await fs.readFile(filePath, "utf8");
    const updated = replaceLinks(original, filePath, repoRoot, missingSlugs);

    if (updated.changed) {
      await fs.writeFile(filePath, updated.content, "utf8");
      results.push({ filePath, replaced: updated.replaced });
    }
  });

  if (results.length === 0) {
    console.log("No layer-4 links were replaced.");
  } else {
    console.log(`Updated ${results.length} file(s).`);
    for (const result of results) {
      console.log(`  ${path.relative(repoRoot, result.filePath)} -> ${result.replaced} link(s)`);
    }
  }

  if (missingSlugs.size > 0) {
    console.warn("\nMissing slug mappings:");
    for (const slug of missingSlugs) {
      console.warn(`  - ${slug}`);
    }
    process.exitCode = 1;
  }
}

function replaceLinks(
  content: string,
  filePath: string,
  repoRoot: string,
  missingSlugs: Set<string>
): { content: string; replaced: number; changed: boolean } {
  let replaced = 0;
  const dir = path.dirname(filePath);
  const linkPattern = /\[([^\]]+)]\(([^)]+layer-4[^)]+)\)/g;

  const newContent = content.replace(linkPattern, (match, text, target) => {
    const slug = extractSlug(target);
    if (!slug) {
      return match;
    }

    const mapped = slugMap.get(slug);
    if (!mapped) {
      missingSlugs.add(slug);
      return match;
    }

    const absoluteTarget = path.resolve(repoRoot, mapped);
    const relativeTarget = path.relative(dir, absoluteTarget).replace(/\\/g, "/");
    replaced += 1;
    return `[${text}](${relativeTarget})`;
  });

  return { content: newContent, replaced, changed: replaced > 0 };
}

function extractSlug(target: string): string | null {
  const normalised = target.replace(/\\/g, "/");
  const match = normalised.match(/layer-4\/(.+?)\.mdmd\.md$/);
  if (!match) {
    return null;
  }
  return match[1];
}

async function walk(dir: string, onFile: (filePath: string) => Promise<void>): Promise<void> {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await walk(fullPath, onFile);
    } else if (entry.isFile()) {
      await onFile(fullPath);
    }
  }
}

main().catch(error => {
  console.error("Failed to replace layer-4 links.");
  console.error(error instanceof Error ? error.stack ?? error.message : error);
  process.exitCode = 1;
});
