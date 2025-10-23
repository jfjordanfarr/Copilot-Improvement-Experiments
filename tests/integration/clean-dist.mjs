import fs from "node:fs";
import path from "node:path";

const distDir = path.resolve(process.cwd(), "tests", "integration", "dist");

try {
  if (fs.existsSync(distDir)) {
    fs.rmSync(distDir, { recursive: true, force: true });
    console.log(`[clean] Removed ${distDir}`);
  } else {
    console.log(`[clean] No dist to remove at ${distDir}`);
  }
} catch (err) {
  console.error(`[clean] Failed to remove ${distDir}:`, err instanceof Error ? err.message : String(err));
  process.exit(1);
}
