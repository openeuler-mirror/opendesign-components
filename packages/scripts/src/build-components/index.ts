import configUmd from './vite.config.umd';
import config from './vite.config';
import { build } from 'vite';
import fs from 'fs-extra';
import path from 'path';

const base = process.cwd();

export default async function main() {
  fs.emptyDir(path.resolve(base, 'es'));
  fs.emptyDir(path.resolve(base, 'lib'));
  try {
    console.log('================================================================');
    console.log('generating component es/cjs...');
    await build(config());
  } catch (error) {
    console.log(error);
  }

  // umd
  fs.emptyDir(path.resolve(base, 'dist'));

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
