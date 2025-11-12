export interface Stage0Symbol {
  name: string;
  type: string;
}

export interface Stage0Doc {
  sourcePath: string;
  docAbsolutePath: string;
  docRelativePath: string;
  archetype: string;
  dependencies: string[];
  externalModules: string[];
  publicSymbols: Stage0Symbol[];
}

export interface Stage0DocLogger {
  warn(message: string): void;
}

export interface TargetManifest {
  suites?: Array<{
    suite?: string;
    kind?: string;
    tests?: Array<{
      path?: string;
      targets?: string[];
      fixtures?: string[];
    }>;
  }>;
}
