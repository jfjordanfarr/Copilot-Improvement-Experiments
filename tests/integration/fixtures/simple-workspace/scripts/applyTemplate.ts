import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

export function applyTemplate(options: {
  workspaceRoot: string;
  target: string;
  environment: string;
  telemetryEnabled: boolean;
  onboardingEnabled: boolean;
}): void {
  const templatePath = resolve(options.workspaceRoot, "templates", "config.template.yaml");
  const targetPath = resolve(options.workspaceRoot, options.target);

  const raw = readFileSync(templatePath, "utf8");
  const rendered = raw
    .replace("${ENVIRONMENT}", options.environment)
    .replace("${TELEMETRY}", options.telemetryEnabled ? "enabled" : "disabled")
    .replace("${ONBOARDING}", options.onboardingEnabled ? "enabled" : "disabled");

  writeFileSync(targetPath, rendered, "utf8");
}
