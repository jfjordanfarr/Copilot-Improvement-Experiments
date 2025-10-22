/**
 * TypeScript interfaces for LSIF (Language Server Index Format) data structures.
 * LSIF is a graph-based index format for code intelligence that captures symbols,
 * definitions, references, and their relationships.
 * 
 * Spec: https://microsoft.github.io/language-server-protocol/specifications/lsif/0.6.0/specification/
 */

export type LSIFVertexLabel =
  | "metaData"
  | "project"
  | "document"
  | "range"
  | "resultSet"
  | "definitionResult"
  | "referenceResult"
  | "hoverResult"
  | "moniker";

export type LSIFEdgeLabel =
  | "contains"
  | "item"
  | "next"
  | "textDocument/definition"
  | "textDocument/references"
  | "textDocument/hover";

export interface LSIFElement {
  id: string | number;
  type: "vertex" | "edge";
  label: string;
}

export interface LSIFVertex extends LSIFElement {
  type: "vertex";
}

export interface LSIFEdge extends LSIFElement {
  type: "edge";
  outV: string | number;
  inV: string | number;
}

export interface LSIFMetaData extends LSIFVertex {
  label: "metaData";
  version: string;
  projectRoot: string;
  toolInfo?: {
    name: string;
    version?: string;
    args?: string[];
  };
}

export interface LSIFProject extends LSIFVertex {
  label: "project";
  kind?: string;
  name?: string;
  resource?: string;
}

export interface LSIFDocument extends LSIFVertex {
  label: "document";
  uri: string;
  languageId?: string;
  contents?: string;
}

export interface LSIFRange extends LSIFVertex {
  label: "range";
  start: {
    line: number;
    character: number;
  };
  end: {
    line: number;
    character: number;
  };
  tag?: {
    type: "definition" | "reference" | "unknown";
    text: string;
    kind: number;
    fullRange: {
      start: { line: number; character: number };
      end: { line: number; character: number };
    };
  };
}

export interface LSIFResultSet extends LSIFVertex {
  label: "resultSet";
}

export interface LSIFDefinitionResult extends LSIFVertex {
  label: "definitionResult";
}

export interface LSIFReferenceResult extends LSIFVertex {
  label: "referenceResult";
}

export interface LSIFContainsEdge extends LSIFEdge {
  label: "contains";
  inVs: Array<string | number>;
}

export interface LSIFItemEdge extends LSIFEdge {
  label: "item";
  document: string | number;
  property?: "definitions" | "references" | "referenceResults";
}

export interface LSIFNextEdge extends LSIFEdge {
  label: "next";
}

export interface LSIFDefinitionEdge extends LSIFEdge {
  label: "textDocument/definition";
}

export interface LSIFReferencesEdge extends LSIFEdge {
  label: "textDocument/references";
}

/**
 * LSIF dump is a newline-delimited JSON stream where each line is a vertex or edge
 */
export type LSIFEntry =
  | LSIFMetaData
  | LSIFProject
  | LSIFDocument
  | LSIFRange
  | LSIFResultSet
  | LSIFDefinitionResult
  | LSIFReferenceResult
  | LSIFContainsEdge
  | LSIFItemEdge
  | LSIFNextEdge
  | LSIFDefinitionEdge
  | LSIFReferencesEdge
  | (LSIFVertex | LSIFEdge);

export interface ParsedLSIFIndex {
  metaData?: LSIFMetaData;
  documents: Map<string | number, LSIFDocument>;
  ranges: Map<string | number, LSIFRange>;
  resultSets: Map<string | number, LSIFResultSet>;
  definitions: Map<string | number, LSIFDefinitionResult>;
  references: Map<string | number, LSIFReferenceResult>;
  containsEdges: LSIFContainsEdge[];
  itemEdges: LSIFItemEdge[];
  nextEdges: LSIFNextEdge[];
  definitionEdges: LSIFDefinitionEdge[];
  referenceEdges: LSIFReferencesEdge[];
}
