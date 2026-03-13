import path from 'node:path';
import { readFileSync } from 'node:fs';
import { globSync } from 'glob';
import { optimize } from 'svgo';

import { outputFileSync, emptyDirSync, loadModule } from '../utils.ts';
import { defaultConfig, IconsConfig } from './config.ts';

/**
 * 读取配置文件
 */
async function readConfig(cfg: string) {
  const base = process.cwd();
  const configFile = path.resolve(base, cfg || './clear-svg.config.ts');
  const cfgDir = path.dirname(configFile);

  const configData = (await loadModule<{ default: IconsConfig }>(configFile)).default;

  const config = Object.assign(defaultConfig, configData);

  config.input = path.resolve(cfgDir, config.input);
  config.output = path.resolve(cfgDir, config.output);

  return {
    file: configFile,
    data: config,
  };
}

interface IconItem {
  name: string;
  path: string;
}

/**
 * 读取svg图标文件列表
 */
function readSvgData(cfg: IconsConfig) {
  const svgs: Array<IconItem> = [];
  const files = globSync('./**/*.svg', {
    cwd: cfg.input,
    absolute: true,
    posix: true,
  });

  files.forEach((file) => {
    const name = path.basename(file.replace(/\s/g, ''));
    svgs.push({
      name: name,
      path: file,
    });
  });
  return svgs;
}

/**
 * 创建图标组件
 * @param icons 图标列表
 */
function generateSvgs(icons: Array<IconItem>, cfg: IconsConfig) {
  console.log('generating icon components...');
  // 清空构建目录
  emptyDirSync(cfg.output);

  // 遍历生成图标组件
  icons.forEach((item) => {
    const file = readFileSync(item.path, 'utf-8');
    const svgoCfg = cfg.svgo;

    const rlt = optimize(file, {
      path: item.path,
      ...svgoCfg,
    });

    try {
      outputFileSync(path.resolve(cfg.output, item.name), rlt.data);
      console.log(`build [${item.name}] success`);
    } catch (err) {
      console.log(`build [${item.name}] failed: ${err}`);
    }
  });
}
export default async function main(options: { config: string }) {
  const { data } = await readConfig(options.config);

  console.log('search svg...');
  const svgs = readSvgData(data);
  console.log(`find ${svgs.length} svg files...`);

  if (svgs.length > 0) {
    generateSvgs(svgs, data);
  }
}
