import { Connection } from "vscode-languageserver/node";

import {
  GraphStore,
  LinkedArtifactSummary,
  RebindRequiredPayload,
  RebindImpactedArtifact,
  RebindReason
} from "@copilot-improvement/shared";

const REBIND_NOTIFICATION = "linkDiagnostics/maintenance/rebindRequired";

export function handleArtifactDeleted(
  connection: Connection,
  store: GraphStore,
  uri: string
): void {
  handleRemoval(connection, store, uri, "delete");
}

export function handleArtifactRenamed(
  connection: Connection,
  store: GraphStore,
  oldUri: string,
  newUri: string
): void {
  handleRemoval(connection, store, oldUri, "rename", newUri);
}

function handleRemoval(
  connection: Connection,
  store: GraphStore,
  uri: string,
  reason: RebindReason,
  newUri?: string
): void {
  const artifact = store.getArtifactByUri(uri);
  if (!artifact) {
    connection.console.info(`no artifact registered for ${uri}; skipping orphan cleanup`);
    return;
  }

  const linked = store.listLinkedArtifacts(artifact.id);
  store.removeArtifact(artifact.id);

  if (linked.length === 0) {
    connection.console.info(`no linked artifacts remained after removing ${uri}`);
    return;
  }

  const impacted: RebindImpactedArtifact[] = linked.map(toImpactedArtifact);

  const payload: RebindRequiredPayload = {
    removed: { uri: artifact.uri, layer: artifact.layer },
    reason,
    newUri,
    impacted
  };

  void connection.sendNotification(REBIND_NOTIFICATION, payload);
}

function toImpactedArtifact(summary: LinkedArtifactSummary): RebindImpactedArtifact {
  return {
    uri: summary.artifact.uri,
    layer: summary.artifact.layer,
    relationship: summary.kind,
    direction: summary.direction
  };
}
