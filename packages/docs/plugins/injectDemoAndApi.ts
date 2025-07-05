import { type Plugin } from 'vite';
import { join, dirname } from 'node:path';
import { existsSync, promises as fsp } from 'node:fs';
import { getLangByFileName } from '../helper/utils';

export function injectDemoAndApi(): Plugin {
  return {
    name: 'portal:inject-demo-and-api',
    enforce: 'pre',
    async transform(code, id) {
      if (!id.endsWith('.md')) {
        return;
      }
      const imported:{name: string, path: string}[] = [];
      let newCode = code.replace(/<!--\s*@demo\s+(.*?)\s*-->/g, (match, componentName) => {
        const demoFile = join(dirname(id), `./__demo__/${componentName}.vue`);
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
