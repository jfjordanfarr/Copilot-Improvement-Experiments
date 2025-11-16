import { beforeEach, describe, expect, it, vi } from "vitest";
import type { LanguageClient } from "vscode-languageclient/node";

import { getSharedVscodeMock } from "../testUtils/vscodeMock";
import type { InvokeChatResult, LlmInvoker } from "../services/llmInvoker";
import type { LinkDiagnosticsSettings } from "../settings/configService";

const vscodeMock = getSharedVscodeMock();
const mockCommands = vscodeMock.commands;
const mockWindow = vscodeMock.window;
const mockWorkspace = vscodeMock.workspace;
const mockUri = vscodeMock.Uri;
const mockProgressLocation = vscodeMock.ProgressLocation;

vi.mock("vscode", () => vscodeMock.module);

describe("registerAnalyzeWithAICommand", () => {
  const defaultSettings: LinkDiagnosticsSettings = {
    llmProviderMode: "local-only",
    enableDiagnostics: true,
    debounceMs: 500,
    storagePath: undefined,
    noiseSuppression: {
      level: "medium"
    }
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockWorkspace.openTextDocument.mockResolvedValue({
      getText: () => "content"
    });
  mockWindow.withProgress.mockImplementation(async (_options, task) => task({}, { isCancellationRequested: false } as unknown));
  });

  it("registers the command", async () => {
    const { registerAnalyzeWithAICommand } = await import("./analyzeWithAI");
    const client = { sendRequest: vi.fn() } as unknown as LanguageClient;
    const llmInvoker = { invoke: vi.fn() } as unknown as LlmInvoker;

    registerAnalyzeWithAICommand({
      client,
      llmInvoker,
      getSettings: () => defaultSettings
    });

    expect(mockCommands.registerCommand).toHaveBeenCalledWith(
      "linkDiagnostics.analyzeWithAI",
      expect.any(Function)
    );
  }, 15000);

  it("shows information when provider is disabled", async () => {
    const { registerAnalyzeWithAICommand } = await import("./analyzeWithAI");
    const client = { sendRequest: vi.fn() } as unknown as LanguageClient;
    const llmInvoker = { invoke: vi.fn() } as unknown as LlmInvoker;

    registerAnalyzeWithAICommand({
      client,
      llmInvoker,
      getSettings: () => ({ ...defaultSettings, llmProviderMode: "disabled" })
    });

    const handler = mockCommands.registerCommand.mock.calls[0][1] as () => Promise<void>;
    await handler();

    expect(mockWindow.showInformationMessage).toHaveBeenCalledWith(
      "AI analysis is disabled. Update the Link-Aware Diagnostics settings to enable a provider."
    );
    expect(client.sendRequest).not.toHaveBeenCalled();
  });

  it("handles successful analysis flow", async () => {
    const { registerAnalyzeWithAICommand } = await import("./analyzeWithAI");

    const diagnosticsResponse = {
      generatedAt: "2025-01-01T00:00:00.000Z",
      diagnostics: [
        {
          recordId: "diag-1",
          message: "Review required",
          severity: "warning",
          changeEventId: "change-1",
          createdAt: "2025-01-01T00:00:00.000Z",
          acknowledgedAt: undefined,
          acknowledgedBy: undefined,
          linkIds: [],
          target: { id: "artifact-1", uri: "file:///target.md" },
          trigger: { id: "artifact-2", uri: "file:///trigger.md" }
        }
      ]
    };

    const client = {
      sendRequest: vi.fn()
        .mockResolvedValueOnce(diagnosticsResponse)
        .mockResolvedValueOnce({ diagnosticId: "diag-1", updatedAt: "2025-01-01T00:01:00.000Z" })
    } as unknown as LanguageClient;

    const invocationResult: InvokeChatResult = {
      text: '{"summary":"Test","confidence":0.9,"recommendedActions":["Act"]}',
      model: {
        id: "model-1",
        name: "Test",
        vendor: "local",
        family: "family",
        version: "1",
        maxInputTokens: 1024,
        sendRequest: vi.fn(),
        countTokens: vi.fn()
      }
    };

    const llmInvoker = {
      invoke: vi.fn().mockResolvedValue(invocationResult)
    } as unknown as LlmInvoker;

    mockWindow.showQuickPick.mockResolvedValue({
      label: "warning",
      diagnostic: diagnosticsResponse.diagnostics[0]
    });

    mockWindow.withProgress.mockImplementation(async (_options, task) => task({}, { isCancellationRequested: false } as unknown));

    const refreshDiagnosticsTree = vi.fn().mockResolvedValue(undefined);

    registerAnalyzeWithAICommand({
      client,
      llmInvoker,
      getSettings: () => defaultSettings,
      refreshDiagnosticsTree
    });

    const handler = mockCommands.registerCommand.mock.calls[0][1] as () => Promise<void>;
    await handler();

    expect(llmInvoker.invoke).toHaveBeenCalled();
    expect(client.sendRequest).toHaveBeenCalledTimes(2);
    expect(refreshDiagnosticsTree).toHaveBeenCalled();
    expect(mockWindow.showInformationMessage).toHaveBeenCalledWith(
      expect.stringContaining("Saved AI assessment")
    );
  });
});
