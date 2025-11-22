import { promises as fsp } from "node:fs";

import type { ExternalSnapshot, LSIFEntry, SCIPIndex } from "@live-documentation/shared";

import { parseLSIF, type LSIFParserOptions } from "./lsifParser";
import { parseSCIP, type SCIPParserOptions } from "./scipParser";

export type FeedFormat = "lsif" | "scip" | "external-snapshot" | "unknown";

export interface FormatDetectionResult {
  format: FeedFormat;
  confidence: number;
}

/**
 * Detect the format of a knowledge feed file by inspecting its content structure
 */
export function detectFormat(content: string): FormatDetectionResult {
  try {
    const trimmed = content.trim();
    
    // Check for LSIF: newline-delimited JSON with type/label fields
    // LSIF has multiple lines, each a separate JSON object
    if (trimmed.includes("\n")) {
      const lines = trimmed.split("\n");
      if (lines.length > 1) {
        try {
          const firstLine = lines[0];
          const entry = JSON.parse(firstLine) as Partial<LSIFEntry>;
          if (entry.type && entry.label && entry.id !== undefined) {
            return { format: "lsif", confidence: 0.95 };
          }
        } catch {
          // Not valid JSON on first line, continue to other checks
        }
      }
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const parsed = JSON.parse(trimmed);

    // Check for ExternalSnapshot FIRST (higher priority than SCIP)
    // Must resemble the strongly-typed ExternalSnapshot shape
    if (looksLikeExternalSnapshot(parsed)) {
      return { format: "external-snapshot", confidence: 1.0 };
    }

    // Check for SCIP: has metadata.version and documents array
    if (
      typeof parsed === "object" &&
      parsed !== null &&
      "metadata" in parsed &&
      "documents" in parsed &&
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      Array.isArray(parsed.documents)
    ) {
      const scip = parsed as Partial<SCIPIndex>;
      if (scip.metadata && typeof scip.metadata === "object" && "version" in scip.metadata) {
        return { format: "scip", confidence: 0.95 };
      }
    }

    return { format: "unknown", confidence: 0.0 };
  } catch {
    return { format: "unknown", confidence: 0.0 };
  }
}

function looksLikeExternalSnapshot(candidate: unknown): candidate is ExternalSnapshot {
  if (typeof candidate !== "object" || candidate === null) {
    return false;
  }

  const value = candidate as Partial<ExternalSnapshot> & Record<string, unknown>;

  if (!("label" in value) || typeof value.label !== "string") {
    return false;
  }

  if (!Array.isArray(value.artifacts) || !Array.isArray(value.links)) {
    return false;
  }

  const artifactsValid = value.artifacts.every(artifact => {
    if (typeof artifact !== "object" || artifact === null) {
      return false;
    }

    const artifactRecord = artifact as Partial<ExternalSnapshot["artifacts"][number]> &
      Record<string, unknown>;
    return typeof artifactRecord.uri === "string" && artifactRecord.uri.length > 0;
  });

  if (!artifactsValid) {
    return false;
  }

  const linksValid = value.links.every(link => {
    if (typeof link !== "object" || link === null) {
      return false;
    }

    const linkRecord = link as Partial<ExternalSnapshot["links"][number]> & Record<string, unknown>;
    const hasSource = typeof linkRecord.sourceId === "string" && linkRecord.sourceId.length > 0;
    const hasTarget = typeof linkRecord.targetId === "string" && linkRecord.targetId.length > 0;
    const hasKind = typeof linkRecord.kind === "string" && linkRecord.kind.length > 0;
    return hasSource && hasTarget && hasKind;
  });

  return linksValid;
}

export interface ParseFeedFileOptions {
  filePath: string;
  projectRoot: string;
  feedId: string;
  confidence?: number;
}

/**
 * Parse a knowledge feed file into ExternalSnapshot format,
 * automatically detecting LSIF, SCIP, or native ExternalSnapshot formats
 */
export async function parseFeedFile(options: ParseFeedFileOptions): Promise<ExternalSnapshot | null> {
  const { filePath, projectRoot, feedId, confidence = 0.95 } = options;

  try {
    const content = await fsp.readFile(filePath, "utf-8");
    const detection = detectFormat(content);

    switch (detection.format) {
      case "lsif": {
        const parserOptions: LSIFParserOptions = {
          projectRoot,
          feedId,
          confidence
        };
        return parseLSIF(content, parserOptions);
      }

      case "scip": {
        const scipIndex = JSON.parse(content) as SCIPIndex;
        const parserOptions: SCIPParserOptions = {
          projectRoot,
          feedId,
          confidence
        };
        return parseSCIP(scipIndex, parserOptions);
      }

      case "external-snapshot": {
        return JSON.parse(content) as ExternalSnapshot;
      }

      case "unknown":
      default:
        return null;
    }
  } catch (error) {
    console.error(`Failed to parse feed file ${filePath}: ${error instanceof Error ? error.message : String(error)}`);
    return null;
  }
}
