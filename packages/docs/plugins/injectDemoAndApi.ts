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
const transformVueDemo = (code: string, id: string, mode: 'dev' | 'build' | 'unknown', viteDevServer?: ViteDevServer) => {
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
  // 处理 docs 模块
  const docsBlockIdx = customBlocks.findIndex((block) => {
    if (block.type === 'docs' && block.lang === 'md') {
      return true;
    }
  });
  if (docsBlockIdx >= 0) {
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
  const template = `<template><DemoUsage :schema="_schema" :ctx="_ctx" :template="_template" :docs="{${imported.map((item) => `'${item.lang}': ${item.default}`).join(',')}}" :style="_style" /></template>`;
  return `${[...customBlocks, scriptSetup, ...styles]
    .filter(Boolean)
    .map((block) => {
      return generateCode(block);
    })
    .join('\n')}\n${template}`;
};
const transformMdEntry = async (code: string, id: string, usageFiles: Set<string>) => {
  const imported: {
    default?: string;
    all?: string;
    lang?: string;
    path: string;
  }[] = [];
  const lang = getLangByFileName(id);
  // 将 <!-- @case CaseComponent --> 注释替换成 <DemoContainer :demo="AutoInjectCaseComponent" />
  // 将 <!-- @usage usageConfig --> 注释替换成 <DemoUsage :docs="docs" :template="template" :schema="schema" />
  let newCode = await asyncReplace(code, /<!-{2,}\s*@(case|usage|api)\s+(.*?)\s*-{2,}>/g, async (match) => {
    const [, directive, fileName] = match;
    if (directive === 'api') {
      // 拼接 api 文件
      const apiFile = join(dirname(id), `${fileName}-api.${lang.lang}.md`);
      if (await fsp.stat(apiFile).catch(() => false)) {
        return fsp.readFile(apiFile, 'utf-8');
      }
    }
    const demoFile = join(dirname(id), `./__case__/${fileName}.vue`);
    if (await fsp.stat(demoFile).catch(() => false)) {
      if (directive === 'case') {
        imported.push({
          default: `AutoInject${fileName}`,
          path: demoFile,
        });
        return `<DemoContainer :demo="AutoInject${fileName}" />`;
      } else {
        imported.push({
          path: demoFile,
          default: `AutoInject${fileName}`,
        });
        usageFiles.add(demoFile.replace(/\\/g, '/'));
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
  const usageFiles = new Set<string>();
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
        return transformVueDemo(code, id, this.environment.mode, viteDevServer);
      }

      // 处理 md 入口文件
      if (entryFileRegex.test(id) && !id.startsWith('virtual:')) {
        return transformMdEntry(code, id, usageFiles);
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
