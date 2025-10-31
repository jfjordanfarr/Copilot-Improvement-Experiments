import { Minimatch } from "minimatch";
import * as fs from "node:fs";
import * as path from "node:path";

import { createBuiltInResolvers } from "./relationshipResolvers";
import type {
  CompiledRelationshipRule,
  CompiledRelationshipRulePropagation,
  CompiledRelationshipRuleStep,
  CompiledRelationshipRules,
  RelationshipRuleChain,
  RelationshipRuleConfig,
  RelationshipRuleConfigLoadResult,
  RelationshipRulePropagationConfig,
  RelationshipRuleStepConfig,
  RelationshipRuleWarning,
  RelationshipRulesConfig,
  RelationshipResolver
} from "./relationshipRuleTypes";
import type { ArtifactSeed } from "../inference/fallbackInference";
import type { LinkEvidence } from "../inference/linkInference";
import { toWorkspaceRelativePath } from "../tooling/pathUtils";

const DEFAULT_CONFIDENCE = 0.8;
const DEFAULT_CREATED_BY = "relationship-rules";
const DEFAULT_RULES_FILE = "link-relationship-rules.json";

const isWindows = process.platform === "win32";

export function loadRelationshipRuleConfig(
  workspaceRoot: string,
  explicitPath?: string
): RelationshipRuleConfigLoadResult {
  const resolvedPath = explicitPath
    ? path.resolve(workspaceRoot, explicitPath)
    : path.resolve(workspaceRoot, DEFAULT_RULES_FILE);

  if (!fs.existsSync(resolvedPath)) {
    return {
      configPath: resolvedPath,
      config: { rules: [] },
      warnings: []
    };
  }

  try {
    const raw = fs.readFileSync(resolvedPath, "utf8");
    const parsed = JSON.parse(raw) as RelationshipRulesConfig | null;
    if (!parsed || typeof parsed !== "object") {
      return {
        configPath: resolvedPath,
        config: { rules: [] },
        warnings: [
          {
            message: "Relationship rules file must be a JSON object."
          }
        ]
      };
    }

    const ruleArray = Array.isArray(parsed.rules)
      ? parsed.rules
      : Array.isArray(parsed.chains)
      ? parsed.chains
      : [];

    const config: RelationshipRulesConfig = {
      ...parsed,
      rules: ruleArray,
      chains: parsed.chains ?? (Array.isArray(parsed.rules) ? parsed.rules : undefined)
    };

    const warnings: RelationshipRuleWarning[] = [];
    if (!Array.isArray(parsed.rules) && !Array.isArray(parsed.chains)) {
      warnings.push({
        message: "Relationship rules file should define a 'chains' array (or legacy 'rules' array)."
      });
    }

    if (parsed.profiles && !Array.isArray(parsed.profiles)) {
      warnings.push({
        message: "Relationship rules file 'profiles' entry must be an array if present."
      });
      config.profiles = [];
    }

    return {
      configPath: resolvedPath,
      config,
      warnings
    };
  } catch (error) {
    return {
      configPath: resolvedPath,
      config: { rules: [] },
      warnings: [
        {
          message: `Failed to parse relationship rules: ${(error as Error).message}`
        }
      ]
    };
  }
}

export function compileRelationshipRules(
  config: RelationshipRulesConfig,
  workspaceRoot: string
): CompiledRelationshipRules {
  const resolverRegistry = createBuiltInResolvers();
  const compiledRules: CompiledRelationshipRule[] = [];
  const warnings: RelationshipRuleWarning[] = [];

  for (const ruleConfig of config.rules ?? []) {
    const compiled = compileRule(ruleConfig, {
      workspaceRoot,
      resolverRegistry,
      warnings
    });

    if (compiled) {
      compiledRules.push(compiled);
    }
  }

  return { rules: compiledRules, warnings };
}

export interface GenerateRelationshipEvidencesOptions {
  workspaceRoot: string;
  seeds: ArtifactSeed[];
  compiled: CompiledRelationshipRules;
  createdBy?: string;
}

export interface RelationshipEvidenceGenerationResult {
  evidences: LinkEvidence[];
  chains: RelationshipRuleChain[];
}

export function generateRelationshipEvidences(
  options: GenerateRelationshipEvidencesOptions
): RelationshipEvidenceGenerationResult {
  const createdBy = options.createdBy ?? DEFAULT_CREATED_BY;
  const evidenceMap = new Map<string, LinkEvidence>();
  const chains: RelationshipRuleChain[] = [];

  for (const rule of options.compiled.rules) {
    const ruleChains = evaluateRule(rule, options.seeds, options.workspaceRoot);
    chains.push(...ruleChains);

    for (const chain of ruleChains) {
      for (let stepIndex = 1; stepIndex < chain.steps.length; stepIndex += 1) {
        const previous = chain.steps[stepIndex - 1];
        const current = chain.steps[stepIndex];
        const stepDef = rule.steps[stepIndex];

        const key = `${previous.artifact.uri}|${current.artifact.uri}|${stepDef.linkKind}`;
        if (evidenceMap.has(key)) {
          continue;
        }

        evidenceMap.set(key, {
          sourceUri: previous.artifact.uri,
          targetUri: current.artifact.uri,
          kind: stepDef.linkKind,
          confidence: stepDef.confidence,
          rationale: buildEvidenceRationale(rule.id, rule.steps[stepIndex - 1].name, stepDef.name, current.rationale),
          createdBy
        });
      }

      for (const propagation of rule.propagations) {
        const fromStep = chain.steps[propagation.fromIndex];
        const toStep = chain.steps[propagation.toIndex];
        if (!fromStep || !toStep) {
          continue;
        }

        const key = `${fromStep.artifact.uri}|${toStep.artifact.uri}|${propagation.linkKind}`;
        if (evidenceMap.has(key)) {
          continue;
        }

        evidenceMap.set(key, {
          sourceUri: fromStep.artifact.uri,
          targetUri: toStep.artifact.uri,
          kind: propagation.linkKind,
          confidence: propagation.confidence,
          rationale: `${rule.id}:${rule.steps[propagation.fromIndex].name}->${rule.steps[propagation.toIndex].name} (propagate)`,
          createdBy
        });
      }
    }
  }

  return {
    evidences: Array.from(evidenceMap.values()),
    chains
  };
}

function compileRule(
  ruleConfig: RelationshipRuleConfig,
  context: {
    workspaceRoot: string;
    resolverRegistry: Map<string, RelationshipResolver>;
    warnings: RelationshipRuleWarning[];
  }
): CompiledRelationshipRule | undefined {
  if (!ruleConfig.sequence || ruleConfig.sequence.length < 2) {
    context.warnings.push({
      ruleId: ruleConfig.id,
      message: "Rule sequence must contain at least two steps."
    });
    return undefined;
  }

  const steps: CompiledRelationshipRuleStep[] = [];
  const seenNames = new Set<string>();

  for (let index = 0; index < ruleConfig.sequence.length; index += 1) {
    const stepConfig = ruleConfig.sequence[index];
    if (!stepConfig?.name || !stepConfig.glob) {
      context.warnings.push({
        ruleId: ruleConfig.id,
        message: `Step ${index} is missing a name or glob.`
      });
      return undefined;
    }

    if (seenNames.has(stepConfig.name)) {
      context.warnings.push({
        ruleId: ruleConfig.id,
        message: `Duplicate step name '${stepConfig.name}' in rule.`
      });
      return undefined;
    }

    seenNames.add(stepConfig.name);

    const matcher = createMatcher(stepConfig.glob);
    const resolver = index === 0 ? undefined : resolveResolver(stepConfig, ruleConfig, context.resolverRegistry, context.warnings);
    const linkKind = inferLinkKind(stepConfig, index);
    const confidence = clampConfidence(stepConfig.confidence ?? DEFAULT_CONFIDENCE);

    steps.push({
      name: stepConfig.name,
      matches: matcher,
      layer: stepConfig.layer,
      mdmdLayer: stepConfig.mdmdLayer,
      resolver,
      resolverId: stepConfig.resolver,
      linkKind,
      confidence
    });
  }

  const propagations = compilePropagations(ruleConfig.propagate ?? [], steps, ruleConfig.id, context.warnings);

  return {
    id: ruleConfig.id,
    label: ruleConfig.label,
    description: ruleConfig.description,
    steps,
    propagations
  };
}

function compilePropagations(
  configs: RelationshipRulePropagationConfig[],
  steps: CompiledRelationshipRuleStep[],
  ruleId: string,
  warnings: RelationshipRuleWarning[]
): CompiledRelationshipRulePropagation[] {
  const entries: CompiledRelationshipRulePropagation[] = [];

  for (const config of configs) {
    const fromIndex = steps.findIndex(step => step.name === config.from);
    const toIndex = steps.findIndex(step => step.name === config.to);
    if (fromIndex === -1 || toIndex === -1) {
      warnings.push({
        ruleId,
        message: `Propagation references unknown steps '${config.from}' -> '${config.to}'.`
      });
      continue;
    }

    entries.push({
      fromIndex,
      toIndex,
      linkKind: config.linkKind ?? inferPropagationLinkKind(steps[fromIndex], steps[toIndex]),
      confidence: clampConfidence(config.confidence ?? DEFAULT_CONFIDENCE)
    });
  }

  return entries;
}

function inferPropagationLinkKind(
  from: CompiledRelationshipRuleStep,
  to: CompiledRelationshipRuleStep
) {
  if (from.layer === "code" || to.layer === "code") {
    return "implements";
  }
  return "documents";
}

function resolveResolver(
  step: RelationshipRuleStepConfig,
  rule: RelationshipRuleConfig,
  registry: Map<string, RelationshipResolver>,
  warnings: RelationshipRuleWarning[]
): RelationshipResolver | undefined {
  if (!step.resolver) {
    warnings.push({
      ruleId: rule.id,
      message: `Step '${step.name}' is missing a resolver.`
    });
    return undefined;
  }

  const match = registry.get(step.resolver);
  if (!match) {
    warnings.push({
      ruleId: rule.id,
      message: `Unknown resolver '${step.resolver}' referenced by step '${step.name}'.`
    });
    return undefined;
  }

  return match;
}

function createMatcher(globPattern: string): (candidate: string) => boolean {
  const normalized = globPattern.replace(/\\/g, "/");
  const matcher = new Minimatch(normalized, {
    dot: true,
    nocase: isWindows
  });

  return (candidate: string): boolean => {
    const normalisedCandidate = candidate.replace(/\\/g, "/");
    return matcher.match(normalisedCandidate) || matcher.match(`/${normalisedCandidate}`);
  };
}

function inferLinkKind(step: RelationshipRuleStepConfig, index: number) {
  if (step.linkKind) {
    return step.linkKind;
  }

  if (index > 0 && step.layer === "code") {
    return "implements";
  }

  return "documents";
}

function evaluateRule(
  rule: CompiledRelationshipRule,
  seeds: ArtifactSeed[],
  workspaceRoot: string
): RelationshipRuleChain[] {
  const stepCandidates = rule.steps.map(step => collectStepMatches(step, seeds, workspaceRoot));
  if (!stepCandidates[0].length) {
    return [];
  }

  let chains = stepCandidates[0].map(seed => ({
    ruleId: rule.id,
    steps: [
      {
        name: rule.steps[0].name,
        artifact: seed
      }
    ]
  }));

  for (let stepIndex = 1; stepIndex < rule.steps.length; stepIndex += 1) {
    const currentStep = rule.steps[stepIndex];
    const previousStep = rule.steps[stepIndex - 1];
    const candidates = stepCandidates[stepIndex];
    if (!currentStep.resolver || !candidates.length) {
      return [];
    }

    const nextChains: RelationshipRuleChain[] = [];

    for (const chain of chains) {
      const source = chain.steps[chain.steps.length - 1].artifact;
      const matches = currentStep.resolver.resolve({
        workspaceRoot,
        source,
        previousStep,
        currentStep,
        candidateTargets: candidates
      });

      for (const match of matches) {
        nextChains.push({
          ruleId: chain.ruleId,
          steps: [
            ...chain.steps,
            {
              name: currentStep.name,
              artifact: match.target,
              rationale: match.rationale
            }
          ]
        });
      }
    }

    if (!nextChains.length) {
      return [];
    }

    chains = nextChains;
  }

  return chains;
}

function buildEvidenceRationale(
  ruleId: string,
  fromStep: string,
  toStep: string,
  resolverRationale?: string
): string {
  const base = `${ruleId}:${fromStep}->${toStep}`;
  if (!resolverRationale) {
    return base;
  }
  return `${base} (${resolverRationale})`;
}

function collectStepMatches(
  step: CompiledRelationshipRuleStep,
  seeds: ArtifactSeed[],
  workspaceRoot: string
): ArtifactSeed[] {
  const matches: ArtifactSeed[] = [];

  for (const seed of seeds) {
    const relative = toWorkspaceRelativePath(seed.uri, workspaceRoot);
    if (!relative) {
      continue;
    }

    if (!step.matches(relative)) {
      continue;
    }

    if (step.layer && seed.layer !== step.layer) {
      continue;
    }

    if (step.mdmdLayer && readMdmdLayer(seed.metadata) !== step.mdmdLayer) {
      continue;
    }

    matches.push(seed);
  }

  return matches;
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

function clampConfidence(value: number): number {
  if (!Number.isFinite(value)) {
    return DEFAULT_CONFIDENCE;
  }
  return Math.max(0, Math.min(1, value));
}
