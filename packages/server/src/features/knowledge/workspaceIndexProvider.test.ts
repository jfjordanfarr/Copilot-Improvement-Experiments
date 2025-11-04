import { promises as fs } from "node:fs";
import * as path from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";

import { describe, expect, it, beforeEach, afterEach } from "vitest";

import { createWorkspaceIndexProvider } from "./workspaceIndexProvider";

describe("workspaceIndexProvider", () => {
  let workspaceRoot: string;

  beforeEach(async () => {
    workspaceRoot = await fs.mkdtemp(path.join(tmpdir(), "workspace-index-provider-"));
    await fs.mkdir(path.join(workspaceRoot, "src"), { recursive: true });
  });

  afterEach(async () => {
    await fs.rm(workspaceRoot, { recursive: true, force: true });
  });

  it("collects import evidences for TypeScript modules", async () => {
    const srcDir = path.join(workspaceRoot, "src");

    await fs.writeFile(
      path.join(srcDir, "types.ts"),
      "export interface Widget { id: string; }\nexport enum WidgetState { Active = 'active' }\n"
    );

    await fs.writeFile(
      path.join(srcDir, "models.ts"),
      "import { Widget, WidgetState } from './types';\nexport function createWidget(id: string): Widget { return { id, state: WidgetState.Active }; }\n"
    );

    await fs.writeFile(
      path.join(srcDir, "helpers.ts"),
      "export const unused = true;\n"
    );

    await fs.writeFile(
      path.join(srcDir, "index.ts"),
      "import { createWidget } from './models';\nexport function main(): string { return createWidget('1').id; }\n"
    );

    await fs.writeFile(
      path.join(srcDir, "util.ts"),
      "import { Widget } from './types';\nexport function format(widget: Widget): string { return widget.id; }\n"
    );

    const provider = createWorkspaceIndexProvider({
      rootPath: workspaceRoot,
      implementationGlobs: ["src"],
      documentationGlobs: [],
      scriptGlobs: []
    });

    const contribution = await provider.collect({ seeds: [] });
    expect(contribution).toBeTruthy();
    const evidences = contribution?.evidences ?? [];

    const normalized = evidences.map(evidence => ({
      source: path.normalize(path.relative(workspaceRoot, fileURLToPath(evidence.sourceUri))).replace(/\\/g, "/"),
      target: path.normalize(path.relative(workspaceRoot, fileURLToPath(evidence.targetUri))).replace(/\\/g, "/"),
      kind: evidence.kind
    }));

    expect(normalized).toContainEqual({
      source: "src/models.ts",
      target: "src/types.ts",
      kind: "depends_on"
    });

    expect(normalized).toContainEqual({
      source: "src/index.ts",
      target: "src/models.ts",
      kind: "depends_on"
    });

    expect(normalized).not.toContainEqual({
      source: "src/index.ts",
      target: "src/helpers.ts",
      kind: "depends_on"
    });

    expect(normalized).not.toContainEqual({
      source: "src/util.ts",
      target: "src/types.ts",
      kind: "depends_on"
    });
  });
});
