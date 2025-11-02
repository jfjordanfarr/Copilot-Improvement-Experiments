#!/usr/bin/env node
import { promises as fs } from "node:fs";
import * as path from "node:path";
import process from "node:process";

const [rootArg] = process.argv.slice(2);
const targetRoot = rootArg ? path.resolve(rootArg) : process.cwd();
const includePattern = /#include\s+"(\.\.\/[^"\n]+)"/g;

async function main() {
  const matches = [];
  await walk(targetRoot, async filePath => {
    if (!filePath.endsWith(".c") && !filePath.endsWith(".h")) {
      return;
    }

    const content = await fs.readFile(filePath, "utf8");
    let match;
    while ((match = includePattern.exec(content)) !== null) {
      matches.push({
        filePath,
        include: match[1],
        line: locateLine(content, match.index)
      });
    }
  });

  if (matches.length === 0) {
    console.log(`No parent-directory includes found under ${targetRoot}`);
    return;
  }

  console.log(`Found ${matches.length} parent-directory include(s):`);
  for (const entry of matches) {
    const relativePath = path.relative(process.cwd(), entry.filePath).replace(/\\/g, "/");
    console.log(`- ${relativePath}:${entry.line} -> ${entry.include}`);
  }
  process.exitCode = 1;
}

async function walk(directory, onFile) {
  const entries = await fs.readdir(directory, { withFileTypes: true });
  for (const entry of entries) {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      await walk(entryPath, onFile);
      continue;
    }
    if (entry.isFile()) {
      await onFile(entryPath);
    }
  }
}

function locateLine(content, index) {
  let line = 1;
  for (let i = 0; i < index; i += 1) {
    if (content.charCodeAt(i) === 10) {
      line += 1;
    }
  }
  return line;
}

main().catch(error => {
  console.error("Failed to scan includes.");
  if (error instanceof Error) {
    console.error(error.message);
  }
  process.exitCode = 1;
});
