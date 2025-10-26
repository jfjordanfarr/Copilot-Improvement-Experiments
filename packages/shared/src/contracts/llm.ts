import type { ModelUsage } from "../inference/llm/relationshipExtractor";

export const INVOKE_LLM_REQUEST = "linkDiagnostics/llm/invoke";

export interface InvokeLlmRequest {
  prompt: string;
  schema?: unknown;
  tags?: Record<string, string>;
}

export interface InvokeLlmResult {
  response: string | object;
  modelId?: string;
  usage?: ModelUsage;
}
