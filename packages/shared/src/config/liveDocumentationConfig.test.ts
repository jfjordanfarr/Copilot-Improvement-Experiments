import { describe, expect, it } from "vitest";

import {
  DEFAULT_LIVE_DOCUMENTATION_CONFIG,
  normalizeLiveDocumentationConfig
} from "./liveDocumentationConfig";

describe("normalizeLiveDocumentationConfig", () => {
  it("returns defaults when no input is provided", () => {
    const config = normalizeLiveDocumentationConfig();

    expect(config.root).toBe(DEFAULT_LIVE_DOCUMENTATION_CONFIG.root);
    expect(config.baseLayer).toBe(DEFAULT_LIVE_DOCUMENTATION_CONFIG.baseLayer);
    expect(config.glob).toEqual(DEFAULT_LIVE_DOCUMENTATION_CONFIG.glob);
    expect(config.archetypeOverrides).toEqual({});
    expect(config.requireRelativeLinks).toBe(true);
    expect(config.slugDialect).toBe("github");
    expect(config.enableDocstringBridge).toBe(false);
    expect(config.evidence.strict).toBe("warning");
  });

  it("merges overrides and de-duplicates glob patterns", () => {
    const config = normalizeLiveDocumentationConfig({
      root: "  docs/ld  ",
      baseLayer: "  layer-four  ",
      glob: [
        "  packages/**/src/**/*.ts  ",
        "packages/**/src/**/*.ts",
        "tests/**/integration/**/*.ts",
        ""
      ],
      archetypeOverrides: {
        "tests/**/*.ts": "test",
        "assets/**/*.png": "asset"
      },
      requireRelativeLinks: false,
      slugDialect: "azure-devops",
      enableDocstringBridge: true,
      evidence: {
        strict: "error"
      }
    });

    expect(config.root).toBe("docs/ld");
    expect(config.baseLayer).toBe("layer-four");
    expect(config.glob).toEqual([
      "packages/**/src/**/*.ts",
      "tests/**/integration/**/*.ts"
    ]);
    expect(config.archetypeOverrides).toEqual({
      "tests/**/*.ts": "test",
      "assets/**/*.png": "asset"
    });
    expect(config.requireRelativeLinks).toBe(false);
    expect(config.slugDialect).toBe("azure-devops");
    expect(config.enableDocstringBridge).toBe(true);
    expect(config.evidence.strict).toBe("error");
  });

  it("falls back to defaults when overrides are blank", () => {
    const config = normalizeLiveDocumentationConfig({
      root: "   ",
      baseLayer: "",
      glob: []
    });

    expect(config.root).toBe(DEFAULT_LIVE_DOCUMENTATION_CONFIG.root);
    expect(config.baseLayer).toBe(DEFAULT_LIVE_DOCUMENTATION_CONFIG.baseLayer);
    expect(config.glob).toEqual(DEFAULT_LIVE_DOCUMENTATION_CONFIG.glob);
    expect(config.evidence.strict).toBe("warning");
  });
});
