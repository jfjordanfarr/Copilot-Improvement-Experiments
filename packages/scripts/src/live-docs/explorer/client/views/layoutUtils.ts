import type {
  ExplorerGraphPayload,
  ExplorerLinkPayload,
  ExplorerNodePayload
} from "../../shared/types";
import type { DirectoryNode, ExplorerFilters } from "../types";

const ROOT_KEY = "__root__";

export function buildHierarchy(nodes: ExplorerNodePayload[]): DirectoryNode {
  const root: DirectoryNode = { name: "", path: ROOT_KEY, children: new Map(), nodes: [] };
  nodes.forEach(node => {
    const parts = (node.docRelativePath || "").split("/").filter(Boolean);
    if (parts.length === 0) {
      root.nodes.push(node);
      return;
    }
    const dirParts = parts.slice(0, -1);
    let current = root;
    dirParts.forEach(part => {
      if (!current.children.has(part)) {
        const segmentPath = current.path === ROOT_KEY ? part : `${current.path}/${part}`;
        current.children.set(part, {
          name: part,
          path: segmentPath,
          children: new Map(),
          nodes: []
        });
      }
      current = current.children.get(part)!;
    });
    current.nodes.push(node);
  });
  return root;
}

export function getDirectoryKey(node: ExplorerNodePayload): string {
  const parts = (node.docRelativePath || "").split("/").filter(Boolean);
  if (parts.length <= 1) {
    return ROOT_KEY;
  }
  return parts.slice(0, -1).join("/");
}

export function computeColumnCount(clusterCount: number, filters: ExplorerFilters): number {
  if (clusterCount <= 1) {
    return 1;
  }
  const visibilityBias = filters.showTests && filters.showAssets ? 2 : filters.showTests || filters.showAssets ? 1 : 0;
  const scaled = Math.sqrt(Math.max(clusterCount, 1)) * 1.35 + visibilityBias;
  return Math.max(2, Math.min(12, Math.round(scaled)));
}

export function findDominantDirectory(
  graphData: ExplorerGraphPayload,
  nodes: ExplorerNodePayload[],
  resolveLinkEndpoint: (endpoint: ExplorerLinkPayload["source"]) => string
): { path: string; score: number; count: number } | null {
  if (!nodes || nodes.length === 0) {
    return null;
  }
  const included = new Set(nodes.map(node => node.id));
  const degreeMap = new Map<string, number>();
  graphData.links.forEach(link => {
    const sourceId = resolveLinkEndpoint(link.source);
    const targetId = resolveLinkEndpoint(link.target);
    if (included.has(sourceId)) {
      degreeMap.set(sourceId, (degreeMap.get(sourceId) ?? 0) + 1);
    }
    if (included.has(targetId)) {
      degreeMap.set(targetId, (degreeMap.get(targetId) ?? 0) + 1);
    }
  });

  const directoryScores = new Map<string, { score: number; count: number }>();
  nodes.forEach(node => {
    const key = getDirectoryKey(node);
    if (!directoryScores.has(key)) {
      directoryScores.set(key, { score: 0, count: 0 });
    }
    const entry = directoryScores.get(key)!;
    entry.score += degreeMap.get(node.id) ?? 0;
    entry.count += 1;
  });

  let best: { path: string; score: number; count: number } | null = null;
  directoryScores.forEach((value, key) => {
    if (!best || value.score > best.score || (value.score === best.score && value.count > best.count)) {
      best = { path: key, score: value.score, count: value.count };
    }
  });

  return best;
}

export { ROOT_KEY };
