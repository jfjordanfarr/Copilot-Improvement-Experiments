import { pathToFileURL } from "node:url";

import type {
  ExternalArtifact,
  ExternalLink,
  ExternalSnapshot,
  SCIPIndex,
  SCIPOccurrence
} from "@live-documentation/shared";

export interface SCIPParserOptions {
  projectRoot: string;
  feedId: string;
  confidence?: number;
}

/**
 * Parses SCIP (SCIP Code Intelligence Protocol) indexes into ExternalSnapshot format.
 * 
 * SCIP is a language-agnostic protocol for code intelligence developed by Sourcegraph.
 * Documents contain occurrences (symbol usages) and symbols (definitions/declarations).
 * Reference: Sourcegraph SCIP protocol repository.
 */
export class SCIPParser {
  private readonly options: Required<SCIPParserOptions>;

  constructor(options: SCIPParserOptions) {
    this.options = {
      ...options,
      confidence: options.confidence ?? 0.95
    };
  }

  /**
   * Parse SCIP index from JSON object
   */
  parse(scipIndex: SCIPIndex): ExternalSnapshot {
    const artifacts = this.extractArtifacts(scipIndex);
    const links = this.extractLinks(scipIndex);

    return {
      id: `scip-${Date.now()}`,
      label: this.options.feedId,
      createdAt: new Date().toISOString(),
      artifacts,
      links,
      metadata: {
        source: "scip",
        feedId: this.options.feedId
      }
    };
  }

  /**
   * Extract artifacts (documents) from the SCIP index
   */
  private extractArtifacts(index: SCIPIndex): ExternalArtifact[] {
    const artifacts: ExternalArtifact[] = [];

    for (const doc of index.documents) {
      const uri = this.normalizeUri(doc.relative_path);
      const language = this.inferLanguage(doc.relative_path, doc.language);

      artifacts.push({
        id: `scip:${doc.relative_path}`,
        uri,
        layer: "code",
        language,
        metadata: {
          source: "scip",
          feedId: this.options.feedId,
          relativePath: doc.relative_path,
          originalLanguage: doc.language,
          confidence: this.options.confidence
        }
      });
    }

    return artifacts;
  }

  /**
   * Extract links (symbol references) from the SCIP index
   */
  private extractLinks(index: SCIPIndex): ExternalLink[] {
    const links: ExternalLink[] = [];

    // Build symbol -> definition location map
    const symbolDefinitions = new Map<string, { document: string; occurrence: SCIPOccurrence }>();

    for (const doc of index.documents) {
      for (const occ of doc.occurrences) {
        if (this.isDefinition(occ)) {
          symbolDefinitions.set(occ.symbol, {
            document: doc.relative_path,
            occurrence: occ
          });
        }
      }
    }

    // Find references to defined symbols
    for (const doc of index.documents) {
      for (const occ of doc.occurrences) {
        if (!this.isDefinition(occ)) {
          const def = symbolDefinitions.get(occ.symbol);

          if (def && def.document !== doc.relative_path) {
            // Cross-document reference
            links.push({
              id: `scip:${doc.relative_path}:${occ.symbol}`,
              sourceId: `scip:${doc.relative_path}`,
              targetId: `scip:${def.document}`,
              kind: this.getEdgeKind(occ),
              confidence: this.options.confidence,
              metadata: {
                source: "scip",
                feedId: this.options.feedId,
                symbol: occ.symbol,
                sourceRange: occ.range ? JSON.stringify(occ.range) : undefined,
                targetRange: def.occurrence.range ? JSON.stringify(def.occurrence.range) : undefined,
                symbolRole: String(occ.symbol_roles || 0)
              }
            });
          }
        }
      }
    }

    return links;
  }

  /**
   * Determine if an occurrence is a definition
   */
  private isDefinition(occ: SCIPOccurrence): boolean {
    const roles = occ.symbol_roles || 0;
    const DEFINITION_ROLE = 1; // Definition role bit
    return (roles & DEFINITION_ROLE) !== 0;
  }

  /**
   * Determine edge kind from occurrence role
   */
  private getEdgeKind(occ: SCIPOccurrence): "references" | "depends_on" {
    const roles = occ.symbol_roles || 0;
    const WRITE_ROLE = 4; // Write access role bit

    if ((roles & WRITE_ROLE) !== 0) {
      return "depends_on"; // Writes indicate stronger dependency
    }
    return "references"; // Reads are references
  }

  /**
   * Infer language from file extension if not provided
   */
  private inferLanguage(path: string, language?: string): string {
    if (language) {
      return language;
    }

    const ext = path.split(".").pop()?.toLowerCase();
    const extensionMap: Record<string, string> = {
      ts: "typescript",
      tsx: "typescriptreact",
      js: "javascript",
      jsx: "javascriptreact",
      py: "python",
      java: "java",
      go: "go",
      rs: "rust",
      cpp: "cpp",
      c: "c",
      cs: "csharp",
      rb: "ruby",
      php: "php",
      swift: "swift",
      kt: "kotlin",
      scala: "scala"
    };

    return extensionMap[ext || ""] || "unknown";
  }

  /**
   * Normalize relative paths to file:// URIs
   */
  private normalizeUri(relativePath: string): string {
    try {
      const absolutePath = `${this.options.projectRoot}/${relativePath}`.replace(/\\/g, "/");
      return pathToFileURL(absolutePath).toString();
    } catch {
      return relativePath;
    }
  }
}

/**
 * Parse SCIP index into an ExternalSnapshot
 */
export function parseSCIP(scipIndex: SCIPIndex, options: SCIPParserOptions): ExternalSnapshot {
  const parser = new SCIPParser(options);
  return parser.parse(scipIndex);
}
