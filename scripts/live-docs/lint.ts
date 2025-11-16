#!/usr/bin/env node
import { glob } from "glob";
import * as fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";

import {
  DEFAULT_LIVE_DOCUMENTATION_CONFIG,
  LIVE_DOCUMENTATION_FILE_EXTENSION,
  normalizeLiveDocumentationConfig,
  type LiveDocumentationEvidenceStrictMode
} from "@copilot-improvement/shared/config/liveDocumentationConfig";

interface LintIssue {
  file: string;
  message: string;
}

interface LintWarning {
  file: string;
  message: string;
}

async function main(): Promise<void> {
  const workspaceRoot = process.cwd();
  const config = normalizeLiveDocumentationConfig({
    ...DEFAULT_LIVE_DOCUMENTATION_CONFIG
  });

  const docGlob = path.join(
    config.root,
    config.baseLayer,
    "**",
    `*${LIVE_DOCUMENTATION_FILE_EXTENSION}`
  );
  const files = await glob(docGlob, {
    cwd: workspaceRoot,
    absolute: true,
    nodir: true,
    windowsPathsNoEscape: true
  });

  if (files.length === 0) {
    console.log("live-docs:lint — no staged Live Docs found");
    return;
  }

  const issues: LintIssue[] = [];
  const warnings: LintWarning[] = [];

  await Promise.all(
    files.map(async (absolutePath) => {
      const content = await fs.readFile(absolutePath, "utf8");
      const relativePath = path.relative(workspaceRoot, absolutePath).split(path.sep).join("/");

      validateStructure(relativePath, content, issues);

      const archetype = detectArchetype(content);
      if (archetype === "implementation") {
        validateImplementationEvidence(
          relativePath,
          content,
          warnings,
          issues,
          config.evidence.strict
        );
      } else if (archetype === "test") {
        validateTestLinks(relativePath, content, warnings);
      }

      validateRelativeLinks(relativePath, content, issues);
    })
  );

  if (warnings.length > 0) {
    console.warn("\nLive Doc lint warnings:");
    for (const warning of warnings) {
      console.warn(`- ${warning.file}: ${warning.message}`);
    }
  }

  if (issues.length > 0) {
    console.error("\nLive Doc lint failures:");
    for (const issue of issues) {
      console.error(`- ${issue.file}: ${issue.message}`);
    }
    process.exitCode = 1;
    return;
  }

  console.log(`live-docs:lint — ${files.length} file(s) validated`);
}

function validateStructure(file: string, content: string, issues: LintIssue[]): void {
  const requiredHeadings = ["## Metadata", "## Authored", "## Generated"];
  for (const heading of requiredHeadings) {
    if (!content.includes(heading)) {
      issues.push({
        file,
        message: `missing required heading: ${heading}`
      });
    }
  }

  const requiredSections = ["Public Symbols", "Dependencies"];
  for (const section of requiredSections) {
    if (!hasSection(content, section)) {
      issues.push({
        file,
        message: `missing generated section markers for ${section}`
      });
    }
  }
}

function validateImplementationEvidence(
  file: string,
  content: string,
  warnings: LintWarning[],
  issues: LintIssue[],
  strictMode: LiveDocumentationEvidenceStrictMode
): void {
  const observedEvidenceExists = hasSection(content, "Observed Evidence");
  if (!observedEvidenceExists) {
    return;
  }

  const block = extractSection(content, "Observed Evidence");
  const trimmed = block.trim();
  if (!trimmed) {
    reportEvidenceProblem(
      file,
      "Observed Evidence block empty",
      strictMode,
      warnings,
      issues
    );
    return;
  }

  const waiverMatch = trimmed.match(/^<!--\s*evidence-waived[^>]*-->/i);
  const hasWaiver = Boolean(waiverMatch);
  const remainder = hasWaiver ? trimmed.slice(waiverMatch![0].length).trim() : trimmed;

  const lines = remainder.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  const hasDefaultMessage = lines.some((line) =>
    line.toLowerCase().includes("_no automated evidence found_")
  );
  const hasBullet = lines.some((line) => line.startsWith("- "));
  const hasEvidenceEntries = hasBullet || (!hasDefaultMessage && lines.length > 0);

  if (!hasEvidenceEntries) {
    if (hasWaiver) {
      if (!hasDefaultMessage) {
        warnings.push({
          file,
          message: "Evidence waiver present but default message missing"
        });
      }
      return;
    }

    reportEvidenceProblem(
      file,
      "Observed Evidence contains no automated evidence and lacks a waiver comment",
      strictMode,
      warnings,
      issues
    );
    return;
  }

  if (hasDefaultMessage && !hasWaiver) {
    reportEvidenceProblem(
      file,
      "Observed Evidence indicates no automated evidence but is missing an evidence waiver comment",
      strictMode,
      warnings,
      issues
    );
  }

  if (hasWaiver && hasEvidenceEntries && !hasDefaultMessage) {
    warnings.push({
      file,
      message: "Evidence waiver present despite recorded evidence entries"
    });
  }

  if (!hasBullet && !hasDefaultMessage) {
    warnings.push({
      file,
      message: "Observed Evidence should enumerate tests as bullet list items"
    });
  }
}

function reportEvidenceProblem(
  file: string,
  message: string,
  strictMode: LiveDocumentationEvidenceStrictMode,
  warnings: LintWarning[],
  issues: LintIssue[]
): void {
  if (strictMode === "off") {
    return;
  }

  if (strictMode === "error") {
    issues.push({ file, message });
    return;
  }

  warnings.push({ file, message });
}

function validateTestLinks(file: string, content: string, warnings: LintWarning[]): void {
  if (!hasSection(content, "Targets")) {
    warnings.push({
      file,
      message: "Targets block missing"
    });
  }
  if (!hasSection(content, "Supporting Fixtures")) {
    warnings.push({
      file,
      message: "Supporting Fixtures block missing"
    });
  }
}

function validateRelativeLinks(file: string, content: string, issues: LintIssue[]): void {
  const linkPattern = /\[[^\]]*\]\(([^)]+)\)/g;
  let match: RegExpExecArray | null;
  while ((match = linkPattern.exec(content))) {
    const target = match[1];
    if (target.startsWith("http://") || target.startsWith("https://")) {
      issues.push({
        file,
        message: `contains absolute link (${target})`
      });
    }
    if (/^[a-zA-Z]+:\\/.test(target)) {
      issues.push({
        file,
        message: `contains absolute filesystem link (${target})`
      });
    }
  }
}

function hasSection(content: string, section: string): boolean {
  const begin = `<!-- LIVE-DOC:BEGIN ${section} -->`;
  const end = `<!-- LIVE-DOC:END ${section} -->`;
  return content.includes(begin) && content.includes(end);
}

function extractSection(content: string, section: string): string {
  const begin = `<!-- LIVE-DOC:BEGIN ${section} -->`;
  const end = `<!-- LIVE-DOC:END ${section} -->`;
  const startIndex = content.indexOf(begin);
  const endIndex = content.indexOf(end);
  if (startIndex === -1 || endIndex === -1 || endIndex <= startIndex) {
    return "";
  }
  return content.slice(startIndex + begin.length, endIndex).trim();
}

function detectArchetype(content: string): string {
  const match = content.match(/-\s+Archetype:\s+(\w+)/);
  if (match) {
    return match[1].toLowerCase();
  }
  return "implementation";
}

main().catch((error) => {
  console.error("live-docs:lint failed");
  if (error instanceof Error) {
    console.error(error.message);
  }
  process.exit(1);
});