import { exec } from "child_process";
import * as fs from "fs/promises";
import { createServer } from "http";
import * as path from "path";

import { snapshotWorkspace } from "../graph-tools/snapshot-workspace";

const PORT = 3000;

async function main() {
    console.log("Starting Live Documentation Explorer...");

    // --- DATA GENERATION ---
    console.log("Generating graph data...");
    const { artifacts, links } = await snapshotWorkspace({
        workspaceRoot: process.cwd(),
        quiet: true,
        skipDb: true,
        outputPath: path.join("data", "graph-snapshots", "explorer-temp.json")
    });

    // Filter for Live Docs
    const LIVE_DOCS_ROOT = ".mdmd/layer-4";
    const filteredArtifacts = artifacts.filter(a => a.uri.includes(LIVE_DOCS_ROOT));
    const filteredArtifactIds = new Set(filteredArtifacts.map(a => a.id));

    // --- INHERITANCE EXTRACTION (Shared Logic) ---
    console.log("Extracting inheritance relationships...");
    const inheritanceLinks = [];

    for (const node of filteredArtifacts) {
        try {
            const mdmdPath = node.uri.replace("file:///", "").replace("file://", "").replace(/\\/g, "/");
            const sourcePath = mdmdPath.replace(".mdmd/layer-4/", "").replace(".mdmd.md", "");
            const content = await fs.readFile(sourcePath, "utf-8");

            // Extract Archetype
            const archetypeMatch = content.match(/- Archetype:\s*(.+)/);
            const archetype = archetypeMatch ? archetypeMatch[1].trim() : "unknown";
            (node as any).archetype = archetype;

            // Extends
            const extendsMatch = content.match(/class\s+\w+[\s\n]+extends[\s\n]+(\w+)/);
            if (extendsMatch) {
                const parentName = extendsMatch[1];
                let parentNode = filteredArtifacts.find(n => {
                    const name = path.basename(n.uri).replace(".mdmd.md", "");
                    return name === parentName || name === parentName + ".ts";
                });

                // Import Resolution
                if (!parentNode) {
                    const importRegex = new RegExp(`import\\s+(?:{[^}]*?\\b${parentName}\\b[^}]*}|\\b${parentName}\\b)\\s+from\\s+['"](.*?)['"]`, 's');
                    const importMatch = content.match(importRegex);
                    if (importMatch) {
                        const cleanModulePath = importMatch[1].replace("@copilot-improvement/", "packages/");
                        parentNode = filteredArtifacts.find(n => {
                            const nodePath = n.uri.replace("file:///", "").replace("file://", "");
                            return nodePath.includes(cleanModulePath) && !nodePath.includes("node_modules");
                        });
                    }
                }

                if (parentNode) {
                    inheritanceLinks.push({ source: node.id, target: parentNode.id, kind: "extends" });
                }
            }

            // Implements
            const implementsMatch = content.match(/class\s+\w+[\s\n]+implements[\s\n]+([\w,\s]+)/);
            if (implementsMatch) {
                const interfaces = implementsMatch[1].split(",").map(s => s.trim());
                for (const iface of interfaces) {
                    const cleanIface = iface.split('<')[0].replace(/[\n\r]/g, '').trim();
                    let ifaceNode = filteredArtifacts.find(n => {
                        const name = path.basename(n.uri).replace(".mdmd.md", "");
                        return name === cleanIface || name === cleanIface + ".ts";
                    });

                    if (!ifaceNode) {
                        const importRegex = new RegExp(`import\\s+(?:{[^}]*?\\b${cleanIface}\\b[^}]*}|\\b${cleanIface}\\b)\\s+from\\s+['"](.*?)['"]`, 's');
                        const importMatch = content.match(importRegex);
                        if (importMatch) {
                            const cleanModulePath = importMatch[1].replace("@copilot-improvement/", "packages/");
                            ifaceNode = filteredArtifacts.find(n => {
                                const nodePath = n.uri.replace("file:///", "").replace("file://", "");
                                return nodePath.includes(cleanModulePath) && !nodePath.includes("node_modules");
                            });
                        }
                    }

                    if (ifaceNode) {
                        inheritanceLinks.push({ source: node.id, target: ifaceNode.id, kind: "implements" });
                    }
                }
            }
        } catch { /* Ignore */ }
    }
    console.log(`Found ${inheritanceLinks.length} inheritance links.`);

    // --- INDUCED LINKS (Shared Logic) ---
    const codeToDocs = new Map();
    for (const link of links) {
        if (filteredArtifactIds.has(link.sourceId) && !filteredArtifactIds.has(link.targetId)) {
            if (!codeToDocs.has(link.targetId)) codeToDocs.set(link.targetId, new Set());
            codeToDocs.get(link.targetId).add(link.sourceId);
        }
    }

    const inducedLinks = [];
    for (const link of links) {
        const sourceDocs = codeToDocs.get(link.sourceId);
        const targetDocs = codeToDocs.get(link.targetId);
        if (sourceDocs && targetDocs) {
            for (const s of sourceDocs) {
                for (const t of targetDocs) {
                    if (s !== t) inducedLinks.push({ source: s, target: t, kind: link.kind || "induced" });
                }
            }
        }
    }

    const directLinks = links
        .filter(l => filteredArtifactIds.has(l.sourceId) && filteredArtifactIds.has(l.targetId))
        .map(l => ({ source: l.sourceId, target: l.targetId, kind: l.kind || "coupling" }));

    const allEdges = [...directLinks, ...inducedLinks, ...inheritanceLinks];

    // Dedupe
    const uniqueEdgesMap = new Map();
    allEdges.forEach(e => uniqueEdgesMap.set(`${e.source}|${e.target}`, e));
    const finalEdges = Array.from(uniqueEdgesMap.values());

    // Prepare Data Payload
    const graphData = {
        nodes: filteredArtifacts.map(n => ({
            id: n.id,
            name: path.basename(n.uri).replace(".mdmd.md", ""),
            path: n.uri,
            archetype: (n as any).archetype || "unknown"
        })),
        links: finalEdges
    };

    // --- HTML SHELL ---
    // --- CLIENT SIDE SCRIPT ---
    const html = `
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
    
    /* Sidebar */
    #sidebar { width: 250px; background: var(--sidebar-bg); border-right: 1px solid var(--border); display: flex; flex-direction: column; z-index: 100; box-shadow: 2px 0 5px rgba(0,0,0,0.2); }
    .sidebar-header { padding: 20px; font-weight: bold; font-size: 18px; color: var(--text-active); border-bottom: 1px solid var(--border); background: #111; }
    .nav-item { padding: 12px 20px; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; gap: 10px; border-left: 3px solid transparent; }
    .nav-item:hover { background: rgba(255,255,255,0.05); }
    .nav-item.active { background: rgba(0,122,204,0.1); color: var(--accent); border-left: 3px solid var(--accent); }
    
    /* Context Bar */
    #context-bar { padding: 10px 20px; font-size: 12px; color: #888; border-top: 1px solid var(--border); margin-top: auto; background: #111; }
    #context-bar span { color: var(--accent); font-weight: bold; }

    /* Main Content */
    #main { flex: 1; position: relative; overflow: hidden; background: #1e1e1e; }
    .view-container { position: absolute; top: 0; left: 0; width: 100%; height: 100%; opacity: 0; pointer-events: none; transition: opacity 0.4s ease; overflow: hidden; }
    .view-container.active { opacity: 1; pointer-events: all; }
    
    /* DOM Layer (Circuit/Map) */
    .dom-layer { 
        position: absolute; 
        top: 0; left: 0; 
        transform-origin: 0 0; 
        will-change: transform;
        padding: 40px;
        box-sizing: border-box;
    }
    
    /* Circuit Board Specifics */
    #circuit-container {
        /* Ensure it can grow */
        width: max-content;
        height: max-content;
    }

    .cluster {
        border: 1px solid var(--cluster-border);
        background: var(--cluster-bg);
        border-radius: 8px;
        padding: 10px;
        margin: 10px;
        display: inline-flex; /* Allow horizontal flow */
        flex-direction: column;
        vertical-align: top;
    }
    .cluster-label {
        font-size: 12px;
        font-weight: bold;
        color: #888;
        margin-bottom: 10px;
        text-transform: uppercase;
        letter-spacing: 1px;
    }
    .cluster-content {
        display: flex;
        flex-wrap: wrap; /* Allow wrapping */
        gap: 16px; /* Spacing between cards */
        align-items: flex-start;
    }

    .node-card {
        width: 180px; /* Fixed width for cards */
        background: var(--node-bg);
        border: 1px solid var(--node-border);
        border-radius: 6px;
        padding: 10px;
        position: relative;
        cursor: pointer;
        box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        flex-shrink: 0;
        /* Removed transition to prevent shifting artifacts */
    }
    .node-card:hover { background: var(--node-hover); border-color: #777; }
    .node-card.selected { border-color: var(--accent); box-shadow: 0 0 0 2px rgba(0,122,204,0.3); }

    .node-title { 
        font-weight: bold; font-size: 13px; color: #eee; margin-bottom: 4px; 
        white-space: nowrap; overflow: hidden; text-overflow: ellipsis; 
    }
    .node-path { 
        font-size: 10px; color: #666; 
        white-space: nowrap; overflow: hidden; text-overflow: ellipsis; 
    }
    
    /* Pins */
    .pin {
        position: absolute;
        width: 8px; height: 8px;
        background: #555;
        border-radius: 50%;
    }
    .pin.top { top: -4px; left: 50%; transform: translateX(-50%); }
    .pin.bottom { bottom: -4px; left: 50%; transform: translateX(-50%); }
    .pin.left { left: -4px; top: 50%; transform: translateY(-50%); }
    .pin.right { right: -4px; top: 50%; transform: translateY(-50%); }

    /* Detail Panel */
    #detail-panel { 
        width: 350px; 
        background: var(--glass); 
        backdrop-filter: blur(10px);
        border-left: 1px solid var(--border); 
        display: flex; flex-direction: column;
        transform: translateX(100%); 
        transition: transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1); 
        position: absolute; 
        right: 0; top: 0; bottom: 0; 
        z-index: 200; 
        box-shadow: -5px 0 20px rgba(0,0,0,0.5);
    }
    #detail-panel.visible { transform: translateX(0); }
    
    .detail-header { padding: 20px; border-bottom: 1px solid var(--border); background: rgba(0,0,0,0.2); }
    .detail-scroll { flex: 1; overflow-y: auto; padding: 20px; }
    .detail-footer { padding: 20px; border-top: 1px solid var(--border); background: rgba(0,0,0,0.2); }

    .detail-section { margin-bottom: 20px; }
    .detail-label { font-size: 11px; text-transform: uppercase; color: #888; margin-bottom: 5px; letter-spacing: 1px; }
    .detail-content { font-size: 14px; line-height: 1.5; color: #eee; }
    .tag { display: inline-block; padding: 2px 8px; border-radius: 4px; background: #333; font-size: 12px; margin-right: 5px; margin-bottom: 5px; }
    .tag.archetype { background: #007acc; color: white; }
    
    /* Controls */
    #controls { position: absolute; bottom: 20px; left: 20px; display: flex; gap: 10px; z-index: 100; }
    .control-btn { width: 36px; height: 36px; border-radius: 50%; background: var(--sidebar-bg); border: 1px solid var(--border); color: var(--text); cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 18px; box-shadow: 0 2px 5px rgba(0,0,0,0.3); transition: all 0.2s; }
    .control-btn:hover { background: #333; color: white; transform: translateY(-2px); }

    button.action-btn {
        width: 100%; padding: 10px; background: var(--accent); color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: bold;
    }
    button.action-btn:hover { background: #0062a3; }
  </style>
</head>
<body>
  <div id="sidebar">
    <div class="sidebar-header">Live Docs Explorer</div>
    <div class="nav-item active" onclick="switchView('circuit')"><span>Circuit Board</span></div>
    <div class="nav-item" onclick="switchView('map')"><span>Local Map</span></div>
    <div class="nav-item" onclick="switchView('graph')"><span>Force Graph</span></div>
    <div id="context-bar">
        Context: <span id="context-name">None</span>
    </div>
  </div>
  
  <div id="main">
    <!-- Circuit View -->
    <div id="view-circuit" class="view-container active">
        <div id="circuit-container" class="dom-layer"></div>
        <svg id="circuit-connections" class="connections-layer"></svg>
    </div>

    <!-- Local Map View -->
    <div id="view-map" class="view-container">
        <div id="map-container" class="dom-layer" style="width: 100%; height: 100%;"></div>
        <svg id="map-connections" class="connections-layer"></svg>
    </div>

    <!-- Force Graph View -->
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
    console.log("Live Docs Explorer Script Starting...");
    const graphData = ${JSON.stringify(graphData)};
    console.log("Graph Data Loaded:", graphData);
    let currentState = { view: 'circuit', selectedNode: null };
    
    // View State
    let circuitTransform = { x: 0, y: 0, k: 1 };
    let mapTransform = { x: 0, y: 0, k: 1 };

    // --- HIERARCHY BUILDER ---
    function buildHierarchy(nodes) {
        const root = { name: 'root', type: 'dir', children: new Map(), nodes: [] };
        
        nodes.forEach(node => {
            const parts = node.path.replace("file:///", "").split('/');
            // Find where the project root starts (heuristic)
            let startIdx = parts.indexOf('.mdmd'); 
            if (startIdx === -1) startIdx = 0;
            
            const relevantParts = parts.slice(startIdx + 2); // Skip .mdmd/layer-4
            const fileName = relevantParts.pop();
            const dirPath = relevantParts;

            let current = root;
            dirPath.forEach(part => {
                if (!current.children.has(part)) {
                    current.children.set(part, { name: part, type: 'dir', children: new Map(), nodes: [] });
                }
                current = current.children.get(part);
            });
            current.nodes.push(node);
        });
        return root;
    }

    function switchView(viewName) {
        document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
        event.currentTarget.classList.add('active');
        document.querySelectorAll('.view-container').forEach(el => el.classList.remove('active'));
        document.getElementById('view-' + viewName).classList.add('active');
        currentState.view = viewName;
        renderCurrentView();
    }

    function renderCurrentView() {
        if (currentState.view === 'circuit') renderCircuit();
        else if (currentState.view === 'map') renderMap();
        else if (currentState.view === 'graph') renderGraph();
    }

    // --- DOM RENDERERS ---
    function renderCircuit() {
        const container = document.getElementById('circuit-container');
        container.innerHTML = ''; // Clear
        container.style.transform = \`translate(\${circuitTransform.x}px, \${circuitTransform.y}px) scale(\${circuitTransform.k})\`;

        const hierarchy = buildHierarchy(graphData.nodes);
        
        function renderDir(dir) {
            const el = document.createElement('div');
            el.className = 'cluster';
            
            const label = document.createElement('div');
            label.className = 'cluster-label';
            label.textContent = dir.name;
            el.appendChild(label);

            const content = document.createElement('div');
            content.className = 'cluster-content';
            
            // Sub-directories
            dir.children.forEach(child => {
                content.appendChild(renderDir(child));
            });

            // Files/Nodes
            dir.nodes.forEach(node => {
                const nodeEl = document.createElement('div');
                nodeEl.className = 'node-card';
                if (currentState.selectedNode && currentState.selectedNode.id === node.id) {
                    nodeEl.classList.add('selected');
                }
                nodeEl.id = 'node-' + node.id;
                nodeEl.onclick = (e) => { e.stopPropagation(); selectNode(node); };
                
                nodeEl.innerHTML = \`
                    <div class="node-title">\${node.name}</div>
                    <div class="node-path">\${node.path.split('/').pop()}</div>
                    <div class="pin top"></div><div class="pin bottom"></div>
                    <div class="pin left"></div><div class="pin right"></div>
                \`;
                content.appendChild(nodeEl);
            });

            el.appendChild(content);
            return el;
        }

        // Render Root Children
        hierarchy.children.forEach(child => {
            container.appendChild(renderDir(child));
        });
        
        // Draw connections after layout
        setTimeout(drawConnections, 100);
    }



    function renderMap() {
        const container = document.getElementById('map-container');
        container.innerHTML = ''; // Clear

        if (!currentState.selectedNode) {
            container.innerHTML = '<div style="display:flex;justify-content:center;align-items:center;height:100%;color:#888;">Select a node to view map</div>';
            return;
        }

        const centerNode = currentState.selectedNode;
        const neighbors = new Set();
        const links = [];

        // Find neighbors (1 hop)
        graphData.links.forEach(e => {
            if (e.source === centerNode.id) { neighbors.add(e.target); links.push(e); }
            if (e.target === centerNode.id) { neighbors.add(e.source); links.push(e); }
        });

        const nodesToRender = [centerNode, ...graphData.nodes.filter(n => neighbors.has(n.id))];
        
        // Radial Layout
        const cx = window.innerWidth / 2;
        const cy = window.innerHeight / 2;
        const radius = 250;

        nodesToRender.forEach((node, i) => {
            const el = document.createElement('div');
            el.className = 'node-card';
            el.id = 'map-node-' + node.id;
            el.style.position = 'absolute';
            el.style.width = '150px';
            
            if (node.id === centerNode.id) {
                el.style.left = (cx - 75) + 'px';
                el.style.top = (cy - 40) + 'px';
                el.style.border = '2px solid var(--accent)';
                el.style.zIndex = 10;
            } else {
                const angle = ((i - 1) / (nodesToRender.length - 1)) * 2 * Math.PI;
                const x = cx + radius * Math.cos(angle) - 75;
                const y = cy + radius * Math.sin(angle) - 40;
                el.style.left = x + 'px';
                el.style.top = y + 'px';
            }

            el.innerHTML = \`
                <div class="node-title">\${node.name}</div>
                <div class="node-path">\${node.path.split('/').pop()}</div>
            \`;
            el.onclick = () => selectNode(node);
            container.appendChild(el);
        });

        // Draw Map Connections (Simple SVG lines)
        const svg = document.getElementById('map-connections');
        svg.innerHTML = '';
        
        links.forEach(link => {
            const sourceId = typeof link.source === 'object' ? link.source.id : link.source;
            const targetId = typeof link.target === 'object' ? link.target.id : link.target;
            
            const sourceEl = document.getElementById('map-node-' + sourceId);
            const targetEl = document.getElementById('map-node-' + targetId);

            if (sourceEl && targetEl) {
                const sRect = sourceEl.getBoundingClientRect();
                const tRect = targetEl.getBoundingClientRect();
                
                const x1 = sRect.left + sRect.width / 2;
                const y1 = sRect.top + sRect.height / 2;
                const x2 = tRect.left + tRect.width / 2;
                const y2 = tRect.top + tRect.height / 2;

                const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
                line.setAttribute("x1", String(x1));
                line.setAttribute("y1", String(y1));
                line.setAttribute("x2", String(x2));
                line.setAttribute("y2", String(y2));
                line.setAttribute("stroke", "#555");
                line.setAttribute("stroke-width", "1");
                svg.appendChild(line);
            }
        });
    }
    function drawConnections() {
        if (currentState.view !== 'circuit') return;
        const svg = document.getElementById('circuit-connections');
        svg.innerHTML = ''; // Clear existing lines

        // Get all visible nodes
        const visibleNodes = Array.from(document.querySelectorAll('.node-card'));
        const nodeMap = new Map();
        visibleNodes.forEach(el => {
            const id = el.getAttribute('data-id') || el.id.replace('node-', '');
            if (id) nodeMap.set(id, el);
        });

        // Draw connections based on graphData.links
        graphData.links.forEach(edge => {
            const sourceId = typeof edge.source === 'object' ? edge.source.id : edge.source;
            const targetId = typeof edge.target === 'object' ? edge.target.id : edge.target;

            const sourceEl = nodeMap.get(sourceId);
            const targetEl = nodeMap.get(targetId);

            if (sourceEl && targetEl) {
                const sourceRect = sourceEl.getBoundingClientRect();
                const targetRect = targetEl.getBoundingClientRect();

                // Calculate centers relative to the viewport (since SVG is fixed overlay)
                const x1 = sourceRect.left + sourceRect.width / 2;
                const y1 = sourceRect.top + sourceRect.height / 2;
                const x2 = targetRect.left + targetRect.width / 2;
                const y2 = targetRect.top + targetRect.height / 2;

                // Manhattan Routing
                const midX = (x1 + x2) / 2;
                
                const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                // M x1 y1 L midX y1 L midX y2 L x2 y2
                const d = \`M \${x1} \${y1} L \${midX} \${y1} L \${midX} \${y2} L \${x2} \${y2}\`;
                
                path.setAttribute('d', d);
                path.setAttribute('stroke', '#555');
                path.setAttribute('stroke-width', '2');
                path.setAttribute('fill', 'none');
                svg.appendChild(path);
            }
        });
    }

    // --- FORCE GRAPH (Legacy Wrapper) ---
    function renderGraph() {
        const elem = document.getElementById('graph-svg');
        if (elem.childElementCount > 0) return; // Already rendered

        const Graph = ForceGraph3D()(elem)
            .graphData(graphData)
            .nodeLabel('name')
            .nodeLabel('name')
            .nodeColor(node => {
                if (currentState.selectedNode && node.id === currentState.selectedNode.id) return '#ff0000';
                switch (node.archetype) {
                    case 'implementation': return '#007acc'; // Blue
                    case 'test': return '#28a745'; // Green
                    case 'interface': return '#ffc107'; // Yellow
                    case 'config': return '#6c757d'; // Gray
                    case 'script': return '#17a2b8'; // Cyan
                    default: return '#666';
                }
            })
            .onNodeClick(node => {
                const originalNode = graphData.nodes.find(n => n.id === node.id);
                if (originalNode) {
                    selectNode(originalNode);
                    setTimeout(() => switchView('map'), 50);
                }
            });
    }

    // --- DETAIL PANEL LOGIC ---
    async function selectNode(node) {
        currentState.selectedNode = node;
        document.getElementById('context-name').textContent = node.name;
        
        const panel = document.getElementById('detail-panel');
        panel.classList.add('visible');
        
        const title = document.getElementById('detail-title');
        const body = document.getElementById('detail-body');
        
        title.textContent = node.name;
        body.innerHTML = '<p>Loading details...</p>';
        
        // Re-render to update highlights
        renderCurrentView(); 

        try {
            const res = await fetch('/details?path=' + encodeURIComponent(node.path));
            const data = await res.json();
            
            let html = '';
            if (data.archetype) html += \`<div class="detail-section"><div class="detail-label">Archetype</div><span class="tag archetype">\${data.archetype}</span></div>\`;
            if (data.purpose) html += \`<div class="detail-section"><div class="detail-label">Purpose</div><div class="detail-content">\${data.purpose}</div></div>\`;
            if (data.symbols && data.symbols.length > 0) {
                html += \`<div class="detail-section"><div class="detail-label">Exported Symbols</div><div class="detail-content">\`;
                data.symbols.forEach(s => html += \`<span class="tag">\${s}</span>\`);
                html += \`</div></div>\`;
            }
            html += \`<div class="detail-section"><div class="detail-label">File Path</div><div class="detail-content" style="font-family: monospace; font-size: 12px; word-break: break-all;">\${node.path}</div></div>\`;
            
            body.innerHTML = html;
        } catch (e) {
            body.innerHTML = '<p style="color: red">Failed to load details.</p>';
            console.error(e);
        }
    }

    function openInEditor() {
        if (currentState.selectedNode) {
            fetch('/open?path=' + encodeURIComponent(currentState.selectedNode.path));
        }
    }

    // --- ZOOM CONTROLS ---
    function zoomIn() {
        if (currentState.view === 'circuit') { circuitTransform.k *= 1.2; renderCircuit(); }
    }
    function zoomOut() {
        if (currentState.view === 'circuit') { circuitTransform.k /= 1.2; renderCircuit(); }
    }
    function resetZoom() {
        if (currentState.view === 'circuit') { circuitTransform = { x: 0, y: 0, k: 1 }; renderCircuit(); }
    }

    // Initial Render
    renderCurrentView();
    
    // Handle Window Resize for Connections
    window.addEventListener('resize', () => {
        if(currentState.view === 'circuit') drawConnections();
    });
  </script>
</body>
</html>
    `;

    const server = createServer(async (req, res) => {
        const url = new URL(req.url || "", `http://localhost:${PORT}`);

        if (url.pathname === '/open') {
            const filePath = url.searchParams.get('path');
            if (filePath) {
                const realPath = filePath.replace("file:///", "").replace("file://", "");
                realPath = realPath.replace(/\.mdmd\.md$/, "");
                realPath = realPath.replace(".mdmd/layer-4/", "");
                console.log(`Opening file: ${realPath}`);
                exec(`code "${realPath}"`);
            }
            res.writeHead(200);
            res.end("OK");
            return;
        }

        if (url.pathname === '/details') {
            const filePath = url.searchParams.get('path');
            if (filePath) {
                try {
                    const realPath = filePath.replace("file:///", "").replace("file://", "");
                    // Read the MDMD file directly
                    const content = await fs.readFile(realPath, "utf-8");

                    // Extract Metadata
                    const archetypeMatch = content.match(/- Archetype:\s*(.+)/);
                    const archetype = archetypeMatch ? archetypeMatch[1].trim() : "Unknown";

                    // Extract Purpose
                    const purposeMatch = content.match(/## Purpose\s+([\s\S]*?)(?=##|$)/);
                    const purpose = purposeMatch ? purposeMatch[1].trim() : "No purpose defined.";

                    const symbols: string[] = [];
                    const symbolMatch = content.match(/- Exported Symbols:\s*(.+)/);
                    if (symbolMatch) {
                        symbolMatch[1].split(',').forEach(s => symbols.push(s.trim()));
                    }

                    res.writeHead(200, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({ archetype, purpose, symbols }));
                    return;
                } catch (e) {
                    console.error(e);
                    res.writeHead(500);
                    res.end(JSON.stringify({ error: "Failed to read file" }));
                    return;
                }
            }
        }

        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(html);
    });
    server.listen(PORT, () => {
        console.log(`Explorer running at http://localhost:${PORT}`);
        const startCommand = process.platform === "win32" ? "start" : "open";
        exec(`${startCommand} http://localhost:${PORT}`);
    });
}

main().catch(console.error);
