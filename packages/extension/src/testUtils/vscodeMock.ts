import { vi } from "vitest";
import type * as vscode from "vscode";

export interface SharedVscodeMock {
  module: typeof import("vscode");
  commands: {
    registerCommand: ReturnType<typeof vi.fn>;
    executeCommand: ReturnType<typeof vi.fn>;
  };
  window: typeof vscode.window & {
    showQuickPick: ReturnType<typeof vi.fn>;
    showInformationMessage: ReturnType<typeof vi.fn>;
    showErrorMessage: ReturnType<typeof vi.fn>;
    showSaveDialog: ReturnType<typeof vi.fn>;
    showTextDocument: ReturnType<typeof vi.fn>;
    withProgress: ReturnType<typeof vi.fn>;
  };
  workspace: typeof vscode.workspace & {
    openTextDocument: ReturnType<typeof vi.fn>;
    asRelativePath: ReturnType<typeof vi.fn>;
    workspaceFolders: vscode.WorkspaceFolder[] | undefined;
    textDocuments: vscode.TextDocument[];
  };
  Uri: typeof vscode.Uri & {
    parse: ReturnType<typeof vi.fn>;
    file: ReturnType<typeof vi.fn>;
    joinPath: ReturnType<typeof vi.fn>;
  };
  ProgressLocation: typeof vscode.ProgressLocation;
  CancellationError: typeof vscode.CancellationError;
}

export function createVscodeMock(): SharedVscodeMock {
  const commands = {
    registerCommand: vi.fn(),
    executeCommand: vi.fn()
  };

  const windowState: { activeTextEditor?: vscode.TextEditor } = {};

  const window = {
    showQuickPick: vi.fn(),
    showInformationMessage: vi.fn(),
    showErrorMessage: vi.fn(),
    showSaveDialog: vi.fn(),
    showTextDocument: vi.fn(),
    withProgress: vi.fn(),
    get activeTextEditor() {
      return windowState.activeTextEditor;
    },
    set activeTextEditor(editor: vscode.TextEditor | undefined) {
      windowState.activeTextEditor = editor;
    }
  } as unknown as SharedVscodeMock["window"];

  const workspace = {
    openTextDocument: vi.fn(),
    asRelativePath: vi.fn((uri: string | vscode.Uri) =>
      typeof uri === "string" ? uri : uri.toString()
    ),
    workspaceFolders: undefined,
    textDocuments: [] as vscode.TextDocument[]
  } as unknown as SharedVscodeMock["workspace"];

  const uriFactory = (value: string) => ({
    toString: () => value,
    fsPath: value.replace(/^file:\/\//u, ""),
    scheme: value.split(":")[0] ?? "",
    path: value
  });

  const Uri = {
    parse: vi.fn((value: string) => uriFactory(value)),
    file: vi.fn((value: string) => uriFactory(`file://${value}`)),
    joinPath: vi.fn((base: { fsPath: string }, ...segments: string[]) =>
      uriFactory(`${base.fsPath}/${segments.join("/")}`)
    )
  } as unknown as SharedVscodeMock["Uri"];

  const ProgressLocation = {
    SourceControl: 0,
    Window: 1,
    Notification: 2
  } as unknown as typeof vscode.ProgressLocation;
  const CancellationError = class extends Error {} as unknown as typeof vscode.CancellationError;

  const module = {
    commands,
    window,
    workspace,
    Uri,
    ProgressLocation,
    CancellationError
  } as unknown as typeof import("vscode");

  return {
    module,
    commands,
    window,
    workspace,
    Uri,
    ProgressLocation,
    CancellationError
  };
}

const globalAny = globalThis as { __sharedVscodeMock?: SharedVscodeMock };

export function getSharedVscodeMock(): SharedVscodeMock {
  if (!globalAny.__sharedVscodeMock) {
    globalAny.__sharedVscodeMock = createVscodeMock();
  }

  return globalAny.__sharedVscodeMock;
}

export function resetSharedVscodeMock(): SharedVscodeMock {
  globalAny.__sharedVscodeMock = createVscodeMock();
  return globalAny.__sharedVscodeMock;
}
