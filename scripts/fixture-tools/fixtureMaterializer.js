"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.materializeFixture = materializeFixture;
const node_child_process_1 = require("node:child_process");
const node_fs_1 = require("node:fs");
const os = require("node:os");
const path = require("node:path");
async function materializeFixture(repoRoot, fixture, options = {}) {
    const materialization = fixture.materialization;
    const workspaceMode = options.workspaceMode ?? "persistent";
    if (!materialization || materialization.kind === "workspace") {
        const fallbackPath = fixture.path
            ? path.join(repoRoot, "tests", "integration", "benchmarks", "fixtures", fixture.path)
            : undefined;
        if (!fallbackPath) {
            throw new Error(`Fixture ${fixture.id} does not declare a workspace path.`);
        }
        return {
            workspaceRoot: fallbackPath,
            materialization
        };
    }
    if (materialization.kind !== "git") {
        throw new Error(`Unsupported materialization kind for fixture ${fixture.id}.`);
    }
    let stagingRoot;
    let dispose;
    if (workspaceMode === "ephemeral") {
        stagingRoot = await node_fs_1.promises.mkdtemp(path.join(os.tmpdir(), `fixture-${sanitizeSegment(fixture.id)}-`));
        dispose = async () => {
            await node_fs_1.promises.rm(stagingRoot, { recursive: true, force: true });
        };
    }
    else {
        stagingRoot = path.join(repoRoot, "AI-Agent-Workspace", "tmp", "benchmarks", "vendor", sanitizeSegment(fixture.id));
        await node_fs_1.promises.mkdir(stagingRoot, { recursive: true });
    }
    const repoDir = path.join(stagingRoot, "repo");
    await ensureGitWorkspace(repoDir, materialization);
    const workspaceRoot = materialization.subdirectory
        ? path.join(repoDir, materialization.subdirectory)
        : repoDir;
    return {
        workspaceRoot,
        materialization,
        dispose
    };
}
async function ensureGitWorkspace(targetDir, spec) {
    const remote = spec.remote ?? `https://github.com/${spec.repository}.git`;
    const gitDir = path.join(targetDir, ".git");
    const parentDir = path.dirname(targetDir);
    const checkoutTarget = spec.commit;
    await node_fs_1.promises.mkdir(parentDir, { recursive: true });
    const repoExists = await pathExists(gitDir);
    if (!repoExists) {
        await runGit(["clone", "--filter=blob:none", "--no-checkout", remote, targetDir], parentDir);
    }
    else {
        await runGit(["remote", "set-url", "origin", remote], targetDir);
    }
    await runGit(["fetch", "--force", "--tags", "origin"], targetDir);
    if (spec.ref) {
        await runGit(["fetch", "--force", "origin", spec.ref], targetDir);
    }
    await runGit(["fetch", "--force", "origin", checkoutTarget], targetDir);
    if (spec.sparsePaths && spec.sparsePaths.length > 0) {
        const sparseFile = path.join(targetDir, ".git", "info", "sparse-checkout");
        if (!(await pathExists(sparseFile))) {
            await runGit(["sparse-checkout", "init", "--cone"], targetDir);
        }
        await runGit(["sparse-checkout", "set", ...spec.sparsePaths], targetDir);
    }
    await runGit(["checkout", "--force", "--detach", checkoutTarget], targetDir);
    await runGit(["reset", "--hard", checkoutTarget], targetDir);
    await runGit(["clean", "-fdx"], targetDir);
}
async function runGit(args, cwd) {
    await new Promise((resolve, reject) => {
        const child = (0, node_child_process_1.spawn)("git", args, {
            cwd,
            stdio: "inherit"
        });
        child.on("error", reject);
        child.on("exit", code => {
            if (code === 0) {
                resolve();
                return;
            }
            reject(new Error(`git ${args.join(" ")} failed with exit code ${code ?? "null"}`));
        });
    });
}
async function pathExists(candidate) {
    try {
        await node_fs_1.promises.access(candidate);
        return true;
    }
    catch {
        return false;
    }
}
function sanitizeSegment(segment) {
    return segment.replace(/[^a-zA-Z0-9_.-]/g, "-");
}
