import { describe, expect, it, vi } from "vitest";

import type {
  GraphStore,
  KnowledgeArtifact,
  LinkedArtifactSummary
} from "@copilot-improvement/shared";

import { publishDocDiagnostics } from "./publishDocDiagnostics";
import type { DocumentChangeContext } from "./publishDocDiagnostics";
import type { RuntimeSettings } from "../settings/settingsBridge";
import type { MarkdownDocumentChange } from "../watchers/markdownWatcher";

const RUNTIME_SETTINGS: RuntimeSettings = {
  debounceMs: 500,
  noiseSuppression: {
    level: "medium",
    maxDiagnosticsPerBatch: 5,
    hysteresisMs: 1000
  }
};

const BASE_CHANGE: MarkdownDocumentChange = {
  uri: "file:///docs/spec.md",
  layer: "requirements",
  change: {
    uri: "file:///docs/spec.md",
    languageId: "markdown",
    version: 1
  },
  previousArtifact: undefined,
  nextArtifact: undefined,
  hints: [],
  content: "# Spec",
  contentLength: 6
};

function buildContext(overrides: Partial<DocumentChangeContext> = {}): DocumentChangeContext {
  const artifact: KnowledgeArtifact = {
    id: "doc-artifact",
    uri: BASE_CHANGE.uri,
    layer: "requirements",
    language: "markdown",
    owner: undefined,
    lastSynchronizedAt: undefined,
    hash: undefined,
    metadata: undefined
  };

  return {
    change: BASE_CHANGE,
    artifact,
    ...overrides
  };
}

describe("publishDocDiagnostics", () => {
  it("emits diagnostics for outgoing linked artifacts", () => {
    const linked: LinkedArtifactSummary[] = [
      {
        linkId: "link-1",
        kind: "references",
        direction: "outgoing",
        artifact: {
          id: "code-artifact",
          uri: "file:///src/code.ts",
          layer: "implementation",
          language: "typescript",
          owner: "backend",
          lastSynchronizedAt: undefined,
          hash: undefined,
          metadata: undefined
        }
      }
    ];

    const listLinkedArtifacts = vi.fn().mockReturnValue(linked);
    const sendDiagnostics = vi.fn();

    const graphStore = {
      listLinkedArtifacts
    } as unknown as GraphStore;

    const contexts = [buildContext()];

    const result = publishDocDiagnostics({
      sender: { sendDiagnostics: params => { sendDiagnostics(params); } },
      graphStore,
      contexts,
      runtimeSettings: RUNTIME_SETTINGS
    });

    expect(result).toEqual({ emitted: 1, suppressed: 0 });
    expect(listLinkedArtifacts).toHaveBeenCalledWith("doc-artifact");
    expect(sendDiagnostics).toHaveBeenCalledTimes(1);
    const [[diagnosticParams]] = sendDiagnostics.mock.calls as Array<[
      { uri: string; diagnostics: unknown[] }
    ]>;
    expect(diagnosticParams.uri).toBe("file:///src/code.ts");
    expect(diagnosticParams.diagnostics).toHaveLength(1);
    const diagnostics = diagnosticParams.diagnostics as Array<Record<string, unknown>>;
    const diagnostic = diagnostics[0] as {
      code?: string;
      data?: Record<string, unknown>;
    };
    expect(diagnostic.code).toBe("doc-drift");
    expect(diagnostic.data).toMatchObject({ triggerUri: BASE_CHANGE.uri, linkId: "link-1" });
  });

  it("applies the batch suppression budget", () => {
    const linked: LinkedArtifactSummary[] = [
      {
        linkId: "link-1",
        kind: "references",
        direction: "outgoing",
        artifact: {
          id: "code-artifact",
          uri: "file:///src/code.ts",
          layer: "implementation",
          language: "typescript",
          owner: "backend",
          lastSynchronizedAt: undefined,
          hash: undefined,
          metadata: undefined
        }
      }
    ];

    const listLinkedArtifacts = vi.fn().mockReturnValue(linked);
    const sendDiagnostics = vi.fn();

    const graphStore = {
      listLinkedArtifacts
    } as unknown as GraphStore;

    const contexts = [buildContext()];

    const tightBudget: RuntimeSettings = {
      ...RUNTIME_SETTINGS,
      noiseSuppression: {
        ...RUNTIME_SETTINGS.noiseSuppression,
        maxDiagnosticsPerBatch: 0
      }
    };

    const result = publishDocDiagnostics({
      sender: { sendDiagnostics: params => { sendDiagnostics(params); } },
      graphStore,
      contexts,
      runtimeSettings: tightBudget
    });

    expect(result).toEqual({ emitted: 0, suppressed: 1 });
    expect(sendDiagnostics).not.toHaveBeenCalled();
  });

  it("short-circuits when no contexts are provided", () => {
    const listLinkedArtifacts = vi.fn();
    const graphStore = {
      listLinkedArtifacts
    } as unknown as GraphStore;

    const sendDiagnostics = vi.fn();

    const result = publishDocDiagnostics({
      sender: { sendDiagnostics: params => { sendDiagnostics(params); } },
      graphStore,
      contexts: [],
      runtimeSettings: RUNTIME_SETTINGS
    });

    expect(result).toEqual({ emitted: 0, suppressed: 0 });
    expect(sendDiagnostics).not.toHaveBeenCalled();
    expect(listLinkedArtifacts).not.toHaveBeenCalled();
  });
});
