import {
  ArtifactLayer,
  ExternalArtifact,
  ExternalLink,
  ExternalSnapshot,
  ExternalStreamEvent,
  LinkRelationshipKind,
  StreamEventKind
} from "@copilot-improvement/shared";

export interface SchemaViolation {
  path: string;
  message: string;
}

export interface SchemaValidationResult {
  valid: boolean;
  issues: SchemaViolation[];
}

const ALLOWED_LAYERS: ArtifactLayer[] = [
  "vision",
  "requirements",
  "architecture",
  "implementation",
  "code"
];

const ALLOWED_LINK_KINDS: LinkRelationshipKind[] = ["documents", "implements", "depends_on", "references"];

const ALLOWED_STREAM_KINDS: StreamEventKind[] = [
  "artifact-upsert",
  "artifact-remove",
  "link-upsert",
  "link-remove"
];

export function validateSnapshot(snapshot: ExternalSnapshot): SchemaValidationResult {
  const issues: SchemaViolation[] = [];

  if (!snapshot) {
    issues.push({ path: "snapshot", message: "Snapshot payload is required." });
    return { valid: false, issues };
  }

  if (!isNonEmptyString(snapshot.label)) {
    issues.push({ path: "snapshot.label", message: "Snapshot label must be a non-empty string." });
  }

  if (snapshot.createdAt && !isIsoTimestamp(snapshot.createdAt)) {
    issues.push({ path: "snapshot.createdAt", message: "createdAt must be an ISO-8601 timestamp." });
  }

  if (snapshot.metadata !== undefined && !isPlainObject(snapshot.metadata)) {
    issues.push({ path: "snapshot.metadata", message: "metadata must be a JSON object when provided." });
  }

  if (!Array.isArray(snapshot.artifacts)) {
    issues.push({ path: "snapshot.artifacts", message: "artifacts must be an array." });
  }

  if (!Array.isArray(snapshot.links)) {
    issues.push({ path: "snapshot.links", message: "links must be an array." });
  }

  const artifactIds = new Set<string>();

  if (Array.isArray(snapshot.artifacts)) {
    snapshot.artifacts.forEach((artifact, index) => {
      const result = validateArtifact(artifact, `snapshot.artifacts[${index}]`);
      issues.push(...result.issues);
      if (result.valid && artifact.id) {
        artifactIds.add(artifact.id);
      }
    });
  }

  if (Array.isArray(snapshot.links)) {
    snapshot.links.forEach((link, index) => {
      const result = validateLink(link, `snapshot.links[${index}]`);
      issues.push(...result.issues);
      if (result.valid) {
        if (artifactIds.size && !artifactIds.has(link.sourceId)) {
          issues.push({
            path: `snapshot.links[${index}].sourceId`,
            message: "sourceId must reference an artifact present in the snapshot."
          });
        }
        if (artifactIds.size && !artifactIds.has(link.targetId)) {
          issues.push({
            path: `snapshot.links[${index}].targetId`,
            message: "targetId must reference an artifact present in the snapshot."
          });
        }
      }
    });
  }

  return { valid: issues.length === 0, issues };
}

export function validateStreamEvent(event: ExternalStreamEvent): SchemaValidationResult {
  const issues: SchemaViolation[] = [];

  if (!event) {
    issues.push({ path: "event", message: "Stream event payload is required." });
    return { valid: false, issues };
  }

  if (!ALLOWED_STREAM_KINDS.includes(event.kind)) {
    issues.push({
      path: "event.kind",
      message: `kind must be one of ${ALLOWED_STREAM_KINDS.join(", ")}.`
    });
  }

  if (!isNonEmptyString(event.sequenceId)) {
    issues.push({ path: "event.sequenceId", message: "sequenceId must be a non-empty string." });
  }

  if (!isIsoTimestamp(event.detectedAt)) {
    issues.push({ path: "event.detectedAt", message: "detectedAt must be an ISO-8601 timestamp." });
  }

  if (event.metadata !== undefined && !isPlainObject(event.metadata)) {
    issues.push({ path: "event.metadata", message: "metadata must be a JSON object when provided." });
  }

  switch (event.kind) {
    case "artifact-upsert": {
      if (!event.artifact) {
        issues.push({
          path: "event.artifact",
          message: "artifact-upsert events must include an artifact payload."
        });
      } else {
        issues.push(...validateArtifact(event.artifact, "event.artifact").issues);
      }
      break;
    }
    case "artifact-remove": {
      if (!isNonEmptyString(event.artifactId) && !(event.artifact && isNonEmptyString(event.artifact.uri))) {
        issues.push({
          path: "event",
          message: "artifact-remove events require artifactId or artifact.uri."
        });
      }
      if (event.artifact) {
        issues.push(...validateArtifact(event.artifact, "event.artifact").issues);
      }
      break;
    }
    case "link-upsert": {
      if (!event.link) {
        issues.push({ path: "event.link", message: "link-upsert events must include a link payload." });
      } else {
        issues.push(...validateLink(event.link, "event.link").issues);
      }
      break;
    }
    case "link-remove": {
      if (!isNonEmptyString(event.linkId) && !(event.link && isNonEmptyString(event.link.id))) {
        issues.push({
          path: "event",
          message: "link-remove events require linkId or link.id."
        });
      }
      if (event.link) {
        issues.push(...validateLink(event.link, "event.link").issues);
      }
      break;
    }
  }

  return { valid: issues.length === 0, issues };
}

export function assertValidSnapshot(snapshot: ExternalSnapshot): void {
  const result = validateSnapshot(snapshot);
  if (!result.valid) {
    throw new Error(renderIssues("snapshot", result.issues));
  }
}

export function assertValidStreamEvent(event: ExternalStreamEvent): void {
  const result = validateStreamEvent(event);
  if (!result.valid) {
    throw new Error(renderIssues("stream event", result.issues));
  }
}

function validateArtifact(artifact: ExternalArtifact, pathBase: string): SchemaValidationResult {
  const issues: SchemaViolation[] = [];

  if (!artifact) {
    issues.push({ path: pathBase, message: "artifact payload is required." });
    return { valid: false, issues };
  }

  if (!isNonEmptyString(artifact.uri)) {
    issues.push({ path: `${pathBase}.uri`, message: "uri must be a non-empty string." });
  }

  if (!ALLOWED_LAYERS.includes(artifact.layer)) {
    issues.push({ path: `${pathBase}.layer`, message: `layer must be one of ${ALLOWED_LAYERS.join(", ")}.` });
  }

  if (artifact.id !== undefined && !isNonEmptyString(artifact.id)) {
    issues.push({ path: `${pathBase}.id`, message: "id must be a non-empty string when provided." });
  }

  if (artifact.language !== undefined && !isNonEmptyString(artifact.language)) {
    issues.push({ path: `${pathBase}.language`, message: "language must be a non-empty string when provided." });
  }

  if (artifact.owner !== undefined && !isNonEmptyString(artifact.owner)) {
    issues.push({ path: `${pathBase}.owner`, message: "owner must be a non-empty string when provided." });
  }

  if (artifact.hash !== undefined && !isNonEmptyString(artifact.hash)) {
    issues.push({ path: `${pathBase}.hash`, message: "hash must be a non-empty string when provided." });
  }

  if (artifact.lastSynchronizedAt !== undefined && !isIsoTimestamp(artifact.lastSynchronizedAt)) {
    issues.push({
      path: `${pathBase}.lastSynchronizedAt`,
      message: "lastSynchronizedAt must be an ISO-8601 timestamp when provided."
    });
  }

  if (artifact.metadata !== undefined && !isPlainObject(artifact.metadata)) {
    issues.push({ path: `${pathBase}.metadata`, message: "metadata must be a JSON object when provided." });
  }

  return { valid: issues.length === 0, issues };
}

function validateLink(link: ExternalLink, pathBase: string): SchemaValidationResult {
  const issues: SchemaViolation[] = [];

  if (!link) {
    issues.push({ path: pathBase, message: "link payload is required." });
    return { valid: false, issues };
  }

  if (!isNonEmptyString(link.sourceId)) {
    issues.push({ path: `${pathBase}.sourceId`, message: "sourceId must be a non-empty string." });
  }

  if (!isNonEmptyString(link.targetId)) {
    issues.push({ path: `${pathBase}.targetId`, message: "targetId must be a non-empty string." });
  }

  if (!ALLOWED_LINK_KINDS.includes(link.kind)) {
    issues.push({ path: `${pathBase}.kind`, message: `kind must be one of ${ALLOWED_LINK_KINDS.join(", ")}.` });
  }

  if (link.id !== undefined && !isNonEmptyString(link.id)) {
    issues.push({ path: `${pathBase}.id`, message: "id must be a non-empty string when provided." });
  }

  if (link.confidence !== undefined && !isFiniteNumber(link.confidence, 0, 1)) {
    issues.push({
      path: `${pathBase}.confidence`,
      message: "confidence must be a number between 0 and 1 when provided."
    });
  }

  if (link.createdAt !== undefined && !isIsoTimestamp(link.createdAt)) {
    issues.push({ path: `${pathBase}.createdAt`, message: "createdAt must be an ISO-8601 timestamp when provided." });
  }

  if (link.createdBy !== undefined && !isNonEmptyString(link.createdBy)) {
    issues.push({ path: `${pathBase}.createdBy`, message: "createdBy must be a non-empty string when provided." });
  }

  if (link.metadata !== undefined && !isPlainObject(link.metadata)) {
    issues.push({ path: `${pathBase}.metadata`, message: "metadata must be a JSON object when provided." });
  }

  return { valid: issues.length === 0, issues };
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isFiniteNumber(value: unknown, min: number, max: number): value is number {
  return typeof value === "number" && Number.isFinite(value) && value >= min && value <= max;
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (value === null || typeof value !== "object" || Array.isArray(value)) {
    return false;
  }
  return true;
}

function isIsoTimestamp(value: unknown): value is string {
  if (typeof value !== "string") {
    return false;
  }
  const parsed = Date.parse(value);
  return Number.isFinite(parsed);
}

function renderIssues(scope: string, issues: SchemaViolation[]): string {
  const header = `${scope} failed schema validation:`;
  const details = issues.map((issue) => ` - ${issue.path}: ${issue.message}`).join("\n");
  return `${header}\n${details}`;
}
