import * as assert from "node:assert";
import * as vscode from "vscode";

/**
 * US1 Integration Test: Developers see code-change impact
 *
 * Confirms that saving implementation files raises diagnostics on every dependent module,
 * honours debounce behaviour, and surfaces transitive dependency ripples.
 */

suite("US1: Developers see code-change impact", () => {
  let workspaceUri: vscode.Uri;
  let entryUri: vscode.Uri;
  let featureUri: vscode.Uri;
  let utilUri: vscode.Uri;

  suiteSetup(async function (this: Mocha.Context) {
    this.timeout(60000);

    const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
    assert.ok(workspaceFolder, "Test workspace must be opened");
    workspaceUri = workspaceFolder.uri;

    entryUri = vscode.Uri.joinPath(workspaceUri, "src", "core.ts");
    featureUri = vscode.Uri.joinPath(workspaceUri, "src", "feature.ts");
    utilUri = vscode.Uri.joinPath(workspaceUri, "src", "util.ts");

    const extension = vscode.extensions.getExtension("copilot-improvement.link-aware-diagnostics");
    assert.ok(extension, "Extension must be installed");

    if (!process.env.LINK_AWARE_PROVIDER_MODE) {
      process.env.LINK_AWARE_PROVIDER_MODE = "local-only";
    }

    await extension.activate();

    const config = vscode.workspace.getConfiguration("linkAwareDiagnostics");
    await config.update("enableDiagnostics", true, vscode.ConfigurationTarget.Workspace);
    await config.update("llmProviderMode", "local-only", vscode.ConfigurationTarget.Workspace);

    await waitForLanguageServerReady();
  });

  test("Code save triggers diagnostics on dependent module", async function (this: Mocha.Context) {
    this.timeout(30000);

    await clearDiagnostics();

    const featureDoc = await vscode.workspace.openTextDocument(featureUri);
    const edit = new vscode.WorkspaceEdit();
    const lastLine = featureDoc.lineAt(featureDoc.lineCount - 1);
    edit.insert(featureUri, lastLine.range.end, `\n// feature touched ${Date.now()}`);
    await vscode.workspace.applyEdit(edit);
    await featureDoc.save();

    await waitForDiagnostics(entryUri, 10000);

    const diagnostics = vscode.languages.getDiagnostics(entryUri);
    assert.ok(diagnostics.length > 0, "Dependent module should receive diagnostics");

    const dependencyDiagnostic = diagnostics.find((d) =>
      d.message.includes("linked dependency changed") && d.code === "code-ripple"
    );
    if (!dependencyDiagnostic) {
      console.log(
        "US1 code diagnostics",
        diagnostics.map((d) => {
          const enriched = d as vscode.Diagnostic & { data?: unknown };
          return { message: d.message, code: d.code, data: enriched.data };
        })
      );
    }
    assert.ok(dependencyDiagnostic, "Diagnostic should reference dependency drift");

    const rippleDiagnostic = dependencyDiagnostic!;

    const codeActions = await vscode.commands.executeCommand<vscode.CodeAction[]>(
      "vscode.executeCodeActionProvider",
      entryUri,
      rippleDiagnostic.range
    );

    assert.ok(
      codeActions?.some((action) => action.title === "View ripple details"),
      "Ripple diagnostics should surface detail quick action"
    );
  });

  test("Transitive dependents receive diagnostics for upstream changes", async function (this: Mocha.Context) {
    this.timeout(40000);

    await clearDiagnostics();

    const utilDoc = await vscode.workspace.openTextDocument(utilUri);
    const edit = new vscode.WorkspaceEdit();
    const lastLine = utilDoc.lineAt(utilDoc.lineCount - 1);
    edit.insert(utilUri, lastLine.range.end, `\n// util touched ${Date.now()}`);
    await vscode.workspace.applyEdit(edit);
    await utilDoc.save();

    await Promise.all([waitForDiagnostics(featureUri, 15000), waitForDiagnostics(entryUri, 15000)]);

    const featureDiagnostics = vscode.languages.getDiagnostics(featureUri);
    const entryDiagnostics = vscode.languages.getDiagnostics(entryUri);

    assert.ok(
      featureDiagnostics.some((d) => d.code === "code-ripple"),
      "Intermediate dependency should report ripple diagnostic"
    );
    assert.ok(
      entryDiagnostics.some((d) => d.code === "code-ripple"),
      "Transitive dependency should report ripple diagnostic"
    );

    const transitive = entryDiagnostics.find((d) => d.code === "code-ripple");
    assert.ok(transitive, "Transitive diagnostic should be present");
    assert.ok(
      /depth\s*\d+/i.test(transitive.message),
      "Transitive diagnostic message should include depth context"
    );
  });

  test("Rapid code edits are debounced into a single diagnostic batch", async function (this: Mocha.Context) {
    this.timeout(40000);

    await clearDiagnostics();

    const featureDoc = await vscode.workspace.openTextDocument(featureUri);
    const trackUpdates = trackDiagnosticUpdates(entryUri);

    for (let i = 0; i < 3; i += 1) {
      const edit = new vscode.WorkspaceEdit();
      const lastLine = featureDoc.lineAt(featureDoc.lineCount - 1);
      edit.insert(featureUri, lastLine.range.end, `\n// burst edit ${i}`);
      await vscode.workspace.applyEdit(edit);
      await featureDoc.save();
      await sleep(150);
    }

    await sleep(5000);

    const updateCount = trackUpdates();
    assert.ok(updateCount <= 2, `Expected <=2 diagnostic batches, received ${updateCount}`);
  });
});

async function waitForLanguageServerReady(): Promise<void> {
  const maxWait = 15000;
  const pollInterval = 500;
  let elapsed = 0;

  while (elapsed < maxWait) {
    try {
      const ready = await vscode.commands.executeCommand<boolean>("linkAwareDiagnostics.isServerReady");
      if (ready) {
        return;
      }
    } catch (error) {
      console.warn("isServerReady command failed", error);
    }

    await sleep(pollInterval);
    elapsed += pollInterval;
  }

  throw new Error("Language server did not become ready within timeout");
}

async function clearDiagnostics(): Promise<void> {
  await vscode.commands.executeCommand("linkAwareDiagnostics.clearAllDiagnostics");
  await sleep(500);
}

async function waitForDiagnostics(uri: vscode.Uri, timeout: number): Promise<void> {
  const pollInterval = 200;
  let elapsed = 0;

  while (elapsed < timeout) {
    const diagnostics = vscode.languages.getDiagnostics(uri);
    if (diagnostics.length > 0) {
      return;
    }
    await sleep(pollInterval);
    elapsed += pollInterval;
  }

  throw new Error(`No diagnostics appeared for ${uri.fsPath} within ${timeout}ms`);
}

function trackDiagnosticUpdates(uri: vscode.Uri): () => number {
  let updateCount = 0;
  const listener = vscode.languages.onDidChangeDiagnostics((event) => {
    if (event.uris.some((candidate) => candidate.toString() === uri.toString())) {
      updateCount += 1;
    }
  });

  return () => {
    listener.dispose();
    return updateCount;
  };
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
