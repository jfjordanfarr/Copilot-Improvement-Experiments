import path from "node:path";
import { pathToFileURL } from "node:url";
import { describe, expect, it, vi } from "vitest";
import { TextDocument } from "vscode-languageserver-textdocument";

import { LinkInferenceOrchestrator } from "@copilot-improvement/shared";
import type { GraphStore } from "@copilot-improvement/shared";

import { ArtifactWatcher } from "./artifactWatcher";
import type { QueuedChange } from "../changeEvents/changeQueue";

const TEST_NOW = () => new Date("2025-01-01T00:00:00.000Z");

describe("ArtifactWatcher", () => {
  it("tracks document and code artifacts during inference", async () => {
    const workspaceDir = path.join(process.cwd(), "tests", "integration", "fixtures", "simple-workspace");
    const codeFile = path.join(workspaceDir, "src", "core.ts");
    const codeUri = pathToFileURL(codeFile).toString();

    const docFile = path.join(workspaceDir, "docs", "spec.md");
    const relative = path.relative(path.dirname(docFile), codeFile).replace(/\\/g, "/");
    const docContent = `# Feature\n\nLinks to [Core](${relative}) implementation.`;
    const docUri = pathToFileURL(docFile).toString();

    const documents = {
      get: (uri: string) => {
        if (uri === docUri) {
          return TextDocument.create(docUri, "markdown", 1, docContent);
        }

        if (uri === codeUri) {
          return TextDocument.create(codeUri, "typescript", 1, "export function core() { return true; }\n");
        }

        return undefined;
      }
    };

    const listArtifacts = vi.fn(() => [
      {
        id: "code-artifact",
        uri: codeUri,
        layer: "code",
        language: "typescript",
        owner: undefined,
        hash: undefined,
        lastSynchronizedAt: undefined,
        metadata: undefined
      }
    ]) as unknown as GraphStore["listArtifacts"];

    const graphStore = {
      listArtifacts,
      getArtifactByUri: vi.fn(() => undefined) as unknown as GraphStore["getArtifactByUri"],
      listLinkedArtifacts: vi.fn(() => []) as unknown as GraphStore["listLinkedArtifacts"]
    } as unknown as GraphStore;

    const watcher = new ArtifactWatcher({
      documents,
      graphStore,
      orchestrator: new LinkInferenceOrchestrator(),
      now: TEST_NOW
    });

    const docChange: QueuedChange = {
      uri: docUri,
      languageId: "markdown",
      version: 1
    };

    const codeChange: QueuedChange = {
      uri: codeUri,
      languageId: "typescript",
      version: 1
    };

    const result = await watcher.processChanges([docChange, codeChange]);

    expect(result.skipped).toHaveLength(0);
    expect(result.processed).toHaveLength(2);

    const documentChange = result.processed.find(change => change.category === "document");
    expect(documentChange?.uri).toBe(docUri);
    expect(documentChange?.layer).toBe("requirements");
    expect(documentChange?.contentLength).toBe(docContent.length);

    const codeArtifactChange = result.processed.find(change => change.category === "code");
    expect(codeArtifactChange?.uri).toBe(codeUri);
    expect(codeArtifactChange?.layer).toBe("code");
    expect(codeArtifactChange?.contentLength).toBeGreaterThan(0);

    expect(result.inference).toBeDefined();
    expect(result.inference?.errors ?? []).toHaveLength(0);
  });
});
