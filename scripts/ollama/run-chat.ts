#!/usr/bin/env node
/*
 * Workspace-local bridge for issuing Ollama chat requests.
 * Reads a JSON payload from stdin, calls the configured Ollama endpoint, and prints an InvokeLlmResult JSON object.
 */

import {
  invokeOllamaChat,
  OllamaInvocationError,
  type OllamaChatUsage
} from "../../packages/shared/src/tooling/ollamaClient";
import { resolveOllamaEndpoint } from "../../packages/shared/src/tooling/ollamaEndpoint";
import { createMockOllamaResponse } from "../../packages/shared/src/tooling/ollamaMock";

interface CliInput {
  prompt: string;
  model?: string;
}

interface CliArgs {
  endpoint?: string;
  model?: string;
  timeout?: string;
  context?: string;
}

interface CliResult {
  response: string;
  modelId?: string;
  usage?: OllamaChatUsage;
}

function parseArgs(argv: string[]): CliArgs {
  const args: CliArgs = {};
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (!token.startsWith("--")) {
      continue;
    }
    const key = token.slice(2);
    const next = argv[index + 1];
    if (!next || next.startsWith("--")) {
      (args as Record<string, string | undefined>)[key] = undefined;
      continue;
    }
    (args as Record<string, string | undefined>)[key] = next;
    index += 1;
  }
  return args;
}

async function readStdin(): Promise<string> {
  const chunks: Buffer[] = [];
  return new Promise((resolve, reject) => {
    process.stdin.on("data", chunk => chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk));
    process.stdin.on("error", reject);
    process.stdin.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
  });
}

async function main(): Promise<void> {
  try {
    const args = parseArgs(process.argv.slice(2));
    const rawInput = await readStdin();
    const payload: CliInput = rawInput.trim().length > 0 ? JSON.parse(rawInput) : { prompt: "" };
    const prompt = typeof payload.prompt === "string" ? payload.prompt : "";
    const model = payload.model
      ?? args.model
      ?? process.env.LINK_AWARE_OLLAMA_MODEL
      ?? process.env.OLLAMA_MODEL;
  const endpoint = args.endpoint ?? resolveOllamaEndpoint({ env: process.env });
  const contextWindow = resolveContextWindow(args.context);

    if (!prompt) {
      throw new Error("Input prompt was empty; supply prompt text via stdin JSON.");
    }

    if (!model) {
      process.stderr.write(
        "[ollama-bridge] No model supplied; returning mock response. Configure --model or LINK_AWARE_OLLAMA_MODEL.\n"
      );
      const mock = createMockOllamaResponse(prompt);
      emitResult({
        response: mock.responseText,
        modelId: mock.modelId,
        usage: mock.usage
      });
      return;
    }

    const timeoutMs = parseInt(args.timeout ?? "60000", 10) || 60000;

    try {
  const result = await invokeOllamaChat({ endpoint, model, prompt, timeoutMs, contextWindow });
      emitResult({ response: result.text, modelId: result.modelId, usage: result.usage });
    } catch (error) {
      const detail = error instanceof OllamaInvocationError ? error.message : String(error);
      if (isMissingModelError(detail, model)) {
        process.stderr.write(
          `[ollama-bridge] Model '${model}' not found. Run "ollama pull ${model}" or provide a different model via --model / LINK_AWARE_OLLAMA_MODEL.\n`
        );
      } else {
        process.stderr.write(`[ollama-bridge] Request failed: ${detail}\n`);
      }
      const mock = createMockOllamaResponse(prompt, { modelId: model });
      emitResult({
        response: mock.responseText,
        modelId: mock.modelId,
        usage: mock.usage
      });
    }
  } catch (error) {
    process.stderr.write(`[ollama-bridge] fatal error: ${error instanceof Error ? error.message : String(error)}\n`);
    process.exitCode = 1;
  }
}

function resolveContextWindow(argValue?: string): number | undefined {
  const candidates = [
    argValue,
    process.env.LINK_AWARE_OLLAMA_CONTEXT,
    process.env.LINK_AWARE_OLLAMA_CONTEXT_WINDOW,
    process.env.OLLAMA_NUM_CTX
  ];

  for (const candidate of candidates) {
    const parsed = candidate ? Number.parseInt(candidate, 10) : Number.NaN;
    if (Number.isFinite(parsed) && parsed > 0) {
      return parsed;
    }
  }

  return undefined;
}

function emitResult(result: CliResult): void {
  process.stdout.write(`${JSON.stringify(result)}\n`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  void main();
}

function isMissingModelError(message: string, model: string): boolean {
  const normalized = message.toLowerCase();
  return normalized.includes("not found") && normalized.includes(model.toLowerCase());
}
