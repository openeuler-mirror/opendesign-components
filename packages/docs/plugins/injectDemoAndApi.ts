import { type Plugin } from 'vite';
import { join, dirname } from 'node:path';
import { existsSync, readFileSync, promises as fsp } from 'node:fs';
import { getLangByFileName } from '../helper/utils';

const entryFileRegex = /index\.([\w-]+)\.md$/;
const apiFileRegex = /api\.([\w-]+)\.md$/;
/**
 * vite 插件，在 index.<lang>.md 添加 /__docs__/__case__ 组件；拼接 api.zh-CN.md 文件
 * @returns Plugin
 */
export function injectDemoAndApi(): Plugin {
  return {
    name: 'portal:inject-demo-and-api',
    enforce: 'pre',
    async transform(code, id) {
      if (!entryFileRegex.test(id) || id.startsWith('virtual:')) {
        return;
      }
      const lang = getLangByFileName(id);
      const imported: {
        default?: string;
        all?: string;
        path: string;
      }[] = [];
      // 将 <!-- @case CaseComponent --> 注释替换成 <DemoContainer :demo="AutoInjectCaseComponent" />
      // 将 <!-- @usage usageConfig --> 注释替换成 <DemoUsage :docs="docs" :template="template" :schema="schema" />
      let newCode = code.replace(/<!--\s*@(case|usage|api)\s+(.*?)\s*-->/g, (match, directive, fileName) => {
        if (directive === 'api') {
          // 拼接 api 文件
          const apiFile = join(dirname(id), `${fileName}-api.${lang.lang}.md`);
          if (existsSync(apiFile)) {
            return readFileSync(apiFile, 'utf-8');
          }
        }
        const fileNameWidthExt = directive === 'case' ? `./__case__/${fileName}.vue` : `./__case__/${fileName}.ts`;
        const demoFile = join(dirname(id), fileNameWidthExt);
        if (existsSync(demoFile)) {
          if (directive === 'case') {
            imported.push({
              default: `AutoInject${fileName}`,
              path: demoFile,
            });
            return `<DemoContainer :demo="AutoInject${fileName}" />`;
          } else {
            
            imported.push({
              path: demoFile,
              all: 'autoInjectUsage'
            });
            return `<DemoUsage :docs="autoInjectUsage.docs" :template="autoInjectUsage.template" :schema="autoInjectUsage.schema" :style="autoInjectUsage.style" :ctx="autoInjectUsage.ctx" />`;
          }
        }
        return match;
      });
      // 插入需要导入的模块
      if (imported.length) {
        newCode += `\n<script setup>\n${imported
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
          .join('\n')}\n</script>`;
      }
      return newCode;
    },
    // 处理 api.*.md 文件的热更新
    handleHotUpdate(ctx) {
      const { file } = ctx;
      const match = file.match(apiFileRegex);
      if (match) {
        const entryFile = join(dirname(file), `index.${match[1]}.md`);
        if (existsSync(entryFile)) {
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
