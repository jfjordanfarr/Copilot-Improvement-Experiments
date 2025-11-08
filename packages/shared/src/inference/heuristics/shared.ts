import path from "node:path";
import { fileURLToPath } from "node:url";

import type { HeuristicArtifact } from "../fallbackHeuristicTypes";

export function cleanupReference(reference: string | undefined): string {
  return (reference ?? "").trim();
}

export function isExternalLink(value: string): boolean {
  return /^https?:\/\//i.test(value);
}

export function normalizePath(raw: string): string {
  return path.normalize(raw).replace(/\\/g, "/").toLowerCase();
}

export function stem(value: string): string {
  const basename = path.basename(value).toLowerCase();
  const extension = path.extname(basename);
  return extension ? basename.slice(0, basename.length - extension.length) : basename;
}

export function toComparablePath(uri: string): string {
  try {
    if (uri.startsWith("file://")) {
      return normalizePath(fileURLToPath(uri));
    }
  } catch {
    // ignore URI parsing failures and fall back to generic normalisation
  }

  return normalizePath(uri);
}

export function computeReferenceStart(match: RegExpMatchArray, rawReference: string): number | null {
  if (!match[0]) {
    return null;
  }

  const offset = match[0].indexOf(rawReference);
  if (offset < 0) {
    return match.index ?? null;
  }

  return (match.index ?? 0) + offset;
}

export function isWithinComment(content: string, index: number): boolean {
  let inBlockComment = false;
  let inLineComment = false;

  for (let position = 0; position < index; position += 1) {
    const char = content[position];
    const next = content[position + 1];

    if (inLineComment) {
      if (char === "\n") {
        inLineComment = false;
      }
      continue;
    }

    if (inBlockComment) {
      if (char === "*" && next === "/") {
        inBlockComment = false;
        position += 1;
      }
      continue;
    }

    if (char === "/" && next === "*") {
      inBlockComment = true;
      position += 1;
      continue;
    }

    if (char === "/" && next === "/") {
      inLineComment = true;
      position += 1;
      continue;
    }
  }

  return inBlockComment || inLineComment;
}

export function buildReferenceVariants(reference: string, sourceDir: string): string[] {
  const variants = new Set<string>();
  const cleaned = reference.replace(/\\/g, "/");

  if (!cleaned) {
    return [];
  }

  variants.add(toComparablePath(cleaned));

  const extension = path.extname(cleaned).toLowerCase();
  if ([".js", ".mjs", ".cjs"].includes(extension)) {
    const replacements = extension === ".mjs"
      ? [".mts", ".ts"]
      : extension === ".cjs"
        ? [".cts", ".ts"]
        : [".ts", ".tsx"];

    for (const replacement of replacements) {
      const swapped = cleaned.slice(0, -extension.length) + replacement;
      variants.add(toComparablePath(swapped));
      variants.add(toComparablePath(path.join(sourceDir, swapped)));
    }
  }

  if (cleaned.startsWith(".")) {
    variants.add(toComparablePath(path.join(sourceDir, cleaned)));
  }

  if (!path.extname(cleaned)) {
    const popularExtensions = [".md", ".mdx", ".markdown", ".ts", ".tsx", ".js", ".jsx", ".json", ".py"];
    for (const candidateExtension of popularExtensions) {
      variants.add(toComparablePath(`${cleaned}${candidateExtension}`));
      variants.add(toComparablePath(path.join(sourceDir, `${cleaned}${candidateExtension}`)));
    }
  }

  variants.add(cleaned.toLowerCase());
  variants.add(path.basename(cleaned).toLowerCase());
  variants.add(stem(cleaned));

  return Array.from(variants);
}

export interface VariantMatchScore {
  confidence: number;
  rationale: string;
}

export function evaluateVariantMatch(
  variant: string,
  rawReference: string,
  candidate: HeuristicArtifact
): VariantMatchScore | null {
  if (variant === candidate.comparablePath) {
    return { confidence: 0.8, rationale: `exact path match ${variant}` };
  }

  if (candidate.basename === variant) {
    return { confidence: 0.7, rationale: `basename match ${variant}` };
  }

  if (candidate.stem === variant) {
    return { confidence: 0.6, rationale: `stem match ${variant}` };
  }

  const trimmedReference = rawReference.replace(/\.\//g, "");
  if (candidate.basename === trimmedReference) {
    return { confidence: 0.55, rationale: `relative basename match ${trimmedReference}` };
  }

  if (candidate.stem === trimmedReference) {
    return { confidence: 0.5, rationale: `relative stem match ${trimmedReference}` };
  }

  return null;
}
