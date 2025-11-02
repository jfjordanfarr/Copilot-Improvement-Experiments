#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import process from "node:process";

function usage() {
  console.log("Usage: node summarize-snapshot.mjs <snapshot.json> [--rel <base-path>]");
}

const args = process.argv.slice(2);
if (args.length === 0 || args.includes("--help")) {
  usage();
  process.exit(args.includes("--help") ? 0 : 1);
}

const snapshotPath = path.resolve(args[0]);
let relBase = process.cwd();
const relIndex = args.indexOf("--rel");
if (relIndex !== -1) {
  const relValue = args[relIndex + 1];
  if (!relValue) {
    console.error("--rel option requires a path");
    process.exit(1);
  }
  relBase = path.resolve(relValue);
}

const raw = fs.readFileSync(snapshotPath, "utf8");
const snapshot = JSON.parse(raw);
const artifacts = new Map(snapshot.artifacts.map(artifact => [artifact.id, artifact]));
const includeLinks = snapshot.links.filter(link => link.kind === "includes");

const perSourceDir = new Map();
const perTarget = new Map();

for (const link of includeLinks) {
  const sourceArtifact = artifacts.get(link.sourceId);
  const targetArtifact = artifacts.get(link.targetId);
  if (!sourceArtifact || !targetArtifact) {
    continue;
  }

  const sourcePath = path.relative(relBase, fileUriToPath(sourceArtifact.uri));
  const targetPath = path.relative(relBase, fileUriToPath(targetArtifact.uri));
  const sourceDir = path.dirname(sourcePath);
  perSourceDir.set(sourceDir, (perSourceDir.get(sourceDir) ?? 0) + 1);
  perTarget.set(targetPath, (perTarget.get(targetPath) ?? 0) + 1);
}

console.log(`Include edges: ${includeLinks.length}`);
console.log("By source directory:");
for (const [dir, count] of [...perSourceDir.entries()].sort((a, b) => a[0].localeCompare(b[0]))) {
  console.log(`  ${dir || '.'}: ${count}`);
}

const topTargets = [...perTarget.entries()]
  .sort((a, b) => b[1] - a[1])
  .slice(0, 15);
console.log("Top included targets:");
for (const [target, count] of topTargets) {
  console.log(`  ${target}: ${count}`);
}

function fileUriToPath(uri) {
  if (!uri.startsWith("file://")) {
    throw new Error(`Unsupported URI: ${uri}`);
  }
  const url = new URL(uri);
  return path.normalize(url.pathname.replace(/^\//, ""));
}
