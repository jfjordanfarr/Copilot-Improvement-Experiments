import * as vscode from "vscode";
import { LanguageClient } from "vscode-languageclient/node";

const FILE_DELETED_NOTIFICATION = "linkDiagnostics/files/deleted";
const FILE_RENAMED_NOTIFICATION = "linkDiagnostics/files/renamed";

export function registerFileMaintenanceWatcher(client: LanguageClient): vscode.Disposable {
  const watcher = vscode.workspace.createFileSystemWatcher("**/*", true, true, false);

  const deleteDisposable = watcher.onDidDelete((uri: vscode.Uri) => {
    void client.sendNotification(FILE_DELETED_NOTIFICATION, { uri: uri.toString(true) });
  });

  const deleteEventDisposable = vscode.workspace.onDidDeleteFiles((event: vscode.FileDeleteEvent) => {
    for (const file of event.files) {
      void client.sendNotification(FILE_DELETED_NOTIFICATION, { uri: file.toString(true) });
    }
  });

  const renameDisposable = vscode.workspace.onDidRenameFiles((event: vscode.FileRenameEvent) => {
    for (const file of event.files) {
      void client.sendNotification(FILE_RENAMED_NOTIFICATION, {
        oldUri: file.oldUri.toString(true),
        newUri: file.newUri.toString(true)
      });
    }
  });

  return vscode.Disposable.from(watcher, deleteDisposable, deleteEventDisposable, renameDisposable);
}
