import type { ArtifactLayer } from "../../domain/artifacts";

export function isDocumentLayer(layer: ArtifactLayer): boolean {
  return layer === "vision" || layer === "requirements" || layer === "architecture";
}

export function isImplementationLayer(layer: ArtifactLayer): boolean {
  return layer === "implementation" || layer === "code";
}
