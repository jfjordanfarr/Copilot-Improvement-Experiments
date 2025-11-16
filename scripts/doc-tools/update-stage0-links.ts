import fs from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2);

if (args.length === 0) {
  console.error('Usage: tsx scripts/doc-tools/update-stage0-links.ts <file> [more files]');
  process.exitCode = 1;
  process.exit();
}

for (const relativePath of args) {
  const absolutePath = path.resolve(process.cwd(), relativePath);

  if (!fs.existsSync(absolutePath)) {
    console.warn(`Skipping ${relativePath} (not found)`);
    continue;
  }

  const original = fs.readFileSync(absolutePath, 'utf8');
  const updated = original
    .replace(/(\.live-documentation\/["'\w\-./]+?)\.mdmd\.md/g, '$1.md')
    .replace(/(\\\.live-documentation\\["'\w\-.\\]+?)\.mdmd\.md/g, '$1.md');

  if (original === updated) {
    console.log(`No .mdmd.md links found in ${relativePath}`);
    continue;
  }

  fs.writeFileSync(absolutePath, updated, 'utf8');
  console.log(`Updated Stage-0 links in ${relativePath}`);
}
