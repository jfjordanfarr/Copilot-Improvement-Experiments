# Symbol Neighbors Quick Pick (Layer 4)

**Created:** 2025-10-23  
**Last Edited:** 2025-10-23

## Source Mapping
- Implementation: [`packages/extension/src/commands/inspectSymbolNeighbors.ts`](../../../packages/extension/src/commands/inspectSymbolNeighbors.ts)
- Tests: [`packages/extension/src/commands/inspectSymbolNeighbors.test.ts`](../../../packages/extension/src/commands/inspectSymbolNeighbors.test.ts), [`tests/integration/us4/inspectSymbolNeighbors.test.ts`](../../../tests/integration/us4/inspectSymbolNeighbors.test.ts)
- Parent designs: [Extension Surfaces Architecture](../../layer-3/extension-surfaces.mdmd.md), [Diagnostics Pipeline Architecture](../../layer-3/diagnostics-pipeline.mdmd.md)
- Spec references: [T066](../../../specs/001-link-aware-diagnostics/tasks.md)

## Purpose
Expose a palette command that lets maintainers and Copilot agents inspect the graph neighborhood surrounding any artifact without triggering diagnostics. This file exists to deliver the human-facing UX for US4 and to dogfood the server-side traversal before richer diagnostics consume it.

## Responsibilities
1. Resolve an inspection target (active editor, URI, or explicit artifact id) and issue the `INSPECT_SYMBOL_NEIGHBORS_REQUEST` via the language client.
2. Validate the response schema to prevent UI drift when server contracts evolve.
3. Group neighbors by relationship kind and render a Quick Pick with direction, depth, confidence, and hop-path context for each neighbor.
4. Handle empty or missing data states gracefully with actionable messaging.
5. Open the selected neighbor in a non-preview editor, enabling fast investigation workflows.

## Public Interfaces
- `registerInspectSymbolNeighborsCommand(client: LanguageClient): Disposable` — registers the `linkDiagnostics.inspectSymbolNeighbors` command and wires it to the language client.
- `SymbolNeighborQuickPickController.show(target?: SymbolNeighborCommandTarget)` — entry point used by the command; accepts a `vscode.Uri`, artifact id, or parameter bag (`{ artifactId?: string; uri?: string; maxDepth?: number; maxResults?: number; linkKinds?: LinkRelationshipKind[] }`).
- `InspectSymbolNeighborsResultValidator` — exported zod schema used by unit tests and future callers to validate contract conformance.

## Collaborators
- Depends on the shared contract: [`INSPECT_SYMBOL_NEIGHBORS_REQUEST`](../../../packages/shared/src/contracts/symbols.ts).
- Requires the language server handler implemented in [`packages/server/src/main.ts`](../../../packages/server/src/main.ts) and traversal logic (`symbolNeighbors.ts`).
- Leverages shared artifact schemas defined in [`packages/extension/src/shared/artifactSchemas.ts`](../../../packages/extension/src/shared/artifactSchemas.ts) to ensure consistent parsing across commands.

## Testing
- **Unit:** [`packages/extension/src/commands/inspectSymbolNeighbors.test.ts`](../../../packages/extension/src/commands/inspectSymbolNeighbors.test.ts) exercises command registration, schema validation, and Quick Pick selection handling using mocked VS Code APIs.
- **Integration:** [`tests/integration/us4/inspectSymbolNeighbors.test.ts`](../../../tests/integration/us4/inspectSymbolNeighbors.test.ts) verifies the command executes inside VS Code, communicates with the live language server, and surfaces empty-state messaging deterministically.

## Rationale
Symbol-neighbor exploration is a deliberate liability that prevents the extension from exposing raw traversal primitives. Centralising the UX in this command ensures every workflow shares a single validation layer and presentation format, making future telemetry and UI refinements straightforward. Without this file, maintainers would continue relying on diagnostics or manual SQL to understand ripple impacts, delaying feedback loops for graph quality.
