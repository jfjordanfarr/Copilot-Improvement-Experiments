import type {
  CompiledRelationshipRule,
  CompiledRelationshipRuleStep,
  CompiledRelationshipRules,
  RelationshipRuleWarning
} from "./relationshipRuleTypes";
import type { GraphStore } from "../db/graphStore";
import type { LinkRelationshipKind, KnowledgeArtifact } from "../domain/artifacts";
import { toWorkspaceRelativePath } from "../tooling/pathUtils";

export interface RelationshipCoverageChain {
  ruleId: string;
  label?: string;
  artifactUris: string[];
}

export type RelationshipCoverageIssueKind = "step" | "propagation";

export interface RelationshipCoverageIssue {
  kind: RelationshipCoverageIssueKind;
  ruleId: string;
  label?: string;
  sourceUri: string;
  missingStep: string;
  hopIndex: number;
  expectedKind: LinkRelationshipKind;
  chainUris: string[];
  message: string;
}

export interface RelationshipCoverageRuleResult {
  rule: CompiledRelationshipRule;
  satisfied: RelationshipCoverageChain[];
  issues: RelationshipCoverageIssue[];
  warnings: RelationshipRuleWarning[];
}

export interface RelationshipCoverageResult {
  rules: RelationshipCoverageRuleResult[];
}

export interface EvaluateRelationshipCoverageOptions {
  store: GraphStore;
  compiled: CompiledRelationshipRules;
  workspaceRoot: string;
}

export function evaluateRelationshipCoverage(
  options: EvaluateRelationshipCoverageOptions
): RelationshipCoverageResult {
  const artifacts = options.store.listArtifacts();

  const results: RelationshipCoverageRuleResult[] = [];

  for (const rule of options.compiled.rules) {
    const evaluation = evaluateRuleCoverage(rule, {
      workspaceRoot: options.workspaceRoot,
      store: options.store,
      artifacts
    });

    results.push({
      rule,
      satisfied: evaluation.satisfied,
      issues: evaluation.issues,
      warnings: evaluation.warnings
    });
  }

  return { rules: results };
}

interface RuleEvaluationContext {
  workspaceRoot: string;
  store: GraphStore;
  artifacts: KnowledgeArtifact[];
}

interface RuleEvaluationResult {
  satisfied: RelationshipCoverageChain[];
  issues: RelationshipCoverageIssue[];
  warnings: RelationshipRuleWarning[];
}

function evaluateRuleCoverage(
  rule: CompiledRelationshipRule,
  context: RuleEvaluationContext
): RuleEvaluationResult {
  const stepCandidates = collectStepCandidates(rule, context);
  const warnings: RelationshipRuleWarning[] = [];
  const satisfied: RelationshipCoverageChain[] = [];
  const issues: RelationshipCoverageIssue[] = [];

  if (!stepCandidates[0]?.length) {
    return { satisfied, issues, warnings };
  }

  const missingStepIndex = stepCandidates.findIndex((candidates, index) => index > 0 && !candidates.length);
  if (missingStepIndex !== -1) {
    issues.push({
      kind: "step",
      ruleId: rule.id,
      label: rule.label,
      sourceUri: "",
      missingStep: rule.steps[missingStepIndex].name,
      hopIndex: missingStepIndex,
      expectedKind: rule.steps[missingStepIndex].linkKind,
      chainUris: [],
      message: `Rule '${rule.id}' has no candidate artifacts for step '${rule.steps[missingStepIndex].name}'.`
    });
    return { satisfied, issues, warnings };
  }

  for (const source of stepCandidates[0]) {
    const result = followRuleChain(rule, context, {
      stepIndex: 1,
      chain: [source],
      current: source,
      stepCandidates
    });

    if (result.chain) {
      satisfied.push({
        ruleId: rule.id,
        label: rule.label,
        artifactUris: result.chain.map(artifact => artifact.uri)
      });

      const propagationIssues = verifyPropagations(rule, result.chain, context);
      issues.push(...propagationIssues);
      continue;
    }

    issues.push({
      kind: "step",
      ruleId: rule.id,
      label: rule.label,
      sourceUri: source.uri,
      missingStep: rule.steps[result.failureIndex ?? 1].name,
      hopIndex: result.failureIndex ?? 1,
      expectedKind: rule.steps[result.failureIndex ?? 1].linkKind,
      chainUris: result.partialChain.map(artifact => artifact.uri),
      message: buildMissingStepMessage(rule, result, source)
    });
  }

  return { satisfied, issues, warnings };
}

interface FollowRuleChainContext {
  stepIndex: number;
  chain: KnowledgeArtifact[];
  current: KnowledgeArtifact;
  stepCandidates: KnowledgeArtifact[][];
}

interface FollowRuleChainResult {
  chain?: KnowledgeArtifact[];
  failureIndex?: number;
  partialChain: KnowledgeArtifact[];
}

function followRuleChain(
  rule: CompiledRelationshipRule,
  context: RuleEvaluationContext,
  followContext: FollowRuleChainContext
): FollowRuleChainResult {
  if (followContext.stepIndex >= rule.steps.length) {
    return { chain: followContext.chain, partialChain: followContext.chain };
  }

  const nextStep = rule.steps[followContext.stepIndex];
  const neighbors = context.store.listLinkedArtifacts(followContext.current.id, {
    kinds: [nextStep.linkKind]
  });

  let observedFailureIndex: number | undefined = followContext.stepIndex;

  for (const neighbor of neighbors) {
    if (neighbor.direction !== "outgoing") {
      continue;
    }

    const target = neighbor.artifact;
    if (!matchesStepArtifact(nextStep, target, followContext.stepIndex, followContext.stepCandidates, context.workspaceRoot)) {
      continue;
    }

    const nextContext: FollowRuleChainContext = {
      stepIndex: followContext.stepIndex + 1,
      current: target,
      chain: [...followContext.chain, target],
      stepCandidates: followContext.stepCandidates
    };

    const result = followRuleChain(rule, context, nextContext);
    if (result.chain) {
      return result;
    }

    observedFailureIndex = result.failureIndex ?? observedFailureIndex;
  }

  return {
    failureIndex: observedFailureIndex,
    partialChain: followContext.chain
  };
}

function collectStepCandidates(
  rule: CompiledRelationshipRule,
  context: RuleEvaluationContext
): KnowledgeArtifact[][] {
  const buckets: KnowledgeArtifact[][] = rule.steps.map(() => []);

  for (const artifact of context.artifacts) {
    const relative = toWorkspaceRelativePath(artifact.uri, context.workspaceRoot);
    if (!relative) {
      continue;
    }

    for (let index = 0; index < rule.steps.length; index += 1) {
      const step = rule.steps[index];
      if (!matchesStepAgainstRelativePath(step, relative, artifact)) {
        continue;
      }

      buckets[index].push(artifact);
    }
  }

  return buckets;
}

function matchesStepAgainstRelativePath(
  step: CompiledRelationshipRuleStep,
  relativePath: string,
  artifact: KnowledgeArtifact
): boolean {
  if (!step.matches(relativePath)) {
    return false;
  }

  if (step.layer && artifact.layer !== step.layer) {
    return false;
  }

  if (step.mdmdLayer && readMdmdLayer(artifact.metadata) !== step.mdmdLayer) {
    return false;
  }

  return true;
}

function matchesStepArtifact(
  step: CompiledRelationshipRuleStep,
  artifact: KnowledgeArtifact,
  stepIndex: number,
  stepCandidates: KnowledgeArtifact[][],
  workspaceRoot: string
): boolean {
  if (!stepCandidates[stepIndex]?.some(candidate => candidate.id === artifact.id)) {
    return false;
  }

  const relative = toWorkspaceRelativePath(artifact.uri, workspaceRoot);
  if (!relative) {
    return false;
  }

  return matchesStepAgainstRelativePath(step, relative, artifact);
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

function verifyPropagations(
  rule: CompiledRelationshipRule,
  chain: KnowledgeArtifact[],
  context: RuleEvaluationContext
): RelationshipCoverageIssue[] {
  if (!rule.propagations.length) {
    return [];
  }

  const issues: RelationshipCoverageIssue[] = [];

  for (const propagation of rule.propagations) {
    const fromArtifact = chain[propagation.fromIndex];
    const toArtifact = chain[propagation.toIndex];
    if (!fromArtifact || !toArtifact) {
      continue;
    }

    const neighbors = context.store.listLinkedArtifacts(fromArtifact.id, {
      kinds: [propagation.linkKind]
    });

    const hasEdge = neighbors.some(
      neighbor => neighbor.direction === "outgoing" && neighbor.artifact.id === toArtifact.id
    );

    if (!hasEdge) {
      issues.push({
        kind: "propagation",
        ruleId: rule.id,
        label: rule.label,
        sourceUri: chain[0]?.uri ?? fromArtifact.uri,
        missingStep: rule.steps[propagation.toIndex]?.name ?? "(unknown)",
        hopIndex: propagation.toIndex,
        expectedKind: propagation.linkKind,
        chainUris: chain.map(artifact => artifact.uri),
        message: `Propagation '${rule.steps[propagation.fromIndex].name}' -> '${rule.steps[propagation.toIndex].name}' is missing link kind '${propagation.linkKind}'.`
      });
    }
  }

  return issues;
}

function buildMissingStepMessage(
  rule: CompiledRelationshipRule,
  result: FollowRuleChainResult,
  source: KnowledgeArtifact
): string {
  const failureIndex = result.failureIndex ?? 1;
  const failingStep = rule.steps[failureIndex];
  const previousStep = rule.steps[failureIndex - 1];
  const previousUri = result.partialChain[result.partialChain.length - 1]?.uri ?? source.uri;

  return `Missing '${failingStep.name}' (${failingStep.linkKind}) from '${previousStep.name}' in chain starting at ${previousUri}.`;
}

export interface RelationshipCoverageDiagnostic {
  ruleId: string;
  label?: string;
  source: string;
  hop: string;
  message: string;
  kind: RelationshipCoverageIssueKind;
}

export function formatRelationshipDiagnostics(
  result: RelationshipCoverageResult,
  workspaceRoot: string
): RelationshipCoverageDiagnostic[] {
  const diagnostics: RelationshipCoverageDiagnostic[] = [];

  for (const ruleResult of result.rules) {
    for (const issue of ruleResult.issues) {
      const sourceRelative = toWorkspaceRelativePath(issue.sourceUri, workspaceRoot) ?? issue.sourceUri;
      diagnostics.push({
        ruleId: issue.ruleId,
        label: issue.label,
        source: sourceRelative,
        hop: issue.missingStep,
        message: issue.message,
        kind: issue.kind
      });
    }
  }

  return diagnostics.sort((left, right) => {
    if (left.ruleId !== right.ruleId) {
      return left.ruleId.localeCompare(right.ruleId);
    }
    if (left.source !== right.source) {
      return left.source.localeCompare(right.source);
    }
    return left.hop.localeCompare(right.hop);
  });
}
