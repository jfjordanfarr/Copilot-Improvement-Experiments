// Live Documentation: .mdmd/layer-4/server-diagnostics/diagnosticPublisher.mdmd.md#source-breadcrumbs
import { DocumentDiagnosticReportKind } from "vscode-languageserver/node";
import type {
  Connection,
  Diagnostic,
  DocumentDiagnosticReport,
  PublishDiagnosticsParams
} from "vscode-languageserver/node";

import type { DiagnosticSender } from "./diagnosticUtils";

interface ActiveDiagnosticEntry {
  diagnostics: Diagnostic[];
  resultId: string;
}

export class DiagnosticPublisher implements DiagnosticSender {
  private sequence = 0;
  private readonly entries = new Map<string, ActiveDiagnosticEntry>();

  constructor(private readonly connection: Connection) {}

  sendDiagnostics(params: { uri: string; diagnostics: Diagnostic[] }): void {
    const payload: PublishDiagnosticsParams = {
      uri: params.uri,
      diagnostics: params.diagnostics
    };

    void this.connection.sendDiagnostics(payload);

    const entry: ActiveDiagnosticEntry = {
      diagnostics: params.diagnostics,
      resultId: this.nextResultId()
    };
    this.entries.set(params.uri, entry);
  }

  clear(): void {
    this.entries.clear();
  }

  removeByRecordId(uri: string | undefined, recordId: string): void {
    if (!uri) {
      return;
    }

    const entry = this.entries.get(uri);
    if (!entry) {
      return;
    }

    const remaining = entry.diagnostics.filter(diagnostic => {
      const enriched = diagnostic as Diagnostic & { data?: unknown };
      if (!enriched.data || typeof enriched.data !== "object") {
        return true;
      }

      const candidate = (enriched.data as Record<string, unknown>).recordId;
      return typeof candidate !== "string" || candidate !== recordId;
    });

    if (remaining.length === entry.diagnostics.length) {
      return;
    }

    this.entries.set(uri, {
      diagnostics: remaining,
      resultId: this.nextResultId()
    });
  }

  buildDocumentReport(uri: string, previousResultId: string | undefined): DocumentDiagnosticReport {
    const entry = this.entries.get(uri);
    if (!entry) {
      return {
        kind: DocumentDiagnosticReportKind.Full,
        items: []
      } satisfies DocumentDiagnosticReport;
    }

    if (previousResultId && entry.resultId === previousResultId) {
      return {
        kind: DocumentDiagnosticReportKind.Unchanged,
        resultId: entry.resultId
      } satisfies DocumentDiagnosticReport;
    }

    return {
      kind: DocumentDiagnosticReportKind.Full,
      resultId: entry.resultId,
      items: entry.diagnostics
    } satisfies DocumentDiagnosticReport;
  }

  private nextResultId(): string {
    const value = `${Date.now()}:${this.sequence}`;
    this.sequence = (this.sequence + 1) % Number.MAX_SAFE_INTEGER;
    return value;
  }
}
