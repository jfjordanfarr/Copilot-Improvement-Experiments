import * as vscode from "vscode";

export interface LinkDiagnosticsSettings {
  llmProviderMode: "prompt" | "local-only" | "disabled";
  noiseSuppression: {
    level: "low" | "medium" | "high";
  };
  storagePath?: string;
  enableDiagnostics: boolean;
  debounceMs: number;
}

export class ConfigService implements vscode.Disposable {
  private readonly emitter = new vscode.EventEmitter<LinkDiagnosticsSettings>();
  private readonly subscription: vscode.Disposable;
  private current: LinkDiagnosticsSettings;

  constructor(private readonly section = "linkAwareDiagnostics") {
    this.current = this.readSettings();
  this.subscription = vscode.workspace.onDidChangeConfiguration((event: vscode.ConfigurationChangeEvent) => {
      if (!event.affectsConfiguration(this.section)) {
        return;
      }

      this.current = this.readSettings();
      this.emitter.fire(this.current);
    });
  }

  get settings(): LinkDiagnosticsSettings {
    return this.current;
  }

  onDidChange(listener: (settings: LinkDiagnosticsSettings) => void): vscode.Disposable {
    return this.emitter.event(listener);
  }

  refresh(): void {
    this.current = this.readSettings();
    this.emitter.fire(this.current);
  }

  dispose(): void {
    this.subscription.dispose();
    this.emitter.dispose();
  }

  private readSettings(): LinkDiagnosticsSettings {
    const config = vscode.workspace.getConfiguration(this.section);
    return {
      llmProviderMode: config.get("llmProviderMode", "prompt"),
      noiseSuppression: {
        level: config.get("noiseSuppression.level", "medium")
      },
      storagePath: config.get("storagePath", "") || undefined,
      enableDiagnostics: config.get("enableDiagnostics", false),
      debounceMs: config.get("debounce.ms", 1000)
    };
  }
}
