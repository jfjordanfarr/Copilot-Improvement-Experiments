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

function runSafeCommitCheck() {
  try {
    const npmArgs = ['run', 'verify'];
    const npmExecPath = process.env.npm_execpath;
    if (npmExecPath && npmExecPath.endsWith('.js')) {
      runStep('Verify (lint + unit + integration)', process.execPath, [npmExecPath, ...npmArgs]);
    } else {
      runStep('Verify (lint + unit + integration)', npmCommand, npmArgs, {
        shell: process.platform === 'win32'
      });
    }
  } catch (error) {
    console.error('\nSafe to commit check failed during verification.');
    if (error instanceof Error) {
      console.error(error.message);
    }
    process.exit(1);
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
