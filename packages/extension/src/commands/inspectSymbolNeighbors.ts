import * as vscode from "vscode";
import { LanguageClient } from "vscode-languageclient/node";
import { z } from "zod";

import {
  INSPECT_SYMBOL_NEIGHBORS_REQUEST,
  type InspectSymbolNeighborsParams
} from "@live-documentation/shared";

import { KnowledgeArtifactSchema, LinkRelationshipKindSchema } from "../shared/artifactSchemas";
import { resolveWindowApis } from "../testing/testHooks";

type SymbolNeighborCommandTarget =
  | vscode.Uri
  | string
  | (Partial<InspectSymbolNeighborsParams> & { title?: string });

interface SymbolNeighborQuickPickItem extends vscode.QuickPickItem {
  target: vscode.Uri;
  neighbor: ParsedNeighborNode;
  groupKind: string;
}

interface SymbolNeighborClient {
  sendRequest(method: string, params: InspectSymbolNeighborsParams): Promise<unknown>;
}

export function registerInspectSymbolNeighborsCommand(client: LanguageClient): vscode.Disposable {
  const controller = new SymbolNeighborQuickPickController(client);

  return vscode.commands.registerCommand(
    "linkDiagnostics.inspectSymbolNeighbors",
    async (target?: SymbolNeighborCommandTarget) => {
      await controller.show(target);
    }
  );
}

export class SymbolNeighborQuickPickController {
  constructor(private readonly client: SymbolNeighborClient) {}

  async show(target?: SymbolNeighborCommandTarget): Promise<void> {
    const windowApis = resolveWindowApis();
    const request = this.buildRequest(target);
    if (!request) {
      await windowApis.showInformationMessage(
        "Open a document or provide an artifact identifier to inspect symbol neighbors."
      );
      return;
    }

    let response: ParsedInspectSymbolNeighborsResult;
    try {
      const method = String(INSPECT_SYMBOL_NEIGHBORS_REQUEST);
      const raw = await this.client.sendRequest(method, request.params);
      response = InspectSymbolNeighborsResultSchema.parse(raw);
    } catch (error) {
      await windowApis.showErrorMessage(
        `Unable to inspect symbol neighbors: ${describeError(error)}`
      );
      return;
    }

    if (!response.origin) {
      await windowApis.showInformationMessage(
        "No symbol information is available for that artifact yet."
      );
      return;
    }

    const neighborCount = response.summary.totalNeighbors;
    if (neighborCount === 0 || response.groups.every(group => group.neighbors.length === 0)) {
      await windowApis.showInformationMessage(
        "No neighboring artifacts are recorded for this symbol yet."
      );
      return;
    }

    const originUri = vscode.Uri.parse(response.origin.uri);
    const originLabel = vscode.workspace.asRelativePath(originUri, false);
    const placeholder = this.buildPlaceholder(originLabel, neighborCount, response.summary.maxDepthReached);
    const items = this.buildQuickPickItems(response);

    const selection = await windowApis.showQuickPick(items, {
      placeHolder: placeholder,
      matchOnDescription: true,
      matchOnDetail: true
    });

    if (!selection) {
      return;
    }

    try {
      const document = await vscode.workspace.openTextDocument(selection.target);
      await vscode.window.showTextDocument(document, { preview: false });
    } catch (error) {
      await windowApis.showErrorMessage(
        `Failed to open ${selection.target.toString()}: ${describeError(error)}`
      );
    }
  }

  private buildRequest(target?: SymbolNeighborCommandTarget):
    | { params: InspectSymbolNeighborsParams }
    | undefined {
    if (!target) {
      const editorUri = vscode.window.activeTextEditor?.document.uri;
      if (!editorUri) {
        return undefined;
      }
      return { params: { uri: editorUri.toString() } };
    }

    if (target instanceof vscode.Uri) {
      return { params: { uri: target.toString() } };
    }

    if (typeof target === "string") {
      if (looksLikeUri(target)) {
        try {
          const parsed = vscode.Uri.parse(target);
          return { params: { uri: parsed.toString() } };
        } catch {
          return { params: { artifactId: target } };
        }
      }
      return { params: { artifactId: target } };
    }

    const params: InspectSymbolNeighborsParams = {};
    if (target.artifactId) {
      params.artifactId = target.artifactId;
    }
    if (target.uri) {
      params.uri = target.uri;
    }
    if (typeof target.maxDepth === "number") {
      params.maxDepth = target.maxDepth;
    }
    if (typeof target.maxResults === "number") {
      params.maxResults = target.maxResults;
    }
    if (Array.isArray(target.linkKinds)) {
      params.linkKinds = target.linkKinds;
    }

    if (!params.artifactId && !params.uri) {
      return undefined;
    }

    return { params };
  }

  private buildPlaceholder(originLabel: string, neighborCount: number, maxDepth: number): string {
    const neighborText = neighborCount === 1 ? "neighbor" : "neighbors";
    return `${originLabel} • ${neighborCount} ${neighborText} • max depth ${maxDepth}`;
  }

  private buildQuickPickItems(result: ParsedInspectSymbolNeighborsResult): SymbolNeighborQuickPickItem[] {
    const workspace = vscode.workspace;
    const items: SymbolNeighborQuickPickItem[] = [];

    for (const group of result.groups) {
      for (const neighbor of group.neighbors) {
        const targetUri = vscode.Uri.parse(neighbor.artifact.uri);
        const label = workspace.asRelativePath(targetUri, false);
        const description = this.describeNeighbor(group.kind, neighbor);
        const detail = this.describeNeighborPath(neighbor, workspace);

        items.push({
          label,
          description,
          detail,
          target: targetUri,
          neighbor,
          groupKind: group.kind
        });
      }
    }

    return items;
  }

  private describeNeighbor(groupKind: string, neighbor: ParsedNeighborNode): string {
    const direction = neighbor.direction === "incoming" ? "<-" : "->";
    const confidencePercent = Math.round(neighbor.confidence * 100);
    return `${groupKind} ${direction} depth ${neighbor.depth} • ${confidencePercent}% confidence`;
  }

  private describeNeighborPath(neighbor: ParsedNeighborNode, workspace: typeof vscode.workspace): string | undefined {
    const artifacts = neighbor.path.artifacts;
    if (!artifacts || artifacts.length <= 1) {
      return undefined;
    }

    const originPathSegments = artifacts
      .slice(0, artifacts.length - 1)
      .map(artifact => workspace.asRelativePath(vscode.Uri.parse(artifact.uri), false))
      .filter(segment => segment.length > 0);

    if (originPathSegments.length === 0) {
      return undefined;
    }

    return `via ${originPathSegments.join(" -> ")}`;
  }
}

function looksLikeUri(value: string): boolean {
  return /^\w+:\/\//u.test(value);
}

function describeError(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return String(error);
}

const SymbolNeighborDirectionSchema = z.enum(["incoming", "outgoing"]);

const SymbolNeighborPathSchema = z.object({
  artifacts: z.array(KnowledgeArtifactSchema).min(1)
});

const SymbolNeighborNodeSchema = z.object({
  artifact: KnowledgeArtifactSchema,
  depth: z.number().int().min(1),
  direction: SymbolNeighborDirectionSchema,
  viaLinkId: z.string(),
  viaKind: LinkRelationshipKindSchema,
  confidence: z.number().min(0).max(1),
  path: SymbolNeighborPathSchema
});

const SymbolNeighborGroupSchema = z.object({
  kind: LinkRelationshipKindSchema,
  neighbors: z.array(SymbolNeighborNodeSchema)
});

const InspectSymbolNeighborsResultSchema = z.object({
  origin: KnowledgeArtifactSchema.optional(),
  groups: z.array(SymbolNeighborGroupSchema),
  summary: z.object({
    totalNeighbors: z.number().int().min(0),
    maxDepthReached: z.number().int().min(0)
  })
});

export type ParsedInspectSymbolNeighborsResult = z.infer<
  typeof InspectSymbolNeighborsResultSchema
>;
export type ParsedNeighborNode = z.infer<typeof SymbolNeighborNodeSchema>;

export const InspectSymbolNeighborsResultValidator = InspectSymbolNeighborsResultSchema;
