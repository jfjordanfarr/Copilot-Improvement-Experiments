import * as vscode from "vscode";

import type { LinkDiagnosticsSettings } from "../settings/configService";

export type LlmProviderMode = LinkDiagnosticsSettings["llmProviderMode"];

export type LlmInvocationFailureReason = "disabled" | "no-model" | "cancelled" | "failed";

export class LlmInvocationError extends Error {
  constructor(message: string, public readonly reason: LlmInvocationFailureReason, public readonly cause?: unknown) {
    super(message);
    this.name = "LlmInvocationError";
  }
}

export interface InvokeChatOptions {
  prompt: string;
  tags?: Record<string, string>;
  justification?: string;
  interactive?: boolean;
  modelOptions?: Record<string, unknown>;
  token?: vscode.CancellationToken;
}

export interface InvokeChatResult {
  text: string;
  model: vscode.LanguageModelChat;
}

export class LlmInvoker {
  private lastModelId: string | undefined;

  constructor(private readonly getSettings: () => LinkDiagnosticsSettings) {}

  async invoke(options: InvokeChatOptions): Promise<InvokeChatResult> {
    const mode = this.getSettings().llmProviderMode ?? "prompt";
    if (mode === "disabled") {
      throw new LlmInvocationError("LLM provider is disabled for this workspace", "disabled");
    }

    const allModels = await vscode.lm.selectChatModels();
    const eligible = this.filterModels(allModels, mode);
    if (eligible.length === 0) {
      throw new LlmInvocationError("No eligible language models are available", "no-model");
    }

    const model = await this.chooseModel(eligible, mode, options.interactive ?? false);

    const requestOptions: vscode.LanguageModelChatRequestOptions = {
      justification: options.justification ?? "Link-Aware Diagnostics request",
      modelOptions: options.modelOptions ?? (options.tags ? { tags: options.tags } : undefined)
    };

    const response = await model.sendRequest(
      [vscode.LanguageModelChatMessage.User(options.prompt)],
      requestOptions,
      options.token
    );

    let text = "";
    for await (const chunk of response.text) {
      text += chunk;
    }

    return { text, model };
  }

  private async chooseModel(
    models: vscode.LanguageModelChat[],
    mode: LlmProviderMode,
    interactive: boolean
  ): Promise<vscode.LanguageModelChat> {
    const cached = this.lastModelId ? models.find(model => model.id === this.lastModelId) : undefined;
    if (cached) {
      return cached;
    }

    if (!interactive || mode !== "prompt") {
      const chosen = models[0];
      this.lastModelId = chosen.id;
      return chosen;
    }

    const pickItems = models.map(model => ({
      label: model.name || model.id,
      description: `${model.vendor} · ${model.family}`,
      detail: `id: ${model.id}`,
      model
    }));

    const selection = await vscode.window.showQuickPick(pickItems, {
      placeHolder: "Select the language model to use",
      ignoreFocusOut: true
    });

    if (!selection) {
      throw new LlmInvocationError("Model selection cancelled", "cancelled");
    }

    this.lastModelId = selection.model.id;
    return selection.model;
  }

  private filterModels(models: vscode.LanguageModelChat[], mode: LlmProviderMode): vscode.LanguageModelChat[] {
    if (mode !== "local-only") {
      return models;
    }

    const localModels = models.filter(model => this.isLikelyLocal(model));
    return localModels.length > 0 ? localModels : [];
  }

  private isLikelyLocal(model: vscode.LanguageModelChat): boolean {
    const vendor = model.vendor.toLowerCase();
    const family = model.family.toLowerCase();
    const id = model.id.toLowerCase();
    return vendor.includes("ollama") || vendor.includes("local") || family.includes("llama") || id.includes("ollama");
  }
}
