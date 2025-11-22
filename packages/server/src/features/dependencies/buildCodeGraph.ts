import { GraphStore } from "@live-documentation/shared";
import { KnowledgeArtifact, LinkRelationshipKind } from "@live-documentation/shared";

export interface CodeImpactEdge {
  trigger: KnowledgeArtifact;
  dependent: KnowledgeArtifact;
  viaLinkId: string;
  viaKind: LinkRelationshipKind;
  depth: number;
  /**
   * Ordered list of artifacts representing the path from the trigger to the dependent. The final
   * entry is always the dependent; intermediate entries (if any) indicate transitive hops.
   */
  path: KnowledgeArtifact[];
}

export interface BuildCodeGraphOptions {
  maxDepth?: number;
  linkKinds?: LinkRelationshipKind[];
}

const DEFAULT_MAX_DEPTH = 3;
const DEFAULT_LINK_KINDS: LinkRelationshipKind[] = ["depends_on"];

interface QueueItem {
  root: KnowledgeArtifact;
  artifact: KnowledgeArtifact;
  depth: number;
  path: KnowledgeArtifact[];
}

export function buildCodeImpactGraph(
  graphStore: GraphStore,
  triggers: KnowledgeArtifact[],
  options: BuildCodeGraphOptions = {}
): CodeImpactEdge[] {
  if (triggers.length === 0) {
    return [];
  }

  const maxDepth = Math.max(1, options.maxDepth ?? DEFAULT_MAX_DEPTH);
  const permittedKinds = new Set<LinkRelationshipKind>(options.linkKinds ?? DEFAULT_LINK_KINDS);

  const edges: CodeImpactEdge[] = [];
  const visited = new Set<string>();
  const triggerMap = new Map<string, KnowledgeArtifact>(triggers.map((artifact) => [artifact.id, artifact]));

  const queue: QueueItem[] = triggers.map((artifact) => ({ root: artifact, artifact, depth: 0, path: [] }));

  while (queue.length > 0) {
    const item = queue.shift()!;
    const links = graphStore.listLinkedArtifacts(item.artifact.id);

    for (const link of links) {
      if (link.direction !== "incoming") {
        continue;
      }

      if (!permittedKinds.has(link.kind)) {
        continue;
      }

      const dependent = link.artifact;
      if (!dependent || dependent.id === item.root.id) {
        continue;
      }

      const depth = item.depth + 1;
      if (depth > maxDepth) {
        continue;
      }

      const visitedKey = composeVisitKey(item.root.id, dependent.id);
      if (visited.has(visitedKey)) {
        continue;
      }
      visited.add(visitedKey);

      const path = [...item.path, dependent];
      edges.push({
        trigger: item.root,
        dependent,
        viaLinkId: link.linkId,
        viaKind: link.kind,
        depth,
        path
      });

      queue.push({ root: item.root, artifact: dependent, depth, path });
    }
  }

  // Include triggers that may not yet reside in GraphStore (e.g., first-run artifacts)
  // by ensuring the return value references the canonical trigger objects supplied by the caller.
  return edges.map((edge) => ({
    ...edge,
    trigger: triggerMap.get(edge.trigger.id) ?? edge.trigger,
    dependent: edge.dependent
  }));
}

function composeVisitKey(triggerId: string, dependentId: string): string {
  return `${triggerId}->${dependentId}`;
}
