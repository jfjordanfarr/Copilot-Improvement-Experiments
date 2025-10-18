import { runTests } from "@vscode/test-electron";
import * as path from "path";

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
