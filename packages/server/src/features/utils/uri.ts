import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

/**
 * Normalise a file URI so equivalent paths resolve to a consistent canonical representation.
 * Ensures Windows drive letters and percent-encoded segments are handled uniformly.
 */
export function normalizeFileUri(uri: string): string {
  const trimmed = uri.trim();
  if (!trimmed.startsWith("file://")) {
    return trimmed;
  }

  try {
    const filePath = fileURLToPath(trimmed);
    return pathToFileURL(path.normalize(filePath)).toString();
  } catch {
    return trimmed;
  }
}
