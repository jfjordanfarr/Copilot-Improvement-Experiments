import { describe, expect, it } from "vitest";

import { LinkRelationshipKind } from "../domain/artifacts";
import { inferFallbackGraph } from "./fallbackInference";

describe("fallback inference language heuristics", () => {
  it("links C translation units when functions are invoked across files", async () => {
    const result = await inferFallbackGraph({
      seeds: [
        {
          uri: "file:///repo/src/main.c",
          layer: "code",
          content: [
            "#include \"util.h\"",
            "int main(void) {",
            "  return add(2, 3);",
            "}"
          ].join("\n")
        },
        {
          uri: "file:///repo/src/util.c",
          layer: "code",
          content: [
            "#include \"util.h\"",
            "int add(int left, int right) {",
            "  return left + right;",
            "}"
          ].join("\n")
        },
        {
          uri: "file:///repo/src/util.h",
          layer: "code",
          content: "int add(int left, int right);\n"
        }
      ]
    });

    const mainId = getArtifactId(result, "main.c");
    const utilId = getArtifactId(result, "util.c");

    expect(mainId).toBeDefined();
    expect(utilId).toBeDefined();

    expect(hasLink(result, mainId!, utilId!, "depends_on")).toBe(true);
    expect(hasTrace(result, "main.c", "util.c", "call")).toBe(true);
  });

  it("discovers Rust module edges from mod and use statements", async () => {
    const result = await inferFallbackGraph({
      seeds: [
        {
          uri: "file:///repo/src/lib.rs",
          layer: "code",
          content: [
            "pub mod helpers;",
            "use crate::helpers::math::Calculator;",
            "pub fn build() -> Calculator {",
            "    Calculator::new(5)",
            "}"
          ].join("\n")
        },
        {
          uri: "file:///repo/src/helpers/mod.rs",
          layer: "code",
          content: [
            "pub mod math;",
            "pub use math::Calculator;"
          ].join("\n")
        },
        {
          uri: "file:///repo/src/helpers/math.rs",
          layer: "code",
          content: [
            "pub struct Calculator {",
            "    seed: i32,",
            "}",
            "impl Calculator {",
            "    pub fn new(seed: i32) -> Self {",
            "        Self { seed }",
            "    }",
            "    pub fn value(&self) -> i32 {",
            "        self.seed",
            "    }",
            "}",
            "#[cfg(test)]",
            "mod tests {",
            "    use super::Calculator;",
            "    #[test]",
            "    fn computes_value() {",
            "        assert_eq!(Calculator::new(1).value(), 1);",
            "    }",
            "}"
          ].join("\n")
        }
      ]
    });

    const libId = getArtifactId(result, "lib.rs");
    const helpersId = getArtifactId(result, "helpers/mod.rs");
    const mathId = getArtifactId(result, "helpers/math.rs");

    expect(libId).toBeDefined();
    expect(helpersId).toBeDefined();
    expect(mathId).toBeDefined();

    expect(hasLink(result, libId!, helpersId!, "depends_on")).toBe(true);
    expect(hasLink(result, libId!, mathId!, "depends_on")).toBe(true);
    expect(hasTrace(result, "lib.rs", "helpers/mod.rs", "use")).toBe(true);
    expect(hasTrace(result, "lib.rs", "helpers/math.rs", "use")).toBe(true);
  });

  it("connects Java sources to imported runtime dependencies", async () => {
    const result = await inferFallbackGraph({
      seeds: [
        {
          uri: "file:///repo/src/com/example/App.java",
          layer: "code",
          content: [
            "package com.example;",
            "import com.example.http.RequestBuilder;",
            "import com.example.util.JsonFormatter;",
            "public class App {",
            "  public RequestBuilder create(int timeout) {",
            "    return new RequestBuilder().timeout(timeout);",
            "  }",
            "  public String encode(String value) {",
            "    JsonFormatter formatter = new JsonFormatter();",
            "    return formatter.stringify(value);",
            "  }",
            "}"
          ].join("\n")
        },
        {
          uri: "file:///repo/src/com/example/http/RequestBuilder.java",
          layer: "code",
          content: [
            "package com.example.http;",
            "public class RequestBuilder {",
            "  private int timeout = 0;",
            "  public RequestBuilder timeout(int value) {",
            "    this.timeout = value;",
            "    return this;",
            "  }",
            "  public int buildTimeout() {",
            "    return timeout;",
            "  }",
            "}"
          ].join("\n")
        },
        {
          uri: "file:///repo/src/com/example/util/JsonFormatter.java",
          layer: "code",
          content: [
            "package com.example.util;",
            "public class JsonFormatter {",
            "  public String stringify(String value) {",
            "    return \"\" + value + \"\";",
            "  }",
            "}"
          ].join("\n")
        }
      ]
    });

    const appId = getArtifactId(result, "App.java");
    const builderId = getArtifactId(result, "RequestBuilder.java");
    const formatterId = getArtifactId(result, "JsonFormatter.java");

    expect(appId).toBeDefined();
    expect(builderId).toBeDefined();
    expect(formatterId).toBeDefined();

    expect(hasLink(result, appId!, builderId!, "depends_on")).toBe(true);
    expect(hasLink(result, appId!, formatterId!, "depends_on")).toBe(true);
    expect(hasTrace(result, "App.java", "RequestBuilder.java", "use")).toBe(true);
    expect(hasTrace(result, "App.java", "JsonFormatter.java", "use")).toBe(true);
  });

  it("infers PowerShell dot-source and module relationships", async () => {
    const result = await inferFallbackGraph({
      seeds: [
        {
          uri: "file:///repo/scripts/deploy.ps1",
          layer: "code",
          content: [
            "Using module Microsoft.PowerShell.Utility",
            "#requires -Modules Microsoft.PowerShell.Management",
            ". \"../common/logging.ps1\"",
            "Import-Module MyCompany.Inventory",
            "",
            "function Invoke-Deployment {",
            "  param(",
            "    [string]$Environment",
            "  )",
            "  Write-DeploymentLog \"Deploying to $Environment\"",
            "  Get-InventorySnapshot -Region $Environment",
            "}",
            "",
            "Invoke-Deployment -Environment $Region"
          ].join("\n")
        },
        {
          uri: "file:///repo/common/logging.ps1",
          layer: "code",
          content: [
            "function Write-DeploymentLog {",
            "  param(",
            "    [string]$Message",
            "  )",
            "  \"[LOG] $Message\"",
            "}"
          ].join("\n")
        },
        {
          uri: "file:///repo/modules/Inventory.psm1",
          layer: "code",
          content: [
            "function Get-InventorySnapshot {",
            "  param(",
            "    [string]$Region",
            "  )",
            "  @{",
            "    Region = $Region",
            "    Servers = @(\"srv-01\", \"srv-02\")",
            "  }",
            "}",
            "",
            "Export-ModuleMember -Function Get-InventorySnapshot"
          ].join("\n")
        }
      ]
    });

    const deployId = getArtifactId(result, "deploy.ps1");
    const loggingId = getArtifactId(result, "logging.ps1");
    const inventoryId = getArtifactId(result, "Inventory.psm1");

    expect(deployId).toBeDefined();
    expect(loggingId).toBeDefined();
    expect(inventoryId).toBeDefined();

    expect(hasLink(result, deployId!, loggingId!, "depends_on")).toBe(true);
    expect(hasLink(result, deployId!, inventoryId!, "depends_on")).toBe(true);
    expect(hasTrace(result, "deploy.ps1", "logging.ps1", "import")).toBe(true);
    expect(hasTrace(result, "deploy.ps1", "Inventory.psm1", "import")).toBe(true);
  });

  it("resolves Ruby require_relative chains across sibling files", async () => {
    const result = await inferFallbackGraph({
      seeds: [
        {
          uri: "file:///repo/lib/main.rb",
          layer: "code",
          content: [
            "require_relative \"support/logger\"",
            "module Main",
            "  def self.boot(name)",
            "    Support::Logger.info(name)",
            "  end",
            "end"
          ].join("\n")
        },
        {
          uri: "file:///repo/lib/support/logger.rb",
          layer: "code",
          content: [
            "module Support",
            "  module Logger",
            "    def self.info(message)",
            "      message.upcase",
            "    end",
            "  end",
            "end"
          ].join("\n")
        }
      ]
    });

    const mainId = getArtifactId(result, "main.rb");
    const loggerId = getArtifactId(result, "support/logger.rb");

    expect(mainId).toBeDefined();
    expect(loggerId).toBeDefined();

    expect(hasLink(result, mainId!, loggerId!, "depends_on")).toBe(true);
    expect(hasTrace(result, "main.rb", "support/logger.rb", "require")).toBe(true);
  });
});

function getArtifactId(
  result: Awaited<ReturnType<typeof inferFallbackGraph>>,
  suffix: string
): string | undefined {
  return result.artifacts.find(artifact => artifact.uri.endsWith(suffix))?.id;
}

function hasLink(
  result: Awaited<ReturnType<typeof inferFallbackGraph>>,
  sourceId: string,
  targetId: string,
  kind: LinkRelationshipKind
): boolean {
  return result.links.some(link => link.sourceId === sourceId && link.targetId === targetId && link.kind === kind);
}

function hasTrace(
  result: Awaited<ReturnType<typeof inferFallbackGraph>>,
  sourceSuffix: string,
  targetSuffix: string,
  context: string
): boolean {
  return result.traces.some(
    trace =>
      trace.sourceUri.endsWith(sourceSuffix) &&
      trace.targetUri.endsWith(targetSuffix) &&
      trace.context === context
  );
}
