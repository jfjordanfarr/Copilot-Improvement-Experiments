title: "SlopCop Asset Reference Audit"
# SlopCop Asset Reference Audit (Layer 4)

## Source Mapping
- CLI: [`scripts/slopcop/check-asset-paths.ts`](/scripts/slopcop/check-asset-paths.ts)
- Shared utility: [`packages/shared/src/tooling/assetPaths.ts`](/packages/shared/src/tooling/assetPaths.ts)
- Unit tests: [`packages/shared/src/tooling/assetPaths.test.ts`](/packages/shared/src/tooling/assetPaths.test.ts)
- Configuration: [`slopcop.config.json`](/slopcop.config.json)
- Shared config loader: [`scripts/slopcop/config.ts`](/scripts/slopcop/config.ts)

## Purpose
Detect missing static assets referenced from HTML and stylesheet files so template-driven projects cannot ship broken images, fonts, or other resources. Extends the SlopCop lint suite beyond Markdown proxies, tightening the bridge between MDMD documentation and the concrete artefacts it references.

## Behaviour
- Scans files matched by the SlopCop `assets.includeGlobs` config (defaults to `*.html`, `*.htm`, `*.css`, `*.scss`, `*.sass`).
- Parses `src`, `srcset`, `href`, `poster`, and related attributes plus CSS `url(...)` references, skipping external schemes, protocol-relative URLs, anchors, and data URIs.
- Resolves absolute `/` paths from the repository root and relative paths from the source file before verifying file existence.
- Returns exit code `3` when missing assets are found, `0` when clean, and `4` if the audit encounters an unexpected failure.

## Configuration
- `slopcop.config.json` top-level `ignoreGlobs` applies to all SlopCop passes; the `assets` section supplies per-check `includeGlobs`, `ignoreGlobs`, and regex `ignoreTargets` overrides.
- CLI flags mirror the markdown audit: `--workspace` to override discovery root, `--json` for machine output, `-h/--help` for usage.

## Tests
- `assetPaths.test.ts` covers HTML `src` detection, CSS `url()` references, ignore-pattern support, and handling of external/data URLs.

## Operations
- `npm run slopcop:assets` — human-readable audit, add `-- --json` for JSON output.
- Included in `.vscode/tasks.json` as “SlopCop: Assets” for quick execution from VS Code.
- Planned integration: once the detector stabilises, `npm run safe:commit` will chain the asset audit alongside the markdown lint to guard both documentation and static resources.
