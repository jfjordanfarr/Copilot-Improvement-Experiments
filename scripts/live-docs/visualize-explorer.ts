import { exec } from "child_process";
import * as fs from "fs/promises";
import { createServer } from "http";
import * as path from "path";

import {
    buildLiveDocGraph,
    type LiveDocGraphNode
} from "./lib/liveDocGraph";

interface ExplorerNodePayload {
    id: string;
    name: string;
    codePath: string;
    codeRelativePath: string;
    docPath: string;
    docRelativePath: string;
    archetype: string;
    dependencies: string[];
    dependents: string[];
    missingDependencies: string[];
    publicSymbols: string[];
    symbolDocumentation: LiveDocGraphNode["symbolDocumentation"];
}

interface ExplorerLinkPayload {
    source: string;
    target: string;
    kind: string;
}

interface ExplorerGraphStats {
    nodes: number;
    links: number;
    missingDependencies: number;
}

interface ExplorerGraphPayload {
    nodes: ExplorerNodePayload[];
    links: ExplorerLinkPayload[];
    stats: ExplorerGraphStats;
}

interface InheritanceLink {
    source: string;
    target: string;
    kind: "extends" | "implements";
}

type TypeResolver = (token: string) => LiveDocGraphNode | undefined;

const PORT = 3000;

async function buildExplorerGraph(workspaceRoot: string): Promise<ExplorerGraphPayload> {
    const graph = await buildLiveDocGraph({ workspaceRoot });
    const nodes = Array.from(graph.nodes.values());
    const resolveType = createTypeResolver(nodes);

    const links: ExplorerLinkPayload[] = [];
    const seenLinks = new Set<string>();
    let missingDependencyCount = 0;

    const nodePayloads: ExplorerNodePayload[] = nodes.map(node => {
        const dependencies = Array.from(node.dependencies);
        const dependents = Array.from(graph.inbound.get(node.codePath) ?? []);
        const missingDependencies = node.rawDependencies.filter(dep => !graph.nodes.has(dep));
        missingDependencyCount += missingDependencies.length;

        dependencies.forEach(target => addLink(node.codePath, target, "dependency"));

        return {
            id: node.codePath,
            name: path.basename(node.codePath),
            codePath: node.codePath,
            codeRelativePath: toRelativePath(node.codePath),
            docPath: node.docPath,
            docRelativePath: toRelativePath(node.docPath),
            archetype: node.archetype,
            dependencies,
            dependents,
            missingDependencies,
            publicSymbols: node.publicSymbols,
            symbolDocumentation: node.symbolDocumentation
        };
    });

    const inheritanceLinks = await detectInheritance(nodes, workspaceRoot, resolveType);
    inheritanceLinks.forEach(link => addLink(link.source, link.target, link.kind));

    return {
        nodes: nodePayloads,
        links,
        stats: {
            nodes: nodePayloads.length,
            links: links.length,
            missingDependencies: missingDependencyCount
        }
    };

    function addLink(source: string, target: string, kind: string) {
        if (source === target) {
            return;
        }
        if (!graph.nodes.has(source) || !graph.nodes.has(target)) {
            return;
        }
        const key = `${source}|${target}|${kind}`;
        if (seenLinks.has(key)) {
            return;
        }
        seenLinks.add(key);
        links.push({ source, target, kind });
    }

    function toRelativePath(absolutePath: string) {
        const relative = path.relative(workspaceRoot, absolutePath);
        const normalized = relative.replace(/\\/g, "/");
        return normalized || ".";
    }
}

function createTypeResolver(nodes: LiveDocGraphNode[]): TypeResolver {
    const symbolLookup = new Map<string, LiveDocGraphNode>();
    const baseLookup = new Map<string, LiveDocGraphNode[]>();

    for (const node of nodes) {
        for (const symbol of node.publicSymbols) {
            if (!symbolLookup.has(symbol)) {
                symbolLookup.set(symbol, node);
            }
        }

        const baseName = path.basename(node.codePath, path.extname(node.codePath)).toLowerCase();
        if (!baseLookup.has(baseName)) {
            baseLookup.set(baseName, []);
        }
        baseLookup.get(baseName)!.push(node);
    }

    return token => {
        const sanitized = sanitizeTypeToken(token);
        if (!sanitized) {
            return undefined;
        }

        const bySymbol = symbolLookup.get(sanitized);
        if (bySymbol) {
            return bySymbol;
        }

        const baseMatches = baseLookup.get(sanitized.toLowerCase());
        if (!baseMatches || baseMatches.length === 0) {
            return undefined;
        }

        if (baseMatches.length === 1) {
            return baseMatches[0];
        }

        return (
            baseMatches.find(candidate => {
                const base = path.basename(candidate.codePath, path.extname(candidate.codePath));
                return base === sanitized;
            }) ?? baseMatches[0]
        );
    };
}

async function detectInheritance(
    nodes: LiveDocGraphNode[],
    workspaceRoot: string,
    resolveType: TypeResolver
): Promise<InheritanceLink[]> {
    const results: InheritanceLink[] = [];
    const seen = new Set<string>();

    for (const node of nodes) {
        const absolutePath = path.isAbsolute(node.codePath)
            ? node.codePath
            : path.resolve(workspaceRoot, node.codePath);

        let content: string;
        try {
            content = await fs.readFile(absolutePath, "utf8");
        } catch {
            continue;
        }

        for (const raw of matchTypeTokens(content, /class\s+[A-Za-z0-9_]+\s+extends\s+([^\n{]+)/g)) {
            const parentToken = raw.split(/implements/i)[0];
            const reference = sanitizeTypeToken(parentToken);
            if (!reference) {
                continue;
            }
            const target = resolveType(reference);
            if (!target) {
                continue;
            }
            const key = `${node.codePath}|${target.codePath}|extends`;
            if (seen.has(key)) {
                continue;
            }
            seen.add(key);
            results.push({ source: node.codePath, target: target.codePath, kind: "extends" });
        }

        for (const raw of matchTypeTokens(content, /class\s+[A-Za-z0-9_]+\s+implements\s+([^\n{]+)/g)) {
            const segments = raw.split(",").map(segment => segment.trim()).filter(Boolean);
            for (const segment of segments) {
                const reference = sanitizeTypeToken(segment);
                if (!reference) {
                    continue;
                }
                const target = resolveType(reference);
                if (!target) {
                    continue;
                }
                const key = `${node.codePath}|${target.codePath}|implements`;
                if (seen.has(key)) {
                    continue;
                }
                seen.add(key);
                results.push({ source: node.codePath, target: target.codePath, kind: "implements" });
            }
        }

        for (const raw of matchTypeTokens(content, /interface\s+[A-Za-z0-9_]+\s+extends\s+([^\n{]+)/g)) {
            const segments = raw.split(",").map(segment => segment.trim()).filter(Boolean);
            for (const segment of segments) {
                const reference = sanitizeTypeToken(segment);
                if (!reference) {
                    continue;
                }
                const target = resolveType(reference);
                if (!target) {
                    continue;
                }
                const key = `${node.codePath}|${target.codePath}|extends`;
                if (seen.has(key)) {
                    continue;
                }
                seen.add(key);
                results.push({ source: node.codePath, target: target.codePath, kind: "extends" });
            }
        }
    }

    return results;
}

function matchTypeTokens(content: string, pattern: RegExp): string[] {
    const tokens: string[] = [];
    const regex = new RegExp(pattern.source, pattern.flags.includes("g") ? pattern.flags : `${pattern.flags}g`);
    let match: RegExpExecArray | null;
    while ((match = regex.exec(content)) !== null) {
        const candidate = match[1];
        if (candidate) {
            tokens.push(candidate);
        }
    }
    return tokens;
}

function sanitizeTypeToken(raw: string): string | undefined {
    if (!raw) {
        return undefined;
    }
    let candidate = raw.trim();
    if (!candidate) {
        return undefined;
    }
    candidate = candidate.replace(/implements.+/i, "");
    candidate = candidate.replace(/[<{(].*$/, "");
    candidate = candidate.replace(/[^A-Za-z0-9_.]/g, "");
    if (!candidate) {
        return undefined;
    }
    const segments = candidate.split(".");
    const tail = segments[segments.length - 1];
    return tail ? tail : undefined;
}

function isPathInsideWorkspace(workspaceRoot: string, candidate: string): boolean {
    const resolvedRoot = path.resolve(workspaceRoot);
    const resolvedCandidate = path.resolve(candidate);
    const relative = path.relative(resolvedRoot, resolvedCandidate);
    return relative === "" || (!relative.startsWith("..") && !path.isAbsolute(relative));
}

function normalizeDocPath(workspaceRoot: string, targetPath: string): string {
    const absolute = path.isAbsolute(targetPath)
        ? targetPath
        : path.resolve(workspaceRoot, targetPath);
    return path.normalize(absolute);
}

function renderExplorerHtml(graphData: ExplorerGraphPayload): string {
    const serializedGraph = JSON.stringify(graphData).replace(/</g, "\\u003c");

    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Live Docs Explorer</title>
  <script src="//unpkg.com/3d-force-graph"></script>
  <style>
    :root {
      --bg: #1e1e1e;
      --sidebar-bg: #252526;
      --border: #333;
      --accent: #007acc;
      --text: #ccc;
      --text-active: #fff;
      --glass: rgba(37, 37, 38, 0.95);
      --cluster-bg: rgba(255, 255, 255, 0.03);
      --cluster-border: #444;
      --node-bg: #2d2d30;
      --node-border: #555;
      --node-hover: #3e3e42;
    }
    body { margin: 0; overflow: hidden; background: var(--bg); color: var(--text); font-family: 'Segoe UI', sans-serif; display: flex; height: 100vh; }
    #sidebar { width: 260px; background: var(--sidebar-bg); border-right: 1px solid var(--border); display: flex; flex-direction: column; z-index: 100; box-shadow: 2px 0 5px rgba(0,0,0,0.2); }
    .sidebar-header { padding: 20px; font-weight: bold; font-size: 18px; color: var(--text-active); border-bottom: 1px solid var(--border); background: #111; }
    .nav-item { padding: 12px 20px; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; gap: 10px; border-left: 3px solid transparent; }
    .nav-item:hover { background: rgba(255,255,255,0.05); }
    .nav-item.active { background: rgba(0,122,204,0.1); color: var(--accent); border-left: 3px solid var(--accent); }
    #context-bar { padding: 10px 20px; font-size: 12px; color: #888; border-top: 1px solid var(--border); margin-top: auto; background: #111; display: flex; flex-direction: column; gap: 6px; }
    #context-bar span { color: var(--accent); font-weight: bold; }
    #stats-line { font-size: 11px; color: #777; }

    #main { flex: 1; position: relative; overflow: hidden; background: #1e1e1e; }
    .view-container { position: absolute; top: 0; left: 0; width: 100%; height: 100%; opacity: 0; pointer-events: none; transition: opacity 0.4s ease; overflow: hidden; }
    .view-container.active { opacity: 1; pointer-events: all; }
        .dom-layer { position: absolute; top: 0; left: 0; width: 100%; height: 100%; transform-origin: 0 0; will-change: transform; padding: 40px; box-sizing: border-box; }
        #circuit-container {
            --circuit-columns: 4;
            --circuit-max-width: 1600px;
            display: grid;
            grid-template-columns: repeat(var(--circuit-columns), minmax(320px, 1fr));
            gap: 24px;
            width: 100%;
            max-width: var(--circuit-max-width);
            height: auto;
            margin: 0 auto;
            box-sizing: border-box;
        }

        .cluster { border: 1px solid var(--cluster-border); background: var(--cluster-bg); border-radius: 8px; padding: 16px; display: flex; flex-direction: column; gap: 12px; min-width: 0; }
        .cluster-label { font-size: 12px; font-weight: bold; color: #888; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px; }
        .cluster-content { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px; align-items: start; }
        .cluster-content > .cluster { grid-column: 1 / -1; }

    .node-card { width: 200px; background: var(--node-bg); border: 1px solid var(--node-border); border-radius: 6px; padding: 12px; position: relative; cursor: pointer; box-shadow: 0 2px 5px rgba(0,0,0,0.2); flex-shrink: 0; }
    .node-card:hover { background: var(--node-hover); border-color: #777; }
    .node-card.selected { border-color: var(--accent); box-shadow: 0 0 0 2px rgba(0,122,204,0.3); }
    .node-title { font-weight: bold; font-size: 13px; color: #eee; margin-bottom: 6px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .node-path { font-size: 10px; color: #666; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .node-meta { margin-top: 8px; font-size: 10px; color: #999; display: flex; gap: 6px; flex-wrap: wrap; }
    .badge { display: inline-block; padding: 2px 6px; border-radius: 4px; background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.1); }

    .pin { position: absolute; width: 8px; height: 8px; background: #555; border-radius: 50%; }
    .pin.top { top: -4px; left: 50%; transform: translateX(-50%); }
    .pin.bottom { bottom: -4px; left: 50%; transform: translateX(-50%); }
    .pin.left { left: -4px; top: 50%; transform: translateY(-50%); }
    .pin.right { right: -4px; top: 50%; transform: translateY(-50%); }

    #detail-panel { width: 360px; background: var(--glass); backdrop-filter: blur(10px); border-left: 1px solid var(--border); display: flex; flex-direction: column; transform: translateX(100%); transition: transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1); position: absolute; right: 0; top: 0; bottom: 0; z-index: 200; box-shadow: -5px 0 20px rgba(0,0,0,0.5); }
    #detail-panel.visible { transform: translateX(0); }
    .detail-header { padding: 20px; border-bottom: 1px solid var(--border); background: rgba(0,0,0,0.2); }
    .detail-scroll { flex: 1; overflow-y: auto; padding: 20px; }
    .detail-footer { padding: 20px; border-top: 1px solid var(--border); background: rgba(0,0,0,0.2); }
    .detail-section { margin-bottom: 20px; }
    .detail-label { font-size: 11px; text-transform: uppercase; color: #888; margin-bottom: 6px; letter-spacing: 1px; }
    .detail-content { font-size: 13px; line-height: 1.5; color: #eee; }
    .pill { display: inline-block; padding: 2px 8px; border-radius: 4px; background: #333; font-size: 12px; margin-right: 6px; margin-bottom: 6px; }
    .pill.accent { background: var(--accent); color: #fff; }

    #controls { position: absolute; bottom: 20px; left: 20px; display: flex; gap: 10px; z-index: 100; }
    .control-btn { width: 36px; height: 36px; border-radius: 50%; background: var(--sidebar-bg); border: 1px solid var(--border); color: var(--text); cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 18px; box-shadow: 0 2px 5px rgba(0,0,0,0.3); transition: all 0.2s; }
    .control-btn:hover { background: #333; color: white; transform: translateY(-2px); }

    button.action-btn { width: 100%; padding: 10px; background: var(--accent); color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: bold; }
    button.action-btn:hover { background: #0062a3; }
    svg.connections-layer { position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; }
  </style>
</head>
<body>
  <div id="sidebar">
    <div class="sidebar-header">Live Docs Explorer</div>
    <div class="nav-item active" data-view="circuit" onclick="switchView(event, 'circuit')"><span>Circuit Board</span></div>
    <div class="nav-item" data-view="map" onclick="switchView(event, 'map')"><span>Local Map</span></div>
    <div class="nav-item" data-view="graph" onclick="switchView(event, 'graph')"><span>Force Graph</span></div>
    <div id="context-bar">
        <div id="stats-line">Loading...</div>
        <div>Context: <span id="context-name">None</span></div>
    </div>
  </div>

  <div id="main">
    <div id="view-circuit" class="view-container active">
        <div id="circuit-viewport" style="width:100%;height:100%;overflow:hidden;cursor:grab;">
            <div id="circuit-container" class="dom-layer"></div>
            <svg id="circuit-connections" class="connections-layer"></svg>
        </div>
    </div>

    <div id="view-map" class="view-container">
        <div id="map-container" class="dom-layer" style="width: 100%; height: 100%;"></div>
        <svg id="map-connections" class="connections-layer"></svg>
    </div>

    <div id="view-graph" class="view-container">
        <div id="graph-svg" style="width: 100%; height: 100%;"></div>
    </div>

    <div id="controls">
        <button class="control-btn" onclick="zoomIn()">+</button>
        <button class="control-btn" onclick="zoomOut()">-</button>
        <button class="control-btn" onclick="resetZoom()">⟲</button>
    </div>

    <div id="detail-panel">
        <div class="detail-header">
            <h2 id="detail-title" style="margin: 0; font-size: 18px;">Select a Node</h2>
        </div>
        <div id="detail-body" class="detail-scroll">
            <p style="color: #888;">Click on any node to view details.</p>
        </div>
        <div class="detail-footer">
            <button class="action-btn" onclick="openInEditor()">Open in Editor</button>
        </div>
    </div>
  </div>

  <script>
    function reportFatalExplorerError(error) {
      try {
        console.error("Live Docs Explorer fatal error", error);
      } catch (consoleError) {
        /* ignore */
      }

      const statsLine = document.getElementById("stats-line");
      if (statsLine) {
        const message = error && error.message ? error.message : String(error ?? "Unknown error");
        statsLine.textContent = "Error: " + message;
      }

      const detailBody = document.getElementById("detail-body");
      if (detailBody) {
        const stack = error && error.stack ? error.stack : String(error ?? "Unknown error");
        const escaped = stack.replace(/[&<>]/g, function (character) {
          switch (character) {
            case "&":
              return "&amp;";
            case "<":
              return "&lt;";
            case ">":
              return "&gt;";
            default:
              return character;
          }
        });
        detailBody.innerHTML = '<pre style="white-space:pre-wrap;color:#f88;">' + escaped + "</pre>";
      }

      window.__liveDocsExplorerError = error;
    }

    window.addEventListener("error", function (event) {
      if (window.__liveDocsExplorerError) {
        return;
      }
      const error = event.error || event.message || event;
      reportFatalExplorerError(error);
    });

    (function startExplorer() {
      console.log("Live Docs Explorer Script Starting...");

      try {
        const graphData = ${serializedGraph};
        console.log("Graph Data Loaded:", graphData);

        const state = { view: "circuit", selectedNode: null };
        const nodesById = new Map(graphData.nodes.map(function (node) { return [node.id, node]; }));
        let circuitTransform = { x: 0, y: 0, k: 1 };
        let isDragging = false;
        let dragStartX = 0;
        let dragStartY = 0;
        let forceGraphInstance = null;
        let circuitHasInitialFit = false;

        const viewport = document.getElementById("circuit-viewport");
        const circuitContainer = document.getElementById("circuit-container");
        const circuitConnections = document.getElementById("circuit-connections");
        const statsLine = document.getElementById("stats-line");
        if (statsLine) {
          statsLine.textContent = graphData.stats.nodes + " nodes, " + graphData.stats.links + " links, " + graphData.stats.missingDependencies + " missing dependencies";
        }

        viewport.addEventListener("mousedown", function (event) {
            if (event.target.closest(".node-card")) {
                return;
            }
            isDragging = true;
            dragStartX = event.clientX - circuitTransform.x;
            dragStartY = event.clientY - circuitTransform.y;
            viewport.style.cursor = "grabbing";
        });

        window.addEventListener("mousemove", function (event) {
            if (!isDragging) {
                return;
            }
            event.preventDefault();
            circuitTransform.x = event.clientX - dragStartX;
            circuitTransform.y = event.clientY - dragStartY;
            updateCircuitTransform();
        });

        window.addEventListener("mouseup", function () {
            if (!isDragging) {
                return;
            }
            isDragging = false;
            viewport.style.cursor = "grab";
        });

        viewport.addEventListener("wheel", function (event) {
            event.preventDefault();
            const scaleAmount = -event.deltaY * 0.001;
            const next = circuitTransform.k * (1 + scaleAmount);
            circuitTransform.k = Math.min(Math.max(0.1, next), 5);
            updateCircuitTransform();
        });

        function updateCircuitTransform() {
            const transform = "translate(" + circuitTransform.x + "px, " + circuitTransform.y + "px) scale(" + circuitTransform.k + ")";
            circuitContainer.style.transform = transform;
            circuitConnections.style.transform = transform;
            circuitConnections.style.transformOrigin = "0 0";
        }

        window.switchView = function (event, viewName) {
            event.preventDefault();
            document.querySelectorAll(".nav-item").forEach(function (el) { el.classList.remove("active"); });
            event.currentTarget.classList.add("active");
            document.querySelectorAll(".view-container").forEach(function (el) { el.classList.remove("active"); });
            document.getElementById("view-" + viewName).classList.add("active");
            state.view = viewName;
            renderCurrentView();
        };

        function renderCurrentView() {
            if (!graphData.nodes || graphData.nodes.length === 0) {
                return;
            }
            if (state.view === "circuit") {
                renderCircuit();
            } else if (state.view === "map") {
                renderMap();
            } else if (state.view === "graph") {
                renderGraph();
            }
        }

        function buildHierarchy(nodes) {
            const root = { children: new Map(), nodes: [] };
            nodes.forEach(function (node) {
                const parts = node.docRelativePath.split("/").filter(Boolean);
                if (parts.length === 0) {
                    root.nodes.push(node);
                    return;
                }
                const dirParts = parts.slice(0, -1);
                let current = root;
                dirParts.forEach(function (part) {
                    if (!current.children.has(part)) {
                        current.children.set(part, { children: new Map(), nodes: [] });
                    }
                    current = current.children.get(part);
                });
                current.nodes.push(node);
            });
            return root;
        }

        function renderCircuit() {
            const hierarchy = buildHierarchy(graphData.nodes);
            const clusterElements = [];

            function renderDir(label, dir) {
                const element = document.createElement("div");
                element.className = "cluster";

                const heading = document.createElement("div");
                heading.className = "cluster-label";
                heading.textContent = label;
                element.appendChild(heading);

                const content = document.createElement("div");
                content.className = "cluster-content";

                dir.children.forEach(function (child, childLabel) {
                    content.appendChild(renderDir(childLabel, child));
                });

                dir.nodes
                    .slice()
                    .sort(function (a, b) { return a.name.localeCompare(b.name); })
                    .forEach(function (node) {
                        const card = document.createElement("div");
                        card.className = "node-card";
                        card.dataset.id = node.id;
                        if (state.selectedNode && state.selectedNode.id === node.id) {
                            card.classList.add("selected");
                        }
                        card.innerHTML =
                            '<div class="node-title">' + node.name + '</div>' +
                            '<div class="node-path">' + node.codeRelativePath + '</div>' +
                            '<div class="node-meta"><span class="badge">' + node.archetype + '</span><span class="badge">' + node.publicSymbols.length + ' symbols</span></div>' +
                            '<div class="pin top"></div><div class="pin bottom"></div><div class="pin left"></div><div class="pin right"></div>';
                        card.addEventListener("click", function (event) {
                            event.stopPropagation();
                            selectNode(node);
                        });
                        content.appendChild(card);
                    });

                element.appendChild(content);
                return element;
            }

            hierarchy.children.forEach(function (child, label) {
                clusterElements.push(renderDir(label, child));
            });

            if (hierarchy.nodes.length > 0) {
                clusterElements.push(renderDir("(root)", { children: new Map(), nodes: hierarchy.nodes }));
            }

            if (clusterElements.length === 0) {
                circuitContainer.innerHTML = '<div style="color:#888;">No documentation nodes detected.</div>';
                circuitContainer.style.setProperty("--circuit-max-width", "800px");
                updateCircuitTransform();
                requestAnimationFrame(drawConnections);
                return;
            }

            const columnEstimate = Math.round(Math.sqrt(clusterElements.length));
            const columns = Math.max(1, Math.min(6, columnEstimate || 1));
            const columnWidth = 360;
            const gutter = 24;
            const computedMaxWidth = Math.max(720, Math.min(1920, columns * columnWidth + (columns - 1) * gutter));

            circuitContainer.style.setProperty("--circuit-columns", String(columns));
            circuitContainer.style.setProperty("--circuit-max-width", computedMaxWidth + "px");

            circuitContainer.innerHTML = "";
            clusterElements.forEach(function (element) {
                circuitContainer.appendChild(element);
            });

            if (!circuitHasInitialFit) {
                const viewportWidth = viewport.clientWidth;
                const availableWidth = Math.max(viewportWidth - 120, 320);
                const initialScale = Math.max(0.25, Math.min(1, availableWidth / computedMaxWidth));
                const offsetX = (viewportWidth - computedMaxWidth * initialScale) / 2;
                circuitTransform = { x: offsetX, y: 40, k: initialScale };
                circuitHasInitialFit = true;
            }

            updateCircuitTransform();
            requestAnimationFrame(drawConnections);
        }

        function renderMap() {
            const container = document.getElementById("map-container");
            container.innerHTML = "";
            const svg = document.getElementById("map-connections");
            svg.innerHTML = "";

            if (!state.selectedNode) {
                container.innerHTML = '<div style="display:flex;justify-content:center;align-items:center;height:100%;color:#888;">Select a node to view map</div>';
                return;
            }

            const centerNode = state.selectedNode;
            const neighbors = new Set();
            const links = [];

            graphData.links.forEach(function (edge) {
                const sourceId = typeof edge.source === "object" ? edge.source.id : edge.source;
                const targetId = typeof edge.target === "object" ? edge.target.id : edge.target;
                if (sourceId === centerNode.id) {
                    neighbors.add(targetId);
                    links.push({ source: sourceId, target: targetId, kind: edge.kind });
                } else if (targetId === centerNode.id) {
                    neighbors.add(sourceId);
                    links.push({ source: targetId, target: sourceId, kind: edge.kind });
                }
            });

            const nodesToRender = [centerNode].concat(graphData.nodes.filter(function (node) { return neighbors.has(node.id); }));

            const width = window.innerWidth;
            const height = window.innerHeight;
            const radius = Math.min(width, height) * 0.25;

            nodesToRender.forEach(function (node, index) {
                const card = document.createElement("div");
                card.className = "node-card";
                card.dataset.id = node.id;
                card.style.position = "absolute";
                card.style.width = "180px";
                if (node.id === centerNode.id) {
                    card.style.left = (width / 2 - 90) + "px";
                    card.style.top = (height / 2 - 60) + "px";
                    card.style.border = "2px solid var(--accent)";
                    card.style.zIndex = "10";
                } else {
                    const angle = (index / nodesToRender.length) * Math.PI * 2;
                    const x = width / 2 + radius * Math.cos(angle) - 90;
                    const y = height / 2 + radius * Math.sin(angle) - 60;
                    card.style.left = x + "px";
                    card.style.top = y + "px";
                }

                card.innerHTML =
                    '<div class="node-title">' + node.name + '</div>' +
                    '<div class="node-path">' + node.codeRelativePath + '</div>' +
                    '<div class="node-meta"><span class="badge">' + node.archetype + '</span></div>';
                card.addEventListener("click", function () { selectNode(node); });
                container.appendChild(card);
            });

            links.forEach(function (edge) {
                const sourceEl = document.querySelector('#map-container .node-card[data-id="' + edge.source + '"]');
                const targetEl = document.querySelector('#map-container .node-card[data-id="' + edge.target + '"]');
                if (!sourceEl || !targetEl) {
                    return;
                }
                const sourceRect = sourceEl.getBoundingClientRect();
                const targetRect = targetEl.getBoundingClientRect();
                const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
                line.setAttribute("x1", String(sourceRect.left + sourceRect.width / 2));
                line.setAttribute("y1", String(sourceRect.top + sourceRect.height / 2));
                line.setAttribute("x2", String(targetRect.left + targetRect.width / 2));
                line.setAttribute("y2", String(targetRect.top + targetRect.height / 2));
                line.setAttribute("stroke", "#555");
                line.setAttribute("stroke-width", "1");
                svg.appendChild(line);
            });
        }

        function drawConnections() {
            if (state.view !== "circuit") {
                return;
            }
            const svg = document.getElementById("circuit-connections");
            svg.innerHTML = "";

            const nodeMap = new Map();
            document.querySelectorAll("#circuit-container .node-card").forEach(function (element) {
                const id = element.dataset.id;
                if (id) {
                    nodeMap.set(id, element);
                }
            });

            graphData.links.forEach(function (edge) {
                const sourceId = typeof edge.source === "object" ? edge.source.id : edge.source;
                const targetId = typeof edge.target === "object" ? edge.target.id : edge.target;

                const sourceEl = nodeMap.get(sourceId);
                const targetEl = nodeMap.get(targetId);
                if (!sourceEl || !targetEl) {
                    return;
                }

                const sourceRect = sourceEl.getBoundingClientRect();
                const targetRect = targetEl.getBoundingClientRect();
                const x1 = sourceRect.left + sourceRect.width / 2;
                const y1 = sourceRect.top + sourceRect.height / 2;
                const x2 = targetRect.left + targetRect.width / 2;
                const y2 = targetRect.top + targetRect.height / 2;
                const midX = (x1 + x2) / 2;

                const pathElement = document.createElementNS("http://www.w3.org/2000/svg", "path");
                pathElement.setAttribute("d", "M " + x1 + " " + y1 + " L " + midX + " " + y1 + " L " + midX + " " + y2 + " L " + x2 + " " + y2);
                pathElement.setAttribute("stroke", "#555");
                pathElement.setAttribute("stroke-width", "2");
                pathElement.setAttribute("fill", "none");
                svg.appendChild(pathElement);
            });
        }

        function renderGraph() {
            const container = document.getElementById("graph-svg");
            const dataForGraph = {
                nodes: graphData.nodes.map(function (node) { return Object.assign({}, node); }),
                links: graphData.links.map(function (link) { return Object.assign({}, link); })
            };
            if (forceGraphInstance) {
                forceGraphInstance.graphData(dataForGraph);
                return;
            }
            if (typeof ForceGraph3D !== "function") {
                container.innerHTML = '<div style="padding:20px;color:#f88;">ForceGraph3D failed to load.</div>';
                return;
            }

            forceGraphInstance = ForceGraph3D()(container)
                .graphData(dataForGraph)
                .nodeLabel("name")
                .nodeColor(function (node) {
                    switch (node.archetype) {
                        case "implementation":
                            return "#007acc";
                        case "test":
                            return "#28a745";
                        case "interface":
                            return "#ffc107";
                        case "config":
                            return "#6c757d";
                        case "script":
                            return "#17a2b8";
                        default:
                            return "#888";
                    }
                })
                .onNodeClick(function (node) {
                    const original = nodesById.get(node.id);
                    if (!original) {
                        return;
                    }
                    state.view = "map";
                    document.querySelectorAll(".nav-item").forEach(function (el) { el.classList.remove("active"); });
                    const mapNav = document.querySelector('.nav-item[data-view="map"]');
                    if (mapNav) {
                        mapNav.classList.add("active");
                    }
                    document.querySelectorAll(".view-container").forEach(function (el) { el.classList.remove("active"); });
                    document.getElementById("view-map").classList.add("active");
                    selectNode(original);
                });
        }

        async function selectNode(node) {
            state.selectedNode = node;
            document.getElementById("context-name").textContent = node.codeRelativePath;
            renderCurrentView();
            highlightSelectedCards();

            const panel = document.getElementById("detail-panel");
            panel.classList.add("visible");
            const title = document.getElementById("detail-title");
            const body = document.getElementById("detail-body");

            title.textContent = node.name;
            body.innerHTML = '<p style="color:#888;">Loading details...</p>';

            try {
                const response = await fetch("/details?docPath=" + encodeURIComponent(node.docPath));
                if (!response.ok) {
                    throw new Error("Failed to load details");
                }
                const details = await response.json();

                const dependencies = node.dependencies.map(toRelativePath).sort();
                const dependents = node.dependents.map(toRelativePath).sort();
                const missing = details.missingDependencies || [];

                let html = "";
                html += '<div class="detail-section"><div class="detail-label">Archetype</div><div class="detail-content"><span class="pill accent">' + node.archetype + '</span></div></div>';
                html += '<div class="detail-section"><div class="detail-label">Code Path</div><div class="detail-content" style="font-family: monospace; font-size: 12px;">' + node.codeRelativePath + '</div></div>';
                html += '<div class="detail-section"><div class="detail-label">Document Path</div><div class="detail-content" style="font-family: monospace; font-size: 12px;">' + node.docRelativePath + '</div></div>';

                if (details.purpose) {
                    const lineFeed = String.fromCharCode(10);
                    const carriageReturn = String.fromCharCode(13);
                    const normalizedPurpose = details.purpose
                        .split(carriageReturn + lineFeed).join(lineFeed)
                        .split(carriageReturn).join(lineFeed);
                    const purposeHtml = normalizedPurpose.split(lineFeed).join("<br>");
                    html += '<div class="detail-section"><div class="detail-label">Purpose</div><div class="detail-content">' + purposeHtml + '</div></div>';
                }

                if (node.publicSymbols.length > 0) {
                    html += '<div class="detail-section"><div class="detail-label">Public Symbols</div><div class="detail-content">';
                    node.publicSymbols.forEach(function (symbol) {
                        html += '<span class="pill">' + symbol + '</span>';
                    });
                    html += '</div></div>';
                }

                if (dependencies.length > 0) {
                    html += '<div class="detail-section"><div class="detail-label">Dependencies</div><div class="detail-content">';
                    dependencies.forEach(function (dep) {
                        html += '<div>' + dep + '</div>';
                    });
                    html += '</div></div>';
                }

                if (dependents.length > 0) {
                    html += '<div class="detail-section"><div class="detail-label">Dependents</div><div class="detail-content">';
                    dependents.forEach(function (dep) {
                        html += '<div>' + dep + '</div>';
                    });
                    html += '</div></div>';
                }

                if (missing.length > 0) {
                    html += '<div class="detail-section"><div class="detail-label">Missing Dependencies</div><div class="detail-content" style="color:#f88;">';
                    missing.forEach(function (dep) {
                        html += '<div>' + dep + '</div>';
                    });
                    html += '</div></div>';
                }

                body.innerHTML = html;
            } catch (error) {
                console.error(error);
                body.innerHTML = '<p style="color: #f88;">Failed to load details for this node.</p>';
            }
        }

        function highlightSelectedCards() {
            document.querySelectorAll(".node-card").forEach(function (el) {
                if (!state.selectedNode) {
                    el.classList.remove("selected");
                    return;
                }
                if (el.dataset.id === state.selectedNode.id) {
                    el.classList.add("selected");
                } else {
                    el.classList.remove("selected");
                }
            });
        }

        function toRelativePath(codePath) {
            const match = nodesById.get(codePath);
            return match ? match.codeRelativePath : codePath;
        }

        window.openInEditor = function () {
            if (!state.selectedNode) {
                return;
            }
            fetch("/open?codePath=" + encodeURIComponent(state.selectedNode.codePath));
        };

        window.zoomIn = function () {
            if (state.view !== "circuit") {
                return;
            }
            circuitTransform.k = Math.min(circuitTransform.k * 1.2, 5);
            updateCircuitTransform();
        };

        window.zoomOut = function () {
            if (state.view !== "circuit") {
                return;
            }
            circuitTransform.k = Math.max(circuitTransform.k / 1.2, 0.1);
            updateCircuitTransform();
        };

        window.resetZoom = function () {
            if (state.view !== "circuit") {
                return;
            }
            circuitTransform = { x: 0, y: 0, k: 1 };
            updateCircuitTransform();
        };

        renderCurrentView();
        window.addEventListener("resize", function () {
            if (state.view === "circuit") {
                drawConnections();
            } else if (state.view === "map") {
                renderMap();
            }
        });
      } catch (error) {
        reportFatalExplorerError(error);
      }
    })();
  </script>
</body>
</html>
`;
}

async function main() {
    const workspaceRoot = process.cwd();
    console.log("Building Live Documentation Explorer graph...");
    const graphData = await buildExplorerGraph(workspaceRoot);
    console.log(
        `Explorer graph ready: ${graphData.stats.nodes} nodes, ${graphData.stats.links} links, ${graphData.stats.missingDependencies} missing dependencies.`
    );

    const html = renderExplorerHtml(graphData);
    const nodesByDocPath = new Map(
        graphData.nodes.map(node => [normalizeDocPath(workspaceRoot, node.docPath), node] as const)
    );

    const server = createServer(async (req, res) => {
        try {
            const url = new URL(req.url ?? "/", `http://localhost:${PORT}`);

            if (url.pathname === "/open") {
                const codePathParam = url.searchParams.get("codePath");
                if (!codePathParam) {
                    res.writeHead(400, { "Content-Type": "text/plain" });
                    res.end("Missing codePath");
                    return;
                }

                const absoluteCodePath = path.resolve(codePathParam);
                if (!isPathInsideWorkspace(workspaceRoot, absoluteCodePath)) {
                    res.writeHead(400, { "Content-Type": "text/plain" });
                    res.end("Invalid codePath");
                    return;
                }

                console.log(`Opening file: ${absoluteCodePath}`);
                const quoted = `"${absoluteCodePath.replace(/"/g, '\\"')}"`;
                const command = process.platform === "win32" ? `code ${quoted}` : `code ${quoted}`;
                exec(command);
                res.writeHead(200, { "Content-Type": "text/plain" });
                res.end("OK");
                return;
            }

            if (url.pathname === "/details") {
                const docPathParam = url.searchParams.get("docPath");
                if (!docPathParam) {
                    res.writeHead(400, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({ error: "Missing docPath" }));
                    return;
                }

                const absoluteDocPath = path.resolve(workspaceRoot, docPathParam);
                if (!isPathInsideWorkspace(workspaceRoot, absoluteDocPath)) {
                    res.writeHead(400, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({ error: "Invalid docPath" }));
                    return;
                }

                const lookupKey = normalizeDocPath(workspaceRoot, absoluteDocPath);
                const node = nodesByDocPath.get(lookupKey);
                if (!node) {
                    res.writeHead(404, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({ error: "Node not found" }));
                    return;
                }

                try {
                    const content = await fs.readFile(absoluteDocPath, "utf8");
                    const purposeMatch = content.match(/##\s+Purpose\s+([\s\S]*?)(?=##|$)/);
                    const purpose = purposeMatch ? purposeMatch[1].trim() : "No purpose defined.";

                    res.writeHead(200, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({
                        archetype: node.archetype,
                        purpose,
                        publicSymbols: node.publicSymbols,
                        dependencies: node.dependencies,
                        dependents: node.dependents,
                        missingDependencies: node.missingDependencies,
                        docRelativePath: node.docRelativePath,
                        codeRelativePath: node.codeRelativePath,
                        symbolDocumentation: node.symbolDocumentation
                    }));
                } catch (error) {
                    console.error("Failed to read doc", error);
                    res.writeHead(500, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({ error: "Failed to read doc" }));
                }
                return;
            }

            res.writeHead(200, { "Content-Type": "text/html" });
            res.end(html);
        } catch (error) {
            console.error("Failed to handle request", error);
            res.writeHead(500, { "Content-Type": "text/plain" });
            res.end("Internal server error");
        }
    });

    server.listen(PORT, () => {
        console.log(`Explorer running at http://localhost:${PORT}`);
        const startCommand = process.platform === "win32" ? "start" : "open";
        exec(`${startCommand} http://localhost:${PORT}`);
    });
}

main().catch(error => {
    console.error("Explorer failed to start", error);
    process.exitCode = 1;
});
