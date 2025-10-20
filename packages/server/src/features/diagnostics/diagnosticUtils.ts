import path from "node:path";
import { fileURLToPath } from "node:url";
import { Diagnostic } from "vscode-languageserver/node";

export interface DiagnosticSender {
  sendDiagnostics(params: { uri: string; diagnostics: Diagnostic[] }): void;
}

export function normaliseDisplayPath(uri: string): string {
  if (!uri.startsWith("file://")) {
    return uri;
  }

  try {
    return path.normalize(fileURLToPath(uri));
  } catch {
    return uri;
  }
}
