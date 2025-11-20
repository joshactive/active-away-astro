const { cpSync, mkdirSync, rmSync, existsSync } = require('fs');
const { join } = require('path');

const sourceDir = join('dist', '_worker.js');
const targetDir = join('functions', '_worker-build');

if (!existsSync(sourceDir)) {
  console.error(`[copy-worker] Source directory not found: ${sourceDir}`);
  process.exit(1);
}

rmSync(targetDir, { recursive: true, force: true });
mkdirSync(targetDir, { recursive: true });
cpSync(sourceDir, targetDir, { recursive: true });

console.log(`[copy-worker] Copied ${sourceDir} -> ${targetDir}`);

