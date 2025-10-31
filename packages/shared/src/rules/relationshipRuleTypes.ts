import type { ArtifactLayer, LinkRelationshipKind } from "../domain/artifacts";
import type { ArtifactSeed } from "../inference/fallbackInference";

export type SymbolProfileRequirementDirection = "outbound" | "incoming";

export interface RelationshipRuleStepConfig {
  name: string;
  glob: string;
  layer?: ArtifactLayer;
  mdmdLayer?: string;
  resolver?: string;
  linkKind?: LinkRelationshipKind;
  confidence?: number;
}

export interface RelationshipRulePropagationConfig {
  from: string;
  to: string;
  linkKind?: LinkRelationshipKind;
  confidence?: number;
}

export interface RelationshipRuleConfig {
  id: string;
  label?: string;
  description?: string;
  sequence: RelationshipRuleStepConfig[];
  propagate?: RelationshipRulePropagationConfig[];
}

export interface RelationshipRulesConfig {
  version?: number;
  rules?: RelationshipRuleConfig[];
  chains?: RelationshipRuleConfig[];
  profiles?: SymbolCorrectnessProfileConfig[];
}

export interface RelationshipRuleConfigLoadResult {
  configPath: string;
  config: RelationshipRulesConfig;
  warnings: RelationshipRuleWarning[];
}

export interface RelationshipRuleWarning {
  ruleId?: string;
  profileId?: string;
  message: string;
}

export interface RelationshipResolverResult {
  target: ArtifactSeed;
  rationale?: string;
}

export interface RelationshipResolverOptions {
  workspaceRoot: string;
  source: ArtifactSeed;
  previousStep: CompiledRelationshipRuleStep;
  currentStep: CompiledRelationshipRuleStep;
  candidateTargets: ArtifactSeed[];
}

export interface RelationshipResolver {
  id: string;
  resolve(options: RelationshipResolverOptions): RelationshipResolverResult[];
}

export interface CompiledRelationshipRuleStep {
  name: string;
  matches(candidate: string): boolean;
  layer?: ArtifactLayer;
  mdmdLayer?: string;
  resolver?: RelationshipResolver;
  resolverId?: string;
  linkKind: LinkRelationshipKind;
  confidence: number;
}

export interface CompiledRelationshipRulePropagation {
  fromIndex: number;
  toIndex: number;
  linkKind: LinkRelationshipKind;
  confidence: number;
}

export interface CompiledRelationshipRule {
  id: string;
  label?: string;
  description?: string;
  steps: CompiledRelationshipRuleStep[];
  propagations: CompiledRelationshipRulePropagation[];
}

export interface CompiledRelationshipRules {
  rules: CompiledRelationshipRule[];
  profiles?: CompiledSymbolProfile[];
  warnings: RelationshipRuleWarning[];
}

export interface RelationshipRuleChain {
  ruleId: string;
  steps: RelationshipRuleChainStep[];
}

export interface RelationshipRuleChainStep {
  name: string;
  artifact: ArtifactSeed;
  rationale?: string;
}

export interface SymbolProfileSourceConfig {
  glob: string | string[];
  layer?: ArtifactLayer;
  mdmdLayer?: string;
  identifierPattern?: string;
  identifierField?: string;
}

export interface SymbolProfileTargetConfig {
  glob: string | string[];
  layer?: ArtifactLayer;
  mdmdLayer?: string;
}

export interface SymbolProfileRequirementConfig {
  id: string;
  description?: string;
  linkKind: LinkRelationshipKind;
  direction?: SymbolProfileRequirementDirection;
  targets: SymbolProfileTargetConfig | SymbolProfileTargetConfig[];
  minimum?: number;
  identifierMatch?: boolean;
  chainId?: string;
}

export interface SymbolCorrectnessProfileConfig {
  id: string;
  label?: string;
  source: SymbolProfileSourceConfig;
  requirements: SymbolProfileRequirementConfig[];
  notes?: string;
  enforce?: boolean;
}

export interface CompiledSymbolProfileTarget {
  patterns: string[];
  matchers: ((candidate: string) => boolean)[];
  layer?: ArtifactLayer;
  mdmdLayer?: string;
}

export interface CompiledSymbolProfileRequirement {
  id: string;
  description?: string;
  linkKind: LinkRelationshipKind;
  direction: SymbolProfileRequirementDirection;
  targets: CompiledSymbolProfileTarget[];
  minimum: number;
  identifierMatch: boolean;
  chainId?: string;
}

export interface CompiledSymbolProfileSource {
  matchers: ((candidate: string) => boolean)[];
  layer?: ArtifactLayer;
  mdmdLayer?: string;
  identifierPattern?: RegExp;
  identifierFieldSegments?: string[];
}

export interface CompiledSymbolProfile {
  id: string;
  label?: string;
  notes?: string;
  enforce: boolean;
  source: CompiledSymbolProfileSource;
  requirements: CompiledSymbolProfileRequirement[];
}

export interface SymbolProfileLookup {
  profiles: CompiledSymbolProfile[];
  findProfilesForArtifact(
    artifact: { uri: string; layer?: ArtifactLayer; metadata?: Record<string, unknown> },
    workspaceRoot: string
  ): CompiledSymbolProfile[];
}
