import { describe, it, expect, vi, beforeEach } from "vitest";
import type * as vscode from "vscode";

import type { ListOutstandingDiagnosticsResult } from "@copilot-improvement/shared";
import { getSharedVscodeMock } from "../testUtils/vscodeMock";

const vscodeMock = getSharedVscodeMock();
const mockCommands = vscodeMock.commands;
const mockWindow = vscodeMock.window;
const mockWorkspace = vscodeMock.workspace;
const mockUri = vscodeMock.Uri;

vi.mock("vscode", () => vscodeMock.module);

vi.mock("node:fs/promises", () => ({
  default: {
    writeFile: vi.fn()
  },
  writeFile: vi.fn()
}));

describe("exportDiagnostics", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("registers the export command", async () => {
    const { registerExportDiagnosticsCommand } = await import("./exportDiagnostics");
    const mockClient = {
      sendRequest: vi.fn()
    } as unknown;

    registerExportDiagnosticsCommand(mockClient as never);

    expect(mockCommands.registerCommand).toHaveBeenCalledWith(
      "linkDiagnostics.exportDiagnostics",
      expect.any(Function)
    );
  });

  it("exports diagnostics in CSV format", async () => {
    const mockResult: ListOutstandingDiagnosticsResult = {
      generatedAt: "2025-10-22T10:00:00.000Z",
      diagnostics: [
        {
          recordId: "record-1",
          message: "Test diagnostic",
          severity: "warning",
          changeEventId: "change-1",
          createdAt: "2025-10-22T09:00:00.000Z",
          linkIds: ["link-1"],
          target: { id: "target-1", uri: "file:///path/to/target.ts" },
          trigger: { id: "trigger-1", uri: "file:///path/to/trigger.ts" }
        }
      ]
    };

    mockWindow.showQuickPick.mockResolvedValue({ label: "CSV", key: "csv" });
    mockWindow.showSaveDialog.mockResolvedValue({ fsPath: "/export/diagnostics.csv" });

    const mockClient = {
      sendRequest: vi.fn().mockResolvedValue(mockResult)
    };

    const { registerExportDiagnosticsCommand } = await import("./exportDiagnostics");
    registerExportDiagnosticsCommand(mockClient as never);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const handler = mockCommands.registerCommand.mock.calls[0][1] as () => Promise<void>;
    await handler();

    expect(mockClient.sendRequest).toHaveBeenCalledWith("linkDiagnostics/diagnostics/list");
    expect(mockWindow.showSaveDialog).toHaveBeenCalled();
  });

  it("shows message when no diagnostics exist", async () => {
    const mockResult: ListOutstandingDiagnosticsResult = {
      generatedAt: "2025-10-22T10:00:00.000Z",
      diagnostics: []
    };

    mockWindow.showQuickPick.mockResolvedValue({ label: "JSON", key: "json" });

    const mockClient = {
      sendRequest: vi.fn().mockResolvedValue(mockResult)
    };

    const { registerExportDiagnosticsCommand } = await import("./exportDiagnostics");
    registerExportDiagnosticsCommand(mockClient as never);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const handler = mockCommands.registerCommand.mock.calls[0][1] as () => Promise<void>;
    await handler();

    expect(mockWindow.showInformationMessage).toHaveBeenCalledWith(
      "No outstanding diagnostics to export."
    );
  });

  it("handles cancellation gracefully", async () => {
    mockWindow.showQuickPick.mockResolvedValue(undefined);

    const mockClient = {
      sendRequest: vi.fn()
    };

    const { registerExportDiagnosticsCommand } = await import("./exportDiagnostics");
    registerExportDiagnosticsCommand(mockClient as never);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const handler = mockCommands.registerCommand.mock.calls[0][1] as () => Promise<void>;
    await handler();

    expect(mockClient.sendRequest).not.toHaveBeenCalled();
  });
});
