export type ExplorerLinkKind = "dependency" | "extends" | "implements" | string;

export interface ExplorerNodePayload {
    id: string;
    name: string;
    codePath: string;
    codeRelativePath: string;
    docPath: string;
    docRelativePath: string;
    archetype: string;
    dependencies: string[];
    dependents: string[];
    missingDependencies: string[];
    publicSymbols: string[];
    symbolDocumentation: Record<string, unknown> | undefined;
}

export interface ExplorerLinkPayload {
    source: string | { id: string };
    target: string | { id: string };
    kind: ExplorerLinkKind;
}

export interface ExplorerGraphStats {
    nodes: number;
    links: number;
    missingDependencies: number;
}

export interface ExplorerGraphPayload {
    nodes: ExplorerNodePayload[];
    links: ExplorerLinkPayload[];
    stats: ExplorerGraphStats;
}

export interface ExplorerDetailPayload {
    archetype: string;
    purpose: string;
    publicSymbols: string[];
    dependencies: string[];
    dependents: string[];
    missingDependencies: string[];
    docRelativePath: string;
    codeRelativePath: string;
    symbolDocumentation: Record<string, unknown> | undefined;
}
