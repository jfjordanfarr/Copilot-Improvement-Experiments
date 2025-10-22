/**
 * TypeScript interfaces for SCIP (SCIP Code Intelligence Protocol) data structures.
 * SCIP is a language-agnostic protocol for indexing code and representing code intelligence data.
 * 
 * Spec: https://github.com/sourcegraph/scip
 */

export interface SCIPIndex {
  metadata: SCIPMetadata;
  documents: SCIPDocument[];
}

export interface SCIPMetadata {
  version: string;
  tool_info?: SCIPToolInfo;
  project_root: string;
  text_document_encoding?: string;
}

export interface SCIPToolInfo {
  name: string;
  version?: string;
  arguments?: string[];
}

export interface SCIPDocument {
  language: string;
  relative_path: string;
  occurrences: SCIPOccurrence[];
  symbols: SCIPSymbolInformation[];
}

export interface SCIPOccurrence {
  range: number[];
  symbol: string;
  symbol_roles: number;
  override_documentation?: string[];
  syntax_kind?: number;
  diagnostics?: SCIPDiagnostic[];
}

export interface SCIPSymbolInformation {
  symbol: string;
  documentation?: string[];
  relationships?: SCIPRelationship[];
  kind?: number;
  display_name?: string;
  signature_documentation?: SCIPSignature;
}

export interface SCIPRelationship {
  symbol: string;
  is_reference?: boolean;
  is_implementation?: boolean;
  is_type_definition?: boolean;
  is_definition?: boolean;
}

export interface SCIPDiagnostic {
  severity: number;
  code?: string;
  message: string;
  source?: string;
  tags?: number[];
}

export interface SCIPSignature {
  text: string;
  documentation?: string[];
  occurrences?: SCIPOccurrence[];
}

/**
 * SCIP symbol roles (bitflags)
 */
export enum SCIPSymbolRole {
  UnspecifiedSymbolRole = 0,
  Definition = 1,
  Import = 2,
  WriteAccess = 4,
  ReadAccess = 8,
  Generated = 16,
  Test = 32,
  ForwardDefinition = 64,
}

/**
 * SCIP symbol kinds
 */
export enum SCIPSymbolKind {
  UnspecifiedSymbolKind = 0,
  Class = 1,
  Enum = 2,
  Interface = 3,
  Struct = 4,
  TypeAlias = 5,
  TypeParameter = 6,
  Union = 7,
  Variable = 8,
  Constant = 9,
  Parameter = 10,
  Function = 11,
  Method = 12,
  Constructor = 13,
  Destructor = 14,
  Field = 15,
  Property = 16,
  EnumMember = 17,
  Event = 18,
  Operator = 19,
  Module = 20,
  Namespace = 21,
  Package = 22,
  String = 23,
  Number = 24,
  Boolean = 25,
  Array = 26,
  Object = 27,
  Key = 28,
  Null = 29,
  Macro = 30,
  File = 31,
}

export interface ParsedSCIPIndex {
  metadata: SCIPMetadata;
  documentsByPath: Map<string, SCIPDocument>;
  symbolsByName: Map<string, SCIPSymbolInformation>;
  occurrencesBySymbol: Map<string, SCIPOccurrence[]>;
}
