import path from 'path';
import { mergeConfig, IconsConfig } from './config';
import { globSync } from 'glob';
import { toPascalCase } from '../utils';
import { optimize } from 'svgo';
import fs from 'fs-extra';

/**
 * 读取配置文件
 */
async function readConfig(cfg: string) {
  const base = process.cwd();
  const configFile = path.resolve(base, cfg || './icon.config.ts');
  const cfgDir = path.dirname(configFile);
  let configData: IconsConfig | null = null;
  try {
    configData = await require(configFile);
  } catch (error) {
    console.log('no config file');
  }

  const config = mergeConfig(configData);

  console.log('[input]', config.input);
  console.log('[output]', config.output);

  config.input = path.resolve(cfgDir, config.input);
  config.output = path.resolve(cfgDir, config.output);

  return {
    file: configFile,
    data: config,
  };
}

enum SvgType {
  FILL = 'fill',
  STROKE = 'stroke',
  COLOR = 'color',
}

interface IconItem {
  type: SvgType;
  name: string;
  componentName: string;
  path: string;
  absolutePath: string;
}
/**
 * 获取svg名称
 * 去掉类型及后缀，将空格、目录嵌套、多连字符替换为一个连字符
 */
function getSvgName(svgPath: string, type: string): string {
  const reg = new RegExp(`^${type}(/|\\\\)`);
  const str = svgPath
    .replace(reg, '')
    .replace(/\.svg$/, '')
    .replace(/\/|\\/, '-')
    .replace(/\s+/, '-')
    .replace(/-+/, '-');

  return str;
}
/**
 * 读取svg图标文件列表
 */
function readSvgData(cfg: IconsConfig) {
  const svgs: Array<IconItem> = [];
  // 记录svg名称，用于处理名称重复问题
  const names: Record<string, number> = {};
  [SvgType.FILL, SvgType.STROKE, SvgType.COLOR].forEach((key) => {
    const files = globSync(`${key}/**/*.svg`, {
      cwd: cfg.input,
      // absolute: true,
    });

    files.forEach((file) => {
      let name = `${cfg.prefix}icon-${getSvgName(file, key)}`;
      if (names[name]) {
        // 重复名称以序号递增
        name = `${name}${names[name]++}`;
      } else {
        names[name] = 2;
      }
      const svg = {
        type: key,
        name: name,
        componentName: toPascalCase(name),
        path: file,
        absolutePath: path.resolve(cfg.input, file),
      };
      // 判断 name 是否符合 js 的命名规范。若不符合规范则报警告同时忽略该文件；警告文字为红色以提高辨识度
      // 如：[error] invalid icon name: color\ascend.01.svg -> OIconAscend.01.vue
      const varNameReg = /^[a-zA-Z_$][0-9a-zA-Z_$]*$/;
      if (!varNameReg.test(svg.componentName)) {
        console.error(`\x1b[41m\x1b[37m[error]\x1b[0m\x1b[31m invalid icon name: ${svg.path} -> ${svg.componentName}.vue\x1b[0m`);
        return;
      }
      svgs.push(svg);
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
  icons.forEach((item) => {
    const file = fs.readFileSync(item.absolutePath, 'utf-8');
    const svgoCfg = cfg.svgo[item.type];

    const rlt = optimize(file, {
      path: item.absolutePath,
      ...svgoCfg,
    });

    const content = cfg.template({
      name: item.name,
      componentName: item.componentName,
      svg: rlt.data,
      type: item.type,
      componentClass: cfg.componentClass,
      renderOnServer: cfg.renderOnServer,
    });

    fs.outputFile(path.resolve(cfg.output, `${item.componentName}/${item.componentName}.vue`), content, (err) => {
      if (err) {
        console.log(`build [${item.componentName}] failed: ${err}`);
      } else {
        console.log(`build [${item.componentName}] success`);
      }
    });

    const idxContent = `export { default as ${item.componentName} } from './${item.componentName}.vue';`;
    fs.outputFile(path.resolve(cfg.output, `${item.componentName}/index.ts`), idxContent, (err) => {
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

  const content = icons.map((item) => {
    return `export { ${item.componentName} } from './${item.componentName}';`;
  });

  fs.outputFileSync(path.resolve(output, 'index.ts'), content.join('\n'));

  // 创建图标地图
  fs.outputFileSync(
    path.resolve(output, 'icons.json'),
    JSON.stringify(
      icons.map((item) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { absolutePath: _, ...rest } = item;
        return rest;
      }),
      null,
      2
    )
  );
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
