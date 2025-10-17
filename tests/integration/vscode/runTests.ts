import * as path from "path";

import { runTests } from "@vscode/test-electron";

async function main(): Promise<void> {
  try {
    const extensionDevelopmentPath = path.resolve(__dirname, "../../../packages/extension");
    const extensionTestsPath = path.resolve(__dirname, "suite");

    await runTests({ extensionDevelopmentPath, extensionTestsPath });
  } catch (error) {
    console.error("Failed to run extension tests", error);
    process.exit(1);
  }
}

void main();
