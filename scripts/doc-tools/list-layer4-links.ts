import * as fs from "node:fs/promises";
import * as path from "node:path";

interface Finding {
  filePath: string;
  line: number;
  linkText: string;
  target: string;
}

async function main(): Promise<void> {
  const root = process.argv[2] ?? path.join(process.cwd(), ".mdmd");
  const findings: Finding[] = [];

  await walk(root, async filePath => {
    if (!filePath.endsWith(".mdmd.md")) {
      return;
    }

    const content = await fs.readFile(filePath, "utf8");
    const lines = content.split(/\r?\n/);
    const linkRegex = /\[([^\]]+)]\(([^)]+)\)/g;

    lines.forEach((line, index) => {
      let match: RegExpExecArray | null;
      while ((match = linkRegex.exec(line)) !== null) {
        const target = match[2];
        if (target.includes("layer-4")) {
          findings.push({
            filePath,
            line: index + 1,
            linkText: match[1],
            target
          });
        }
      }
    });
  });

  if (findings.length === 0) {
    console.log("No layer-4 links found.");
    return;
  }

  console.log(`Found ${findings.length} layer-4 link(s) across ${new Set(findings.map(f => f.filePath)).size} file(s).`);
  let currentFile = "";
  for (const finding of findings) {
    if (finding.filePath !== currentFile) {
      currentFile = finding.filePath;
      console.log(`\n${currentFile}`);
    }
    console.log(`  L${finding.line}: [${finding.linkText}](${finding.target})`);
  }
}

async function walk(dir: string, onFile: (filePath: string) => Promise<void>): Promise<void> {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await walk(fullPath, onFile);
    } else if (entry.isFile()) {
      await onFile(fullPath);
    }
  }
}

main().catch(error => {
  console.error("Failed to list layer-4 links.");
  console.error(error instanceof Error ? error.stack ?? error.message : error);
  process.exitCode = 1;
});
