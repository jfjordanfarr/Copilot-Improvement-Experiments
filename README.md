# Live Documentation

**The Offline-First, Falsifiable Truth for Your Codebase.**

> [!IMPORTANT]
> **Documentation should be a compilation target, not a creative writing exercise.** Live Documentation treats markdown as a structured artifact derived directly from your code, ensuring that what you read matches what you run.

Live Documentation is a VS Code extension and CLI suite that mirrors every tracked workspace artifact into **deterministic, machine-verified markdown** stored locally under `/.live-documentation/`.

It is a **falsifiable graph of knowledge** that lives in your repo, works offline, and guarantees provenance.

---

## The Challenge: Durable Intelligence

In the age of AI, generating documentation is easy. Ensuring its **correctness** and **longevity** is the real challenge.
*   **Cloud-hosted wikis** often drift from the codebase they describe.
*   **AI chat contexts** are powerful but ephemeral; the insight vanishes when the session ends.
*   **"Just-in-time" maps** provide great transient understanding but leave no permanent artifact for the team.

Live Documentation bridges this gap by creating a **permanent, audit-proof library** inside your own project.

---

## Core Philosophy: The Pit of Success

Live Documentation is designed to create a **"linting machine"** that guides you to the right state. It's not about adding toil; it's about **Squiggle-Driven Development**.

1.  **Markdown as AST**: We treat markdown files as Abstract Syntax Trees. They are structured data nodes linked to your code.
2.  **Offline-First**: No API keys. No cloud dependencies. Your documentation is generated locally and stored in Git.
3.  **Falsifiable Guidance**: Every generated section (Dependencies, Public Symbols, Evidence) is backed by a linter.
    *   *The Old Way:* You forget to update the docs. A user complains 6 months later.
    *   *The Live Doc Way:* You change the code. The linter gently nudges you (via a squiggle or a build check) to update the doc. **The system makes the correct path the easiest path.**

---

## Competitive Landscape

Live Documentation is designed to complement, not replace, other tools in the ecosystem by focusing on **local ownership** and **determinism**.

| Feature | **Live Documentation** | **Google CodeWiki** | **Windsurf Codemaps** | **GitLab Knowledge Graph** |
| :--- | :--- | :--- | :--- | :--- |
| **Primary Goal** | **Falsifiable Truth** | Exploration & Search | Flow State & Speed | Cross-Project Intelligence |
| **Hosting** | **Local & Git-based** | Cloud-hosted | Local (Session-based) | Server-side |
| **Truth Source** | **Deterministic AST** | AI Generation | AI Annotation | Language Server Index |
| **Offline Access** | **100%** | No | Yes | No |
| **Durability** | **High** (Version Controlled) | Low (External Service) | Low (Ephemeral) | High (Database) |
| **Cost** | **Free** (Open Source) | Free (Public Repos) | Paid Product | Paid Enterprise Feature |

**Why this matters:**
*   **CodeWiki** and **GitLab's Knowledge Graph** are powerful, but they own the data. If you leave their platform, you lose the intelligence.
*   **Windsurf's CodeMaps** are incredible for speed, but the map disappears when you close the tab.
*   **Live Documentation** writes the intelligence *back into your repo*. It travels with your code, works offline, and survives any vendor switch.

---

## Core Concepts

### MDMD (Markdown-to-Markdown)
*Note: "MDMD" is a local convention we use to describe our layering strategy.*

We organize documentation into **Layers** of abstraction:
*   **Layer 4 (The Truth)**: The raw, generated mirror of your code. One file per source file. **Machine-owned.**
*   **Layer 3 (The Map)**: Architecture notes, decision logs, and "System Views". These link *down* to Layer 4. **Human-owned, Machine-verified.**
*   **Layer 2 (The Plan)**: Requirements and Roadmaps.
*   **Layer 1 (The Vision)**: High-level mission statements.

---

## CLI Tooling Reference

We provide a suite of tools to generate, inspect, and enforce documentation integrity.

### For Users (The Magic)

*   **`npm run live-docs:inspect -- --from <path>`**
    *   *The Pathfinder.*
    *   Traces the dependency graph to answer "What does this touch?" or "What touches this?".
    *   **Value:** Provides the LLM with the *provenance* of a file. For example, inspecting `packages/server/src/server.ts` reveals every service it initializes and every config it reads.
    *   **Real Usage:**
        *   *Impact Analysis:* `npm run live-docs:inspect -- --from packages/server/src/server.ts` (Lists all downstream dependencies).
        *   *Traceability:* `npm run live-docs:inspect -- --from packages/site/Scripts/app-insights.js --to Web.config` (Explains *why* a script depends on a config file by showing the full path).

*   **`npm run live-docs:system`**
    *   *Architecture on Demand.*
    *   Generates high-level views of your system.
    *   **Real Example:** `npm run live-docs:system` generates `FLOW-scripts-live-docs-run-all`, a visual map showing exactly how `run-all.ts` orchestrates the generation pipeline, derived entirely from the code.
    *   **Value:** Creates ephemeral maps that are guaranteed to be accurate at the moment of generation.

*   **`npm run live-docs:generate`**
    *   *The Engine.*
    *   Scans your workspace and materializes the Layer 4 mirror.
    *   *Usage:* `npm run live-docs:generate` (or `-- --dry-run` to preview).

### The Truth Engine (Enforcement)

*   **`npm run graph:audit`**
    *   *The Watchdog.*
    *   Enforces your custom documentation rules.
    *   **Real Rule:** Our own `layer4-orphans` rule ensures that every generated implementation doc is linked to a Layer 3 architecture doc. If you add a new feature but don't map it to the architecture, the build fails.

*   **`npm run slopcop:markdown`**
    *   *The Link Validator.*
    *   Instantly verifies every markdown link in your project.
    *   **Real Usage:** We use this to ensure that generated "See Also" links in `/.live-documentation/` never point to missing files, preventing dead ends in the documentation graph.

### For Contributors

*   **`npm run safe:commit`**
    *   *The Safety Gate.*
    *   Runs the full battery (tests + audits + benchmarks) to guarantee a clean state before merging.
    *   **Philosophy:** "Zero broken windows."

---

## Roadmap

*   **Codebase-Mirrored Live Documentation**: **Complete**. (Supports TS, C#, Python, Ruby, Rust, Java, C).
*   **Docstring Bridges**: **In Progress**. (Adapters exist, bidirectional sync coming soon).
*   **System Views**: **In Progress**. (Basic graphs working, advanced filtering next).
*   **Hosted Showcase**: **Planned**. (A read-only web viewer for public repos).

---

## Future Vision (Pie in the Sky)

*   **The "Reverse Bridge"**: Edit the documentation to refactor the code. True bidirectional sync.
*   **Greenfield Generative UX**: A clean, document-based interface where you write pseudocode (Live Docs), and the system generates the implementation skeletons for you.
*   **Universal Showcase**: Point us at any public repo, and we materialize its graph instantly in the browser. No install required.
*   **"Oracle of Bacon" for Code**: We already shipped the CLI (`inspect`), but the vision is a visual graph explorer that finds the "six degrees of separation" between any two symbols in your codebase.

---

## Getting Started

### Prerequisites
*   Node.js 22.x (see `.nvmrc`)
*   VS Code 1.91+

### Installation
1.  **Install dependencies**:
    ```powershell
    npm install
    ```
2.  **Build the suite**:
    ```powershell
    npm run build
    ```
3.  **Generate the world**:
    ```powershell
    npm run live-docs:generate
    ```
4.  **Verify the truth**:
    ```powershell
    npm run graph:audit
    ```
