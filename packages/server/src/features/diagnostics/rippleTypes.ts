import type { KnowledgeArtifact, RelationshipHint } from "@live-documentation/shared";

export type RippleHint = RelationshipHint & {
  depth?: number;
  path?: string[];
};

export interface RippleImpact {
  target: KnowledgeArtifact;
  hint: RippleHint;
}
