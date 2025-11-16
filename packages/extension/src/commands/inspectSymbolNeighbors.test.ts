import { beforeEach, describe, expect, it, vi } from "vitest";
import type * as vscode from "vscode";

import type { InspectSymbolNeighborsParams } from "@copilot-improvement/shared";
import { getSharedVscodeMock } from "../testUtils/vscodeMock";
import type { ParsedInspectSymbolNeighborsResult } from "./inspectSymbolNeighbors";

const vscodeMock = getSharedVscodeMock();
const mockCommands = vscodeMock.commands;
const mockWindow = vscodeMock.window;
const mockWorkspace = vscodeMock.workspace;
const mockUri = vscodeMock.Uri;

const showQuickPickMock = mockWindow.showQuickPick as ReturnType<typeof vi.fn>;
const showInformationMessageMock = mockWindow.showInformationMessage as ReturnType<typeof vi.fn>;
const showErrorMessageMock = mockWindow.showErrorMessage as ReturnType<typeof vi.fn>;
const showTextDocumentMock = mockWindow.showTextDocument as ReturnType<typeof vi.fn>;

vi.mock("vscode", () => vscodeMock.module);

describe("inspectSymbolNeighbors command", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    showQuickPickMock.mockResolvedValue(undefined);
    showInformationMessageMock.mockResolvedValue(undefined);
    showErrorMessageMock.mockResolvedValue(undefined);
    showTextDocumentMock.mockResolvedValue(undefined);
    mockWindow.activeTextEditor = {
      document: { uri: mockUri.parse("file:///workspace/src/origin.ts") as vscode.Uri }
    } as unknown as vscode.TextEditor;
  });

  it("registers the inspect symbol neighbors command", async () => {
    const { registerInspectSymbolNeighborsCommand } = await import("./inspectSymbolNeighbors");
    const mockClient = {
      sendRequest: vi.fn()
    } as unknown;

    registerInspectSymbolNeighborsCommand(mockClient as never);

    expect(mockCommands.registerCommand).toHaveBeenCalledWith(
      "linkDiagnostics.inspectSymbolNeighbors",
      expect.any(Function)
    );
  }, 15000);

  it("shows an informational message when no editor is active", async () => {
  mockWindow.activeTextEditor = undefined;

    const { registerInspectSymbolNeighborsCommand } = await import("./inspectSymbolNeighbors");
    const mockClient = {
      sendRequest: vi.fn()
    };

    registerInspectSymbolNeighborsCommand(mockClient as never);

    const handler = mockCommands.registerCommand.mock.calls[0][1] as () => Promise<void>;
    await handler();

    expect(mockWindow.showInformationMessage).toHaveBeenCalledWith(
      "Open a document or provide an artifact identifier to inspect symbol neighbors."
    );
    expect(mockClient.sendRequest).not.toHaveBeenCalled();
  });

  it("parses neighbor results and opens the selected artifact", async () => {
    const { registerInspectSymbolNeighborsCommand } = await import("./inspectSymbolNeighbors");
    const mockResult = {
      origin: {
        id: "artifact-origin",
        uri: "file:///workspace/src/origin.ts",
        layer: "code"
      },
      groups: [
        {
          kind: "depends_on",
          neighbors: [
            {
              artifact: {
                id: "artifact-peer",
                uri: "file:///workspace/src/peer.ts",
                layer: "code"
              },
              depth: 1,
              direction: "outgoing",
              viaLinkId: "link-1",
              viaKind: "depends_on",
              confidence: 0.9,
              path: {
                artifacts: [
                  {
                    id: "artifact-origin",
                    uri: "file:///workspace/src/origin.ts",
                    layer: "code"
                  },
                  {
                    id: "artifact-peer",
                    uri: "file:///workspace/src/peer.ts",
                    layer: "code"
                  }
                ]
              }
            }
          ]
        }
      ],
      summary: {
        totalNeighbors: 1,
        maxDepthReached: 1
      }
    } satisfies ParsedInspectSymbolNeighborsResult;

  showQuickPickMock.mockResolvedValue(undefined);

    const mockClient = {
      sendRequest: vi.fn().mockResolvedValue(mockResult)
    };

    registerInspectSymbolNeighborsCommand(mockClient as never);
    const handler = mockCommands.registerCommand.mock.calls[0][1] as () => Promise<void>;

  showQuickPickMock.mockResolvedValueOnce({
      target: mockUri.parse("file:///workspace/src/peer.ts"),
      neighbor: mockResult.groups[0].neighbors[0],
      groupKind: "depends_on",
      label: "src/peer.ts"
    });

    await handler();

    expect(mockClient.sendRequest).toHaveBeenCalledWith(
      "linkDiagnostics/symbols/inspectNeighbors",
      expect.objectContaining<InspectSymbolNeighborsParams>({ uri: "file:///workspace/src/origin.ts" })
    );
  expect(showQuickPickMock).toHaveBeenCalled();
  expect(mockWorkspace.openTextDocument).toHaveBeenCalledWith(
      expect.objectContaining({ toString: expect.any(Function) })
    );
  expect(showTextDocumentMock).toHaveBeenCalled();
  });

  it("reports validation errors from the language server", async () => {
    const { registerInspectSymbolNeighborsCommand } = await import("./inspectSymbolNeighbors");
    const mockClient = {
      sendRequest: vi.fn().mockResolvedValue({})
    };

    registerInspectSymbolNeighborsCommand(mockClient as never);
    const handler = mockCommands.registerCommand.mock.calls[0][1] as () => Promise<void>;

    await handler();

  expect(showErrorMessageMock).toHaveBeenCalledWith(
      expect.stringContaining("Unable to inspect symbol neighbors")
    );
  });
});

