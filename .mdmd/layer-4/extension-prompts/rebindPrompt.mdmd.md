# Rebind Prompt (Layer 4)

## Source Mapping
- Implementation: [`packages/extension/src/prompts/rebindPrompt.ts`](../../../packages/extension/src/prompts/rebindPrompt.ts)
- Triggering diagnostics: [`RebindRequiredPayload`](../../../packages/shared/src/contracts/diagnostics.ts)
- Command dependency: [`Override Link Command`](../extension-commands/overrideLink.mdmd.md)

## Responsibility
Surface a notification when documentation drift removes or renames artifacts that other files depend on. Encourages the user to rebind impacted links by invoking the override command with the necessary context payload.

## Key Concepts
- **RebindRequiredPayload**: Server-sent payload enumerating impacted artifacts, removal reason, and optional replacement URI.
- **Action prompt**: Uses `showInformationMessage` with contextual detail (sample impacted URIs) to drive user action.
- **Command chaining**: Executes `linkDiagnostics.overrideLink` with the payload so the override command can batch rebind operations.

## Public API
- `showRebindPrompt(payload): Promise<void>`

## Internal Flow
1. Summarize impacted artifact count and preview up to three URIs; annotate with rename/delete action.
2. Display an information message offering to “Rebind links” or dismiss; include detail text when previews exist.
3. On acceptance, invoke the override command with removed artifact data, impacted list, reason, and optional new URI.
4. Exit silently on dismissal to avoid nagging users.

## Error Handling
- Relies on VS Code command execution to reject on failure; consumer code should wrap the prompt if further handling is required.

## Integration Notes
- Designed to be triggered from diagnostics when drift acknowledgements detect broken links.
- Preview formatting keeps prompts concise while hinting at the scope of work.
- Additional actions (e.g., “View details”) can be added by extending the quick action options.
