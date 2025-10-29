import { afterEach, beforeAll, beforeEach, describe, expect, it, vi, type MockInstance } from "vitest";

let configValues: Record<string, unknown> = {};
const configurationGetMock = vi.fn(<T>(key: string, defaultValue?: T) => {
  if (Object.prototype.hasOwnProperty.call(configValues, key)) {
    return configValues[key] as T;
  }
  return defaultValue;
});

const workspaceGetConfigurationMock = vi.fn(() => ({
  get: configurationGetMock
}));

vi.mock("vscode", () => ({
  workspace: {
    getConfiguration: workspaceGetConfigurationMock
  }
}));

const invokeOllamaChatMock = vi.fn();

vi.mock("@copilot-improvement/shared", async () => {
  const actual = await vi.importActual<typeof import("@copilot-improvement/shared")>(
    "@copilot-improvement/shared"
  );
  return {
    ...actual,
    invokeOllamaChat: invokeOllamaChatMock
  } satisfies Partial<typeof actual>;
});

let invokeLocalOllamaBridge!: typeof import("./localOllamaBridge").invokeLocalOllamaBridge;

interface BridgeResult {
  response: string | object;
  modelId?: string;
  usage?: { promptTokens?: number; completionTokens?: number; totalTokens?: number };
}

describe("invokeLocalOllamaBridge", () => {
  const originalEnv = { ...process.env };
  let warnSpy: MockInstance<[message?: any, ...optionalParams: any[]], void>;

  beforeAll(async () => {
    ({ invokeLocalOllamaBridge } = await import("./localOllamaBridge"));
  });

  beforeEach(() => {
    invokeOllamaChatMock.mockReset();
    process.env = { ...originalEnv };
    warnSpy = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    configValues = {};
    configurationGetMock.mockClear();
    workspaceGetConfigurationMock.mockClear();
  });

  afterEach(() => {
    process.env = { ...originalEnv };
    warnSpy.mockRestore();
  });

  it("returns a mock response when no model is configured", async () => {
    delete process.env.LINK_AWARE_OLLAMA_MODEL;
    delete process.env.OLLAMA_MODEL;

    const result = (await invokeLocalOllamaBridge({ prompt: "hello" })) as BridgeResult;
    expect(typeof result.response).toBe("string");
    const parsed = JSON.parse(result.response as string);
    expect(parsed).toHaveProperty("relationships");
    expect(Array.isArray(parsed.relationships)).toBe(true);
    expect(result.modelId).toBe("ollama-mock");
    expect(result.usage?.promptTokens).toBe(5);
    expect(invokeOllamaChatMock).not.toHaveBeenCalled();
    expect(warnSpy).toHaveBeenCalledWith("[ollama-bridge] No model configured; emitting mock response.");
  });

  it("delegates to Ollama when a model is available", async () => {
    process.env.LINK_AWARE_OLLAMA_MODEL = "llama3";
    invokeOllamaChatMock.mockResolvedValue({
      text: JSON.stringify({ relationships: [] }),
      modelId: "llama3",
      usage: { promptTokens: 10, totalTokens: 12 }
    });

    const result = (await invokeLocalOllamaBridge({ prompt: "full" })) as BridgeResult;
    expect(result.response).toBe(JSON.stringify({ relationships: [] }));
    expect(result.modelId).toBe("llama3");
    expect(result.usage?.totalTokens).toBe(12);
    expect(invokeOllamaChatMock).toHaveBeenCalledTimes(1);
    expect(invokeOllamaChatMock).toHaveBeenCalledWith(
      expect.objectContaining({ contextWindow: 32_768 })
    );
  });

  it("falls back to mock when Ollama invocation fails", async () => {
    process.env.LINK_AWARE_OLLAMA_MODEL = "llama3";
    const { OllamaInvocationError } = await import("@copilot-improvement/shared");
    invokeOllamaChatMock.mockRejectedValue(
      new OllamaInvocationError("Ollama /api/chat returned 404: {\"error\":\"model 'llama3' not found\"}")
    );

    const result = (await invokeLocalOllamaBridge({ prompt: "boom" })) as BridgeResult;
    expect(typeof result.response).toBe("string");
    const parsed = JSON.parse(result.response as string);
    expect(parsed.relationships).toEqual([]);
    expect(result.modelId).toBe("llama3");
    expect(invokeOllamaChatMock).toHaveBeenCalledTimes(1);
    expect(warnSpy).toHaveBeenCalledWith(
      "[ollama-bridge] Model 'llama3' was not found. Run \"ollama pull llama3\" or update LINK_AWARE_OLLAMA_MODEL before rerunning tests."
    );
    expect(warnSpy).toHaveBeenCalledWith("[ollama-bridge] Falling back to deterministic mock response.");
  });

  it("honours explicit context window overrides", async () => {
    process.env.LINK_AWARE_OLLAMA_MODEL = "llama3";
    process.env.LINK_AWARE_OLLAMA_CONTEXT = "64000";
    invokeOllamaChatMock.mockResolvedValue({
      text: "{}",
      modelId: "llama3",
      usage: undefined
    });

    await invokeLocalOllamaBridge({ prompt: "ctx" });

    expect(invokeOllamaChatMock).toHaveBeenCalledWith(
      expect.objectContaining({ contextWindow: 64_000 })
    );
  });

  it("uses workspace configuration when environment variables are unset", async () => {
    delete process.env.LINK_AWARE_OLLAMA_MODEL;
    delete process.env.OLLAMA_MODEL;
    configValues.ollamaModel = "qwen3-coder:14b";
    invokeOllamaChatMock.mockResolvedValue({
      text: "{}",
      modelId: "qwen3-coder:14b",
      usage: undefined
    });

    await invokeLocalOllamaBridge({ prompt: "config" });

    expect(invokeOllamaChatMock).toHaveBeenCalledWith(
      expect.objectContaining({ model: "qwen3-coder:14b" })
    );
    expect(warnSpy).not.toHaveBeenCalledWith(
      "[ollama-bridge] No model configured; emitting mock response."
    );
  });
});
