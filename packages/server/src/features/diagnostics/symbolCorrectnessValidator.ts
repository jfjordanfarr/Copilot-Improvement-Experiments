import {
  type CompiledSymbolProfile,
  type CompiledSymbolProfileRequirement,
  type CompiledSymbolProfileTarget,
  type GraphStore,
  type KnowledgeArtifact,
  type LinkRelationshipKind,
  toWorkspaceRelativePath
} from "@copilot-improvement/shared";
import type { SymbolProfileLookup } from "@copilot-improvement/shared";

export interface SymbolCorrectnessDiagnosticOptions {
  workspaceRoot: string;
  store: GraphStore;
  profiles: CompiledSymbolProfile[];
  lookup: SymbolProfileLookup;
}

export interface SymbolProfileViolation {
  profileId: string;
  profileLabel?: string;
  requirementId: string;
  artifactUri: string;
  artifactId: string;
  linkKind: LinkRelationshipKind;
  direction: "outbound" | "incoming";
  expectedMinimum: number;
  observed: number;
  message: string;
}

export interface SymbolProfileSummary {
  profileId: string;
  profileLabel?: string;
  evaluated: number;
  satisfied: number;
  violations: SymbolProfileViolation[];
}

export interface SymbolCorrectnessReport {
  summaries: SymbolProfileSummary[];
  violations: SymbolProfileViolation[];
}

interface IdentifierExtractionOptions {
  identifierPattern?: RegExp;
  identifierFieldSegments?: string[];
}

export function generateSymbolCorrectnessDiagnostics(
  options: SymbolCorrectnessDiagnosticOptions
): SymbolCorrectnessReport {
  const artifacts = options.store.listArtifacts();
  const summaries: SymbolProfileSummary[] = [];
  const violations: SymbolProfileViolation[] = [];
  const profilesById = new Map<string, CompiledSymbolProfile>();

  for (const profile of options.profiles) {
    profilesById.set(profile.id, profile);
    summaries.push({
      profileId: profile.id,
      profileLabel: profile.label,
      evaluated: 0,
      satisfied: 0,
      violations: []
    });
  }

  const summariesById = new Map<string, SymbolProfileSummary>(
    summaries.map(summary => [summary.profileId, summary])
  );

  for (const artifact of artifacts) {
    const matchingProfiles = options.lookup.findProfilesForArtifact(artifact, options.workspaceRoot);
    if (matchingProfiles.length === 0) {
      continue;
    }

    const relative = toWorkspaceRelativePath(artifact.uri, options.workspaceRoot);
    if (!relative) {
      continue;
    }

    for (const profile of matchingProfiles) {
      const summary = summariesById.get(profile.id);
      if (!summary) {
        continue;
      }

      summary.evaluated += 1;
      const identifiers = extractIdentifiers(artifact, {
        identifierPattern: profile.source.identifierPattern,
        identifierFieldSegments: profile.source.identifierFieldSegments ?? ["mdmd", "identifiers"]
      });

      const requirementResults = evaluateRequirements({
        artifact,
        profile,
        identifiers,
        store: options.store,
        workspaceRoot: options.workspaceRoot
      });

      if (requirementResults.every(result => result.satisfied)) {
        summary.satisfied += 1;
        continue;
      }

      for (const failure of requirementResults.filter(result => !result.satisfied)) {
        const violation: SymbolProfileViolation = {
          profileId: profile.id,
          profileLabel: profile.label,
          requirementId: failure.requirement.id,
          artifactUri: artifact.uri,
          artifactId: artifact.id,
          linkKind: failure.requirement.linkKind,
          direction: failure.requirement.direction,
          expectedMinimum: failure.requirement.minimum,
          observed: failure.observed,
          message: buildViolationMessage(profile, failure.requirement, relative, failure.observed)
        };

        summary.violations.push(violation);
        violations.push(violation);
      }
    }
  }

  return {
    summaries,
    violations
  };
}

interface RequirementEvaluationContext {
  artifact: KnowledgeArtifact;
  profile: CompiledSymbolProfile;
  identifiers: string[];
  store: GraphStore;
  workspaceRoot: string;
}

interface RequirementEvaluationResult {
  requirement: CompiledSymbolProfileRequirement;
  observed: number;
  satisfied: boolean;
}

function evaluateRequirements(context: RequirementEvaluationContext): RequirementEvaluationResult[] {
  return context.profile.requirements.map(requirement => {
    const matches = collectRequirementMatches(context, requirement);
    return {
      requirement,
      observed: matches,
      satisfied: matches >= requirement.minimum
    };
  });
}

function collectRequirementMatches(
  context: RequirementEvaluationContext,
  requirement: CompiledSymbolProfileRequirement
): number {
  const neighbors = context.store.listLinkedArtifacts(context.artifact.id, {
    kinds: [requirement.linkKind]
  });

  let matches = 0;
  for (const neighbor of neighbors) {
    if (!directionMatches(requirement.direction, neighbor.direction)) {
      continue;
    }

    const targetArtifact = neighbor.artifact;
    if (!targetMatches(requirement.targets, targetArtifact, context.workspaceRoot)) {
      continue;
    }

    if (requirement.identifierMatch) {
      const targetIdentifiers = extractIdentifiers(targetArtifact, {
        identifierPattern: context.profile.source.identifierPattern,
        identifierFieldSegments: context.profile.source.identifierFieldSegments
      });

      if (!hasIdentifierIntersection(context.identifiers, targetIdentifiers)) {
        continue;
      }
    }

    matches += 1;
  }

  return matches;
}

function directionMatches(
  expected: "outbound" | "incoming",
  actual: "incoming" | "outgoing"
): boolean {
  if (expected === "incoming") {
    return actual === "incoming";
  }
  return actual === "outgoing";
}

function targetMatches(
  targets: CompiledSymbolProfileTarget[],
  artifact: KnowledgeArtifact,
  workspaceRoot: string
): boolean {
  const relative = toWorkspaceRelativePath(artifact.uri, workspaceRoot);
  if (!relative) {
    return false;
  }

  for (const target of targets) {
    const matchesLayer = !target.layer || target.layer === artifact.layer;
    if (!matchesLayer) {
      continue;
    }

    const matchesMdmdLayer = !target.mdmdLayer || target.mdmdLayer === readMdmdLayer(artifact.metadata);
    if (!matchesMdmdLayer) {
      continue;
    }

    if (target.matchers.some(matcher => matcher(relative))) {
      return true;
    }
  }

  return false;
}

function extractIdentifiers(
  artifact: KnowledgeArtifact,
  options: IdentifierExtractionOptions
): string[] {
  const identifiers = resolveIdentifierArray(artifact.metadata, options.identifierFieldSegments ?? ["mdmd", "identifiers"]);
  if (!identifiers.length) {
    return [];
  }

  if (!options.identifierPattern) {
    return identifiers;
  }

  return identifiers.filter(identifier => options.identifierPattern?.test(identifier));
}

function resolveIdentifierArray(
  metadata: Record<string, unknown> | undefined,
  pathSegments: string[]
): string[] {
  if (!metadata || typeof metadata !== "object" || !pathSegments.length) {
    return [];
  }

  let cursor: unknown = metadata;
  for (const segment of pathSegments) {
    if (!cursor || typeof cursor !== "object") {
      return [];
    }
    cursor = (cursor as Record<string, unknown>)[segment];
  }

  if (!Array.isArray(cursor)) {
    return [];
  }

  return cursor.filter((entry): entry is string => typeof entry === "string" && entry.trim().length > 0);
}

function hasIdentifierIntersection(left: string[], right: string[]): boolean {
  if (!left.length || !right.length) {
    return false;
  }

  const rightSet = new Set(right);
  return left.some(candidate => rightSet.has(candidate));
}

function readMdmdLayer(metadata: Record<string, unknown> | undefined): string | undefined {
  if (!metadata || typeof metadata !== "object") {
    return undefined;
  }

  const mdmd = (metadata as { mdmd?: unknown }).mdmd;
  if (!mdmd || typeof mdmd !== "object") {
    return undefined;
  }

  const layer = (mdmd as { layer?: unknown }).layer;
  return typeof layer === "string" ? layer : undefined;
}

function buildViolationMessage(
  profile: CompiledSymbolProfile,
  requirement: CompiledSymbolProfileRequirement,
  relativeSource: string,
  observed: number
): string {
  const base = requirement.description
    ? `${requirement.description}`
    : `Expected ${requirement.minimum} ${requirement.direction === "incoming" ? "incoming" : "outgoing"} '${requirement.linkKind}' link${requirement.minimum === 1 ? "" : "s"}`;

  const targetDescription = requirement.targets
    .map(target => describeTarget(target))
    .join(" or ");

  return `${base} from ${relativeSource} to ${targetDescription} (observed ${observed}).`;
}

function describeTarget(target: CompiledSymbolProfileTarget): string {
  const globList = target.patterns.length;
  const layerPart = target.layer ? ` layer '${target.layer}'` : "";
  const mdmdPart = target.mdmdLayer ? ` MDMD layer '${target.mdmdLayer}'` : "";
  if (globList === 1) {
    return `targets matching '${target.patterns[0]}'${layerPart}${mdmdPart}`;
  }
  const patternList = target.patterns.map(pattern => `'${pattern}'`).join(", ");
  return `targets matching any of [${patternList}]${layerPart}${mdmdPart}`;
}
