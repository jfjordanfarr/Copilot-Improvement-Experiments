import type {
  ExplorerDetailPayload,
  ExplorerNodePayload
} from "../shared/types";
import { requireElement } from "./dom";

export interface DetailPanelApi {
  showNode(node: ExplorerNodePayload): Promise<void>;
  setLoading(node: ExplorerNodePayload): void;
}

export function createDetailPanel(nodesById: Map<string, ExplorerNodePayload>): DetailPanelApi {
  const panel = requireElement<HTMLDivElement>("detail-panel");
  const title = requireElement<HTMLHeadingElement>("detail-title");
  const body = requireElement<HTMLDivElement>("detail-body");

  function setLoading(node: ExplorerNodePayload): void {
    panel.classList.add("visible");
    title.textContent = node.name;
    body.innerHTML = '<p style="color:#888;">Loading details...</p>';
  }

  async function showNode(node: ExplorerNodePayload): Promise<void> {
    setLoading(node);

    try {
      const response = await fetch(`/details?docPath=${encodeURIComponent(node.docPath)}`);
      if (!response.ok) {
        throw new Error("Failed to load details");
      }
      const details: ExplorerDetailPayload = await response.json();
      body.innerHTML = buildDetailsHtml(node, details, nodesById);
    } catch (error) {
      console.error(error);
      body.innerHTML = '<p style="color: #f88;">Failed to load details for this node.</p>';
    }
  }

  return { showNode, setLoading };
}

function buildDetailsHtml(
  node: ExplorerNodePayload,
  details: ExplorerDetailPayload,
  nodesById: Map<string, ExplorerNodePayload>
): string {
  const dependencies = node.dependencies.map(dep => toRelativePath(dep, nodesById)).sort();
  const dependents = node.dependents.map(dep => toRelativePath(dep, nodesById)).sort();
  const missing = details.missingDependencies ?? [];

  const normalizedPurpose = normalizeNewlines(details.purpose ?? "");
  const purposeHtml = normalizedPurpose.split("\n").join("<br>");

  const parts: string[] = [];
  parts.push(sectionHtml("Archetype", `<span class="pill accent">${node.archetype}</span>`));
  parts.push(
    sectionHtml(
      "Code Path",
      `<div style="font-family: monospace; font-size: 12px;">${node.codeRelativePath}</div>`
    )
  );
  parts.push(
    sectionHtml(
      "Document Path",
      `<div style="font-family: monospace; font-size: 12px;">${node.docRelativePath}</div>`
    )
  );

  if (details.purpose) {
    parts.push(sectionHtml("Purpose", purposeHtml));
  }

  if (node.publicSymbols.length > 0) {
    const symbols = node.publicSymbols.map(symbol => `<span class="pill">${symbol}</span>`).join("");
    parts.push(sectionHtml("Public Symbols", symbols));
  }

  if (dependencies.length > 0) {
    parts.push(sectionHtml("Dependencies", listHtml(dependencies)));
  }

  if (dependents.length > 0) {
    parts.push(sectionHtml("Dependents", listHtml(dependents)));
  }

  if (missing.length > 0) {
    parts.push(sectionHtml("Missing Dependencies", listHtml(missing, true)));
  }

  return parts.join("");
}

function sectionHtml(label: string, content: string): string {
  return `
    <div class="detail-section">
      <div class="detail-label">${label}</div>
      <div class="detail-content">${content}</div>
    </div>
  `;
}

function listHtml(entries: string[], isError = false): string {
  const color = isError ? " style=\"color:#f88;\"" : "";
  return `<div${color}>${entries.map(entry => `<div>${entry}</div>`).join("")}</div>`;
}

function toRelativePath(codePath: string, nodesById: Map<string, ExplorerNodePayload>): string {
  const match = nodesById.get(codePath);
  return match ? match.codeRelativePath : codePath;
}

function normalizeNewlines(value: string): string {
  return value.replace(/\r\n?/g, "\n");
}
