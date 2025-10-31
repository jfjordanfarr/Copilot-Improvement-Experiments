import { afterEach, beforeEach, describe, expect, it } from "vitest";
import * as fs from "node:fs/promises";
import * as path from "node:path";
import { tmpdir } from "node:os";
import { pathToFileURL } from "node:url";

// @link ../../../../.mdmd/layer-4/tooling/relationshipRuleProvider.mdmd.md

import {
  compileRelationshipRules,
  generateRelationshipEvidences,
  loadRelationshipRuleConfig
} from "./relationshipRuleEngine";
import { createRelationshipRuleProvider } from "./relationshipRuleProvider";
import { toWorkspaceRelativePath } from "../tooling/pathUtils";
import type { ArtifactSeed } from "../inference/fallbackInference";

const RULE_CONFIG = {
  rules: [
    {
      id: "test-mdmd-chain",
      sequence: [
        {
          name: "layer3-doc",
          glob: ".mdmd/layer-3/**/*.mdmd.md",
          mdmdLayer: "3"
        },
        {
          name: "layer4-doc",
          glob: ".mdmd/layer-4/**/*.mdmd.md",
          resolver: "markdown-links",
          linkKind: "documents",
          confidence: 0.95
        },
        {
          name: "code-file",
          glob: "{packages,tests,scripts}/**/*.{ts,tsx,js,jsx,cts,mts,mjs}",
          resolver: "markdown-links",
          linkKind: "documents",
          confidence: 0.9
        }
      ],
      propagate: [
        {
          from: "layer3-doc",
          to: "code-file",
          linkKind: "documents",
          confidence: 0.85
        }
      ]
    }
  ]
};

describe("createRelationshipRuleProvider", () => {
  let workspaceRoot: string;

  beforeEach(async () => {
    workspaceRoot = await fs.mkdtemp(path.join(tmpdir(), "relationship-rule-provider-"));
    await fs.mkdir(path.join(workspaceRoot, ".mdmd", "layer-3"), { recursive: true });
    await fs.mkdir(path.join(workspaceRoot, ".mdmd", "layer-4", "tooling"), { recursive: true });
    await fs.mkdir(path.join(workspaceRoot, "packages", "shared", "src"), { recursive: true });

    await fs.writeFile(
      path.join(workspaceRoot, "link-relationship-rules.json"),
      `${JSON.stringify(RULE_CONFIG, null, 2)}\n`
    );
  });

  afterEach(async () => {
    await fs.rm(workspaceRoot, { recursive: true, force: true });
  });

  it("emits evidences for matching rule chains", async () => {
    const layer3Path = path.join(
      workspaceRoot,
      ".mdmd",
      "layer-3",
      "relationship-rule-engine.mdmd.md"
    );
    const layer4Path = path.join(
      workspaceRoot,
      ".mdmd",
      "layer-4",
      "tooling",
      "relationship-rule-engine.mdmd.md"
    );
    const codePath = path.join(workspaceRoot, "packages", "shared", "src", "relationshipRuleEngine.ts");

    await fs.writeFile(
      layer3Path,
      `# Test Layer 3\n\n[Layer 4](../layer-4/tooling/relationship-rule-engine.mdmd.md)\n`
    );
    await fs.writeFile(
      layer4Path,
      `# Test Layer 4\n\n- Code Path: [packages/shared/src/relationshipRuleEngine.ts](../../../packages/shared/src/relationshipRuleEngine.ts)\n`
    );
    await fs.writeFile(codePath, "export const placeholder = true;\n");

    const layer3Seed: ArtifactSeed = {
      uri: pathToFileURL(layer3Path).toString(),
      layer: "requirements",
      language: "markdown",
      content: "# Test Layer 3\n\n[Layer 4](../layer-4/tooling/relationship-rule-engine.mdmd.md)",
      metadata: {
        mdmd: {
          layer: "3"
        }
      }
    };

    const layer4Seed: ArtifactSeed = {
      uri: pathToFileURL(layer4Path).toString(),
      layer: "requirements",
      language: "markdown",
      content:
        "# Test Layer 4\n\n- Code Path: [packages/shared/src/relationshipRuleEngine.ts](../../../packages/shared/src/relationshipRuleEngine.ts)",
      metadata: {
        mdmd: {
          layer: "4"
        }
      }
    };

    const codeSeed: ArtifactSeed = {
      uri: pathToFileURL(codePath).toString(),
      layer: "code",
      language: "typescript",
      content: "export const placeholder = true;"
    };

    const loadResult = loadRelationshipRuleConfig(workspaceRoot);
    expect(loadResult.config.rules?.length).toBe(1);
    expect(loadResult.warnings).toEqual([]);

    const compiled = compileRelationshipRules(loadResult.config, workspaceRoot);
    expect(compiled.rules.length).toBe(1);
    expect(compiled.warnings).toEqual([]);

    const rule = compiled.rules[0];
    const seeds = [layer3Seed, layer4Seed, codeSeed];
    const relativeSeeds = seeds.map(seed => ({
      seed,
      relative: toWorkspaceRelativePath(seed.uri, workspaceRoot)
    }));

    for (const entry of relativeSeeds) {
      expect(entry.relative).toBeDefined();
    }

    const stepMatches = rule.steps.map(step =>
      relativeSeeds
        .filter(entry => entry.relative && step.matches(entry.relative))
        .map(entry => entry.seed)
    );

    expect(stepMatches[0].length).toBe(1);
    expect(stepMatches[1].length).toBe(1);
    expect(stepMatches[2].length).toBe(1);

    const layer4CandidateUri = path.relative(workspaceRoot, layer4Path).split(path.sep).join("/");
    const resolvedLayer4Link = path.resolve(
      path.dirname(layer3Path),
      "../layer-4/tooling/relationship-rule-engine.mdmd.md"
    );
    const layer4LinkUri = path.relative(workspaceRoot, resolvedLayer4Link).split(path.sep).join("/");
    expect(layer4CandidateUri).toBe(layer4LinkUri);

    const firstHopMatches = rule.steps[1].resolver?.resolve({
      workspaceRoot,
      source: layer3Seed,
      previousStep: rule.steps[0],
      currentStep: rule.steps[1],
      candidateTargets: stepMatches[1]
    });
    expect(firstHopMatches?.length).toBe(1);

    const secondHopMatches = rule.steps[2].resolver?.resolve({
      workspaceRoot,
      source: layer4Seed,
      previousStep: rule.steps[1],
      currentStep: rule.steps[2],
      candidateTargets: stepMatches[2]
    });
    expect(secondHopMatches?.length).toBe(1);

    const generated = generateRelationshipEvidences({
      workspaceRoot,
      seeds,
      compiled
    });
    expect(generated.evidences.length).toBe(3);

    const provider = createRelationshipRuleProvider({ workspaceRoot });
    const contribution = await provider.collect({ seeds: [layer3Seed, layer4Seed, codeSeed] });

    expect(contribution).toBeDefined();
    expect(contribution?.evidences).toBeDefined();
    expect(contribution?.evidences?.length).toBe(3);

    const kinds = new Set(contribution?.evidences?.map(evidence => evidence.kind));
    expect(kinds.size).toBe(1);
    expect(kinds.has("documents")).toBe(true);
  });
});
