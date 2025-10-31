import { Minimatch } from "minimatch";

import type {
  CompiledSymbolProfile,
  CompiledSymbolProfileRequirement,
  CompiledSymbolProfileSource,
  CompiledSymbolProfileTarget,
  RelationshipRuleWarning,
  RelationshipRulesConfig,
  SymbolCorrectnessProfileConfig,
  SymbolProfileLookup,
  SymbolProfileRequirementConfig,
  SymbolProfileRequirementDirection,
  SymbolProfileSourceConfig,
  SymbolProfileTargetConfig
} from "./relationshipRuleTypes";
import { toWorkspaceRelativePath } from "../tooling/pathUtils";

const isWindows = process.platform === "win32";

export interface SymbolProfileLoadResult {
  profiles: SymbolCorrectnessProfileConfig[];
  warnings: RelationshipRuleWarning[];
}

export interface CompileSymbolProfilesResult {
  profiles: CompiledSymbolProfile[];
  lookup: SymbolProfileLookup;
  warnings: RelationshipRuleWarning[];
}

export function loadSymbolCorrectnessProfiles(
  config: RelationshipRulesConfig
): SymbolProfileLoadResult {
  if (!config.profiles) {
    return { profiles: [], warnings: [] };
  }

  if (!Array.isArray(config.profiles)) {
    return {
      profiles: [],
      warnings: [
        {
          message: "Symbol correctness profiles must be defined as an array."
        }
      ]
    };
  }

  return { profiles: config.profiles, warnings: [] };
}

export function compileSymbolProfiles(
  config: RelationshipRulesConfig,
  workspaceRoot: string
): CompileSymbolProfilesResult {
  const loadResult = loadSymbolCorrectnessProfiles(config);
  const compiled: CompiledSymbolProfile[] = [];
  const warnings: RelationshipRuleWarning[] = [...loadResult.warnings];

  for (const profile of loadResult.profiles) {
    const compiledProfile = compileProfile(profile, workspaceRoot, warnings);
    if (compiledProfile) {
      compiled.push(compiledProfile);
    }
  }

  const lookup = createSymbolProfileLookup(compiled, workspaceRoot);
  return { profiles: compiled, lookup, warnings };
}

function compileProfile(
  profile: SymbolCorrectnessProfileConfig,
  workspaceRoot: string,
  warnings: RelationshipRuleWarning[]
): CompiledSymbolProfile | undefined {
  if (!profile.id || typeof profile.id !== "string") {
    warnings.push({
      profileId: profile.id,
      message: "Profile is missing a valid 'id'."
    });
    return undefined;
  }

  if (!profile.source) {
    warnings.push({
      profileId: profile.id,
      message: "Profile must define a source section."
    });
    return undefined;
  }

  if (!Array.isArray(profile.requirements) || profile.requirements.length === 0) {
    warnings.push({
      profileId: profile.id,
      message: "Profile must define at least one requirement."
    });
    return undefined;
  }

  const compiledSource = compileSource(profile.id, profile.source, warnings);
  if (!compiledSource) {
    return undefined;
  }

  const compiledRequirements: CompiledSymbolProfileRequirement[] = [];
  for (const requirement of profile.requirements) {
    const compiledRequirement = compileRequirement(profile.id, requirement, warnings);
    if (compiledRequirement) {
      compiledRequirements.push(compiledRequirement);
    }
  }

  if (compiledRequirements.length === 0) {
    warnings.push({
      profileId: profile.id,
      message: "Profile requirements were invalid."
    });
    return undefined;
  }

  return {
    id: profile.id,
    label: profile.label,
    notes: profile.notes,
    enforce: Boolean(profile.enforce),
    source: compiledSource,
    requirements: compiledRequirements
  };
}

function compileSource(
  profileId: string,
  source: SymbolProfileSourceConfig,
  warnings: RelationshipRuleWarning[]
): CompiledSymbolProfileSource | undefined {
  const globs = normalizeGlobArray(source.glob);
  if (globs.length === 0) {
    warnings.push({
      profileId,
      message: "Profile source must include at least one glob pattern."
    });
    return undefined;
  }

  const matchers = globs.map(glob => createMatcher(glob));
  const identifierPattern = source.identifierPattern ? safeCompileRegex(source.identifierPattern, profileId, warnings) : undefined;
  const identifierFieldSegments = source.identifierField
    ? source.identifierField.split(".").filter(segment => segment.length > 0)
    : ["mdmd", "identifiers"];

  return {
    matchers,
    layer: source.layer,
    mdmdLayer: source.mdmdLayer,
    identifierPattern,
    identifierFieldSegments
  };
}

function compileRequirement(
  profileId: string,
  requirement: SymbolProfileRequirementConfig,
  warnings: RelationshipRuleWarning[]
): CompiledSymbolProfileRequirement | undefined {
  if (!requirement.id || typeof requirement.id !== "string") {
    warnings.push({
      profileId,
      message: "Requirement is missing an 'id'."
    });
    return undefined;
  }

  if (!requirement.linkKind) {
    warnings.push({
      profileId,
      message: `Requirement '${requirement.id}' must declare a linkKind.`
    });
    return undefined;
  }

  const targetsConfig = Array.isArray(requirement.targets)
    ? requirement.targets
    : [requirement.targets];

  if (targetsConfig.length === 0) {
    warnings.push({
      profileId,
      message: `Requirement '${requirement.id}' must declare at least one target.`
    });
    return undefined;
  }

  const targets: CompiledSymbolProfileTarget[] = [];
  for (const target of targetsConfig) {
    const compiledTarget = compileTarget(profileId, requirement.id, target, warnings);
    if (compiledTarget) {
      targets.push(compiledTarget);
    }
  }

  if (!targets.length) {
    warnings.push({
      profileId,
      message: `Requirement '${requirement.id}' targets were invalid.`
    });
    return undefined;
  }

  const direction: SymbolProfileRequirementDirection = requirement.direction ?? "outbound";
  const minimum = requirement.minimum && requirement.minimum > 0 ? Math.floor(requirement.minimum) : 1;
  const identifierMatch = Boolean(requirement.identifierMatch);

  return {
    id: requirement.id,
    description: requirement.description,
    linkKind: requirement.linkKind,
    direction,
    targets,
    minimum,
    identifierMatch,
    chainId: requirement.chainId
  };
}

function compileTarget(
  profileId: string,
  requirementId: string,
  target: SymbolProfileTargetConfig,
  warnings: RelationshipRuleWarning[]
): CompiledSymbolProfileTarget | undefined {
  const globs = normalizeGlobArray(target.glob);
  if (globs.length === 0) {
    warnings.push({
      profileId,
      message: `Requirement '${requirementId}' target must include at least one glob.`
    });
    return undefined;
  }

  return {
    patterns: globs,
    matchers: globs.map(glob => createMatcher(glob)),
    layer: target.layer,
    mdmdLayer: target.mdmdLayer
  };
}

function normalizeGlobArray(candidate: string | string[] | undefined): string[] {
  if (!candidate) {
    return [];
  }

  if (Array.isArray(candidate)) {
    return candidate.filter(entry => typeof entry === "string" && entry.trim().length > 0);
  }

  return typeof candidate === "string" && candidate.trim().length > 0 ? [candidate] : [];
}

function createMatcher(pattern: string): (candidate: string) => boolean {
  const normalized = pattern.replace(/\\/g, "/");
  const matcher = new Minimatch(normalized, { dot: true, nocase: isWindows });

  return (candidate: string): boolean => {
    const normalisedCandidate = candidate.replace(/\\/g, "/");
    return matcher.match(normalisedCandidate) || matcher.match(`/${normalisedCandidate}`);
  };
}

function safeCompileRegex(
  pattern: string,
  profileId: string,
  warnings: RelationshipRuleWarning[]
): RegExp | undefined {
  try {
    return new RegExp(pattern);
  } catch (error) {
    warnings.push({
      profileId,
      message: `Invalid identifierPattern '${pattern}': ${(error as Error).message}`
    });
    return undefined;
  }
}

function createSymbolProfileLookup(
  profiles: CompiledSymbolProfile[],
  workspaceRoot: string
): SymbolProfileLookup {
  return {
    profiles,
    findProfilesForArtifact(artifact, root) {
      const resolvedRoot = root ?? workspaceRoot;
      const relative = toWorkspaceRelativePath(artifact.uri, resolvedRoot);
      if (!relative) {
        return [];
      }

      return profiles.filter(profile =>
        profile.source.matchers.some(matcher => matcher(relative)) &&
        matchesLayer(profile.source.layer, artifact.layer) &&
        matchesMdmdLayer(profile.source.mdmdLayer, readMdmdLayer(artifact.metadata))
      );
    }
  };
}

function matchesLayer(expected: SymbolProfileSourceConfig["layer"], actual: string | undefined): boolean {
  if (!expected) {
    return true;
  }
  return expected === actual;
}

function matchesMdmdLayer(expected: string | undefined, actual: string | undefined): boolean {
  if (!expected) {
    return true;
  }
  return expected === actual;
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
