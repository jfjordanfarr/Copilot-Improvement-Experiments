import path from "node:path";

import type { SourceAnalysisResult } from "../core";
import { csharpAdapter } from "./csharp";

export interface LanguageAdapter {
  readonly id: string;
  readonly extensions: readonly string[];
  analyze(input: { absolutePath: string; workspaceRoot: string }): Promise<SourceAnalysisResult | null>;
}

const ADAPTERS: readonly LanguageAdapter[] = [csharpAdapter];

export async function analyzeWithLanguageAdapters(options: {
  absolutePath: string;
  workspaceRoot: string;
}): Promise<SourceAnalysisResult | null> {
  const extension = path.extname(options.absolutePath).toLowerCase();
  if (!extension) {
    return null;
  }

  for (const adapter of ADAPTERS) {
    if (adapter.extensions.includes(extension)) {
      return adapter.analyze(options);
    }
  }

  return null;
}
