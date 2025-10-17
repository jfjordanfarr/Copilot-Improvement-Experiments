import { ArtifactLayer, LinkRelationshipKind } from "../domain/artifacts";

export type RebindReason = "delete" | "rename";

export interface RebindRequiredArtifact {
  uri: string;
  layer: ArtifactLayer;
}

export interface RebindImpactedArtifact extends RebindRequiredArtifact {
  relationship: LinkRelationshipKind;
  direction: "incoming" | "outgoing";
}

export interface RebindRequiredPayload {
  removed: RebindRequiredArtifact;
  reason: RebindReason;
  newUri?: string;
  impacted: RebindImpactedArtifact[];
}
