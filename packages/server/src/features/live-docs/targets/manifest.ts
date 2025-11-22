import * as fs from "node:fs/promises";
import path from "node:path";

import type { TargetManifest } from "@live-documentation/shared/live-docs/types";

export async function loadTargetManifest(workspaceRoot: string): Promise<TargetManifest | undefined> {
  const manifestPath = path.resolve(workspaceRoot, "data", "live-docs", "targets.json");
  try {
    const raw = await fs.readFile(manifestPath, "utf8");
    return JSON.parse(raw) as TargetManifest;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return undefined;
    }
    throw error;
  }
}
