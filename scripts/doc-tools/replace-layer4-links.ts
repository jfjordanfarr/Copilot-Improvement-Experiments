import * as fs from "node:fs/promises";
import * as path from "node:path";

interface ReplacementResult {
  filePath: string;
  replaced: number;
}

const slugMap = new Map<string, string>([
  ["knowledge-graph-ingestion/knowledgeFeedManager", ".live-documentation/source/packages/server/src/features/knowledge/knowledgeFeedManager.ts.md"],
  ["extension-views/diagnosticsTree", ".live-documentation/source/packages/extension/src/views/diagnosticsTree.ts.md"],
  ["extension-commands/exportDiagnostics", ".live-documentation/source/packages/extension/src/commands/exportDiagnostics.ts.md"],
  ["tooling/slopcopMarkdownLinks", ".live-documentation/source/scripts/slopcop/check-markdown-links.ts.md"],
  ["tooling/slopcopAssetPaths", ".live-documentation/source/scripts/slopcop/check-asset-paths.ts.md"],
  ["tooling/slopcopSymbolReferences", ".live-documentation/source/scripts/slopcop/check-symbols.ts.md"],
  ["language-server-runtime/changeProcessor", ".live-documentation/source/packages/server/src/runtime/changeProcessor.ts.md"],
  ["tooling/workspaceGraphSnapshot", ".live-documentation/source/scripts/graph-tools/snapshot-workspace.ts.md"],
  ["knowledge-graph-ingestion/feedCheckpointStore", ".live-documentation/source/packages/server/src/features/knowledge/feedCheckpointStore.ts.md"],
  ["knowledge-graph-ingestion/feedDiagnosticsGateway", ".live-documentation/source/packages/server/src/features/knowledge/feedDiagnosticsGateway.ts.md"],
  ["extension-diagnostics/dependencyQuickPick", ".live-documentation/source/packages/extension/src/diagnostics/dependencyQuickPick.ts.md"],
  ["shared/fallbackInference", ".live-documentation/source/packages/shared/src/inference/fallbackInference.ts.md"],
  ["language-server-runtime/linkInferenceOrchestrator", ".live-documentation/source/packages/shared/src/inference/linkInference.ts.md"],
  ["extension-diagnostics/docDiagnosticProvider", ".live-documentation/source/packages/extension/src/diagnostics/docDiagnosticProvider.ts.md"],
  ["server-diagnostics/publishDocDiagnostics", ".live-documentation/source/packages/server/src/features/diagnostics/publishDocDiagnostics.ts.md"],
  ["server-diagnostics/publishCodeDiagnostics", ".live-documentation/source/packages/server/src/features/diagnostics/publishCodeDiagnostics.ts.md"],
  ["tooling/safeToCommit", "scripts/safe-to-commit.mjs"],
  ["tooling/graphCoverageAudit", ".live-documentation/source/scripts/graph-tools/audit-doc-coverage.ts.md"],
  ["tooling/inspectSymbolNeighborsCli", ".live-documentation/source/scripts/graph-tools/inspect-symbol.ts.md"],
  ["tooling/relationshipRuleEngine", ".live-documentation/source/packages/shared/src/rules/relationshipRuleEngine.ts.md"],
  ["tooling/relationshipRuleAudit", ".live-documentation/source/packages/shared/src/rules/relationshipRuleAudit.ts.md"],
  ["tooling/relationshipRuleResolvers", ".live-documentation/source/packages/shared/src/rules/relationshipResolvers.ts.md"],
  ["tooling/relationshipRuleTypes", ".live-documentation/source/packages/shared/src/rules/relationshipRuleTypes.ts.md"],
  ["tooling/relationshipRuleProvider", ".live-documentation/source/packages/shared/src/rules/relationshipRuleProvider.ts.md"],
  ["tooling/symbolCorrectnessProfiles", ".live-documentation/source/packages/shared/src/rules/symbolCorrectnessProfiles.ts.md"],
  ["server-diagnostics/symbolCorrectnessValidator", ".live-documentation/source/packages/server/src/features/diagnostics/symbolCorrectnessValidator.ts.md"],
  ["testing/benchmarks/pythonFixtureOracle", ".live-documentation/source/packages/shared/src/testing/fixtureOracles/pythonFixtureOracle.ts.md"],
  ["testing/benchmarks/cFixtureOracle", ".live-documentation/source/packages/shared/src/testing/fixtureOracles/cFixtureOracle.ts.md"],
  ["testing/benchmarks/rustFixtureOracle", ".live-documentation/source/packages/shared/src/testing/fixtureOracles/rustFixtureOracle.ts.md"],
  ["testing/benchmarks/javaFixtureOracle", ".live-documentation/source/packages/shared/src/testing/fixtureOracles/javaFixtureOracle.ts.md"],
  ["testing/benchmarks/rubyFixtureOracle", ".live-documentation/source/packages/shared/src/testing/fixtureOracles/rubyFixtureOracle.ts.md"],
  ["testing/benchmarks/csharpFixtureOracle", ".live-documentation/source/packages/shared/src/testing/fixtureOracles/csharpFixtureOracle.ts.md"],
  ["shared/llmSampling", ".live-documentation/source/packages/shared/src/inference/llmSampling.ts.md"],
  ["tooling/testReportGenerator", ".live-documentation/source/packages/shared/src/reporting/testReport.ts.md"],
  ["testing/benchmarks/benchmarkRecorder", ".live-documentation/source/tests/integration/benchmarks/utils/benchmarkRecorder.ts.md"],
  ["telemetry/inferenceAccuracyTracker", ".live-documentation/source/packages/shared/src/telemetry/inferenceAccuracy.ts.md"],
  ["server-diagnostics/acknowledgementService", ".live-documentation/source/packages/server/src/features/diagnostics/acknowledgementService.ts.md"],
  ["server-diagnostics/listOutstandingDiagnostics", ".live-documentation/source/packages/server/src/features/diagnostics/listOutstandingDiagnostics.ts.md"],
  ["language-server-runtime/artifactWatcher", ".live-documentation/source/packages/server/src/features/watchers/artifactWatcher.ts.md"],
  ["knowledge-graph-ingestion/rippleAnalyzer", ".live-documentation/source/packages/server/src/features/knowledge/rippleAnalyzer.ts.md"],
  ["testing/integration/us1-codeImpactSuite", ".live-documentation/source/tests/integration/us1/codeImpact.test.ts.md"],
  ["testing/integration/us2-markdownDriftSuite", ".live-documentation/source/tests/integration/us2/markdownDrift.test.ts.md"],
  ["testing/integration/us3-acknowledgeDiagnosticsSuite", ".live-documentation/source/tests/integration/us3/acknowledgeDiagnostics.test.ts.md"],
  ["testing/integration/us4-symbolNeighborsSuite", ".live-documentation/source/tests/integration/us4/inspectSymbolNeighbors.test.ts.md"],
  ["testing/integration/us5-llmIngestionSuite", ".live-documentation/source/tests/integration/us5/llmIngestionDryRun.test.ts.md"],
  ["change-events/changeQueue", ".live-documentation/source/packages/server/src/features/changeEvents/changeQueue.ts.md"],
  ["knowledge-graph-ingestion/knowledgeGraphIngestor", ".live-documentation/source/packages/server/src/features/knowledge/knowledgeGraphIngestor.ts.md"],
  ["knowledge-graph-ingestion/knowledgeGraphBridge", ".live-documentation/source/packages/server/src/features/knowledge/knowledgeGraphBridge.ts.md"],
  ["server-settings/providerGuard", ".live-documentation/source/packages/server/src/features/settings/providerGuard.ts.md"],
  ["dependencies/inspectDependencies", ".live-documentation/source/packages/server/src/features/dependencies/inspectDependencies.ts.md"],
  ["dependencies/symbolNeighbors", ".live-documentation/source/packages/server/src/features/dependencies/symbolNeighbors.ts.md"],
  ["llm-ingestion/llmIngestionManager", ".live-documentation/source/packages/server/src/runtime/llmIngestion.ts.md"],
  ["llm-ingestion/llmIngestionOrchestrator", ".live-documentation/source/packages/server/src/features/knowledge/llmIngestionOrchestrator.ts.md"],
  ["llm-ingestion/relationshipExtractor", ".live-documentation/source/packages/shared/src/inference/llm/relationshipExtractor.ts.md"],
  ["llm-ingestion/confidenceCalibrator", ".live-documentation/source/packages/shared/src/inference/llm/confidenceCalibrator.ts.md"],
  ["tooling/ollamaBridge", ".live-documentation/source/packages/extension/src/services/localOllamaBridge.ts.md"],
  ["testing/benchmarks/typeScriptFixtureOracle", ".live-documentation/source/packages/shared/src/testing/fixtureOracles/typeScriptFixtureOracle.ts.md"],
  ["tooling/benchmarkFixtureRegenerator", ".live-documentation/source/scripts/fixture-tools/regenerate-benchmarks.ts.md"],
  ["tooling/pathUtils", ".live-documentation/source/packages/shared/src/tooling/pathUtils.ts.md"],
  ["testing/integration/vscodeIntegrationHarness", ".live-documentation/source/tests/integration/vscode/runTests.ts.md"],
  ["testing/integration/simpleWorkspaceFixture", ".live-documentation/source/tests/integration/fixtures/simple-workspace/scripts/applyTemplate.ts.md"],
  ["testing/integration/cleanDistUtility", "tests/integration/clean-dist.mjs"],
  ["server-telemetry/latencyTracker", ".live-documentation/source/packages/server/src/telemetry/latencyTracker.ts.md"],
  ["server-settings/settingsBridge", ".live-documentation/source/packages/server/src/features/settings/settingsBridge.ts.md"],
  ["extension-commands/latencySummary", ".live-documentation/source/packages/extension/src/commands/latencySummary.ts.md"],
  ["extension-services/llmInvoker", ".live-documentation/source/packages/extension/src/services/llmInvoker.ts.md"]
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
