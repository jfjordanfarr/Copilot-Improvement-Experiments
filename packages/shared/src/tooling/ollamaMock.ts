import type { OllamaChatUsage } from "./ollamaClient";

const DEFAULT_MODEL_ID = "ollama-mock";
const MAX_ECHO_LENGTH = 256;

export interface MockOllamaResponse {
  responseText: string;
  modelId: string;
  usage: OllamaChatUsage;
}

export interface CreateMockOllamaResponseOptions {
  modelId?: string;
  rationale?: string;
}

export function createMockOllamaResponse(
  prompt: string,
  options: CreateMockOllamaResponseOptions = {}
): MockOllamaResponse {
  const normalizedPrompt = typeof prompt === "string" ? prompt : "";
  const modelId = options.modelId?.trim() || DEFAULT_MODEL_ID;
  const rationale = options.rationale ?? "Mock response generated because no Ollama model was configured.";

  const response = {
    relationships: [],
    rationale,
    echo: normalizedPrompt.slice(0, MAX_ECHO_LENGTH)
  };

  const promptTokens = normalizedPrompt.length;
  const usage: OllamaChatUsage = {
    promptTokens,
    completionTokens: 0,
    totalTokens: promptTokens
  };

  return {
    responseText: JSON.stringify(response),
    modelId,
    usage
  };
}

export { DEFAULT_MODEL_ID as MOCK_OLLAMA_MODEL_ID };
