# Maintenance Contracts (Layer 4)

## Source Mapping
- Implementation: [`packages/shared/src/contracts/maintenance.ts`](../../../packages/shared/src/contracts/maintenance.ts)
- Consumers: [`packages/server/src/features/knowledge/feedDiagnosticsGateway.ts`](../../../packages/server/src/features/knowledge/feedDiagnosticsGateway.ts), [`packages/extension/src/prompts/rebindPrompt.ts`](../../../packages/extension/src/prompts/rebindPrompt.ts), [`packages/extension/src/commands/overrideLink.ts`](../../../packages/extension/src/commands/overrideLink.ts)
- Parent design: [Diagnostics Pipeline](../server-diagnostics/publishDocDiagnostics.mdmd.md)

## Responsibility
Model the payloads used when documentation drift or file deletions require link maintenance. Shared by the server and extension to keep rebind prompts, override commands, and diagnostics messages aligned on structure and terminology.

## Key Concepts
- **RebindReason**: Enumerates why a link needs remediation (`delete` or `rename`).
- **RebindRequiredArtifact**: Minimal descriptor (URI + layer) for the artifact that was removed.
- **RebindImpactedArtifact**: Extends the descriptor with relationship kind and direction, describing each affected link.
- **RebindRequiredPayload**: Bundles removal details, optional replacement URI, and impacted list sent to the extension.

## Integration Notes
- Diagnostics publisher emits `RebindRequiredPayload` when acknowledging drift; extension surfaces it via `showRebindPrompt` and `overrideLink` command.
- Payload structure intentionally mirrors GraphStore link relationships (layer + relationship kind) so maintenance operations can re-apply correct metadata.
- Additional remediation reasons can be introduced by widening `RebindReason`, ensuring extension auto-completion stays in sync.
