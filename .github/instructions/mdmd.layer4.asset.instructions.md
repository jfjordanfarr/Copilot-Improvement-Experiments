---
applyTo: ".live-documentation/assets/**/*.mdmd.md"
---

# Asset Live Documentation Guidance

- Treat asset Live Docs as **manual exceptions**. Prefer linking directly to the asset from implementation/test Live Docs; only create an asset entry when the binary/non-plaintext file needs persistent metadata (ownership, provenance, replacement notes, etc.).
- Generated sections follow the base ordering: first `### Public Symbols`, then `### Dependencies`. Leave `_Not applicable_` when there is nothing to report. Do not add additional generated sections such as "Observed Evidence" or "Consumers"; inbound relationships should be derived by tooling from other Live Docs.
- Use `### Dependencies` strictly for assets this file *consumes* (e.g., a sprite atlas referencing an external stylesheet), not for downstream consumers. Those downstream references surface naturally via the other files' dependency lists.
- Authored content should focus on orientation: clarify why the asset exists, how it should be updated, and whether alternative formats are maintained elsewhere. Mention when the asset is mirrored outside the repository.
- When the asset lives outside the workspace tree (e.g., CDN), document the canonical reference in `### Notes` and add an inline comment explaining why no local dependency is listed.
