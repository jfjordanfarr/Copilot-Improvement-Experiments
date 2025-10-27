# Override Link Command (Layer 4)

## Source Mapping
- Implementation: [`packages/extension/src/commands/overrideLink.ts`](../../../packages/extension/src/commands/overrideLink.ts)
- Server counterpart: [`packages/server/src/features/overrides/overrideLink.ts`](../../../packages/server/src/features/overrides/overrideLink.ts)
- Shared contracts: [`OverrideLinkRequest`](../../../packages/shared/src/contracts/overrides.ts), [`RebindRequiredArtifact`](../../../packages/shared/src/contracts/diagnostics.ts)

## Responsibility
Expose the `linkDiagnostics.overrideLink` VS Code command used to correct or rebind graph relationships from the client UI. Supports both manual overrides (user picks linked documents) and automated rebind flows triggered when files move or delete.

## Key Concepts
- **OverrideCommandPayload**: Optional context passed when the command originates from diagnostics UI; includes removed link details, impacted artifacts, and rename hints.
- **Layer selection**: Prompts help the user classify artifacts into documentation vs. code layers, driving default relationship kinds.
- **Rebind flow**: Iterates impacted artifacts, emitting batched override requests to restore relationships after renames/deletions.

## Exported Symbols
- `registerOverrideLinkCommand` — command registrar handling both manual override and rebind payloads.

## Internal Flow
1. Register the command and branch between manual override and rebind paths depending on payload.
2. **Manual overrides**
   - Ensure an active editor exists; infer the source layer from file extension.
   - Prompt for target file, layer, and relationship kind (with defaults based on layer pairing).
   - Resolve VS Code language identifiers for both endpoints.
   - Send `OverrideLinkRequest` to the language server under a progress notification; toast success.
3. **Rebind overrides**
   - Determine replacement URI (auto-accept rename suggestion or prompt user).
   - Resolve language for replacement document.
   - For each impacted link, build a directional request that swaps URIs appropriately and send under progress with incremental updates.

## Error Handling
- Command exits quietly when prompts are cancelled to avoid surprising side-effects.
- Failures during server requests or file resolution appear as `showErrorMessage` notifications.
- Rebind loop responds to cancellation tokens, allowing users to stop long-running operations.

## Observability Hooks
- Progress notifications communicate rebind status; information messages summarize results.

## Integration Notes
- Shares layer defaults and relationship kinds with server contracts to keep override semantics aligned.
- Manual overrides tag links with `createdBy: override:manual`; rebind path uses `override:rebind`, enabling downstream acknowledgement flows.
- Future UI surfaces (tree views, inline code lenses) can pass enriched payloads without modifying core command logic.
