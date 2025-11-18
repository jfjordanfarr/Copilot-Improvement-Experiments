import * as fs from "node:fs/promises";
import * as os from "node:os";
import * as path from "node:path";

import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { csharpAdapter } from "./csharp";

describe("csharpAdapter Hangfire heuristics", () => {
  let workspaceRoot: string;

  beforeEach(async () => {
    workspaceRoot = await fs.mkdtemp(path.join(os.tmpdir(), "hangfire-adapter-"));
  });

  afterEach(async () => {
    if (workspaceRoot) {
      await fs.rm(workspaceRoot, { recursive: true, force: true });
    }
  });

  it("links BackgroundJob.Enqueue targets to worker implementations", async () => {
    const controllersDir = path.join(workspaceRoot, "Controllers");
    const workersDir = path.join(workspaceRoot, "Workers");
    await fs.mkdir(controllersDir, { recursive: true });
    await fs.mkdir(workersDir, { recursive: true });

    const controllerPath = path.join(controllersDir, "TelemetryController.cs");
    await fs.writeFile(
      controllerPath,
      [
        "using Hangfire;",
        "namespace Example.Controllers;",
        "public class TelemetryController",
        "{",
        "    public void Record()",
        "    {",
        "        BackgroundJob.Enqueue<Example.Workers.TelemetryWorker>(worker => worker.Process(\"payload\"));",
        "    }",
        "}",
        ""
      ].join("\n"),
      "utf8"
    );

    const workerPath = path.join(workersDir, "TelemetryWorker.cs");
    await fs.writeFile(
      workerPath,
      [
        "namespace Example.Workers;",
        "public class TelemetryWorker",
        "{",
        "    public void Process(string payload) { }",
        "}",
        ""
      ].join("\n"),
      "utf8"
    );

    const analysis = await csharpAdapter.analyze({
      absolutePath: controllerPath,
      workspaceRoot
    });

    expect(analysis?.dependencies).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          resolvedPath: path
            .relative(workspaceRoot, workerPath)
            .replace(/\\/g, "/")
        })
      ])
    );
  });
});
