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
let preRouteContent = '';

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

interface DocFileInfo {
  /** 文件相对路径 */
  file: string;
  /** 文件绝对路径 */
  fullPath: string;
  /** 文件内容 */
  content: string;
  /** 组件名称 */
  name: string;
  /** 文件语言 */
  lang: string;
}

interface DocRouteInfo extends DocFileInfo {
  /** 路由元信息 */
  meta: Record<string, any>;
}

/**
 * 读取所有文档文件并提取元信息
 * @param docSearchBase - 搜索根目录
 * @returns 文件信息数组
 */
const readDocFiles = async (docSearchBase: string): Promise<DocFileInfo[]> => {
  const files = await glob('**/__docs__/index.*.md', { cwd: docSearchBase, posix: true });
  return Promise.all(
    files.sort().map(async (file) => {
      const fullPath = resolve(docSearchBase, file);
      const content = await fse.readFile(fullPath, 'utf-8');
      return { content, file, fullPath, name: file.match(/([^/]+)\/__docs__\/?/)?.[1] ?? '', lang: getLangByFileName(file).lang };
    }),
  );
};

/**
 * 解析 markdown 中的 frontmatter 语法，将数据存储到 route.meta 中
 * @param fileContents - 文件信息数组
 * @returns 包含 meta 信息的路由信息数组
 */
const parseMatterData = (fileContents: DocFileInfo[]): DocRouteInfo[] => {
  const headCommentRegex = /^---\s*([\s\S]*?)\s*---/;
  return fileContents.map((info) => {
    const match = info.content.match(headCommentRegex);
    const matterData = match ? matter(match[0]) : { data: {} };
    return {
      ...info,
      meta: {
        ...matterData.data,
        lang: info.lang,
        sidebarName: 'components',
      },
    };
  });
};

/**
 * 根据路由信息生成路由代码字符串
 * @param routes - 路由信息数组
 * @returns 路由代码字符串
 */
const generateRouteCode = (routes: DocRouteInfo[]): string => {
  return `import { type RouteRecordRaw } from 'vue-router';
export const routes: Array<RouteRecordRaw & { name: \`component/\${string}/\${string}\`; meta: { sidebar: string; lang: string; kind: string; sidebarName: string; } }> = [
${routes
  .map(
    (info) => `  {
    path: '/${info.lang}/components/${info.name}',
    name: 'component/${info.name}/${info.lang}',
    component: () => import('@opensig/opendesign/${info.file}'),
    meta: ${JSON.stringify(info.meta)}
  }`,
  )
  .join(',')}
];
 `;
};

const emit = debounce(async () => {
  /**
   * 检测 /packages/opendesing/OXxx/__docs__/index.<lang>.md 中的文件，生成 /src/router/components.ts 路由文件
   */
  const fileContents = await readDocFiles(searchBase);
  const routes = parseMatterData(fileContents);
  const routeCode = generateRouteCode(routes);

  if (routeCode === preRouteContent) {
    // 避免不必要的更新导致页面自动刷新
    return;
  }
  preRouteContent = routeCode;
  // 使用 prettier 格式化输出的代码
  const formatted = await prettier.format(routeCode, { parser: 'typescript', plugins: [tsPlugin], singleQuote: true, printWidth: 160 });
  // 写代码文件
  await fse.writeFile(output, formatted);
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
