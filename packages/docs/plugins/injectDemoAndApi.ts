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
      const imported: {
        default?: string;
        named?: { name: string; alias?: string }[];
        path: string;
      }[] = [];
      // 将 <!-- @case CaseComponent --> 注释替换成 <DemoContainer :demo="AutoInjectCaseComponent" />
      // 将 <!-- @usage usageConfig --> 注释替换成 <DemoUsage :docs="docs" :template="template" :schema="schema" />
      let newCode = code.replace(/<!--\s*@(case|usage)\s+(.*?)\s*-->/g, (match, directive, fileName) => {
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
            const docsAlias = `autoInject${fileName}Docs`;
            const templateAlias = `autoInject${fileName}Template`;
            const schemaAlias = `autoInject${fileName}Schema`;
            imported.push({
              path: demoFile,
              named: [
                { name: 'docs', alias: docsAlias },
                { name: 'template', alias: templateAlias },
                { name: 'schema', alias: schemaAlias },
              ],
            });
            return `<DemoUsage :docs="${docsAlias}" :template="${templateAlias}" :schema="${schemaAlias}" />`;
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
            if (item.named) {
              importStr += `{ ${item.named
                .map((namedItem) => {
                  if (namedItem.alias) {
                    return `${namedItem.name} as ${namedItem.alias}`;
                  }
                  return namedItem.name;
                })
                .join(', ')} } `;
            }
            importStr += `from ${JSON.stringify(item.path)};`;
            return importStr;
          })
          .join('\n')}\n</script>`;
      }
      const lang = getLangByFileName(id);
      const dir = dirname(id);
      // 读取同文件夹下的所有<fileName>-api.<lang>.md 的api文档，将内容注入到对应语言的index.<lang>.md文件末尾
      const files = await fsp.readdir(dir);
      for (const file of files) {
        const filePath = join(dir, file);
        if (filePath.endsWith(`api.${lang.lang}.md`) && (await fsp.stat(filePath).then((stat) => stat.isFile()))) {
          newCode += `\n\n${await fsp.readFile(filePath, 'utf-8')}`;
        }
      }
      return newCode;
    },
  };
}
