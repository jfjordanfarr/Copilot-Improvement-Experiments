# Workspace Audit & L3 Linking Enforcement

## Overview
We have successfully audited the workspace for "AI slop" and implemented a robust mechanism to enforce that every Layer 4 (Implementation) document is linked from a Layer 3 (Architecture) document. This ensures the "Code Like Clay" philosophy is maintained with a deterministic spine.

## Changes Implemented

### 1. Relationship Rule Engine Profile
We added a new profile `layer4-orphans` to `link-relationship-rules.json`.
- **Goal:** Enforce L3 -> L4 linking.
- **Mechanism:** Fails `npm run graph:audit` if any L4 document has 0 incoming links from L3.
- **Config:**
  ```json
  {
    "id": "layer4-orphans",
    "label": "Layer 4 documents must have a Layer 3 parent",
    "enforce": true
  }
  ```

### 2. Hybrid L3 Strategy (System View Promotion)
To handle the volume of links, we established a workflow to promote generated system views to Layer 3.
- **Promoted:** `live-documentation-scripts.mdmd.md` (from `scriptslivedocs`).
- **Location:** `.mdmd/layer-3/live-documentation-scripts.mdmd.md`.
- **Status:** Now serves as the authoritative L3 doc for `scripts/live-docs/**`, satisfying the linking requirement for those files.

## Audit Results

### Slop Audit
- **Markdown Links:** 0 broken links (`npm run slopcop:markdown`).
- **Assets:** 0 broken references (`npm run slopcop:assets`).

### Coverage Audit
- **Rule Enforcement:** Active.
- **Current Status:** The audit currently reports violations for **Test** artifacts (e.g., `tests/integration/us5/transformRipple.test.ts.mdmd.md`).
- **Next Steps:** These gaps can be closed by applying the same "System View Promotion" strategy to the test components (e.g., promoting a `test-architecture.mdmd.md` from the system view).

## Verification
Run the audit to see the current coverage status:
```bash
npm run graph:audit
```
*(Expect exit code 1 until all test artifacts are covered)*
