import * as fs from "node:fs";

const [,, filePath, searchText] = process.argv;
if (!filePath || !searchText) {
  console.error("Usage: tsx show-heading-codepoints.ts <file> <search text>");
  process.exit(1);
}

const contents = fs.readFileSync(filePath, "utf8");
const lines = contents.split(/\r?\n/);
const index = lines.findIndex(line => line.includes(searchText));
if (index === -1) {
  console.error(`Could not find text "${searchText}" in ${filePath}`);
  process.exit(1);
}

const line = lines[index];
const codepoints = Array.from(line, ch => `U+${ch.codePointAt(0)?.toString(16).padStart(4, "0")}`);
console.log(`Line ${index + 1}: ${line}`);
console.log(codepoints.join(" "));
