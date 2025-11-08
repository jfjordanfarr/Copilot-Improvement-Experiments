import { isImplementationLayer } from "./artifactLayerUtils";
import type { FallbackHeuristic, HeuristicArtifact } from "../fallbackHeuristicTypes";

const C_FUNCTION_DEFINITION_PATTERN = "([A-Za-z_][A-Za-z0-9_\\s*]*?)\\b([A-Za-z_][A-Za-z0-9_]*)\\s*\\([^;{}]*\\)\\s*\\{";
const C_FUNCTION_CALL_PATTERN = "\\b([A-Za-z_][A-Za-z0-9_]*)\\s*\\(";
const C_RESERVED_IDENTIFIERS = new Set([
  "if",
  "else",
  "for",
  "while",
  "switch",
  "return",
  "sizeof",
  "do",
  "case",
  "break",
  "continue",
  "goto",
]);

type CFunctionIndex = Map<string, HeuristicArtifact[]>;

export function createCFunctionHeuristic(): FallbackHeuristic {
  let functionIndex: CFunctionIndex = new Map();

  const buildIndex = (artifacts: readonly HeuristicArtifact[]): void => {
    const index: CFunctionIndex = new Map();

    for (const artifact of artifacts) {
      if (!artifact.content || !artifact.comparablePath.endsWith(".c")) {
        continue;
      }

      const stripped = stripCComments(artifact.content);
      const pattern = new RegExp(C_FUNCTION_DEFINITION_PATTERN, "gm");

      for (const match of stripped.matchAll(pattern)) {
        const name = match[2];
        if (!name || C_RESERVED_IDENTIFIERS.has(name)) {
          continue;
        }

        const bucket = index.get(name) ?? [];
        bucket.push(artifact);
        index.set(name, bucket);
      }
    }

    functionIndex = index;
  };

  return {
    id: "c-function-call",
    initialize(artifacts) {
      buildIndex(artifacts);
    },
    appliesTo(source) {
      return isImplementationLayer(source.artifact.layer) && source.comparablePath.endsWith(".c");
    },
    evaluate(source, emit) {
      if (!source.content) {
        return;
      }

      const stripped = stripCComments(source.content);
      const pattern = new RegExp(C_FUNCTION_CALL_PATTERN, "gm");
      const recorded = new Set<string>();

      for (const match of stripped.matchAll(pattern)) {
        const name = match[1];
        if (!name || C_RESERVED_IDENTIFIERS.has(name)) {
          continue;
        }

        const targets = functionIndex.get(name);
        if (!targets) {
          continue;
        }

        for (const target of targets) {
          if (target.artifact.id === source.artifact.id) {
            continue;
          }

          const key = `${target.artifact.id}|${name}`;
          if (recorded.has(key)) {
            continue;
          }

          recorded.add(key);
          emit({
            target,
            confidence: 0.75,
            rationale: `c call ${name}`,
            context: "call",
          });
        }
      }
    },
  };
}

function stripCComments(content: string): string {
  const withoutBlock = content.replace(/\/\*[\s\S]*?\*\//g, " ");
  return withoutBlock.replace(/\/\/.*$/gm, " ");
}
