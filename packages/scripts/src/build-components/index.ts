import { build } from 'vite';
import path from 'node:path';

import { emptyDirSync } from '../utils.ts';

import configUmd from './vite.config.umd.ts';
import config from './vite.config.ts';

const base = process.cwd();

export default async function main() {
  emptyDirSync(path.resolve(base, 'es'));
  emptyDirSync(path.resolve(base, 'lib'));
  try {
    console.log('================================================================');
    console.log('generating component es/cjs...');
    await build(config());
  } catch (error) {
    console.log(error);
  }

  // umd
  emptyDirSync(path.resolve(base, 'dist'));

  try {
    console.log('================================================================');
    console.log('generating component es/cjs...');
    await build(configUmd('component'));
  } catch (error) {
    console.log(error);
  }

  try {
    console.log('================================================================');
    console.log('generating icon umd...');
    await build(configUmd('icon'));
  } catch (error) {
    console.log(error);
  }
}
