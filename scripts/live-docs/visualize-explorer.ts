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
    --bg: #18181a;
    --sidebar-bg: #1f1f22;
    --border: #2f2f34;
    --accent: #0091ff;
    --text: #e4e4e4;
    --text-active: #ffffff;
    --glass: rgba(34, 34, 37, 0.95);
    --cluster-bg: rgba(0, 145, 255, 0.06);
    --cluster-border: rgba(0, 145, 255, 0.12);
    --node-bg: #232326;
    --node-border: #3f3f46;
    --node-hover: #2f2f33;
    --connection-stroke: rgba(0, 189, 255, 0.45);
    }
    body { margin: 0; overflow: hidden; background: var(--bg); color: var(--text); font-family: 'Segoe UI', sans-serif; display: flex; height: 100vh; }
    #sidebar { width: 260px; background: var(--sidebar-bg); border-right: 1px solid var(--border); display: flex; flex-direction: column; z-index: 100; box-shadow: 2px 0 5px rgba(0,0,0,0.2); }
    .sidebar-header { padding: 20px; font-weight: bold; font-size: 18px; color: var(--text-active); border-bottom: 1px solid var(--border); background: #111; }
    .nav-item { padding: 12px 20px; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; gap: 10px; border-left: 3px solid transparent; font-size: 14px; color: var(--text); }
    .nav-item:hover { background: rgba(0,145,255,0.12); color: var(--text-active); }
    .nav-item.active { background: rgba(0,145,255,0.18); color: var(--accent); border-left: 3px solid var(--accent); }
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

        .view-toolbar { position: absolute; top: 20px; right: 20px; display: flex; gap: 14px; align-items: center; z-index: 160; padding: 12px 16px; background: var(--glass); border: 1px solid var(--border); border-radius: 999px; box-shadow: 0 10px 30px rgba(0,0,0,0.35); backdrop-filter: blur(14px); }
        .filter-toggle { display: inline-flex; align-items: center; gap: 6px; font-size: 12px; color: var(--text); cursor: pointer; user-select: none; padding: 6px 10px; border-radius: 999px; transition: background 0.2s ease, color 0.2s ease; }
        .filter-toggle input { appearance: none; width: 16px; height: 16px; border-radius: 4px; border: 1px solid var(--border); background: rgba(255,255,255,0.05); position: relative; }
        .filter-toggle input:checked { background: var(--accent); border-color: var(--accent); }
        .filter-toggle input:checked::after { content: ""; position: absolute; inset: 4px; background: white; border-radius: 2px; }
        .filter-toggle:hover { background: rgba(0,145,255,0.12); color: var(--text-active); }

        .cluster { border: 1px solid var(--cluster-border); background: var(--cluster-bg); border-radius: 8px; padding: 16px; display: flex; flex-direction: column; gap: 12px; min-width: 0; transition: border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease; position: relative; cursor: zoom-in; }
        .cluster-label { font-size: 12px; font-weight: bold; color: #888; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px; }
        .cluster-content { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px; align-items: start; }
        .cluster-content > .cluster { grid-column: 1 / -1; }

        .cluster:hover { border-color: rgba(0,145,255,0.6); box-shadow: 0 12px 30px rgba(0,145,255,0.18); background: rgba(0, 145, 255, 0.1); }
        .cluster:focus-visible { outline: 2px solid var(--accent); outline-offset: 4px; }

    .node-card { width: 200px; background: var(--node-bg); border: 1px solid var(--node-border); border-radius: 6px; padding: 12px; position: relative; cursor: pointer; box-shadow: 0 2px 6px rgba(0,0,0,0.28); flex-shrink: 0; }
    .node-card:hover { background: var(--node-hover); border-color: #777; }
    .node-card.selected { border-color: var(--accent); box-shadow: 0 0 0 2px rgba(0,122,204,0.3); }
    .node-title { font-weight: bold; font-size: 13px; color: #eee; margin-bottom: 6px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .node-path { font-size: 10px; color: #a8a8b2; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .node-meta { margin-top: 8px; font-size: 10px; color: #c0c0c8; display: flex; gap: 6px; flex-wrap: wrap; }
    .badge { display: inline-block; padding: 2px 6px; border-radius: 4px; background: rgba(0,145,255,0.15); border: 1px solid rgba(0,145,255,0.45); color: #f0f8ff; }

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

    button.action-btn { width: 100%; padding: 10px; background: var(--accent); color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: bold; transition: background 0.2s ease, transform 0.2s ease; }
    button.action-btn:hover { background: #0070d4; transform: translateY(-1px); }
    button.action-btn.ghost { background: transparent; border: 1px solid var(--accent); color: var(--accent); }
    button.action-btn.ghost:hover { background: rgba(0,145,255,0.18); }
    .connections-layer { position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; overflow: visible; }
    .connection-line { position: absolute; height: 2px; background: var(--connection-stroke); border-radius: 999px; transform-origin: 0 50%; opacity: 0.85; box-shadow: 0 0 8px rgba(0, 189, 255, 0.25); }
    .connection-line[data-kind="extends"] { background: rgba(255, 104, 144, 0.75); box-shadow: 0 0 10px rgba(255, 104, 144, 0.45); }
    .connection-line[data-kind="implements"] { background: rgba(255, 188, 87, 0.75); box-shadow: 0 0 10px rgba(255, 188, 87, 0.35); }
    .nav-item:focus-visible,
    .control-btn:focus-visible,
    .node-card:focus-visible,
    button.action-btn:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
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
        <div id="circuit-toolbar" class="view-toolbar" role="group" aria-label="Circuit Filters">
            <span style="font-size:12px;color:#9ba3b1;letter-spacing:0.04em;text-transform:uppercase;">Show</span>
            <label class="filter-toggle"><input id="filter-toggle-tests" type="checkbox" aria-label="Toggle test archetype"><span>Tests</span></label>
            <label class="filter-toggle"><input id="filter-toggle-assets" type="checkbox" aria-label="Toggle asset archetype"><span>Assets</span></label>
        </div>
        <div id="circuit-viewport" style="width:100%;height:100%;overflow:hidden;cursor:grab;">
            <div id="circuit-container" class="dom-layer"></div>
            <div id="circuit-connections" class="connections-layer"></div>
        </div>
    </div>

    <div id="view-map" class="view-container">
        <div id="map-container" class="dom-layer" style="width: 100%; height: 100%;"></div>
        <div id="map-connections" class="connections-layer"></div>
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
        <div class="detail-footer" style="display:flex;flex-direction:column;gap:10px;">
            <button class="action-btn ghost" onclick="openInLocalView()">Open in Local View</button>
            <button class="action-btn ghost" onclick="openInGraphView()">Open in Graph View</button>
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

        const state = {
            view: "circuit",
            selectedNode: null,
            filters: {
                showTests: false,
                showAssets: false
            }
        };
        const nodesById = new Map(graphData.nodes.map(function (node) { return [node.id, node]; }));
        let circuitTransform = { x: 0, y: 0, k: 1 };
        let isDragging = false;
        let lastDragPosition = null;
        let dragVelocity = { x: 0, y: 0 };
        let forceGraphInstance = null;
        let circuitHasInitialFit = false;
        let circuitUserAdjusted = false;
        let circuitInertiaFrame = 0;
        let circuitAnimationFrame = 0;

        const viewport = document.getElementById("circuit-viewport");
        const circuitContainer = document.getElementById("circuit-container");
        const circuitConnections = document.getElementById("circuit-connections");
        const filterToggleTests = document.getElementById("filter-toggle-tests");
        const filterToggleAssets = document.getElementById("filter-toggle-assets");
        const statsLine = document.getElementById("stats-line");
        if (statsLine) {
          statsLine.textContent = graphData.stats.nodes + " nodes, " + graphData.stats.links + " links, " + graphData.stats.missingDependencies + " missing dependencies";
        }

        syncFilterControls();

        if (filterToggleTests) {
            filterToggleTests.addEventListener("change", function (event) {
                state.filters.showTests = event.target.checked;
                if (state.view === "circuit") {
                    renderCircuit();
                }
            });
        }
        if (filterToggleAssets) {
            filterToggleAssets.addEventListener("change", function (event) {
                state.filters.showAssets = event.target.checked;
                if (state.view === "circuit") {
                    renderCircuit();
                }
            });
        }

        viewport.style.cursor = "grab";

        viewport.addEventListener("mousedown", function (event) {
            if (event.target.closest(".node-card")) {
                return;
            }
            isDragging = true;
            circuitUserAdjusted = true;
            cancelInertia();
            lastDragPosition = { x: event.clientX, y: event.clientY, time: performance.now() };
            dragVelocity = { x: 0, y: 0 };
            viewport.style.cursor = "grabbing";
        });

        window.addEventListener("mousemove", function (event) {
            if (!isDragging || !lastDragPosition) {
                return;
            }
            event.preventDefault();
            const now = performance.now();
            const deltaX = event.clientX - lastDragPosition.x;
            const deltaY = event.clientY - lastDragPosition.y;
            circuitTransform.x += deltaX;
            circuitTransform.y += deltaY;
            updateCircuitTransform();
            const elapsed = Math.max(1, now - lastDragPosition.time);
            dragVelocity = {
                x: deltaX / elapsed,
                y: deltaY / elapsed
            };
            lastDragPosition = { x: event.clientX, y: event.clientY, time: now };
        });

        window.addEventListener("mouseup", function () {
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

        function handleWheel(event) {
            if (state.view !== "circuit") {
                return;
            }
            if (event.ctrlKey || event.metaKey) {
                event.preventDefault();
                circuitUserAdjusted = true;
                cancelInertia();
                const viewportRect = viewport.getBoundingClientRect();
                zoomAtPoint(event.clientX - viewportRect.left, event.clientY - viewportRect.top, -event.deltaY * 0.0015);
                return;
            }

            event.preventDefault();
            circuitUserAdjusted = true;
            cancelInertia();
            circuitTransform.x -= event.deltaX;
            circuitTransform.y -= event.deltaY;
            updateCircuitTransform();
        }

        function zoomAtPoint(offsetX, offsetY, delta) {
            const scaleFactor = Math.exp(delta);
            const nextScale = clamp(circuitTransform.k * scaleFactor, 0.1, 5);
            const localX = (offsetX - circuitTransform.x) / circuitTransform.k;
            const localY = (offsetY - circuitTransform.y) / circuitTransform.k;
            circuitTransform.k = nextScale;
            circuitTransform.x = offsetX - localX * circuitTransform.k;
            circuitTransform.y = offsetY - localY * circuitTransform.k;
            updateCircuitTransform();
            circuitUserAdjusted = true;
        }

        function updateCircuitTransform() {
            const matrix = "matrix(" + circuitTransform.k + ",0,0," + circuitTransform.k + "," + circuitTransform.x + "," + circuitTransform.y + ")";
            circuitContainer.style.transformOrigin = "0 0";
            circuitConnections.style.transformOrigin = "0 0";
            circuitContainer.style.transform = matrix;
            circuitConnections.style.transform = matrix;
        }

        function startInertia(initialVx, initialVy) {
            cancelInertia();
            cancelAnimationFrame(circuitAnimationFrame);
            circuitUserAdjusted = true;
            let vx = initialVx;
            let vy = initialVy;
            const friction = 0.9;
            function step() {
                circuitTransform.x += vx;
                circuitTransform.y += vy;
                updateCircuitTransform();
                vx *= friction;
                vy *= friction;
                if (Math.abs(vx) < 0.3 && Math.abs(vy) < 0.3) {
                    cancelInertia();
                    return;
                }
                circuitInertiaFrame = requestAnimationFrame(step);
            }
            circuitInertiaFrame = requestAnimationFrame(step);
        }

        function cancelInertia() {
            if (circuitInertiaFrame) {
                cancelAnimationFrame(circuitInertiaFrame);
                circuitInertiaFrame = 0;
            }
        }

        function animateCircuitTransform(target, options) {
            cancelAnimationFrame(circuitAnimationFrame);
            const duration = Math.max(1, (options && options.duration) || 400);
            const to = {
                x: target.x,
                y: target.y,
                k: clamp(target.k == null ? circuitTransform.k : target.k, 0.1, 5)
            };
            const from = { x: circuitTransform.x, y: circuitTransform.y, k: circuitTransform.k };
            const suppressUserState = options && options.suppressUserState;
            if (!suppressUserState) {
                circuitUserAdjusted = true;
            }

            const start = performance.now();
            function step(now) {
                const progress = clamp((now - start) / duration, 0, 1);
                const eased = easeOutCubic(progress);
                circuitTransform.x = from.x + (to.x - from.x) * eased;
                circuitTransform.y = from.y + (to.y - from.y) * eased;
                circuitTransform.k = from.k + (to.k - from.k) * eased;
                updateCircuitTransform();
                if (progress < 1) {
                    circuitAnimationFrame = requestAnimationFrame(step);
                }
            }
            circuitAnimationFrame = requestAnimationFrame(step);
        }

        function focusClusterElement(element, options) {
            if (!element || !element.isConnected) {
                return;
            }
            cancelInertia();
            const opts = options || {};
            if (!opts.suppressUserState) {
                circuitUserAdjusted = true;
            }

            const currentContainerTransform = circuitContainer.style.transform;
            const currentOverlayTransform = circuitConnections.style.transform;
            circuitContainer.style.transform = "none";
            circuitConnections.style.transform = "none";

            const elementRect = element.getBoundingClientRect();
            const containerRect = circuitContainer.getBoundingClientRect();
            const viewportRect = viewport.getBoundingClientRect();

            const padding = opts.padding == null ? 160 : opts.padding;
            const width = Math.max(elementRect.width, 1);
            const height = Math.max(elementRect.height, 1);
            const scaleX = (viewportRect.width - padding) / width;
            const scaleY = (viewportRect.height - padding) / height;
            const targetScale = clamp(Math.min(scaleX, scaleY), 0.2, 3.2);

            const centerX = elementRect.left - containerRect.left + width / 2;
            const centerY = elementRect.top - containerRect.top + height / 2;

            circuitContainer.style.transform = currentContainerTransform;
            circuitConnections.style.transform = currentOverlayTransform;

            const targetX = viewportRect.width / 2 - centerX * targetScale;
            const targetY = viewportRect.height / 2 - centerY * targetScale;

            animateCircuitTransform({ x: targetX, y: targetY, k: targetScale }, {
                duration: opts.duration || 450,
                suppressUserState: opts.suppressUserState
            });
        }

        function easeOutCubic(t) {
            const p = t - 1;
            return p * p * p + 1;
        }

        function clamp(value, minimum, maximum) {
            return Math.min(Math.max(value, minimum), maximum);
        }

        function syncFilterControls() {
            if (filterToggleTests) {
                filterToggleTests.checked = !!state.filters.showTests;
            }
            if (filterToggleAssets) {
                filterToggleAssets.checked = !!state.filters.showAssets;
            }
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

        function shouldRenderNodeInCircuit(node) {
            const archetype = (node.archetype || "").toLowerCase();
            if (archetype === "test" && !state.filters.showTests) {
                return !!(state.selectedNode && state.selectedNode.id === node.id);
            }
            if (archetype === "asset" && !state.filters.showAssets) {
                return !!(state.selectedNode && state.selectedNode.id === node.id);
            }
            return true;
        }

        function buildHierarchy(nodes) {
            const root = { name: "", path: "__root__", children: new Map(), nodes: [] };
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
                        const segmentPath = current.path === "__root__"
                            ? part
                            : current.path + "/" + part;
                        current.children.set(part, {
                            name: part,
                            path: segmentPath,
                            children: new Map(),
                            nodes: []
                        });
                    }
                    current = current.children.get(part);
                });
                current.nodes.push(node);
            });
            return root;
        }

        function renderCircuit() {
            syncFilterControls();
            const nodesForCircuit = graphData.nodes.filter(shouldRenderNodeInCircuit);
            const hierarchy = buildHierarchy(nodesForCircuit);
            const clusterElements = [];
            const pathToElement = new Map();
            const dominantCluster = findDominantCluster(nodesForCircuit);

            function renderDir(dir) {
                const pathKey = dir.path || "__root__";
                const element = document.createElement("div");
                element.className = "cluster";
                element.dataset.clusterPath = pathKey;
                element.tabIndex = 0;
                element.setAttribute("role", "button");
                element.setAttribute("aria-label", "Cluster " + (dir.path === "__root__" ? "root" : dir.path));
                pathToElement.set(pathKey, element);

                element.addEventListener("click", function (event) {
                    if (event.target.closest(".node-card")) {
                        return;
                    }
                    event.stopPropagation();
                    focusClusterElement(element, { padding: 220, duration: 420 });
                });

                element.addEventListener("keydown", function (event) {
                    if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        focusClusterElement(element, { padding: 220, duration: 420 });
                    }
                });

                const heading = document.createElement("div");
                heading.className = "cluster-label";
                heading.textContent = dir.path === "__root__" ? "(root)" : dir.name;
                element.appendChild(heading);

                const content = document.createElement("div");
                content.className = "cluster-content";

                dir.children.forEach(function (child) {
                    content.appendChild(renderDir(child));
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

            hierarchy.children.forEach(function (child) {
                clusterElements.push(renderDir(child));
            });

            if (hierarchy.nodes.length > 0) {
                clusterElements.push(renderDir({
                    name: "(root)",
                    path: "__root__",
                    children: new Map(),
                    nodes: hierarchy.nodes
                }));
            }

            if (clusterElements.length === 0) {
                circuitContainer.innerHTML = '<div style="color:#888;">No documentation nodes matched the current filters.</div>';
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
            requestAnimationFrame(function () {
                drawConnections();
                if (!circuitUserAdjusted && dominantCluster) {
                    var primaryElement = null;
                    if (pathToElement.has(dominantCluster.path)) {
                        primaryElement = pathToElement.get(dominantCluster.path);
                    } else {
                        var fallbackPath = "__root__";
                        if (state.selectedNode) {
                            fallbackPath = getDirectoryKey(state.selectedNode);
                        }
                        primaryElement = pathToElement.get(fallbackPath) || pathToElement.get("__root__");
                    }
                    if (primaryElement) {
                        focusClusterElement(primaryElement, {
                        padding: 240,
                        duration: 520,
                        suppressUserState: true
                        });
                    }
                }
            });
        }

        function findDominantCluster(nodes) {
            if (!nodes || nodes.length === 0) {
                return null;
            }
            const included = new Set(nodes.map(function (node) { return node.id; }));
            const degreeMap = new Map();
            graphData.links.forEach(function (link) {
                const sourceId = typeof link.source === "object" ? link.source.id : link.source;
                const targetId = typeof link.target === "object" ? link.target.id : link.target;
                if (included.has(sourceId)) {
                    degreeMap.set(sourceId, (degreeMap.get(sourceId) || 0) + 1);
                }
                if (included.has(targetId)) {
                    degreeMap.set(targetId, (degreeMap.get(targetId) || 0) + 1);
                }
            });

            const directoryScores = new Map();
            nodes.forEach(function (node) {
                const key = getDirectoryKey(node);
                if (!directoryScores.has(key)) {
                    directoryScores.set(key, { score: 0, count: 0 });
                }
                const entry = directoryScores.get(key);
                entry.score += degreeMap.get(node.id) || 0;
                entry.count += 1;
            });

            let best = null;
            directoryScores.forEach(function (value, key) {
                if (!best || value.score > best.score || (value.score === best.score && value.count > best.count)) {
                    best = { path: key, score: value.score, count: value.count };
                }
            });

            return best;
        }

        function getDirectoryKey(node) {
            const parts = (node.docRelativePath || "").split("/").filter(Boolean);
            if (parts.length <= 1) {
                return "__root__";
            }
            return parts.slice(0, -1).join("/");
        }

        function renderMap() {
            const container = document.getElementById("map-container");
            container.innerHTML = "";
            const overlay = document.getElementById("map-connections");
            overlay.innerHTML = "";

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

            const width = container.clientWidth || window.innerWidth;
            const height = container.clientHeight || window.innerHeight;
            const radius = Math.min(width, height) * 0.3;

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
                appendConnectionLine(overlay, sourceEl, targetEl, container, edge.kind || "dependency");
            });
        }

        function drawConnections() {
            if (state.view !== "circuit") {
                return;
            }
            const overlay = document.getElementById("circuit-connections");
            overlay.innerHTML = "";

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

                appendConnectionLine(overlay, sourceEl, targetEl, circuitContainer, edge.kind || "dependency");
            });
        }

        function appendConnectionLine(overlay, sourceElement, targetElement, root, kind) {
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
            line.style.width = length + "px";
            line.style.left = source.x + "px";
            line.style.top = (source.y - 1) + "px";
            line.style.transform = "rotate(" + angle + "rad)";
            overlay.appendChild(line);
        }

        function getRelativeCenter(element, root) {
            const elementRect = element.getBoundingClientRect();
            const rootRect = root.getBoundingClientRect();
            const scale = root === circuitContainer ? circuitTransform.k || 1 : 1;
            const relativeX = (elementRect.left - rootRect.left + elementRect.width / 2) / scale;
            const relativeY = (elementRect.top - rootRect.top + elementRect.height / 2) / scale;
            return { x: relativeX, y: relativeY };
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

        window.openInLocalView = function () {
            if (!state.selectedNode) {
                return;
            }
            state.view = "map";
            circuitUserAdjusted = true;
            document.querySelectorAll(".nav-item").forEach(function (el) { el.classList.remove("active"); });
            const mapNav = document.querySelector('.nav-item[data-view="map"]');
            if (mapNav) {
                mapNav.classList.add("active");
            }
            document.querySelectorAll(".view-container").forEach(function (el) { el.classList.remove("active"); });
            document.getElementById("view-map").classList.add("active");
            renderCurrentView();
        };

        window.openInGraphView = function () {
            if (!state.selectedNode) {
                return;
            }
            state.view = "graph";
            circuitUserAdjusted = true;
            document.querySelectorAll(".nav-item").forEach(function (el) { el.classList.remove("active"); });
            const graphNav = document.querySelector('.nav-item[data-view="graph"]');
            if (graphNav) {
                graphNav.classList.add("active");
            }
            document.querySelectorAll(".view-container").forEach(function (el) { el.classList.remove("active"); });
            document.getElementById("view-graph").classList.add("active");
            renderCurrentView();
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
