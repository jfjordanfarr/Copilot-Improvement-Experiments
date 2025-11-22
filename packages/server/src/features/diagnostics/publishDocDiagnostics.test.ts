import { describe, expect, it, vi } from "vitest";
import type { Diagnostic } from "vscode-languageserver/node";

import type { DiagnosticRecord, KnowledgeArtifact } from "@live-documentation/shared";

import type { AcknowledgementService } from "./acknowledgementService";
import { HysteresisController } from "./hysteresisController";
import { ZERO_NOISE_FILTER_TOTALS } from "./noiseFilter";
import { publishDocDiagnostics, type DocumentChangeContext } from "./publishDocDiagnostics";
import type { RippleImpact } from "./rippleTypes";
import type { RuntimeSettings } from "../settings/settingsBridge";
import type { DocumentTrackedArtifactChange } from "../watchers/artifactWatcher";

const RUNTIME_SETTINGS: RuntimeSettings = {
  debounceMs: 500,
  noiseSuppression: {
    level: "medium",
    maxDiagnosticsPerBatch: 5,
    hysteresisMs: 1000,
    filter: {
      minConfidence: 0.25,
      maxDepth: 5,
      maxPerChange: 5,
      maxPerArtifact: 3
    }
  },
  ripple: {
    maxDepth: 3,
    maxResults: 25,
    allowedKinds: ["documents", "references", "depends_on", "implements"],
    documentKinds: ["documents", "references"],
    codeKinds: ["depends_on", "implements"]
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

const BASE_ARTIFACT: KnowledgeArtifact = {
  id: "doc-artifact",
  uri: BASE_CHANGE.uri,
  layer: "requirements",
  language: "markdown",
  owner: undefined,
  lastSynchronizedAt: undefined,
  hash: undefined,
  metadata: undefined
};

function buildContext(overrides: Partial<DocumentChangeContext> = {}): DocumentChangeContext {
  return {
    change: BASE_CHANGE,
    artifact: BASE_ARTIFACT,
    changeEventId: "change-event-doc",
    rippleImpacts: [],
    ...overrides
  };
}

function makeImpact(overrides: { target?: KnowledgeArtifact; hint?: Partial<RippleImpact["hint"]> } = {}): RippleImpact {
  const target: KnowledgeArtifact =
    overrides.target ?? {
      id: "code-artifact",
      uri: "file:///src/code.ts",
      layer: "implementation",
      language: "typescript",
      owner: "backend",
      lastSynchronizedAt: undefined,
      hash: undefined,
      metadata: undefined
    };

  const baseHint = {
    sourceUri: BASE_ARTIFACT.uri,
    targetUri: target.uri ?? "",
    kind: "references" as const,
    confidence: 0.82,
    rationale: "direct relationship",
    depth: 1,
    path: [target.uri ?? ""]
  };

  return {
    target,
    hint: {
      ...baseHint,
      ...(overrides.hint ?? {})
    }
  };
}

function createAckServiceStub(overrides: { shouldEmit?: boolean } = {}): AcknowledgementService {
  const shouldEmit = overrides.shouldEmit ?? true;
  const shouldEmitFn = vi.fn(() => shouldEmit);
  const registerEmission = vi.fn((payload: {
    changeEventId: string;
    targetArtifactId: string;
    triggerArtifactId: string;
    message: string;
    severity: "info" | "warning" | "hint";
    linkIds?: string[];
  }): DiagnosticRecord => ({
    id: `record-${payload.changeEventId}`,
    artifactId: payload.targetArtifactId,
    triggerArtifactId: payload.triggerArtifactId,
    changeEventId: payload.changeEventId,
    message: payload.message,
    severity: payload.severity,
    status: "active",
    createdAt: "2025-01-01T00:00:00.000Z",
    linkIds: payload.linkIds ?? []
  }));

  return {
    shouldEmitDiagnostic: shouldEmitFn,
    registerEmission,
    acknowledgeDiagnostic: vi.fn(),
    updateRuntimeSettings: vi.fn()
  } as unknown as AcknowledgementService;
}

describe("publishDocDiagnostics", () => {
  it("emits diagnostics for outgoing linked artifacts", () => {
    const sendDiagnostics = vi.fn();
    const contexts = [
      buildContext({
        rippleImpacts: [makeImpact()]
      })
    ];
    const hysteresis = new HysteresisController({ now: () => new Date(0) });

    const result = publishDocDiagnostics({
      sender: { sendDiagnostics: params => { sendDiagnostics(params); } },
      contexts,
      runtimeSettings: RUNTIME_SETTINGS,
      hysteresis
    });

    expect(result).toMatchObject({
      emitted: 1,
      suppressedByBudget: 0,
      suppressedByHysteresis: 0,
      suppressedByAcknowledgement: 0,
      emittedByChange: { "change-event-doc": 1 }
    });
    expect(result.noiseFilter).toEqual(ZERO_NOISE_FILTER_TOTALS);
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
    expect(diagnostic.data).toMatchObject({
      triggerUri: BASE_CHANGE.uri,
      targetUri: "file:///src/code.ts",
      relationshipKind: "references"
    });
  });

  it("adds acknowledgement metadata when emissions are persisted", () => {
    const sendDiagnostics = vi.fn();
    const contexts = [
      buildContext({
        rippleImpacts: [makeImpact()]
      })
    ];
    const acknowledgements = createAckServiceStub();

    publishDocDiagnostics({
      sender: { sendDiagnostics: params => { sendDiagnostics(params); } },
      contexts,
      runtimeSettings: RUNTIME_SETTINGS,
      hysteresis: new HysteresisController({ now: () => new Date(0) }),
      acknowledgements
    });

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(acknowledgements.registerEmission).toHaveBeenCalledTimes(1);
    const [[diagnosticParams]] = sendDiagnostics.mock.calls as Array<[
      { uri: string; diagnostics: unknown[] }
    ]>;
    const diagnostic = (diagnosticParams.diagnostics as Diagnostic[])[0];
    const data = diagnostic.data as Record<string, unknown>;
    expect(typeof data.recordId).toBe("string");
    expect(data.changeEventId).toBe("change-event-doc");
  });

  it("applies the batch suppression budget", () => {
    const sendDiagnostics = vi.fn();
    const contexts = [
      buildContext({
        rippleImpacts: [makeImpact()]
      })
    ];
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
      contexts,
      runtimeSettings: tightBudget,
      hysteresis
    });

    expect(result).toEqual({
      emitted: 0,
      suppressedByBudget: 1,
      suppressedByHysteresis: 0,
      suppressedByAcknowledgement: 0,
      noiseFilter: ZERO_NOISE_FILTER_TOTALS,
      emittedByChange: {}
    });
    expect(sendDiagnostics).not.toHaveBeenCalled();
  });

  it("applies noise filter thresholds to ripple impacts", () => {
    const sendDiagnostics = vi.fn();
    const contexts = [
      buildContext({
        rippleImpacts: [
          makeImpact({ hint: { confidence: 0.2, targetUri: "file:///src/low.ts" } }),
          makeImpact({
            target: {
              id: "code-artifact-2",
              uri: "file:///src/high.ts",
              layer: "implementation",
              language: "typescript"
            },
            hint: {
              confidence: 0.85,
              targetUri: "file:///src/high.ts"
            }
          })
        ]
      })
    ];

    const stricter: RuntimeSettings = {
      ...RUNTIME_SETTINGS,
      noiseSuppression: {
        ...RUNTIME_SETTINGS.noiseSuppression,
        filter: {
          ...RUNTIME_SETTINGS.noiseSuppression.filter,
          minConfidence: 0.6
        }
      }
    };

    const result = publishDocDiagnostics({
      sender: { sendDiagnostics: params => { sendDiagnostics(params); } },
      contexts,
      runtimeSettings: stricter,
      hysteresis: new HysteresisController({ now: () => new Date(0) })
    });

    expect(result.emitted).toBe(1);
    expect(result.noiseFilter).toEqual({
      ...ZERO_NOISE_FILTER_TOTALS,
      byConfidence: 1
    });
    expect(result.emittedByChange).toEqual({ "change-event-doc": 1 });
    expect(sendDiagnostics).toHaveBeenCalledTimes(1);
  });

  it("short-circuits when no contexts are provided", () => {
    const sendDiagnostics = vi.fn();
    const hysteresis = new HysteresisController({ now: () => new Date(0) });

    const result = publishDocDiagnostics({
      sender: { sendDiagnostics: params => { sendDiagnostics(params); } },
      contexts: [],
      runtimeSettings: RUNTIME_SETTINGS,
      hysteresis
    });

    expect(result).toEqual({
      emitted: 0,
      suppressedByBudget: 0,
      suppressedByHysteresis: 0,
      suppressedByAcknowledgement: 0,
      noiseFilter: ZERO_NOISE_FILTER_TOTALS,
      emittedByChange: {}
    });
    expect(sendDiagnostics).not.toHaveBeenCalled();
  });

  it("suppresses reciprocal diagnostics within the hysteresis window", () => {
    let now = 0;
    const hysteresis = new HysteresisController({ now: () => new Date(now) });

    const documentContext = buildContext({ rippleImpacts: [makeImpact()] });

    const firstResult = publishDocDiagnostics({
      sender: { sendDiagnostics: () => {} },
      contexts: [documentContext],
      runtimeSettings: RUNTIME_SETTINGS,
      hysteresis
    });

    expect(firstResult).toEqual({
      emitted: 1,
      suppressedByBudget: 0,
      suppressedByHysteresis: 0,
      suppressedByAcknowledgement: 0,
      noiseFilter: ZERO_NOISE_FILTER_TOTALS,
      emittedByChange: { "change-event-doc": 1 }
    });

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

    const codeChange: DocumentTrackedArtifactChange = {
      uri: codeArtifact.uri,
      layer: "implementation",
      category: "document",
      change: {
        uri: codeArtifact.uri,
        languageId: "typescript",
        version: 2
      },
      previousArtifact: undefined,
      nextArtifact: undefined,
      hints: [],
      content: "export const value = 1;",
      contentLength: 22
    };

    const reverseImpact = makeImpact({
      target: BASE_ARTIFACT,
      hint: {
        sourceUri: codeArtifact.uri,
        targetUri: BASE_ARTIFACT.uri,
        kind: "documents",
        path: [BASE_ARTIFACT.uri]
      }
    });

    const codeContext = buildContext({
      change: codeChange,
      artifact: codeArtifact,
      changeEventId: "change-event-code",
      rippleImpacts: [reverseImpact]
    });

    now = 500;

    const secondResult = publishDocDiagnostics({
      sender: { sendDiagnostics: () => {} },
      contexts: [codeContext],
      runtimeSettings: RUNTIME_SETTINGS,
      hysteresis
    });

    expect(secondResult).toEqual({
      emitted: 0,
      suppressedByBudget: 0,
      suppressedByHysteresis: 1,
      suppressedByAcknowledgement: 0,
      noiseFilter: ZERO_NOISE_FILTER_TOTALS,
      emittedByChange: {}
    });
  });

  it("suppresses diagnostics acknowledged by the acknowledgement service", () => {
    const sendDiagnostics = vi.fn();
    const contexts = [
      buildContext({
        rippleImpacts: [makeImpact()]
      })
    ];

    const acknowledgements = createAckServiceStub({ shouldEmit: false });

    const result = publishDocDiagnostics({
      sender: { sendDiagnostics: params => { sendDiagnostics(params); } },
      contexts,
      runtimeSettings: RUNTIME_SETTINGS,
      hysteresis: new HysteresisController({ now: () => new Date(0) }),
      acknowledgements
    });

    expect(result).toEqual({
      emitted: 0,
      suppressedByBudget: 0,
      suppressedByHysteresis: 0,
      suppressedByAcknowledgement: 1,
      noiseFilter: ZERO_NOISE_FILTER_TOTALS,
      emittedByChange: {}
    });
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(acknowledgements.shouldEmitDiagnostic).toHaveBeenCalledTimes(1);
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(acknowledgements.registerEmission).not.toHaveBeenCalled();
  });
});
