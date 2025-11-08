import type { FallbackHeuristic } from "../fallbackHeuristicTypes";
import { createCFunctionHeuristic } from "./cFunctions";
import { createCSharpHeuristic } from "./csharp";
import { createDirectiveHeuristic } from "./directives";
import { createImportHeuristic } from "./imports";
import { createIncludeHeuristic } from "./includes";
import { createJavaHeuristic } from "./java";
import { createMarkdownHeuristic } from "./markdown";
import { createRubyHeuristic } from "./ruby";
import { createRustHeuristic } from "./rust";
import { createWebFormsHeuristic } from "./webforms";

export function createDefaultHeuristics(): FallbackHeuristic[] {
  return [
    createDirectiveHeuristic(),
    createMarkdownHeuristic(),
    createImportHeuristic(),
    createIncludeHeuristic(),
    createCFunctionHeuristic(),
    createRustHeuristic(),
    createJavaHeuristic(),
    createCSharpHeuristic(),
    createRubyHeuristic(),
    createWebFormsHeuristic(),
  ];
}
