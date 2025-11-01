export interface BenchmarkEnvironment {
  nodeVersion?: string | null;
  platform?: string | null;
  arch?: string | null;
  providerMode?: string | null;
  ollamaModel?: string | null;
  ollamaEndpoint?: string | null;
  [key: string]: string | null | undefined;
}

export interface BenchmarkRecord<TData = unknown> {
  benchmark: string;
  recordedAt: string;
  environment: BenchmarkEnvironment;
  data: TData;
  sourcePath?: string;
}

export interface TestReportContext {
  generatedAt: string;
  gitCommit: string;
  gitBranch?: string;
  benchmarkMode?: string;
}

export interface RebuildStabilityData {
  mode?: string;
  workspace: string;
  iterations: number;
  durationsMs: number[];
  averageDurationMs: number;
  maxDurationMs: number;
  driftDetected: boolean;
}

export interface AstAccuracyTotals {
  truePositives: number;
  falsePositives: number;
  falseNegatives: number;
  precision: number | null;
  recall: number | null;
  f1Score: number | null;
  totalEvaluated?: number;
}

export interface AstAccuracyFixture {
  id: string;
  label?: string;
  language?: string;
  totals: AstAccuracyTotals;
}

export interface AstAccuracyData {
  mode?: string;
  thresholds?: {
    precision?: number;
    recall?: number;
  };
  totals: AstAccuracyTotals;
  fixtures: AstAccuracyFixture[];
}

export interface ReportSection {
  title: string;
  body: string[];
}

export function buildTestReportMarkdown(
  context: TestReportContext,
  benchmarks: BenchmarkRecord[]
): string {
  const lines: string[] = [];
  lines.push("# Test Report");
  lines.push("");
  lines.push(`- **Generated:** ${context.generatedAt}`);
  lines.push(`- **Git commit:** ${context.gitCommit}`);
  if (context.gitBranch) {
    lines.push(`- **Git branch:** ${context.gitBranch}`);
  }
  if (context.benchmarkMode) {
    lines.push(`- **Benchmark mode:** ${context.benchmarkMode}`);
  }
  lines.push("");

  const sections = buildBenchmarkSections(benchmarks);
  lines.push("## Benchmarks");
  lines.push("");
  if (sections.length === 0) {
    lines.push("_No benchmark results found. Run benchmarks with --report to capture data._");
  } else {
    for (const section of sections) {
      lines.push(`### ${section.title}`);
      lines.push("");
      lines.push(...section.body);
      if (!section.body.at(-1)) {
        lines.push("");
      } else {
        lines.push("");
      }
    }
  }

  const environmentSummary = summariseEnvironments(benchmarks);
  if (environmentSummary.length > 0) {
    lines.push("## Environment Summary");
    lines.push("");
    lines.push(...environmentSummary);
    lines.push("");
  }

  if (benchmarks.length > 0) {
    lines.push("## Benchmark Artifacts");
    lines.push("");
    for (const record of benchmarks) {
      const suffix = record.sourcePath ? ` (${record.sourcePath})` : "";
      lines.push(`- ${record.benchmark} — recorded ${record.recordedAt}${suffix}`);
    }
    lines.push("");
  }

  return lines.join("\n");
}

function buildBenchmarkSections(records: BenchmarkRecord[]): ReportSection[] {
  return records
    .map(record => {
      switch (record.benchmark) {
        case "rebuild-stability":
          return buildRebuildStabilitySection(record as BenchmarkRecord<RebuildStabilityData>);
        case "ast-accuracy":
          return buildAstAccuracySection(record as BenchmarkRecord<AstAccuracyData>);
        default:
          return buildGenericSection(record);
      }
    })
    .filter((value): value is ReportSection => value !== null);
}

function buildRebuildStabilitySection(record: BenchmarkRecord<RebuildStabilityData>): ReportSection {
  const data = record.data;
  const durations = Array.isArray(data.durationsMs) ? data.durationsMs : [];
  const formattedDurations = durations.map(value => `${value.toFixed(0)} ms`).join(", ");

  const body: string[] = [];
  if (data.mode) {
    body.push(`- **Mode:** ${data.mode}`);
  }
  body.push(`- **Workspace:** ${data.workspace}`);
  body.push(`- **Iterations:** ${data.iterations}`);
  if (durations.length > 0) {
    body.push(`- **Durations:** ${formattedDurations}`);
  }
  body.push(`- **Average duration:** ${data.averageDurationMs.toFixed(2)} ms`);
  body.push(`- **Max duration:** ${data.maxDurationMs.toFixed(2)} ms`);
  body.push(`- **Drift detected:** ${data.driftDetected ? "Yes" : "No"}`);

  return {
    title: "Rebuild Stability",
    body
  };
}

function buildAstAccuracySection(record: BenchmarkRecord<AstAccuracyData>): ReportSection {
  const data = record.data;
  const body: string[] = [];

  if (data.mode) {
    body.push(`- **Mode:** ${data.mode}`);
  }
  if (data.thresholds) {
    const precision = data.thresholds.precision ?? null;
    const recall = data.thresholds.recall ?? null;
    body.push(
      `- **Thresholds:** precision ${formatPercentage(precision)}, recall ${formatPercentage(recall)}`
    );
  }

  body.push("- **Totals:**");
  body.push("");
  body.push(renderTotalsTable(data.totals));
  body.push("");

  if (Array.isArray(data.fixtures) && data.fixtures.length > 0) {
    body.push("- **Fixtures:**");
    body.push("");
    body.push(renderFixtureTable(data.fixtures));
    body.push("");
  }

  return {
    title: "AST Accuracy",
    body
  };
}

function buildGenericSection(record: BenchmarkRecord): ReportSection {
  const body: string[] = [];
  body.push("```");
  body.push(JSON.stringify(record.data, null, 2));
  body.push("```");
  return {
    title: record.benchmark,
    body
  };
}

function renderTotalsTable(totals: AstAccuracyTotals): string {
  const headers = ["TP", "FP", "FN", "Precision", "Recall", "F1"];
  const values = [
    totals.truePositives,
    totals.falsePositives,
    totals.falseNegatives,
    formatPercentage(totals.precision),
    formatPercentage(totals.recall),
    formatPercentage(totals.f1Score)
  ];

  return [
    `| ${headers.join(" | ")} |`,
    `| ${headers.map(() => "-").join(" | ")} |`,
    `| ${values.join(" | ")} |`
  ].join("\n");
}

function renderFixtureTable(fixtures: AstAccuracyFixture[]): string {
  const headers = ["Fixture", "Language", "TP", "FP", "FN", "Precision", "Recall", "F1"];
  const lines = fixtures.map(fixture => {
    const name = fixture.label ?? fixture.id;
    const language = fixture.language ?? "—";
    const totals = fixture.totals;
    return [
      name,
      language,
      totals.truePositives,
      totals.falsePositives,
      totals.falseNegatives,
      formatPercentage(totals.precision),
      formatPercentage(totals.recall),
      formatPercentage(totals.f1Score)
    ].join(" | ");
  });

  return [
    `| ${headers.join(" | ")} |`,
    `| ${headers.map(() => "-").join(" | ")} |`,
    ...lines.map(line => `| ${line} |`)
  ].join("\n");
}

function formatPercentage(value: number | null | undefined): string {
  if (value === null || value === undefined) {
    return "n/a";
  }
  return `${(value * 100).toFixed(1)}%`;
}

function summariseEnvironments(records: BenchmarkRecord[]): string[] {
  if (records.length === 0) {
    return [];
  }

  const merged: Record<string, Set<string>> = {};
  for (const record of records) {
    for (const [key, value] of Object.entries(record.environment ?? {})) {
      if (!value) {
        continue;
      }
      if (!merged[key]) {
        merged[key] = new Set();
      }
      merged[key].add(value);
    }
  }

  const entries = Object.entries(merged).sort(([left], [right]) => left.localeCompare(right));
  if (entries.length === 0) {
    return [];
  }

  return entries.map(([key, values]) => `- **${key}:** ${Array.from(values).join(", ")}`);
}