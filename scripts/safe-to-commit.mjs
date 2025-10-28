#!/usr/bin/env node
import { spawnSync } from 'node:child_process';

const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const gitCommand = 'git';

function runStep(label, command, args, options = {}) {
  console.log(`\n=== ${label} ===`);
  const result = spawnSync(command, args, { stdio: 'inherit', ...options });
  if (result.error) {
    throw result.error;
  }
  if (result.status !== 0) {
    const exitCode = typeof result.status === 'number' ? result.status : 1;
    throw new Error(`${label} failed with exit code ${exitCode}`);
  }
}

function runNpmScript(label, args) {
  const npmArgs = Array.isArray(args) ? args : [args];
  const npmExecPath = process.env.npm_execpath;

  if (npmExecPath && npmExecPath.endsWith('.js')) {
    runStep(label, process.execPath, [npmExecPath, ...npmArgs]);
  } else {
    runStep(label, npmCommand, npmArgs, {
      shell: process.platform === 'win32'
    });
  }
}

function runSafeCommitCheck() {
  const flags = parseFlags(process.argv.slice(2));

  try {
    runNpmScript('Verify (lint + unit + integration)', ['run', 'verify']);
    runNpmScript('Graph snapshot', ['run', 'graph:snapshot', '--', '--quiet']);
    runNpmScript('Graph coverage audit', ['run', 'graph:audit']);
    runNpmScript('Fixture workspace verification', ['run', 'fixtures:verify']);
    runNpmScript('SlopCop markdown audit', ['run', 'slopcop:markdown']);
    runNpmScript('SlopCop asset audit', ['run', 'slopcop:assets']);
    runNpmScript('SlopCop symbol audit', ['run', 'slopcop:symbols']);
  } catch (error) {
    console.error('\nSafe to commit check failed.');
    if (error instanceof Error) {
      console.error(error.message);
    }
    process.exit(1);
  }

  if (flags.skipGitStatus) {
    console.log('\nSkipping git status summary (CI mode).');
    console.log('Safe to commit? Tests and lint gates passed.');
    return;
  }

  const statusResult = spawnSync(gitCommand, ['status', '-sb'], { encoding: 'utf-8' });
  if (statusResult.error) {
    console.error('\nFailed to read git status.');
    console.error(statusResult.error.message);
    process.exit(1);
  }
  if (statusResult.status !== 0) {
    console.error('\nFailed to read git status.');
    process.exit(typeof statusResult.status === 'number' ? statusResult.status : 1);
  }

  const output = statusResult.stdout.trim();
  console.log('\n=== git status -sb ===');
  if (output.length === 0) {
    console.log('Working tree clean.');
    console.log('\nSafe to commit? YES — tests passed and the working tree is clean.');
  } else {
    console.log(output);
    console.log('\nSafe to commit? Tests passed. Review the working tree above before committing.');
  }
}

runSafeCommitCheck();

function parseFlags(argv) {
  let skipGitStatus = false;

  for (const token of argv) {
    switch (token) {
      case '--skip-git-status':
      case '--ci':
        skipGitStatus = true;
        break;
      default:
        console.error(`Unknown argument: ${token}`);
        process.exit(1);
    }
  }

  if (!skipGitStatus && process.env.CI === 'true') {
    skipGitStatus = true;
  }

  return { skipGitStatus };
}
