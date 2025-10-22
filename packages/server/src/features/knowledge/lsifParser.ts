import { fileURLToPath, pathToFileURL } from "node:url";

import type {
  ExternalArtifact,
  ExternalLink,
  ExternalSnapshot,
  LSIFDocument,
  LSIFEntry,
  LSIFRange,
  ParsedLSIFIndex
} from "@copilot-improvement/shared";

export interface LSIFParserOptions {
  projectRoot: string;
  feedId: string;
  confidence?: number;
}

/**
 * Parses LSIF (Language Server Index Format) dumps into ExternalSnapshot format.
 * 
 * LSIF is a newline-delimited JSON format where each line is a vertex or edge.
 * We extract documents as artifacts and definition/reference relationships as links.
 * 
 * @see https://microsoft.github.io/language-server-protocol/specifications/lsif/0.6.0/specification/
 */
export class LSIFParser {
  private readonly options: Required<LSIFParserOptions>;

  constructor(options: LSIFParserOptions) {
    this.options = {
      ...options,
      confidence: options.confidence ?? 0.95
    };
  }

  /**
   * Parse LSIF dump from newline-delimited JSON string
   */
  parse(lsifContent: string): ExternalSnapshot {
    const index = this.buildIndex(lsifContent);
    const artifacts = this.extractArtifacts(index);
    const links = this.extractLinks(index);

    return {
      id: `lsif-${Date.now()}`,
      label: this.options.feedId,
      createdAt: new Date().toISOString(),
      artifacts,
      links,
      metadata: {
        source: "lsif",
        feedId: this.options.feedId
      }
    };
  }

  /**
   * Build an indexed representation of the LSIF graph
   */
  private buildIndex(content: string): ParsedLSIFIndex {
    const index: ParsedLSIFIndex = {
      documents: new Map(),
      ranges: new Map(),
      resultSets: new Map(),
      definitions: new Map(),
      references: new Map(),
      containsEdges: [],
      itemEdges: [],
      nextEdges: [],
      definitionEdges: [],
      referenceEdges: []
    };

    const lines = content.trim().split("\n");

    for (const line of lines) {
      if (!line.trim()) {
        continue;
      }

      try {
        const entry = JSON.parse(line) as LSIFEntry;

        if (entry.type === "vertex") {
          switch (entry.label) {
            case "metaData":
              index.metaData = entry as never;
              break;
            case "document":
              index.documents.set(entry.id, entry as LSIFDocument);
              break;
            case "range":
              index.ranges.set(entry.id, entry as LSIFRange);
              break;
            case "resultSet":
              index.resultSets.set(entry.id, entry as never);
              break;
            case "definitionResult":
              index.definitions.set(entry.id, entry as never);
              break;
            case "referenceResult":
              index.references.set(entry.id, entry as never);
              break;
          }
        } else if (entry.type === "edge") {
          switch (entry.label) {
            case "contains":
              index.containsEdges.push(entry as never);
              break;
            case "item":
              index.itemEdges.push(entry as never);
              break;
            case "next":
              index.nextEdges.push(entry as never);
              break;
            case "textDocument/definition":
              index.definitionEdges.push(entry as never);
              break;
            case "textDocument/references":
              index.referenceEdges.push(entry as never);
              break;
          }
        }
      } catch (error) {
        // Skip malformed lines
        console.warn(`Failed to parse LSIF line: ${error instanceof Error ? error.message : String(error)}`);
      }
    }

    return index;
  }

  /**
   * Extract artifacts (documents) from the LSIF index
   */
  private extractArtifacts(index: ParsedLSIFIndex): ExternalArtifact[] {
    const artifacts: ExternalArtifact[] = [];

    for (const doc of index.documents.values()) {
      const uri = this.normalizeUri(doc.uri);

      artifacts.push({
        id: `lsif:${doc.id}`,
        uri,
        layer: "code",
        language: doc.languageId,
        metadata: {
          source: "lsif",
          feedId: this.options.feedId,
          documentId: String(doc.id),
          confidence: this.options.confidence
        }
      });
    }

    return artifacts;
  }

  /**
   * Extract links (definition/reference relationships) from the LSIF index
   */
  private extractLinks(index: ParsedLSIFIndex): ExternalLink[] {
    const links: ExternalLink[] = [];

    // Build document containment map (document -> ranges)
    const documentRanges = new Map<string | number, Set<string | number>>();
    for (const edge of index.containsEdges) {
      const rangeIds = edge.inVs || [];
      for (const rangeId of rangeIds) {
        if (!documentRanges.has(edge.outV)) {
          documentRanges.set(edge.outV, new Set());
        }
        documentRanges.get(edge.outV)!.add(rangeId);
      }
    }

    // Build range -> resultSet map
    const rangeToResultSet = new Map<string | number, string | number>();
    for (const edge of index.nextEdges) {
      const range = index.ranges.get(edge.outV);
      if (range && index.resultSets.has(edge.inV)) {
        rangeToResultSet.set(edge.outV, edge.inV);
      }
    }

    // Process definition edges
    for (const defEdge of index.definitionEdges) {
      const resultSetId = defEdge.outV;
      const defResultId = defEdge.inV;

      // Find references to this definition
      for (const itemEdge of index.itemEdges) {
        if (itemEdge.inV === defResultId && itemEdge.property === "definitions") {
          const defRangeId = itemEdge.outV;
          const defRange = index.ranges.get(defRangeId);
          const defDocId = this.findDocumentForRange(defRangeId, documentRanges);

          if (!defRange || !defDocId) {
            continue;
          }

          // Find all ranges that reference this resultSet
          for (const [rangeId, rsId] of rangeToResultSet.entries()) {
            if (rsId === resultSetId && rangeId !== defRangeId) {
              const refRange = index.ranges.get(rangeId);
              const refDocId = this.findDocumentForRange(rangeId, documentRanges);

              if (refRange && refDocId && refDocId !== defDocId) {
                const sourceDoc = index.documents.get(refDocId);
                const targetDoc = index.documents.get(defDocId);

                if (sourceDoc && targetDoc) {
                  links.push({
                    id: `lsif:ref:${rangeId}:${defRangeId}`,
                    sourceId: `lsif:${refDocId}`,
                    targetId: `lsif:${defDocId}`,
                    kind: "references",
                    confidence: this.options.confidence,
                    metadata: {
                      source: "lsif",
                      feedId: this.options.feedId,
                      refRangeId: String(rangeId),
                      defRangeId: String(defRangeId),
                      resultSetId: String(resultSetId)
                    }
                  });
                }
              }
            }
          }
        }
      }
    }

    return links;
  }

  /**
   * Find which document contains a given range
   */
  private findDocumentForRange(
    rangeId: string | number,
    documentRanges: Map<string | number, Set<string | number>>
  ): string | number | undefined {
    for (const [docId, ranges] of documentRanges.entries()) {
      if (ranges.has(rangeId)) {
        return docId;
      }
    }
    return undefined;
  }

  /**
   * Normalize file:// URIs relative to project root
   */
  private normalizeUri(uri: string): string {
    try {
      if (uri.startsWith("file://")) {
        const filePath = fileURLToPath(uri);
        const projectRootPath = this.options.projectRoot.replace(/\\/g, "/");

        if (filePath.startsWith(projectRootPath)) {
          return uri;
        }

        // Convert to file:// URI
        return pathToFileURL(filePath).toString();
      }

      // Assume relative path
      const absolutePath = `${this.options.projectRoot}/${uri}`.replace(/\\/g, "/");
      return pathToFileURL(absolutePath).toString();
    } catch {
      return uri;
    }
  }
}

/**
 * Parse LSIF content into an ExternalSnapshot
 */
export function parseLSIF(content: string, options: LSIFParserOptions): ExternalSnapshot {
  const parser = new LSIFParser(options);
  return parser.parse(content);
}
