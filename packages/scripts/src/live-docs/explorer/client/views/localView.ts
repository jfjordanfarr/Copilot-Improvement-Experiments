import type {
  ExplorerGraphPayload,
  ExplorerLinkKind,
  ExplorerLinkPayload,
  ExplorerNodePayload
} from "../../shared/types";
import { requireElement } from "../dom";
import type { DirectoryNode, ExplorerState } from "../types";
import {
  ROOT_KEY,
  buildHierarchy,
  computeColumnCount,
  getDirectoryKey
} from "./layoutUtils";

export interface LocalViewOptions {
  state: ExplorerState;
  graphData: ExplorerGraphPayload;
  resolveLinkEndpoint: (endpoint: ExplorerLinkPayload["source"]) => string;
  onSelectNode: (node: ExplorerNodePayload) => void;
}

export interface LocalViewApi {
  render(): void;
  drawConnections(): void;
  highlightSelection(): void;
}

export function createLocalView(options: LocalViewOptions): LocalViewApi {
  const { state, graphData, resolveLinkEndpoint, onSelectNode } = options;
  const viewport = requireElement<HTMLDivElement>("view-map");
  const container = requireElement<HTMLDivElement>("map-container");
  const overlay = requireElement<HTMLDivElement>("map-connections");

  container.classList.add("cluster-host");
  viewport.style.cursor = "grab";

  let currentSubgraph: { nodes: ExplorerNodePayload[]; links: ExplorerLinkPayload[] } | null = null;
  let mapTransform = { x: 0, y: 0, k: 1 };
  let isDragging = false;
  let lastDragPosition: { x: number; y: number; time: number } | null = null;
  let dragVelocity = { x: 0, y: 0 };
  let mapInertiaFrame = 0;
  let mapAnimationFrame = 0;
  let mapHasInitialFit = false;
  let mapUserAdjusted = false;
  let lastCenteredNodeId: string | null = null;
  let contentRoot: HTMLElement | null = null;

  viewport.addEventListener("mousedown", event => {
    if ((event.target as HTMLElement | null)?.closest?.(".node-card")) {
      return;
    }
    isDragging = true;
    mapUserAdjusted = true;
    cancelInertia();
    cancelAnimationFrame(mapAnimationFrame);
    lastDragPosition = { x: event.clientX, y: event.clientY, time: performance.now() };
    dragVelocity = { x: 0, y: 0 };
    viewport.style.cursor = "grabbing";
  });

  window.addEventListener("mousemove", event => {
    if (!isDragging || !lastDragPosition || state.view !== "map") {
      return;
    }
    event.preventDefault();
    const now = performance.now();
    const deltaX = event.clientX - lastDragPosition.x;
    const deltaY = event.clientY - lastDragPosition.y;
    mapTransform = {
      x: mapTransform.x + deltaX,
      y: mapTransform.y + deltaY,
      k: mapTransform.k
    };
    updateMapTransform();
    const elapsed = Math.max(1, now - lastDragPosition.time);
    dragVelocity = {
      x: deltaX / elapsed,
      y: deltaY / elapsed
    };
    lastDragPosition = { x: event.clientX, y: event.clientY, time: now };
  });

  window.addEventListener("mouseup", () => {
    if (!isDragging) {
      return;
    }
    isDragging = false;
    viewport.style.cursor = "grab";
    if (!lastDragPosition) {
      return;
    }
    const vx = dragVelocity.x * 16;
    const vy = dragVelocity.y * 16;
    if (Math.abs(vx) > 0.4 || Math.abs(vy) > 0.4) {
      startInertia(vx, vy);
    }
  });

  viewport.addEventListener("wheel", handleWheel, { passive: false });

  function handleWheel(event: WheelEvent): void {
    if (state.view !== "map") {
      return;
    }

    if (event.ctrlKey || event.metaKey) {
      event.preventDefault();
      mapUserAdjusted = true;
      cancelInertia();
      const viewportRect = viewport.getBoundingClientRect();
      zoomAtPoint(
        event.clientX - viewportRect.left,
        event.clientY - viewportRect.top,
        -event.deltaY * 0.0015
      );
      return;
    }

    event.preventDefault();
    mapUserAdjusted = true;
    cancelInertia();
    mapTransform = {
      x: mapTransform.x - event.deltaX,
      y: mapTransform.y - event.deltaY,
      k: mapTransform.k
    };
    updateMapTransform();
  }

  function updateMapTransform(): void {
    const matrix = `matrix(${mapTransform.k},0,0,${mapTransform.k},${mapTransform.x},${mapTransform.y})`;
    container.style.transformOrigin = "0 0";
    overlay.style.transformOrigin = "0 0";
    container.style.transform = matrix;
    overlay.style.transform = matrix;
  }

  function zoomAtPoint(offsetX: number, offsetY: number, delta: number): void {
    const scaleFactor = Math.exp(delta);
    const nextScale = clamp(mapTransform.k * scaleFactor, 0.4, 3);
    const localX = (offsetX - mapTransform.x) / mapTransform.k;
    const localY = (offsetY - mapTransform.y) / mapTransform.k;
    mapTransform = {
      x: offsetX - localX * nextScale,
      y: offsetY - localY * nextScale,
      k: nextScale
    };
    updateMapTransform();
  }

  function startInertia(initialVx: number, initialVy: number): void {
    cancelInertia();
    mapUserAdjusted = true;
    let vx = initialVx;
    let vy = initialVy;
    const friction = 0.92;
    const step = () => {
      mapTransform = {
        x: mapTransform.x + vx,
        y: mapTransform.y + vy,
        k: mapTransform.k
      };
      updateMapTransform();
      vx *= friction;
      vy *= friction;
      if (Math.abs(vx) < 0.06 && Math.abs(vy) < 0.06) {
        cancelInertia();
        return;
      }
      mapInertiaFrame = requestAnimationFrame(step);
    };
    mapInertiaFrame = requestAnimationFrame(step);
  }

  function cancelInertia(): void {
    if (mapInertiaFrame) {
      cancelAnimationFrame(mapInertiaFrame);
      mapInertiaFrame = 0;
    }
  }

  function animateMapTransform(target: { x: number; y: number; k: number }, suppressUserState = false): void {
    cancelAnimationFrame(mapAnimationFrame);
    const to = {
      x: target.x,
      y: target.y,
      k: clamp(target.k, 0.4, 3)
    };
    const from = { ...mapTransform };
    const duration = 350;
    const start = performance.now();

    const step = (now: number) => {
      const progress = clamp((now - start) / duration, 0, 1);
      const eased = easeOutCubic(progress);
      mapTransform = {
        x: from.x + (to.x - from.x) * eased,
        y: from.y + (to.y - from.y) * eased,
        k: from.k + (to.k - from.k) * eased
      };
      updateMapTransform();
      if (progress < 1) {
        mapAnimationFrame = requestAnimationFrame(step);
      } else if (!suppressUserState) {
        mapUserAdjusted = true;
      }
    };

    mapAnimationFrame = requestAnimationFrame(step);
  }

  function render(): void {
    overlay.innerHTML = "";
    container.innerHTML = "";
    currentSubgraph = null;
    contentRoot = null;

    if (!state.selectedNode) {
      container.innerHTML = '<div class="empty-hint">Select a node to view local relationships.</div>';
      mapTransform = { x: 0, y: 0, k: 1 };
      mapHasInitialFit = false;
      mapUserAdjusted = false;
      lastCenteredNodeId = null;
      updateMapTransform();
      return;
    }

    const subgraph = buildLocalSubgraph(state.selectedNode);
    currentSubgraph = subgraph;

    if (subgraph.nodes.length === 0) {
      container.innerHTML = '<div class="empty-hint">No related nodes were found.</div>';
      mapTransform = { x: 0, y: 0, k: 1 };
      mapHasInitialFit = false;
      mapUserAdjusted = false;
      updateMapTransform();
      return;
    }

    if (!mapUserAdjusted) {
      mapHasInitialFit = false;
    }

    if (state.selectedNode.id !== lastCenteredNodeId) {
      mapHasInitialFit = false;
      mapUserAdjusted = false;
      lastCenteredNodeId = state.selectedNode.id;
    }

    const hierarchy = buildHierarchy(subgraph.nodes);
    const clusterElements: HTMLElement[] = [];
    const renderDir = (dir: DirectoryNode): HTMLElement => {
      const pathKey = dir.path || ROOT_KEY;
      const element = document.createElement("div");
      element.className = "cluster local";
      element.dataset.clusterPath = pathKey;
      element.tabIndex = 0;
      element.setAttribute("role", "region");
      element.setAttribute("aria-label", `Cluster ${dir.path === ROOT_KEY ? "root" : dir.path}`);
      element.title = dir.path === ROOT_KEY ? "root" : dir.path;

      const heading = document.createElement("div");
      heading.className = "cluster-label";
      heading.textContent = dir.path === ROOT_KEY ? "(root)" : dir.name;
      element.appendChild(heading);

      const content = document.createElement("div");
      content.className = "cluster-content";

        Array.from(dir.children.values())
          .sort((a, b) => a.name.localeCompare(b.name))
          .forEach(child => {
            content.appendChild(renderDir(child));
          });

      dir.nodes
        .slice()
        .sort((a, b) => a.name.localeCompare(b.name))
        .forEach(node => {
          const card = createNodeCard(node);
          content.appendChild(card);
        });

      element.appendChild(content);
      return element;
    };

    Array.from(hierarchy.children.values())
      .sort((a, b) => a.name.localeCompare(b.name))
      .forEach(child => {
        clusterElements.push(renderDir(child));
      });

    if (hierarchy.nodes.length > 0) {
      const rootCluster = renderDir({
        name: "(root)",
        path: ROOT_KEY,
        children: new Map(),
        nodes: hierarchy.nodes
      });
      clusterElements.push(rootCluster);
    }

    const grid = document.createElement("div");
    grid.className = "cluster-grid local-grid";

    const columns = computeColumnCount(clusterElements.length, state.filters);
    const columnWidth = 320;
    const gutter = 28;
    const maxWidth = Math.max(680, Math.min(1800, columns * columnWidth + (columns - 1) * gutter));

    grid.style.setProperty("--cluster-columns", String(columns));
    grid.style.setProperty("--cluster-max-width", `${maxWidth}px`);

    clusterElements.forEach(element => {
      grid.appendChild(element);
    });

    container.appendChild(grid);
    contentRoot = grid;

    if (!mapHasInitialFit && contentRoot) {
      fitMapToContent(contentRoot);
    } else {
      updateMapTransform();
    }

    requestAnimationFrame(drawConnections);
  }

  function fitMapToContent(element: HTMLElement): void {
    cancelInertia();
    const previousContainerTransform = container.style.transform;
    const previousOverlayTransform = overlay.style.transform;
    container.style.transform = "none";
    overlay.style.transform = "none";

    const contentRect = element.getBoundingClientRect();
    const viewportRect = viewport.getBoundingClientRect();

    container.style.transform = previousContainerTransform;
    overlay.style.transform = previousOverlayTransform;

    const padding = 160;
    const width = Math.max(contentRect.width, 1);
    const height = Math.max(contentRect.height, 1);
    const availableScale = Math.min(
      (viewportRect.width - padding) / width,
      (viewportRect.height - padding) / height
    );
    const scale = clamp(availableScale, 0.5, 2);
    const centerX = contentRect.left - viewportRect.left + width / 2;
    const centerY = contentRect.top - viewportRect.top + height / 2;

    const target = {
      x: viewportRect.width / 2 - centerX * scale,
      y: viewportRect.height / 2 - centerY * scale,
      k: scale
    };

    animateMapTransform(target, true);
    mapHasInitialFit = true;
  }

  function createNodeCard(node: ExplorerNodePayload): HTMLElement {
    const card = document.createElement("div");
    card.className = "node-card";
    card.dataset.id = node.id;
    card.title = node.codeRelativePath;

    if (state.selectedNode && state.selectedNode.id === node.id) {
      card.classList.add("selected", "local-focus");
    }

    card.innerHTML = [
      `<div class="node-title">${node.name}</div>`,
      `<div class="node-path">${node.codeRelativePath}</div>`,
      createSymbolMarkup(node),
      `<div class="node-directory">${getDirectoryKey(node) === ROOT_KEY ? "(root)" : getDirectoryKey(node)}</div>`
    ].join("\n");

    card.addEventListener("click", event => {
      event.stopPropagation();
      onSelectNode(node);
    });

    card.addEventListener("dblclick", event => {
      event.stopPropagation();
      onSelectNode(node);
    });

    return card;
  }

  function createSymbolMarkup(node: ExplorerNodePayload): string {
    if (!node.publicSymbols || node.publicSymbols.length === 0) {
      return '<div class="node-meta">No public symbols</div>';
    }

    const limit = state.selectedNode && state.selectedNode.id === node.id ? node.publicSymbols.length : 4;
    const symbols = node.publicSymbols.slice(0, limit);
    const remainder = node.publicSymbols.length - symbols.length;
    const pills = symbols.map(symbol => `<span class="pill">${symbol}</span>`).join("");
    const remainderPill = remainder > 0 ? `<span class="pill ghost">+${remainder} more</span>` : "";
    return `<div class="node-meta symbols">${pills}${remainderPill}</div>`;
  }

  function buildLocalSubgraph(center: ExplorerNodePayload): { nodes: ExplorerNodePayload[]; links: ExplorerLinkPayload[] } {
    const neighbors = new Map<string, ExplorerNodePayload>();
    const linkResults: ExplorerLinkPayload[] = [];

    graphData.links.forEach(edge => {
      const sourceId = resolveLinkEndpoint(edge.source);
      const targetId = resolveLinkEndpoint(edge.target);

      if (sourceId === center.id) {
        const neighbor = getNodeById(targetId);
        if (neighbor) {
          neighbors.set(neighbor.id, neighbor);
          linkResults.push({ source: sourceId, target: targetId, kind: edge.kind });
        }
      } else if (targetId === center.id) {
        const neighbor = getNodeById(sourceId);
        if (neighbor) {
          neighbors.set(neighbor.id, neighbor);
          linkResults.push({ source: targetId, target: sourceId, kind: edge.kind });
        }
      }
    });

    return {
      nodes: [center].concat(Array.from(neighbors.values())),
      links: linkResults
    };
  }

  function getNodeById(id: string): ExplorerNodePayload | undefined {
    return graphData.nodes.find(node => node.id === id);
  }

  function drawConnections(): void {
    overlay.innerHTML = "";
    if (!state.selectedNode || !currentSubgraph) {
      return;
    }

    const nodeMap = new Map<string, HTMLElement>();
    container.querySelectorAll<HTMLElement>(".node-card").forEach(element => {
      const id = element.dataset.id;
      if (id) {
        nodeMap.set(id, element);
      }
    });

    currentSubgraph.links.forEach(edge => {
      const sourceEl = nodeMap.get(String(edge.source));
      const targetEl = nodeMap.get(String(edge.target));
      if (!sourceEl || !targetEl) {
        return;
      }
      appendConnectionLine(overlay, sourceEl, targetEl, container, edge.kind ?? "dependency");
    });
  }

  function appendConnectionLine(
    overlayElement: HTMLElement,
    sourceElement: HTMLElement,
    targetElement: HTMLElement,
    root: HTMLElement,
    kind: ExplorerLinkKind
  ): void {
    const source = getRelativePoint(sourceElement, root);
    const target = getRelativePoint(targetElement, root);

    const dx = target.x - source.x;
    const dy = target.y - source.y;
    const length = Math.sqrt(dx * dx + dy * dy);
    if (!isFinite(length) || length < 1) {
      return;
    }

    const angle = Math.atan2(dy, dx);
    const line = document.createElement("div");
    line.className = "connection-line";
    line.dataset.kind = kind;
    line.style.width = `${length}px`;
    line.style.left = `${source.x}px`;
    line.style.top = `${source.y - 1}px`;
    line.style.transform = `rotate(${angle}rad)`;
    overlayElement.appendChild(line);
  }

  function getRelativePoint(element: HTMLElement, root: HTMLElement): { x: number; y: number } {
    const elementRect = element.getBoundingClientRect();
    const rootRect = root.getBoundingClientRect();
    return {
      x: elementRect.left - rootRect.left + elementRect.width / 2,
      y: elementRect.top - rootRect.top + elementRect.height / 2
    };
  }

  function easeOutCubic(t: number): number {
    const p = t - 1;
    return p * p * p + 1;
  }

  function clamp(value: number, minimum: number, maximum: number): number {
    return Math.min(Math.max(value, minimum), maximum);
  }

  function highlightSelection(): void {
    container.querySelectorAll<HTMLElement>(".node-card").forEach(element => {
      const id = element.dataset.id;
      if (!state.selectedNode || !id) {
        element.classList.remove("selected", "local-focus");
        return;
      }
      if (id === state.selectedNode.id) {
        element.classList.add("selected", "local-focus");
      } else {
        element.classList.remove("local-focus");
        element.classList.remove("selected");
      }
    });
  }

  return {
    render,
    drawConnections,
    highlightSelection
  };
}
