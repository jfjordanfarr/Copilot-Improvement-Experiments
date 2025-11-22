import type {
  ExplorerGraphPayload,
  ExplorerLinkKind,
  ExplorerLinkPayload,
  ExplorerNodePayload
} from "../../shared/types";
import { requireElement } from "../dom";
import type { CircuitTransform, DirectoryNode, ExplorerState } from "../types";
import {
  ROOT_KEY,
  buildHierarchy,
  computeColumnCount,
  findDominantDirectory,
  getDirectoryKey
} from "./layoutUtils";

export interface CircuitViewOptions {
  state: ExplorerState;
  graphData: ExplorerGraphPayload;
  resolveLinkEndpoint: (endpoint: ExplorerLinkPayload["source"]) => string;
  onSelectNode: (node: ExplorerNodePayload) => void;
  onOpenLocalView: (node: ExplorerNodePayload) => void | Promise<void>;
}

export interface CircuitViewApi {
  render(): void;
  highlightSelection(): void;
  drawConnections(): void;
  zoomIn(): void;
  zoomOut(): void;
  resetZoom(): void;
}

export function createCircuitView(options: CircuitViewOptions): CircuitViewApi {
  const { state, graphData, resolveLinkEndpoint, onSelectNode, onOpenLocalView } = options;
  const viewport = requireElement<HTMLDivElement>("circuit-viewport");
  const circuitContainer = requireElement<HTMLDivElement>("circuit-container");
  const circuitConnections = requireElement<HTMLDivElement>("circuit-connections");

  let circuitTransform: CircuitTransform = { x: 0, y: 0, k: 1 };
  let isDragging = false;
  let lastDragPosition: { x: number; y: number; time: number } | null = null;
  let dragVelocity = { x: 0, y: 0 };
  let circuitInertiaFrame = 0;
  let circuitAnimationFrame = 0;
  let circuitHasInitialFit = false;
  let circuitUserAdjusted = false;
  let circuitInitialTransform: CircuitTransform | null = null;

  viewport.style.cursor = "grab";

  viewport.addEventListener("mousedown", event => {
    if ((event.target as HTMLElement | null)?.closest?.(".node-card")) {
      return;
    }
    isDragging = true;
    circuitUserAdjusted = true;
    cancelInertia();
    lastDragPosition = { x: event.clientX, y: event.clientY, time: performance.now() };
    dragVelocity = { x: 0, y: 0 };
    viewport.style.cursor = "grabbing";
  });

  window.addEventListener("mousemove", event => {
    if (!isDragging || !lastDragPosition) {
      return;
    }
    event.preventDefault();
    const now = performance.now();
    const deltaX = event.clientX - lastDragPosition.x;
    const deltaY = event.clientY - lastDragPosition.y;
    circuitTransform = {
      x: circuitTransform.x + deltaX,
      y: circuitTransform.y + deltaY,
      k: circuitTransform.k
    };
    updateCircuitTransform();
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
    if (Math.abs(vx) > 0.5 || Math.abs(vy) > 0.5) {
      startInertia(vx, vy);
    }
  });

  viewport.addEventListener("wheel", handleWheel, { passive: false });

  function handleWheel(event: WheelEvent): void {
    if (state.view !== "circuit") {
      return;
    }

    if (event.ctrlKey || event.metaKey) {
      event.preventDefault();
      circuitUserAdjusted = true;
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
    circuitUserAdjusted = true;
    cancelInertia();
    circuitTransform = {
      x: circuitTransform.x - event.deltaX,
      y: circuitTransform.y - event.deltaY,
      k: circuitTransform.k
    };
    updateCircuitTransform();
  }

  function zoomAtPoint(offsetX: number, offsetY: number, delta: number): void {
    const scaleFactor = Math.exp(delta);
    const nextScale = clamp(circuitTransform.k * scaleFactor, 0.1, 5);
    const localX = (offsetX - circuitTransform.x) / circuitTransform.k;
    const localY = (offsetY - circuitTransform.y) / circuitTransform.k;
    circuitTransform = {
      x: offsetX - localX * nextScale,
      y: offsetY - localY * nextScale,
      k: nextScale
    };
    updateCircuitTransform();
    circuitUserAdjusted = true;
  }

  function zoomAtViewportCenter(scaleFactor: number): void {
    const viewportRect = viewport.getBoundingClientRect();
    const centerX = viewportRect.width / 2;
    const centerY = viewportRect.height / 2;
    zoomAtPoint(centerX, centerY, Math.log(scaleFactor));
  }

  function updateCircuitTransform(): void {
    const matrix = `matrix(${circuitTransform.k},0,0,${circuitTransform.k},${circuitTransform.x},${circuitTransform.y})`;
    circuitContainer.style.transformOrigin = "0 0";
    circuitConnections.style.transformOrigin = "0 0";
    circuitContainer.style.transform = matrix;
    circuitConnections.style.transform = matrix;
  }

  function startInertia(initialVx: number, initialVy: number): void {
    cancelInertia();
    cancelAnimationFrame(circuitAnimationFrame);
    circuitUserAdjusted = true;
    let vx = initialVx;
    let vy = initialVy;
    const friction = 0.94;
    const step = () => {
      circuitTransform = {
        x: circuitTransform.x + vx,
        y: circuitTransform.y + vy,
        k: circuitTransform.k
      };
      updateCircuitTransform();
      vx *= friction;
      vy *= friction;
      if (Math.abs(vx) < 0.08 && Math.abs(vy) < 0.08) {
        cancelInertia();
        return;
      }
      circuitInertiaFrame = requestAnimationFrame(step);
    };
    circuitInertiaFrame = requestAnimationFrame(step);
  }

  function cancelInertia(): void {
    if (circuitInertiaFrame) {
      cancelAnimationFrame(circuitInertiaFrame);
      circuitInertiaFrame = 0;
    }
  }

  function animateCircuitTransform(target: Partial<CircuitTransform>, suppressUserState = false): void {
    cancelAnimationFrame(circuitAnimationFrame);
    const duration = 450;
    const to: CircuitTransform = {
      x: target.x ?? circuitTransform.x,
      y: target.y ?? circuitTransform.y,
      k: clamp(target.k ?? circuitTransform.k, 0.1, 5)
    };
    const from = { ...circuitTransform };
    if (!suppressUserState) {
      circuitUserAdjusted = true;
    }

    const start = performance.now();
    const step = (now: number) => {
      const progress = clamp((now - start) / duration, 0, 1);
      const eased = easeOutCubic(progress);
      circuitTransform = {
        x: from.x + (to.x - from.x) * eased,
        y: from.y + (to.y - from.y) * eased,
        k: from.k + (to.k - from.k) * eased
      };
      updateCircuitTransform();
      if (progress < 1) {
        circuitAnimationFrame = requestAnimationFrame(step);
      }
    };
    circuitAnimationFrame = requestAnimationFrame(step);
  }

  function focusClusterElement(element: HTMLElement | null, suppressUserState = false): void {
    if (!element || !element.isConnected) {
      return;
    }
    cancelInertia();
    if (!suppressUserState) {
      circuitUserAdjusted = true;
    }

    const currentContainerTransform = circuitContainer.style.transform;
    const currentOverlayTransform = circuitConnections.style.transform;
    circuitContainer.style.transform = "none";
    circuitConnections.style.transform = "none";

    const elementRect = element.getBoundingClientRect();
    const containerRect = circuitContainer.getBoundingClientRect();
    const viewportRect = viewport.getBoundingClientRect();

    const padding = 200;
    const width = Math.max(elementRect.width, 1);
    const height = Math.max(elementRect.height, 1);
    const scaleX = (viewportRect.width - padding) / width;
    const scaleY = (viewportRect.height - padding) / height;
    const targetScale = clamp(Math.min(scaleX, scaleY), 0.25, 3);

    const centerX = elementRect.left - containerRect.left + width / 2;
    const centerY = elementRect.top - containerRect.top + height / 2;

    circuitContainer.style.transform = currentContainerTransform;
    circuitConnections.style.transform = currentOverlayTransform;

    const targetX = viewportRect.width / 2 - centerX * targetScale;
    const targetY = viewportRect.height / 2 - centerY * targetScale;

    animateCircuitTransform({ x: targetX, y: targetY, k: targetScale }, suppressUserState);
  }

  function easeOutCubic(t: number): number {
    const p = t - 1;
    return p * p * p + 1;
  }

  function clamp(value: number, minimum: number, maximum: number): number {
    return Math.min(Math.max(value, minimum), maximum);
  }

  function shouldRenderNode(node: ExplorerNodePayload): boolean {
    const archetype = (node.archetype || "").toLowerCase();
    if (archetype === "test" && !state.filters.showTests) {
      return !!(state.selectedNode && state.selectedNode.id === node.id);
    }
    if (archetype === "asset" && !state.filters.showAssets) {
      return !!(state.selectedNode && state.selectedNode.id === node.id);
    }
    return true;
  }

  function buildHierarchy(nodes: ExplorerNodePayload[]): DirectoryNode {
    const root: DirectoryNode = { name: "", path: "__root__", children: new Map(), nodes: [] };
    nodes.forEach(node => {
      const parts = node.docRelativePath.split("/").filter(Boolean);
      if (parts.length === 0) {
        root.nodes.push(node);
        return;
      }
      const dirParts = parts.slice(0, -1);
      let current = root;
      dirParts.forEach(part => {
        if (!current.children.has(part)) {
          const segmentPath = current.path === "__root__" ? part : `${current.path}/${part}`;
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

  function render(): void {
    const nodesForCircuit = graphData.nodes.filter(shouldRenderNode);
    const hierarchy = buildHierarchy(nodesForCircuit);
    const clusterElements: HTMLElement[] = [];
    const pathToElement = new Map<string, HTMLElement>();
    const dominantCluster = findDominantDirectory(graphData, nodesForCircuit, resolveLinkEndpoint);

    const renderDir = (dir: DirectoryNode): HTMLElement => {
      const pathKey = dir.path || ROOT_KEY;
      const element = document.createElement("div");
      element.className = "cluster";
      element.dataset.clusterPath = pathKey;
      element.tabIndex = 0;
      element.setAttribute("role", "button");
      element.setAttribute("aria-label", `Cluster ${dir.path === "__root__" ? "root" : dir.path}`);
      element.title = dir.path === ROOT_KEY ? "root" : dir.path;
      pathToElement.set(pathKey, element);

      element.addEventListener("click", event => {
        if ((event.target as HTMLElement | null)?.closest?.(".node-card")) {
          return;
        }
        event.stopPropagation();
        focusClusterElement(element);
      });

      element.addEventListener("keydown", event => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          focusClusterElement(element);
        }
      });

      const heading = document.createElement("div");
      heading.className = "cluster-label";
      heading.textContent = dir.path === ROOT_KEY ? "(root)" : dir.name;
      element.appendChild(heading);

      const content = document.createElement("div");
      content.className = "cluster-content";

      dir.children.forEach(child => {
        content.appendChild(renderDir(child));
      });

      dir.nodes
        .slice()
        .sort((a, b) => a.name.localeCompare(b.name))
        .forEach(node => {
          const card = document.createElement("div");
          card.className = "node-card";
          card.dataset.id = node.id;
          if (state.selectedNode && state.selectedNode.id === node.id) {
            card.classList.add("selected");
          }
          card.innerHTML = [
            `<div class="node-title">${node.name}</div>`,
            `<div class="node-path">${node.codeRelativePath}</div>`,
            `<div class="node-meta"><span class="badge">${node.archetype}</span><span class="badge">${node.publicSymbols.length} symbols</span></div>`,
            '<div class="pin top"></div><div class="pin bottom"></div><div class="pin left"></div><div class="pin right"></div>'
          ].join("");
          card.addEventListener("click", event => {
            event.stopPropagation();
            onSelectNode(node);
          });
          card.addEventListener("dblclick", event => {
            event.stopPropagation();
            void onOpenLocalView(node);
          });
          content.appendChild(card);
        });

      element.appendChild(content);
      return element;
    };

    hierarchy.children.forEach(child => {
      clusterElements.push(renderDir(child));
    });

    if (hierarchy.nodes.length > 0) {
      clusterElements.push(
        renderDir({
          name: "(root)",
          path: ROOT_KEY,
          children: new Map(),
          nodes: hierarchy.nodes
        })
      );
    }

    if (clusterElements.length === 0) {
      circuitContainer.innerHTML = '<div style="color:#888;">No documentation nodes matched the current filters.</div>';
      circuitContainer.style.setProperty("--circuit-max-width", "800px");
      updateCircuitTransform();
      requestAnimationFrame(drawConnections);
      return;
    }

    const columns = computeColumnCount(clusterElements.length, state.filters);
    const columnWidth = 320;
    const gutter = 28;
    const computedMaxWidth = Math.max(800, Math.min(2800, columns * columnWidth + (columns - 1) * gutter));

    circuitContainer.style.setProperty("--circuit-columns", String(columns));
    circuitContainer.style.setProperty("--circuit-max-width", `${computedMaxWidth}px`);

    circuitContainer.innerHTML = "";
    clusterElements.forEach(element => {
      circuitContainer.appendChild(element);
    });

    if (!circuitHasInitialFit) {
      const viewportWidth = viewport.clientWidth;
      const availableWidth = Math.max(viewportWidth - 120, 320);
      const initialScale = Math.max(0.3, Math.min(1.1, availableWidth / computedMaxWidth));
      const offsetX = (viewportWidth - computedMaxWidth * initialScale) / 2;
      circuitTransform = { x: offsetX, y: 40, k: initialScale };
      circuitHasInitialFit = true;
      circuitInitialTransform = { ...circuitTransform };
    }

    updateCircuitTransform();
    if (!circuitUserAdjusted) {
      circuitInitialTransform = { ...circuitTransform };
    }
    requestAnimationFrame(() => {
      drawConnections();
      if (!circuitUserAdjusted && dominantCluster) {
        let primaryElement: HTMLElement | null = null;
        if (pathToElement.has(dominantCluster.path)) {
          primaryElement = pathToElement.get(dominantCluster.path) ?? null;
        } else if (state.selectedNode) {
          primaryElement = pathToElement.get(getDirectoryKey(state.selectedNode)) ?? null;
        }
        if (!primaryElement) {
          primaryElement = pathToElement.get(ROOT_KEY) ?? null;
        }
        focusClusterElement(primaryElement, true);
      }
    });
  }

  function drawConnections(): void {
    if (state.view !== "circuit") {
      return;
    }
    const overlay = requireElement<HTMLDivElement>("circuit-connections");
    overlay.innerHTML = "";

    const nodeMap = new Map<string, HTMLElement>();
    circuitContainer.querySelectorAll<HTMLElement>(".node-card").forEach(element => {
      const id = element.dataset.id;
      if (id) {
        nodeMap.set(id, element);
      }
    });

    graphData.links.forEach(edge => {
      const sourceId = resolveLinkEndpoint(edge.source);
      const targetId = resolveLinkEndpoint(edge.target);

      const sourceEl = nodeMap.get(sourceId);
      const targetEl = nodeMap.get(targetId);
      if (!sourceEl || !targetEl) {
        return;
      }

      appendConnectionLine(overlay, sourceEl, targetEl, circuitContainer, edge.kind ?? "dependency");
    });
  }

  function appendConnectionLine(
    overlay: HTMLElement,
    sourceElement: HTMLElement,
    targetElement: HTMLElement,
    root: HTMLElement,
    kind: ExplorerLinkKind
  ): void {
    const source = getRelativeCenter(sourceElement, root);
    const target = getRelativeCenter(targetElement, root);

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
    overlay.appendChild(line);
  }

  function getRelativeCenter(element: HTMLElement, root: HTMLElement): { x: number; y: number } {
    const elementRect = element.getBoundingClientRect();
    const rootRect = root.getBoundingClientRect();
    const scale = circuitTransform.k || 1;
    const relativeX = (elementRect.left - rootRect.left + elementRect.width / 2) / scale;
    const relativeY = (elementRect.top - rootRect.top + elementRect.height / 2) / scale;
    return { x: relativeX, y: relativeY };
  }

  function highlightSelection(): void {
    document.querySelectorAll<HTMLElement>(".node-card").forEach(element => {
      const id = element.dataset.id;
      if (!state.selectedNode || !id) {
        element.classList.remove("selected");
        return;
      }
      if (id === state.selectedNode.id) {
        element.classList.add("selected");
      } else {
        element.classList.remove("selected");
      }
    });
  }

  function zoomIn(): void {
    zoomAtViewportCenter(1.2);
  }

  function zoomOut(): void {
    zoomAtViewportCenter(1 / 1.2);
  }

  function resetZoom(): void {
    if (circuitInitialTransform) {
      animateCircuitTransform(circuitInitialTransform, true);
    } else {
      animateCircuitTransform({ x: 0, y: 0, k: 1 }, true);
    }
  }

  return {
    render,
    highlightSelection,
    drawConnections,
    zoomIn,
    zoomOut,
    resetZoom
  };
}
