import { type Plugin, type ViteDevServer } from 'vite';
import { join, dirname } from 'node:path';
import { promises as fsp } from 'node:fs';
import { getLangByFileName } from '../helper/utils';
import { parse } from '@vue/compiler-sfc';
import { parseDocsCode, generateCode, asyncReplace } from '../helper/utils';

const entryFileRegex = /index\.([\w-]+)\.md$/;
const apiFileRegex = /api\.([\w-]+)\.md$/;
const virtualModules = new Map<string, string>();

/** 生成 import 语句 */
const genImportedExpression = (imported: Array<{ path: string; default?: string; all?: string }>) => {
  return `${imported
    .map((item) => {
      let importStr = 'import ';
      if (item.default) {
        importStr += `${item.default} `;
      }
      if (item.all) {
        importStr += `* as ${item.all} `;
      }
      importStr += `from ${JSON.stringify(item.path)};`;
      return importStr;
    })
    .join('\n')}`;
};
const resolveActiveTheme = (theme: string) => {
  let _theme = theme.toLowerCase();
  if (_theme.startsWith(':')) {
    _theme = _theme.slice(1);
  }
  return Array.from(
    new Set(
      _theme
        .split('|')
        .map((_item) => {
          const item = _item.trim().toLowerCase();
          if (['e', 'open-euler'].includes(item)) {
            return 'e';
          }
          if (['k', 'kunpeng'].includes(item)) {
            return 'k';
          }
          if (['a', 'ascend'].includes(item)) {
            return 'a';
          }
          if (['d', 'open-design'].includes(item)) {
            return 'd';
          }
          return '';
        })
        .filter(Boolean),
    ),
  );
};

/**
 * 转化 usage 指令导入的组件
 * @param code 组件源代码
 * @param id 入口文件id
 * @param mode 插件运行环境
 * @param activeTheme 激活组件的主题，分为 e, a, k，分别代表在仅在 Euler、Kunpeng、Ascend 主题下可见
 * @param viteDevServer vite开发服务器实例
 * @returns 转化后的代码
 */
const transformVueDemo = (code: string, id: string, mode: 'dev' | 'build' | 'unknown', activeThemes?: string[], viteDevServer?: ViteDevServer) => {
  const imported: {
    default?: string;
    all?: string;
    lang?: string;
    path: string;
  }[] = [];
  const { customBlocks: _customBlocks, scriptSetup: _scriptSetup, styles } = parse(code).descriptor;
  // 因为要修改 customBlocks 和 scriptSetup，所以复制一份
  const customBlocks = [..._customBlocks];
  const scriptSetup = _scriptSetup ? { ..._scriptSetup } : null;
  // 处理 docs 自定义块
  const docsBlockIdx = customBlocks.findIndex((block) => {
    if (block.type === 'docs' && block.lang === 'md') {
      return true;
    }
  });
  if (docsBlockIdx >= 0) {
    // 将 docs 自定义块按 zh-CN，en-US 分隔为多个虚拟模块然后导入。这些虚拟模块后经由 vueMdTranslate 插件编译为 vue 组件
    parseDocsCode(customBlocks[docsBlockIdx].content).forEach(({ lang: docsLang, code: docCode }, index) => {
      const virtualId = join(dirname(id), `virtual-${docsLang}.md`).replace(/\\/g, '/');
      imported.push({ path: virtualId, default: `AutoInjectDocs${index}`, lang: docsLang });
      if (virtualModules.has(virtualId) && mode === 'dev' && viteDevServer) {
        viteDevServer.watcher.emit('change', virtualId);
      }
      virtualModules.set(virtualId, docCode);
    });
    customBlocks.splice(docsBlockIdx, 1);
    if (scriptSetup) {
      scriptSetup.content = `${scriptSetup.content}\n;${genImportedExpression(imported)}`;
    }
  }
  if (scriptSetup) {
    let styleCode = '';
    styles.forEach((styleItem) => {
      styleCode += `${generateCode(styleItem)}`;
    });
    scriptSetup.content = `${scriptSetup.content}\n;const _style = ${JSON.stringify(styleCode)};\n`;
  }
  const docsJson = `{${imported.map((item) => `'${item.lang}': ${item.default}`).join(',')}}`;
  // 补充 usage 的 vue 文件的 template 块
  const template = `<template><DemoUsage :schema="_schema" :ctx="_ctx" :template="_template" :docs="${docsJson}" :style="_style" :active-themes='${JSON.stringify(activeThemes)}' /></template>`;
  return `${[...customBlocks, scriptSetup, ...styles]
    .filter(Boolean)
    .map((block) => {
      return generateCode(block);
    })
    .join('\n')}\n${template}`;
};
const transformMdEntry = async (
  code: string,
  id: string,
  usageFiles: Map<string, string[]>,
  mode: 'dev' | 'build' | 'unknown',
  viteDevServer?: ViteDevServer,
) => {
  const imported: {
    default?: string;
    all?: string;
    lang?: string;
    path: string;
  }[] = [];
  const lang = getLangByFileName(id);
  // 将 <!-- @case CaseComponent --> 注释替换成 <DemoContainer :demo="AutoInjectCaseComponent" />
  // 将 <!-- @usage usageConfig --> 注释替换成 <AutoInject${fileName} />
  let newCode = await asyncReplace(code, /<!-{2,}\s*@(case|usage|api)(:[\w|-]+)?\s+(.*?)\s*-{2,}>/gi, async (match) => {
    const [, directive, _activeTheme, filePath] = match;
    const paths = filePath.split('/');
    const dirs = paths.slice(0, -1);
    const fileName = paths[paths.length - 1];
    const activeThemes = resolveActiveTheme(_activeTheme || '');
    if (directive === 'api') {
      // 拼接 api 文件
      const apiFile = join(dirname(id), ...dirs, `${fileName}-api.${lang.lang}.md`);
      if (await fsp.stat(apiFile).catch(() => false)) {
        return fsp.readFile(apiFile, 'utf-8');
      }
    }
    const demoFile = join(dirname(id), ...dirs, `./__case__/${fileName}.vue`);
    if (await fsp.stat(demoFile).catch(() => false)) {
      if (directive === 'case') {
        imported.push({
          default: `AutoInject${fileName}`,
          path: demoFile,
        });
        return `<DemoContainer :demo="AutoInject${fileName}" :active-themes='${JSON.stringify(activeThemes)}' />`;
      } else {
        // 此处只导入 usage 指令指定的 vue 模块。该 vue 模块的还需在 transformVueDemo 函数中转换
        imported.push({
          path: demoFile,
          default: `AutoInject${fileName}`,
        });
        const usageFileId = demoFile.replace(/\\/g, '/');
        if (mode === 'dev' && viteDevServer) {
          viteDevServer.watcher.emit('change', usageFileId);
        }
        usageFiles.set(usageFileId, activeThemes);
        return `<AutoInject${fileName} />`;
      }
    }
    return match[0];
  });
  // 插入需要导入的模块
  if (imported.length) {
    newCode += `\n<script setup>\n${genImportedExpression(imported)}\n</script>`;
  }
  return newCode;
};
/**
 * vite 插件，在 index.<lang>.md 添加 /__docs__/__case__ 组件；拼接 api.zh-CN.md 文件
 * @returns Plugin
 */
export function injectDemoAndApi(): Plugin {
  /**
   * 缓存需要导入的usage模块
   * Map<usageId, activeTheme>
   */
  const usageFiles = new Map<string, string[]>();
  let viteDevServer: ViteDevServer | null = null;
  return {
    name: 'portal:inject-demo-and-api',
    enforce: 'pre',
    configureServer(server) {
      viteDevServer = server;
    },
    resolveId(id) {
      if (virtualModules.has(id)) {
        return id;
      }
    },
    load(id) {
      return virtualModules.get(id);
    },
    transform(code, id) {
      // 处理 vue 文件
      if (usageFiles.has(id)) {
        return transformVueDemo(code, id, this.environment.mode, usageFiles.get(id), viteDevServer);
      }

      // 处理 md 入口文件
      if (entryFileRegex.test(id) && !id.startsWith('virtual:')) {
        return transformMdEntry(code, id, usageFiles, this.environment.mode, viteDevServer);
      }
    },
    // 处理 api.*.md 文件的热更新
    async handleHotUpdate(ctx) {
      const { file } = ctx;
      const match = file.match(apiFileRegex);
      if (match) {
        const entryFile = join(dirname(file), `index.${match[1]}.md`);
        if (await fsp.stat(entryFile).catch(() => false)) {
          const module = ctx.server.moduleGraph.getModuleById(entryFile.replace(/\\/g, '/'));
          if (module) {
            ctx.server.moduleGraph.invalidateModule(module);
            ctx.server.ws.send({ type: 'full-reload' });
          }
        }
      }
    },
  };
}
