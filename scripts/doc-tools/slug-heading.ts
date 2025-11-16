import * as fs from "node:fs";

import { createSlugger } from "../../packages/shared/src/tooling/githubSlugger";

const [,, filePath, searchText] = process.argv;
if (!filePath || !searchText) {
  console.error("Usage: tsx slug-heading.ts <file> <search text>");
  process.exit(1);
}

const content = fs.readFileSync(filePath, "utf8");
const lines = content.split(/\r?\n/);
const slugger = createSlugger();

for (const line of lines) {
  const match = /^#+\s+(.*)$/.exec(line.trim());
  if (!match) {
    continue;
  }
  const headingText = match[1];
  const slug = slugger.slug(headingText);
  if (headingText.includes(searchText)) {
    console.log(`Heading: ${headingText}`);
    console.log(`Slug: ${slug}`);
    process.exit(0);
  }
}

console.error(`Heading containing "${searchText}" not found.`);
process.exit(1);
