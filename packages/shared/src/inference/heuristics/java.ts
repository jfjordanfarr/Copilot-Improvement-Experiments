import path from "node:path";

import { isImplementationLayer } from "./artifactLayerUtils";
import type { FallbackHeuristic, HeuristicArtifact } from "../fallbackHeuristicTypes";

const JAVA_IMPORT_PATTERN = "^\\s*import\\s+([^;]+);";

interface JavaContext {
  packageIndex: Map<string, HeuristicArtifact>;
}

export function createJavaHeuristic(): FallbackHeuristic {
  let context: JavaContext = { packageIndex: new Map() };

  return {
    id: "java-imports",
    initialize(artifacts) {
      context = buildJavaContext(artifacts);
    },
    appliesTo(source) {
      return isImplementationLayer(source.artifact.layer) && source.comparablePath.endsWith(".java");
    },
    evaluate(source, emit) {
      if (!source.content) {
        return;
      }

      const seen = new Set<string>();
      const pattern = new RegExp(JAVA_IMPORT_PATTERN, "gm");

      for (const match of source.content.matchAll(pattern)) {
        const statement = match[1]?.trim();
        if (!statement || statement.startsWith("java.")) {
          continue;
        }

        const target = context.packageIndex.get(statement.toLowerCase());
        if (!target || target.artifact.id === source.artifact.id) {
          continue;
        }

        if (seen.has(target.artifact.id)) {
          continue;
        }

        seen.add(target.artifact.id);
        const symbol = statement.slice(statement.lastIndexOf(".") + 1);
        const relation = classifyJavaRelation(symbol, source.content ?? "");
        const rationale = relation === "uses" ? `java usage ${symbol}` : `java import ${symbol}`;
        const confidence = relation === "uses" ? 0.8 : 0.7;

        emit({
          target,
          confidence,
          rationale,
          context: relation === "uses" ? "use" : "import",
        });
      }
    },
  };
}

function buildJavaContext(artifacts: readonly HeuristicArtifact[]): JavaContext {
  const packageIndex = new Map<string, HeuristicArtifact>();

  for (const artifact of artifacts) {
    if (!artifact.content || !artifact.comparablePath.endsWith(".java")) {
      continue;
    }

    const packageName = extractJavaPackage(artifact.content);
    if (!packageName) {
      continue;
    }

    const className = inferJavaClassName(artifact.comparablePath);
    packageIndex.set(`${packageName}.${className}`.toLowerCase(), artifact);
  }

  return { packageIndex };
}

function extractJavaPackage(content: string): string | null {
  const match = content.match(/\bpackage\s+([^;]+);/);
  return match ? match[1].trim() : null;
}

function inferJavaClassName(comparablePath: string): string {
  const basename = path.basename(comparablePath);
  return basename.endsWith(".java") ? basename.slice(0, -".java".length) : basename;
}

function classifyJavaRelation(symbol: string, content: string): "imports" | "uses" {
  const escaped = symbol.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const constructorPattern = new RegExp(`new\\s+${escaped}\\b`);
  const genericPattern = new RegExp(`<\\s*${escaped}\\b`);
  const declarationPattern = new RegExp(`\\b${escaped}\\s+[A-Za-z_$][\\w$]*\\s*(=|;|,|\\))`);
  const methodReferencePattern = new RegExp(`\\b${escaped}::`);

  if (
    constructorPattern.test(content) ||
    genericPattern.test(content) ||
    declarationPattern.test(content) ||
    methodReferencePattern.test(content)
  ) {
    return "uses";
  }

  return "imports";
}
