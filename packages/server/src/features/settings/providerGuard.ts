import { Connection } from "vscode-languageserver";

export interface ExtensionSettings {
  storagePath?: string;
  enableDiagnostics?: boolean;
  llmProviderMode?: "prompt" | "local-only" | "disabled";
  debounceMs?: number;
  noiseSuppression?: {
    level?: "low" | "medium" | "high";
  };
}

export class ProviderGuard {
  private settings: ExtensionSettings = {};

  constructor(private readonly connection: Connection) {}

  apply(settings: ExtensionSettings | undefined): void {
    this.settings = { ...settings };

    if (!this.settings.enableDiagnostics) {
      this.connection.console.info(
        "Diagnostics remain disabled until provider consent is recorded on the client."
      );
    }
  }

  getSettings(): ExtensionSettings {
    return this.settings;
  }

  areDiagnosticsEnabled(): boolean {
    return Boolean(this.settings.enableDiagnostics);
  }
}
