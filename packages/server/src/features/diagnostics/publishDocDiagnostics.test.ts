import { describe, expect, it, vi } from "vitest";

import type {
  GraphStore,
  KnowledgeArtifact,
  LinkedArtifactSummary
} from "@copilot-improvement/shared";

import { HysteresisController } from "./hysteresisController";
import { publishDocDiagnostics } from "./publishDocDiagnostics";
import type { DocumentChangeContext } from "./publishDocDiagnostics";
import type { RuntimeSettings } from "../settings/settingsBridge";
import type { DocumentTrackedArtifactChange } from "../watchers/artifactWatcher";

const RUNTIME_SETTINGS: RuntimeSettings = {
  debounceMs: 500,
  noiseSuppression: {
    level: "medium",
    maxDiagnosticsPerBatch: 5,
    hysteresisMs: 1000
  }
};

const BASE_CHANGE: DocumentTrackedArtifactChange = {
  uri: "file:///docs/spec.md",
  layer: "requirements",
  category: "document",
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
    changeEventId: "change-event-doc",
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
    const hysteresis = new HysteresisController({ now: () => new Date(0) });

    const result = publishDocDiagnostics({
      sender: { sendDiagnostics: params => { sendDiagnostics(params); } },
      graphStore,
      contexts,
      runtimeSettings: RUNTIME_SETTINGS,
      hysteresis
    });

    expect(result).toEqual({ emitted: 1, suppressedByBudget: 0, suppressedByHysteresis: 0 });
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
    const hysteresis = new HysteresisController({ now: () => new Date(0) });

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
      runtimeSettings: tightBudget,
      hysteresis
    });

    expect(result).toEqual({ emitted: 0, suppressedByBudget: 1, suppressedByHysteresis: 0 });
    expect(sendDiagnostics).not.toHaveBeenCalled();
  });

  it("short-circuits when no contexts are provided", () => {
    const listLinkedArtifacts = vi.fn();
    const graphStore = {
      listLinkedArtifacts
    } as unknown as GraphStore;

    const sendDiagnostics = vi.fn();
    const hysteresis = new HysteresisController({ now: () => new Date(0) });

    const result = publishDocDiagnostics({
      sender: { sendDiagnostics: params => { sendDiagnostics(params); } },
      graphStore,
      contexts: [],
      runtimeSettings: RUNTIME_SETTINGS,
      hysteresis
    });

    expect(result).toEqual({ emitted: 0, suppressedByBudget: 0, suppressedByHysteresis: 0 });
    expect(sendDiagnostics).not.toHaveBeenCalled();
    expect(listLinkedArtifacts).not.toHaveBeenCalled();
  });

  it("suppresses reciprocal diagnostics within the hysteresis window", () => {
    let now = 0;
    const hysteresis = new HysteresisController({ now: () => new Date(now) });

    const documentContext = buildContext();
    const codeArtifact: KnowledgeArtifact = {
      id: "code-artifact",
      uri: "file:///src/code.ts",
      layer: "implementation",
      language: "typescript",
      owner: undefined,
      lastSynchronizedAt: undefined,
      hash: undefined,
      metadata: undefined
    };

    const docLinks: LinkedArtifactSummary[] = [
      {
        linkId: "link-1",
        kind: "references",
        direction: "outgoing",
        artifact: codeArtifact
      }
    ];

    const documentGraphStore = {
      listLinkedArtifacts: vi.fn().mockReturnValue(docLinks)
    } as unknown as GraphStore;

    const firstResult = publishDocDiagnostics({
      sender: { sendDiagnostics: () => {} },
      graphStore: documentGraphStore,
      contexts: [documentContext],
      runtimeSettings: RUNTIME_SETTINGS,
      hysteresis
    });

    expect(firstResult).toEqual({ emitted: 1, suppressedByBudget: 0, suppressedByHysteresis: 0 });

    const reverseLinks: LinkedArtifactSummary[] = [
      {
        linkId: "link-1",
        kind: "references",
        direction: "outgoing",
        artifact: documentContext.artifact
      }
    ];

    const codeContext: DocumentChangeContext = {
      change: {
        uri: codeArtifact.uri,
        layer: "implementation",
        change: {
          uri: codeArtifact.uri,
          languageId: "typescript",
          version: 2
        },
        category: "document",
        previousArtifact: undefined,
        nextArtifact: undefined,
        hints: [],
        content: "export const value = 1;",
        contentLength: 22
      },
      artifact: codeArtifact,
      changeEventId: "change-event-code"
    };

    const codeGraphStore = {
      listLinkedArtifacts: vi.fn().mockReturnValue(reverseLinks)
    } as unknown as GraphStore;

    now = 500;

    const secondResult = publishDocDiagnostics({
      sender: { sendDiagnostics: () => {} },
      graphStore: codeGraphStore,
      contexts: [codeContext],
      runtimeSettings: RUNTIME_SETTINGS,
      hysteresis
    });

    expect(secondResult).toEqual({ emitted: 0, suppressedByBudget: 0, suppressedByHysteresis: 1 });
  });
});
