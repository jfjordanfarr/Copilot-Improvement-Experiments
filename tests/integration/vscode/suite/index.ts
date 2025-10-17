import * as path from "path";

import * as vscodeTest from "@vscode/test-electron";

export async function run(): Promise<void> {
  const testWorkspace = path.resolve(__dirname, "../../fixtures/simple-workspace");
  await vscodeTest.runTests({
    extensionDevelopmentPath: path.resolve(__dirname, "../../../packages/extension"),
    extensionTestsPath: __filename,
    launchArgs: [testWorkspace]
  });
}

void run();
