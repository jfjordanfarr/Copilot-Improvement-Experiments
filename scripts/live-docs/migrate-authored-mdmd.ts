import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const liveDocsDir = path.join(root, '.live-documentation', 'source');
const mdmdSuffix = '.mdmd.md';
const migrated: string[] = [];
const promoted: string[] = [];
const skipped: string[] = [];

function collectMdmdFiles(dir: string, acc: string[] = []): string[] {
  if (!fs.existsSync(dir)) {
    return acc;
  }

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const entryPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      collectMdmdFiles(entryPath, acc);
    } else if (entry.isFile() && entry.name.endsWith(mdmdSuffix)) {
      acc.push(entryPath);
    }
  }

  return acc;
}

function normalizeLinks(markdown: string): string {
  return markdown.replaceAll('.mdmd.md', '.md');
}

function extractAuthoredSection(content: string): string | null {
  const authoredIndex = content.indexOf('## Authored');
  const generatedIndex = content.indexOf('## Generated', authoredIndex === -1 ? 0 : authoredIndex);

  if (authoredIndex === -1 || generatedIndex === -1) {
    return null;
  }

  return content.slice(authoredIndex, generatedIndex).trimEnd() + '\n\n';
}

function replaceAuthoredSection(content: string, authoredSection: string): string | null {
  const authoredIndex = content.indexOf('## Authored');
  const generatedIndex = content.indexOf('## Generated', authoredIndex === -1 ? 0 : authoredIndex);

  if (authoredIndex === -1 || generatedIndex === -1) {
    return null;
  }

  const before = content.slice(0, authoredIndex);
  const after = content.slice(generatedIndex);
  const needsLeadingNewline = before.endsWith('\n') ? '' : '\n';
  return `${before}${needsLeadingNewline}${authoredSection}${after.startsWith('\n') ? '' : '\n'}${after}`;
}

function ensureDirectory(filePath: string): void {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
}

function migrate(): void {
  const mdmdFiles = collectMdmdFiles(liveDocsDir);

  for (const legacyPath of mdmdFiles) {
    const legacyContent = fs.readFileSync(legacyPath, 'utf8');
    const authoredSection = extractAuthoredSection(legacyContent);
    const normalizedAuthored = authoredSection ? normalizeLinks(authoredSection) : null;
    const targetPath = legacyPath.replace(/\.mdmd\.md$/, '.md');

    if (fs.existsSync(targetPath)) {
      if (!normalizedAuthored) {
        skipped.push(legacyPath);
        continue;
      }

      const targetContent = fs.readFileSync(targetPath, 'utf8');
      const updatedContent = replaceAuthoredSection(targetContent, normalizedAuthored);

      if (!updatedContent) {
        skipped.push(legacyPath);
        continue;
      }

      fs.writeFileSync(targetPath, updatedContent);
      migrated.push(targetPath);
    } else {
      const convertedContent = normalizeLinks(legacyContent);
      ensureDirectory(targetPath);
      fs.writeFileSync(targetPath, convertedContent);
      promoted.push(targetPath);
    }

    fs.unlinkSync(legacyPath);
  }

  console.log(`Processed ${mdmdFiles.length} legacy Live Docs.`);
  console.log(`  Migrated authored sections into existing .md files: ${migrated.length}`);
  console.log(`  Promoted standalone legacy docs to .md: ${promoted.length}`);

  if (skipped.length) {
    console.warn(`Skipped ${skipped.length} file(s) due to missing markers:`);
    for (const file of skipped) {
      console.warn(`  - ${path.relative(root, file)}`);
    }
  }
}

migrate();
