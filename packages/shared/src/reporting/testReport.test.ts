import { describe, expect, it } from "vitest";

import {
  buildTestReportMarkdown,
  type AstAccuracyData,
  type BenchmarkRecord,
  type RebuildStabilityData,
  type TestReportContext
} from "./testReport";

describe("buildTestReportMarkdown", () => {
  it("renders rebuild stability and AST accuracy sections", () => {
    const context: TestReportContext = {
      generatedAt: "2025-10-31T10:00:00.000Z",
      gitCommit: "abcdef123456",
      gitBranch: "main",
      benchmarkMode: "self-similarity"
    };

    const rebuildRecord: BenchmarkRecord<RebuildStabilityData> = {
      benchmark: "rebuild-stability",
      recordedAt: "2025-10-31T10:01:00.000Z",
      environment: {
        nodeVersion: "v22.0.0",
        platform: "win32"
      },
      sourcePath: "AI-Agent-Workspace/tmp/benchmarks/rebuild-stability.json",
      data: {
        mode: "self-similarity",
        workspace: "simple-workspace",
        iterations: 3,
        durationsMs: [100, 110, 108],
        averageDurationMs: 106,
        maxDurationMs: 110,
        driftDetected: false
      }
    };

    const astRecord: BenchmarkRecord<AstAccuracyData> = {
      benchmark: "ast-accuracy",
      recordedAt: "2025-10-31T10:02:00.000Z",
      environment: {
        nodeVersion: "v22.0.0",
        platform: "win32"
      },
      sourcePath: "AI-Agent-Workspace/tmp/benchmarks/ast-accuracy.json",
      data: {
        mode: "self-similarity",
        thresholds: {
          precision: 0.6,
          recall: 0.6
        },
        totals: {
          truePositives: 4,
          falsePositives: 1,
          falseNegatives: 1,
          precision: 0.8,
          recall: 0.8,
          f1Score: 0.8,
          totalEvaluated: 6
        },
        fixtures: [
          {
            id: "ts-basic",
            language: "typescript",
            totals: {
              truePositives: 4,
              falsePositives: 1,
              falseNegatives: 1,
              precision: 0.8,
              recall: 0.8,
              f1Score: 0.8,
              totalEvaluated: 6
            }
          }
        ]
      }
    };

    const markdown = buildTestReportMarkdown(context, [rebuildRecord, astRecord]);

    expect(markdown).toContain("# Test Report");
    expect(markdown).toContain("## Benchmarks");
    expect(markdown).toContain("### Rebuild Stability");
    expect(markdown).toContain("### AST Accuracy");
    expect(markdown).toContain("simple-workspace");
    expect(markdown).toContain("ts-basic");
    expect(markdown).toContain("## Environment Summary");
    expect(markdown).toContain("nodeVersion");
    expect(markdown).toContain("## Benchmark Artifacts");
  });

  it("falls back to JSON for unknown benchmark types", () => {
    const context: TestReportContext = {
      generatedAt: "2025-10-31T10:00:00.000Z",
      gitCommit: "abcdef123456"
    };

    const customRecord: BenchmarkRecord<{ note: string }> = {
      benchmark: "custom-benchmark",
      recordedAt: "2025-10-31T10:05:00.000Z",
      environment: {},
      data: { note: "hello" }
    };

    const markdown = buildTestReportMarkdown(context, [customRecord]);

    expect(markdown).toContain("### custom-benchmark");
    expect(markdown).toContain("```");
    expect(markdown).toContain("\"note\": \"hello\"");
  });
});
