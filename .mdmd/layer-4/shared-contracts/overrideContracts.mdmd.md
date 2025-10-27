# Override Link Contracts (Layer 4)

## Source Mapping
- Implementation: [`packages/shared/src/contracts/overrides.ts`](../../../packages/shared/src/contracts/overrides.ts)
- Parent design: [Diagnostics Pipeline Architecture](../../layer-3/diagnostics-pipeline.mdmd.md)

## Exported Symbols

#### LinkOverrideReason
`LinkOverrideReason` enumerates why a link override is being applied (`manual`, `rebind`, `external`).

#### OverrideLinkArtifactInput
`OverrideLinkArtifactInput` identifies the source or target artifact being overridden, including optional language metadata.

#### OverrideLinkRequest
`OverrideLinkRequest` carries the source/target artifacts, relationship kind, optional confidence, and operator-facing note when applying overrides.

#### OverrideLinkResponse
`OverrideLinkResponse` echoes the persisted link id and artifact ids after the override is recorded.

#### OVERRIDE_LINK_REQUEST
`OVERRIDE_LINK_REQUEST` names the LSP route clients invoke to apply link overrides.

## Responsibility
Define the payloads for operator-initiated link overrides so the extension and server agree on identifiers, reasons, and response structures.

## Evidence
- Referenced by the override workflow described in [`overrideLink.mdmd.md`](../change-events/overrideLink.mdmd.md).
