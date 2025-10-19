import { globSync } from "glob";
import Mocha from "mocha";
import * as path from "path";

export async function run(): Promise<void> {
  const mocha = new Mocha({ ui: "tdd", color: true, timeout: 120000 });
  const compiledTestsRoot = path.resolve(__dirname, "..", "..");

  const testFiles = globSync("**/*.test.js", {
    cwd: compiledTestsRoot,
    absolute: true,
    ignore: ["vscode/**", "suite/**"]
  });

  console.log(`Discovered ${testFiles.length} integration test file(s)`);

  for (const file of testFiles) {
    mocha.addFile(file);
  }

  await new Promise<void>((resolve, reject) => {
    try {
      mocha.run((failures) => {
        if (failures > 0) {
          reject(new Error(`${failures} integration test(s) failed`));
        } else {
          resolve();
        }
      });
    } catch (error) {
      reject(error);
    }
  });
}
