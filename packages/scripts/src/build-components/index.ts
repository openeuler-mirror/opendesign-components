import configUmd from './vite.config.umd';
import config from './vite.config';
import { build } from 'vite';
import fs from 'fs-extra';
import path from 'path';

const base = process.cwd();

export default function main() {
  console.log('generating component...');

  fs.emptyDir(path.resolve(base, 'es'));
  fs.emptyDir(path.resolve(base, 'lib'));
  build(config());

  // umd
  fs.emptyDir(path.resolve(base, 'dist'));
  build(configUmd('component'));
  build(configUmd('icon'));

}