import path from 'path';
import iconConfig from './config';
import glob from 'glob';
import { toPascalCase } from '../utils';
import { optimize } from 'svgo';
import fs from 'fs-extra';

const base = process.cwd();

// TODO： 支持指定配置文件

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

/**
 * 读取svg图标文件列表
 */
function readSvgData() {
  const input = path.resolve(base, iconConfig.input);

  const svgs: Array<IconItem> = [];
  [SvgType.FILL, SvgType.STROKE, SvgType.COLOR].forEach(key => {
    const files = glob.sync(`${key}/**/*.svg`, {
      cwd: input,
      absolute: true,
    });

    files.forEach(file => {
      const name = `icon-${path.basename(file, '.svg')}`;
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

/**
 * 创建图标组件
 * @param icons 图标列表
 */
function generateIconComponents(icons: Array<IconItem>) {
  console.log('generating icon components...');
  // 清空构建目录
  const outDir = path.resolve(base, iconConfig.output);
  fs.emptyDirSync(outDir);

  const svgoCfg = iconConfig.svgo;
  // 遍历生成图标组件
  icons.forEach(item => {
    const file = fs.readFileSync(item.path, 'utf-8');
    const rlt = optimize(file, {
      path: item.path,
      ...svgoCfg,
    });

    const content = iconConfig.template({
      name: item.name,
      componentName: item.componentName,
      svg: rlt.data,
      type: item.type
    });

    fs.outputFile(path.resolve(outDir, `${item.componentName}/${item.componentName}.vue`), content, err => {
      if (err) {
        console.log(`build [${item.componentName}] failed: ${err}`);
      } else {
        console.log(`build [${item.componentName}] success`);
      }
    });

    const idxContent = `export { default as ${item.componentName} } from './${item.componentName}.vue';`;
    fs.outputFile(path.resolve(outDir, `${item.componentName}/index.ts`), idxContent, err => {
      if (err) {
        console.log(`build index [${item.componentName}] failed: ${err}`);
      } else {
        console.log(`build index [${item.componentName}] success`);
      }
    });
  });

}
/**
 * 创建入口文件
 * @param icons
 */
function generateExportIndex(icons: Array<IconItem>) {
  console.log('generating index.ts...');

  const content = icons.map(item => {
    return `export { ${item.componentName} } from './${item.componentName}';`;
  });

  const outDir = path.resolve(base, iconConfig.output);
  fs.outputFileSync(path.resolve(outDir, 'index.ts'), content.join('\n'));

  // 创建图标地图
  fs.outputFileSync(path.resolve(outDir, 'icons.json'), JSON.stringify(icons, null, 2));
}
export default function main() {
  console.log('search svg...');
  const svgs = readSvgData();
  console.log(`find ${svgs.length} svg files...`);

  generateIconComponents(svgs);
  generateExportIndex(svgs);
}