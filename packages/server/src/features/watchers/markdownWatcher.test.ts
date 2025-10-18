import { promises as fs } from "node:fs";
import os from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { describe, expect, it, afterEach, beforeEach } from "vitest";
import { TextDocument } from "vscode-languageserver-textdocument";

import {
  GraphStore,
  LinkInferenceOrchestrator
} from "@copilot-improvement/shared";

import { MarkdownWatcher } from "./markdownWatcher";
import type { QueuedChange } from "../changeEvents/changeQueue";

const TEST_NOW = () => new Date("2025-01-01T00:00:00.000Z");

describe("MarkdownWatcher", () => {
  let tempDir: string;
  let dbPath: string;
  let graphStore: GraphStore;

  beforeEach(async () => {
    tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "markdown-watcher-"));
    dbPath = path.join(tempDir, "graph.db");
    graphStore = new GraphStore({ dbPath });
  });

  afterEach(async () => {
    graphStore.close();
    await fs.rm(tempDir, { recursive: true, force: true });
  });

  it("runs inference for saved markdown files and discovers existing code artifacts", async () => {
    const codeDir = path.join(tempDir, "src");
    await fs.mkdir(codeDir, { recursive: true });
    const codeFile = path.join(codeDir, "core.ts");
    await fs.writeFile(codeFile, "export function core() { return true; }\n");
    const codeUri = pathToFileURL(codeFile).toString();

    graphStore.upsertArtifact({
      id: "code-artifact",
      uri: codeUri,
      layer: "implementation",
      language: "typescript",
      owner: "backend",
      hash: undefined,
      lastSynchronizedAt: undefined,
      metadata: undefined
    });

    const docsDir = path.join(tempDir, "docs");
    await fs.mkdir(docsDir, { recursive: true });
    const docFile = path.join(docsDir, "spec.md");
    const relative = path
      .relative(path.dirname(docFile), codeFile)
      .replace(/\\/g, "/");
    const docContent = `# Feature\n\nLinks to [Core](${relative}) implementation.`;
    await fs.writeFile(docFile, docContent);
    const docUri = pathToFileURL(docFile).toString();

    const document = TextDocument.create(docUri, "markdown", 1, docContent);
    const documents = { get: (uri: string) => (uri === docUri ? document : undefined) };

    const watcher = new MarkdownWatcher({
      documents,
      graphStore,
      orchestrator: new LinkInferenceOrchestrator(),
      now: TEST_NOW
    });

    const change: QueuedChange = {
      uri: docUri,
      languageId: "markdown",
      version: 1
    };

    const result = await watcher.processChanges([change]);

    expect(result.skipped).toHaveLength(0);
    expect(result.processed).toHaveLength(1);
    expect(result.inference).toBeDefined();
    expect(result.inference?.errors ?? []).toHaveLength(0);

    const processed = result.processed[0];
    expect(processed.previousArtifact).toBeUndefined();
    expect(processed.nextArtifact?.uri).toBe(docUri);

    const artifactsById = new Map(result.inference?.artifacts.map(artifact => [artifact.id, artifact]));
    const linkPairs = (result.inference?.links ?? []).map(link => ({
      sourceUri: artifactsById.get(link.sourceId)?.uri,
      targetUri: artifactsById.get(link.targetId)?.uri
    }));

    expect(linkPairs).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ sourceUri: docUri, targetUri: codeUri })
      ])
    );
  });
});
