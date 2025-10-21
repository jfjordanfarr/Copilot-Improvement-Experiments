import path from "node:path";
import { pathToFileURL } from "node:url";
import { describe, expect, it } from "vitest";

import { buildFileReferenceHints } from "./pathReferenceDetector";
import { normalizeFileUri } from "../utils/uri";

describe("buildFileReferenceHints", () => {
  const workspaceDir = path.join(process.cwd(), "tests", "integration", "fixtures", "simple-workspace");
  const docFile = path.join(workspaceDir, "docs", "architecture.md");
  const codeFile = path.join(workspaceDir, "src", "core.ts");

  it("detects markdown links referencing code files", () => {
    const docUri = pathToFileURL(docFile).toString();
    const relative = path.relative(path.dirname(docFile), codeFile).replace(/\\/g, "/");

    const hints = buildFileReferenceHints({
      sourceUri: docUri,
      content: `# Changelog\n\nSee [core module](${relative}) for details.`,
      category: "document"
    });

    expect(hints).toHaveLength(1);
    expect(hints[0]?.targetUri).toBe(normalizeFileUri(pathToFileURL(codeFile).toString()));
    expect(hints[0]?.kind).toBe("documents");
    expect(hints[0]?.confidence).toBeGreaterThan(0.6);
  });

  it("detects import statements in code files", () => {
    const codeUri = pathToFileURL(codeFile).toString();
    const docRelative = path.relative(path.dirname(codeFile), docFile).replace(/\\/g, "/");

    const hints = buildFileReferenceHints({
      sourceUri: codeUri,
      content: `import spec from "${docRelative}";\nexport const core = () => spec;`,
      category: "code"
    });

    expect(hints).toHaveLength(1);
    expect(hints[0]?.targetUri).toBe(normalizeFileUri(pathToFileURL(docFile).toString()));
    expect(hints[0]?.kind).toBe("references");
  });

  it("ignores http links and unresolved files", () => {
    const docUri = pathToFileURL(docFile).toString();

    const hints = buildFileReferenceHints({
      sourceUri: docUri,
      content: `See https://example.com for more info and [missing file](./missing.ts).`,
      category: "document"
    });

    expect(hints).toHaveLength(0);
  });
});
