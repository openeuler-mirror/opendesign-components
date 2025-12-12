import { resolve } from 'node:path';
import { cwd } from 'node:process';
import { defineConfig } from 'tsdown';

export default defineConfig({
  platform: 'node',
  entry: ['src/index.ts'],
  format: ['cjs'],
  unbundle: true,
  shims: true,
  skipNodeModulesBundle: true,
  outDir: resolve(cwd(), 'dist'),
});
