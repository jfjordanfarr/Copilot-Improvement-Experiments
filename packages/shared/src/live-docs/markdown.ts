import path from "node:path";

import type { LiveDocMetadata, LiveDocProvenance } from "./schema";
import { LIVE_DOCUMENTATION_FILE_EXTENSION } from "../config/liveDocumentationConfig";
import { normalizeWorkspacePath } from "../tooling/pathUtils";

export const LIVE_DOC_BEGIN_MARKER_PREFIX = "<!-- LIVE-DOC:BEGIN ";
export const LIVE_DOC_END_MARKER_PREFIX = "<!-- LIVE-DOC:END ";
export const LIVE_DOC_PROVENANCE_MARKER = "<!-- LIVE-DOC:PROVENANCE ";

export interface LiveDocRenderSection {
  name: string;
  heading?: string;
  lines: string[];
}

export interface RenderLiveDocOptions {
  title: string;
  metadata: LiveDocMetadata;
  authoredBlock: string;
  sections: LiveDocRenderSection[];
  provenance?: LiveDocProvenance;
}

const DEFAULT_AUTHORED_TEMPLATE = [
  "### Purpose",
  "_Pending authored purpose_",
  "",
  "### Notes",
  "_Pending notes_"
].join("\n");

export function renderLiveDocMarkdown(options: RenderLiveDocOptions): string {
  const lines: string[] = [];
  lines.push(`# ${options.title}`);
  lines.push("");
  lines.push("## Metadata");
  renderMetadata(lines, options.metadata);
  lines.push("");
  lines.push("## Authored");
  const authoredLines = normaliseAuthoredBlock(options.authoredBlock);
  lines.push(...authoredLines);
  if (authoredLines.length === 0) {
    lines.push(" ");
  }
  lines.push("");
  lines.push("## Generated");

  if (options.provenance) {
    lines.push(renderProvenanceComment(options.provenance));
  }

  const sectionCount = options.sections.length;
  options.sections.forEach((section, index) => {
    lines.push(renderBeginMarker(section.name));
    lines.push(section.heading ?? `### ${section.name}`);
    if (section.lines.length === 0) {
      lines.push("_No data available_");
    } else {
      lines.push(...section.lines);
    }
    lines.push(renderEndMarker(section.name));
    if (index !== sectionCount - 1) {
      lines.push("");
    }
  });

  const document = lines.join("\n");
  return document.endsWith("\n") ? document : `${document}\n`;
}

export function renderBeginMarker(sectionName: string): string {
  return `${LIVE_DOC_BEGIN_MARKER_PREFIX}${sectionName} -->`;
}

export function renderEndMarker(sectionName: string): string {
  return `${LIVE_DOC_END_MARKER_PREFIX}${sectionName} -->`;
}

export function renderProvenanceComment(provenance: LiveDocProvenance): string {
  const payload = JSON.stringify(provenance);
  return `${LIVE_DOC_PROVENANCE_MARKER}${payload} -->`;
}

export function extractAuthoredBlock(existingContent: string | undefined): string {
  if (!existingContent) {
    return DEFAULT_AUTHORED_TEMPLATE;
  }

  const authoredHeading = matchHeading(existingContent, "Authored");
  if (!authoredHeading) {
    return DEFAULT_AUTHORED_TEMPLATE;
  }

  const generatedHeading = matchHeading(existingContent, "Generated");
  const start = authoredHeading.index + authoredHeading.match.length;
  const end = generatedHeading ? generatedHeading.index : existingContent.length;
  const rawBlock = existingContent.slice(start, end).trim();
  if (!rawBlock) {
    return DEFAULT_AUTHORED_TEMPLATE;
  }

  return rawBlock;
}

interface HeadingMatch {
  index: number;
  match: string;
}

function matchHeading(content: string, title: string): HeadingMatch | undefined {
  const pattern = new RegExp(`^##\\s+${escapeRegExp(title)}\\s*$`, "m");
  const match = content.match(pattern);
  if (!match || match.index === undefined) {
    return undefined;
  }

  return {
    index: match.index,
    match: match[0]
  };
}

function renderMetadata(output: string[], metadata: LiveDocMetadata): void {
  output.push(`- Layer: ${metadata.layer}`);
  if (metadata.archetype) {
    output.push(`- Archetype: ${metadata.archetype}`);
  }
  if (metadata.layer === 4) {
    output.push(`- Code Path: ${metadata.sourcePath}`);
  }
  output.push(`- Live Doc ID: ${metadata.liveDocId}`);
  if (metadata.generatedAt) {
    output.push(`- Generated At: ${metadata.generatedAt}`);
  }
}

function normaliseAuthoredBlock(block: string): string[] {
  const trimmed = block.trim();
  if (!trimmed) {
    return DEFAULT_AUTHORED_TEMPLATE.split(/\r?\n/);
  }

  return trimmed.split(/\r?\n/);
}

export function defaultAuthoredTemplate(): string {
  return DEFAULT_AUTHORED_TEMPLATE;
}

export function composeLiveDocPath(
  root: string,
  baseLayer: string,
  sourcePath: string
): string {
  const normalizedRoot = normalizeWorkspacePath(root);
  const normalizedLayer = normalizeWorkspacePath(baseLayer);
  const normalizedSource = normalizeWorkspacePath(sourcePath);
  return path
    .join(normalizedRoot, normalizedLayer, `${normalizedSource}${LIVE_DOCUMENTATION_FILE_EXTENSION}`)
    .split(path.sep)
    .join("/");
}

export function composeLiveDocId(archetype: string | undefined, sourcePath: string): string {
  const prefix = archetype ?? "unknown";
  const normalised = normalizeWorkspacePath(sourcePath)
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();
  return `LD-${prefix}-${normalised || "root"}`;
}

function escapeRegExp(input: string): string {
  return input.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
