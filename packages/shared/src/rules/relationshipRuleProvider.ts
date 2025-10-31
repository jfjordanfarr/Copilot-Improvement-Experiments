import { compileRelationshipRules, generateRelationshipEvidences, loadRelationshipRuleConfig } from "./relationshipRuleEngine";
import type { RelationshipRuleWarning } from "./relationshipRuleTypes";
import type { WorkspaceLinkContribution, WorkspaceLinkProvider } from "../inference/linkInference";

export interface RelationshipRuleProviderLogger {
  info?(message: string): void;
  warn?(message: string): void;
}

export interface RelationshipRuleProviderOptions {
  workspaceRoot: string;
  configPath?: string;
  createdBy?: string;
  logger?: RelationshipRuleProviderLogger;
  providerId?: string;
  label?: string;
}

const DEFAULT_PROVIDER_ID = "relationship-rules";
const DEFAULT_PROVIDER_LABEL = "Relationship Rule Engine";

export function createRelationshipRuleProvider(options: RelationshipRuleProviderOptions): WorkspaceLinkProvider {
  const providerId = options.providerId ?? DEFAULT_PROVIDER_ID;
  const label = options.label ?? DEFAULT_PROVIDER_LABEL;

  return {
    id: providerId,
    label,
    collect(context): Promise<WorkspaceLinkContribution | undefined> {
      const loadResult = loadRelationshipRuleConfig(options.workspaceRoot, options.configPath);
      logWarnings(options.logger, loadResult.warnings, providerId);

      if (!loadResult.config.rules?.length) {
        return Promise.resolve(undefined);
      }

      const compiled = compileRelationshipRules(loadResult.config, options.workspaceRoot);
      logWarnings(options.logger, compiled.warnings, providerId);

      if (!compiled.rules.length) {
        return Promise.resolve(undefined);
      }

      const { evidences } = generateRelationshipEvidences({
        workspaceRoot: options.workspaceRoot,
        seeds: context.seeds,
        compiled,
        createdBy: options.createdBy ?? providerId
      });

      if (evidences.length && options.logger?.info) {
        options.logger.info(
          `[${providerId}] generated ${evidences.length} relationship evidence${evidences.length === 1 ? "" : "s"}`
        );
      }

      const contribution = evidences.length ? { evidences } : undefined;
      return Promise.resolve(contribution);
    }
  };
}

function logWarnings(
  logger: RelationshipRuleProviderLogger | undefined,
  warnings: RelationshipRuleWarning[] | undefined,
  providerId: string
): void {
  if (!warnings?.length || !logger?.warn) {
    return;
  }

  for (const warning of warnings) {
    if (warning.ruleId) {
      logger.warn(`[${providerId}] ${warning.ruleId}: ${warning.message}`);
    } else {
      logger.warn(`[${providerId}] ${warning.message}`);
    }
  }
}
