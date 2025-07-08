import { type Plugin } from 'vite';
import { join, dirname } from 'node:path';
import { existsSync, promises as fsp } from 'node:fs';
import { getLangByFileName } from '../helper/utils';

/**
 * vite 插件，在 index.<lang>.md 添加 /__docs__/__case__ 组件；拼接 api.zh-CN.md 文件
 * @returns Plugin
 */
export function injectDemoAndApi(): Plugin {
  return {
    name: 'portal:inject-demo-and-api',
    enforce: 'pre',
    async transform(code, id) {
      if (!id.endsWith('.md')) {
        return;
      }
      const imported:{name: string, path: string}[] = [];
      // 将 <!-- @case CaseComponent --> 注释替换成 <DemoContainer :demo="AutoInjectCaseComponent" />
      let newCode = code.replace(/<!--\s*@case\s+(.*?)\s*-->/g, (match, componentName) => {
        const demoFile = join(dirname(id), `./__case__/${componentName}.vue`);
        if (existsSync(demoFile)) {
          imported.push({
            name: `AutoInject${componentName}`,
            path: demoFile,
          });
          return `<DemoContainer :demo="AutoInject${componentName}" />`;
        }
        return match;
      })
      if (imported.length) {
        newCode += `\n<script setup>${imported.map((item) => `import ${item.name} from ${JSON.stringify(item.path)};`).join('\n')}</script>`
      }
      const lang = getLangByFileName(id);
      const dir = dirname(id);
      // 读取同文件夹下的所有<ComponentName>-api.<lang>.md 的api文档，将内容注入到对应语言的index.<lang>.md文件末尾
      const files = await fsp.readdir(dir);
      for (const file of files) {
        const filePath = join(dir, file);
        if (filePath.endsWith(`api.${lang.lang}.md`) && await fsp.stat(filePath).then((stat) => stat.isFile())) {
          newCode += `\n\n${await fsp.readFile(filePath, 'utf-8')}`;
        }
      }
      return newCode;
    },
  };
}
