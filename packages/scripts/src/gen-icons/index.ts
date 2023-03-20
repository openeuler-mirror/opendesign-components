import path from 'path';
import { defaultConfig, IconsConfig } from './config';
import glob from 'glob';
import { toPascalCase } from '../utils';
import { optimize } from 'svgo';
import fs from 'fs-extra';
export interface TokenConfigT {
  output: string,
  prefix: string,
  themes: string[],
  defaultTheme: string,
  tokenFile: string[],
  codeSnippetsFile: string
}

// TODO： 支持指定配置文件

/**
 * 读取配置文件
 */
async function readConfig(cfg: string) {
  const base = process.cwd();
  const configFile = path.resolve(base, cfg || './icon.config.ts');
  const cfgDir = path.dirname(configFile);

  const configData: IconsConfig = await require(configFile);

  const config = Object.assign(defaultConfig, configData);

  config.input = path.resolve(cfgDir, config.input);
  config.output = path.resolve(cfgDir, config.output);

  return {
    file: configFile,
    data: config
  };
}

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
function readSvgData(cfg: IconsConfig) {

  const svgs: Array<IconItem> = [];
  [SvgType.FILL, SvgType.STROKE, SvgType.COLOR].forEach(key => {
    const files = glob.sync(`${key}/**/*.svg`, {
      cwd: cfg.input,
      absolute: true,
    });

    files.forEach(file => {
      const name = `icon-${path.basename(file.replace(/\s/g, ''), '.svg')}`;
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
function generateIconComponents(icons: Array<IconItem>, cfg: IconsConfig) {
  console.log('generating icon components...');
  // 清空构建目录
  fs.emptyDirSync(cfg.output);

  // 遍历生成图标组件
  icons.forEach(item => {
    const file = fs.readFileSync(item.path, 'utf-8');
    const svgoCfg = cfg.svgo[item.type];

    const rlt = optimize(file, {
      path: item.path,
      ...svgoCfg,
    });

    const content = cfg.template({
      name: item.name,
      componentName: item.componentName,
      svg: rlt.data,
      type: item.type
    });

    fs.outputFile(path.resolve(cfg.output, `${item.componentName}/${item.componentName}.vue`), content, err => {
      if (err) {
        console.log(`build [${item.componentName}] failed: ${err}`);
      } else {
        console.log(`build [${item.componentName}] success`);
      }
    });

    const idxContent = `export { default as ${item.componentName} } from './${item.componentName}.vue';`;
    fs.outputFile(path.resolve(cfg.output, `${item.componentName}/index.ts`), idxContent, err => {
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
function generateExportIndex(icons: Array<IconItem>, output: string) {
  console.log('generating index.ts...');

  const content = icons.map(item => {
    return `export { ${item.componentName} } from './${item.componentName}';`;
  });

  fs.outputFileSync(path.resolve(output, 'index.ts'), content.join('\n'));

  // 创建图标地图
  fs.outputFileSync(path.resolve(output, 'icons.json'), JSON.stringify(icons, null, 2));
}
export default async function main(options: { config: string }) {
  const { data } = await readConfig(options.config);

  console.log('search svg...');
  const svgs = readSvgData(data);
  console.log(`find ${svgs.length} svg files...`);

  if (svgs.length > 0) {
    generateIconComponents(svgs, data);
    generateExportIndex(svgs, data.output);
  }
}