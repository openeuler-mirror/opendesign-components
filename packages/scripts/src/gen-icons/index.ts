import path from 'path';
import iconConfig from './config';
import glob from 'glob';
import { toPascalCase } from '../utils';
import { optimize } from 'svgo';
import fs from 'fs-extra';

const base = process.cwd();


enum SvgType {
  FILL = 'fill',
  STROKE = 'stroke',
  COLOR = 'color',
}

interface IconItem {
  type: SvgType,
  name: string,
  componentName: string,
  path: string
}


function readSvgData() {
  const input = path.resolve(base, iconConfig.input);

  const svgs: Array<IconItem> = [];
  [SvgType.FILL, SvgType.STROKE, SvgType.COLOR].forEach(key => {
    const files = glob.sync(`${key}/**/*.svg`, {
      cwd: input,
      absolute: true,
    });

    files.forEach(file => {
      const name = path.basename(file, '.svg');
      svgs.push({
        type: key,
        name: name,
        componentName: toPascalCase(name),
        path: file,
      });
    });

  });
  return svgs;
}

function createIconComponents(icons: Array<IconItem>) {
  const item = icons[0];

  const file = fs.readFileSync(item.path, 'utf-8');
  const rlt = optimize(file, {
    ...iconConfig.svgo,
  });
  console.log(item.name, rlt);

}

export function buildIcons() {
  console.log('search svg...');
  const svgs = readSvgData();
  console.log(`find ${svgs.length} svg files...`);

  createIconComponents(svgs);

}