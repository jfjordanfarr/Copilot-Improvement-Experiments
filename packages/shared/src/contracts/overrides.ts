import { ArtifactLayer, LinkRelationshipKind } from "../domain/artifacts";

export type LinkOverrideReason = "manual" | "rebind" | "external";

export interface OverrideLinkArtifactInput {
  uri: string;
  layer: ArtifactLayer;
  languageId?: string;
}

export interface OverrideLinkRequest {
  source: OverrideLinkArtifactInput;
  target: OverrideLinkArtifactInput;
  kind: LinkRelationshipKind;
  confidence?: number;
  reason: LinkOverrideReason;
  note?: string;
}

export interface OverrideLinkResponse {
  linkId: string;
  sourceArtifactId: string;
  targetArtifactId: string;
}

export const OVERRIDE_LINK_REQUEST = "linkDiagnostics/link/override";
