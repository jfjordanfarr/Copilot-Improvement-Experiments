import type { KnowledgeArtifact, RelationshipHint } from "@copilot-improvement/shared";

export type RippleHint = RelationshipHint & {
  depth?: number;
  path?: string[];
};

export interface RippleImpact {
  target: KnowledgeArtifact;
  hint: RippleHint;
}
