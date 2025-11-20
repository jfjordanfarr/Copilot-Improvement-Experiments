# Implementation Plan - Visual Graph Explorer ("Oracle of Bacon")

We will implement a new CLI command `npm run live-docs:visualize` that launches a local web server to display a 3D interactive graph of the codebase.

## User Review Required

> [!IMPORTANT]
> **Library Choice**: We are using [3d-force-graph](https://github.com/vasturiano/3d-force-graph) (MIT Licensed). It uses WebGL (via Three.js) for high performance and "cool" aesthetics.
> **Connectivity**: The visualization will load libraries from a CDN (unpkg/jsdelivr) to avoid adding heavy npm dependencies to the project. This requires internet access to run the visualization.

## Proposed Changes

### Scripts

#### [NEW] [scripts/live-docs/visualize.ts](file:///d:/Projects/Live-Documentation/scripts/live-docs/visualize.ts)
-   **Purpose**: The main entry point for the visualization tool.
-   **Logic**:
    1.  **Data Gathering**: Reuse logic from `scripts/graph-tools/snapshot-workspace.ts` (or similar) to build a graph of `File` and `Symbol` nodes and their relationships.
    2.  **Server**: Start a lightweight `http` server on a random free port.
    3.  **Serving**: Serve a generated HTML page containing the `3d-force-graph` setup and the JSON graph data.
    4.  **Launch**: Automatically open the browser to the local URL.

### Package Configuration

#### [MODIFY] [package.json](file:///d:/Projects/Live-Documentation/package.json)
-   Add `live-docs:visualize` script: `tsx --tsconfig ./tsconfig.base.json scripts/live-docs/visualize.ts`

## Refinement: Filtering and Weighting

### User Review Required
> [!NOTE]
> **Filtering**: We will default to showing **only Live Documentation** (Layer 4) when the user requests "clean" mode, or we can add a flag. For now, I'll hardcode a `FOCUS_MODE` constant in the script that can be toggled or mapped to a CLI arg later.
> **Weighting**: We will aggregate multiple links between the same two nodes into a single edge with increased **width** and **particle density** to represent "intensity".

### Proposed Changes

#### [MODIFY] [scripts/live-docs/visualize.ts](file:///d:/Projects/Live-Documentation/scripts/live-docs/visualize.ts)
-   **Filtering Logic**:
    -   Filter `artifacts` to include only those residing in `.live-documentation/` (the "mirrored simplified surface").
    -   Filter `links` to ensure both source and target exist in the filtered artifacts.
-   **Weighting Logic**:
    -   Pre-process `links` to count occurrences of `source -> target`.
    -   Map these counts to a `weight` property on the graph links.
-   **Frontend Updates**:
    -   Update `ForceGraph3D` config:
        -   `.linkWidth(link => Math.sqrt(link.weight))` (Square root for better scaling)
        -   `.linkDirectionalParticles(link => link.weight)` (More particles = more intense)
        -   `.linkDirectionalParticleSpeed(0.005)`

## Verification Plan

### Manual Verification
1.  Run `npm run live-docs:visualize`.
2.  **Check Noise**: Verify that raw code files (e.g., `.ts` files in `packages/`) are GONE. Only `.md` files in `.live-documentation/` should remain.
3.  **Check Intensity**: Find two nodes with multiple connections (dependencies). Verify the line is thicker and has more floating particles than a single-connection line.

## Refinement: Color by Archetype, Size by Line Count

### User Review Required
> [!NOTE]
> **Data Extraction**: I will need to parse the generated MDMD files to extract the `archetype` and the `source code path`.
> **Performance**: Reading and counting lines for hundreds of files might slow down the startup slightly, but it should be negligible for this workspace size.

### Proposed Changes

#### [MODIFY] [scripts/live-docs/visualize.ts](file:///d:/Projects/Live-Documentation/scripts/live-docs/visualize.ts)
-   **Data Enrichment**:
    -   Iterate through `filteredArtifacts`.
    -   Read the content of each MDMD file.
    -   **Archetype**: Extract from frontmatter or metadata (need to verify where it is).
    -   **Source Path**: Extract from the "Source" link usually present in MDMD.
    -   **Line Count**: Read the source file and count newlines.
-   **Graph Data**:
    -   `group`: Set to `archetype` (e.g., "concept", "implementation").
    -   `val`: Set to `lineCount` (scaled if necessary, e.g., `Math.log(lineCount)` or linear).


