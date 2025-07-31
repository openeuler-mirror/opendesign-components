import { createFilter, type Plugin } from 'vite';
import { glob } from 'glob';
import { resolve } from 'path';
import { fileURLToPath } from 'url';
import fse from 'fs-extra';
import matter from 'gray-matter';
import * as prettier from 'prettier';
import tsPlugin from 'prettier/plugins/typescript';
import { getLangByFileName } from '../helper/utils';

const __fileName = fileURLToPath(import.meta.url);
const searchBase = resolve(__fileName, '../../../opendesign/src');
const output = resolve(__fileName, '../../src/router/components.ts');
function debounce<T extends (...args: Array<any>) => any>(fn: T, wait: number = 0, runFirst: boolean = true) {
  let handler = null;
  return (...args: Array<any>) => {
    if (runFirst) {
      if (!handler) {
        fn(...args);
      }
    }
    clearTimeout(handler);
    handler = setTimeout(() => {
      if (!runFirst) {
        fn(...args);
      }
      handler = 0;
    }, wait);
  };
}

const emit = debounce(() => {
  /**
   * 检测 /packages/opendesing/OXxx/__docs__/index.<lang>.md 中的文件，生成 /src/router/components.ts 路由文件
   */
  glob('**/__docs__/index.*.md', { cwd: searchBase, posix: true })
    .then((files) => {
      return files.map((file) => {
        const fullPath = resolve(searchBase, file);
        const content = fse.readFileSync(fullPath).toString();
        return { content, file, fullPath, name: file.match(/([^/]+)\/__docs__\/?/)?.[1], lang: getLangByFileName(file).lang };
      });
    })
    .then((fileContents) => {
      /**
       * 解析markdown中的matter语法，将数据存储到route.meta中
       */
      const headCommentRegex = /^---\s*([\s\S]*?)\s*---/;
      return fileContents.map((info) => {
        const match = info.content.match(headCommentRegex);
        const matterData = match ? matter(match[0]) : { data: {} };
        return {
          ...info,
          meta: {
            ...matterData.data,
            lang: info.lang,
          },
        };
      });
    })
    .then((res) => {
      return `import { type RouteRecordRaw } from 'vue-router';
export const routes: Array<RouteRecordRaw & { name: \`component/\${string}/\${string}\`; meta: { sidebar: string; lang: string } }> = [
${res
  .map(
    (info) => `  {
    path: '/${info.lang}/components/${info.name}',
    name: 'component/${info.name}/${info.lang}',
    component: () => import('@components/${info.file}'),
    meta: ${JSON.stringify(info.meta)}
  }`,
  )
  .join(',')}
];
 `;
    })
    .then((res) => {
      // 使用prettier格式化输出的代码
      return prettier.format(res, { parser: 'typescript', plugins: [tsPlugin], singleQuote: true, printWidth: 160 });
    })
    .then((res) => {
      // 写代码文件
      return fse.writeFile(output, res);
    });
}, 1000);

export default function generateComponentRouter(): Plugin {
  const filter = createFilter(/opendesign\/src\/.*?\/__docs__\/index\..*?\.md$/);
  return {
    name: 'generate-component-router',
    configureServer(server) {
      // 监听searchBase文件夹
      server.watcher.add(searchBase);
      server.watcher.on('all', (event, path) => {
        // 当有/packages/opendesing/OXxx/__docs__/index.<lang>.md 文件增删改时重新生成 router/components.ts 文件
        if (filter(path.replace(/\\/g, '/')) && ['add', 'unlink', 'change'].includes(event)) {
          emit();
        }
      });
    },
    buildStart() {
      emit();
    },
  };
}
