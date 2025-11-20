# Audit Report & Improvement Plan

## Goal Description
Audit the workspace for "AI slop" (low-quality/unused artifacts) and implement a mechanism to ensure every Layer 4 (Implementation) MDMD document is linked to a Layer 3 (Architecture) MDMD document.

## Audit Findings

### Automated Checks
- **Markdown Links (`slopcop:markdown`):** PASSED (0 broken links).
- **Asset References (`slopcop:assets`):** PASSED (0 broken references).
- **Graph Coverage (`graph:audit`):**
    - The graph audit tool (`npm run graph:audit`) is functional and reports on documentation gaps.
    - It currently checks for "Code artifacts missing documentation links" and "Layer 4 documents lacking code relationships".
    - It *does not* explicitly enforce that every L4 doc is linked *from* an L3 doc.

### Manual Checks
- **Large Files (>500 lines):**
    - Several files exceed 500 lines, including `scripts/graph-tools/audit-doc-coverage.ts` (which we will be modifying/using as reference).
    - *Recommendation:* Refactor these when touching them, but no immediate "slop" removal is critical for this task.
- **L4 Documentation:**
    - Found L4 docs in `.mdmd/layer-4`.
    - Naming convention: `original_filename.ext.mdmd.md`.
- **L3 Documentation:**
    - Found L3 docs in `.mdmd/layer-3`.
    - Structure includes a `Linked Implementations` section referencing L4 docs.

## Proposed Changes

## Proposed Changes

## Proposed Changes

### 1. Enforce L3 -> L4 Linking (Rules Engine Profile)
We will use the existing Relationship Rule Engine to enforce that every Layer 4 (Implementation) document is referenced by a Layer 3 (Architecture) document.

#### [MODIFY] link-relationship-rules.json
- **Add Profile:** `layer4-orphans`
    - **Source:** Layer 4 documents (`.mdmd/layer-4/**/*.mdmd.md` and `.live-documentation/source/**/*.md`).
    - **Requirement:**
        - **Direction:** `incoming`
        - **Link Kind:** `documents`
        - **Targets:** Layer 3 documents (`.mdmd/layer-3/**/*.mdmd.md`).
        - **Minimum:** 1
    - **Enforce:** `true` (This will cause `graph:audit` to fail if gaps are found).

### 2. Gap Filling (Hybrid L3 Strategy)
To handle the volume of links ("hundreds"), we will promote generated system views to Layer 3.
- **Generate System Views:** Run `npm run live-docs:system` to generate component clusters in `AI-Agent-Workspace/tmp/system-cli-output`.
- **Promote to L3:**
    - Identify high-value system views (e.g., `scriptslivedocs.mdmd.md`).
    - Move them to `.mdmd/layer-3/`.
    - Rename them to be human-readable (e.g., `live-documentation-scripts.mdmd.md`).
    - Add the required "Authored" sections (`Purpose`, `Notes`) to satisfy L3 conventions.
    - **Result:** These docs will now contain the bulk of the L4 links, satisfying the audit requirement while providing a "sane" way to manage the volume.

## Verification Plan

### Automated Tests
- **Run the graph audit:**
    ```bash
    npm run graph:audit
    ```
    - *Expectation:* The audit should pass (exit code 0) after the system views are promoted and any remaining stragglers are linked.

### Manual Verification
- **Verify L3 Links:**
    - Open the new "Hybrid" L3 docs.
    - Confirm they have both authored context and the generated list of components.
