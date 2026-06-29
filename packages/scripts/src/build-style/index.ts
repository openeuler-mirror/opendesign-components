import { readFileSync, mkdirSync } from 'node:fs';
import { cpus } from 'node:os';
import path from 'node:path';
import { globSync } from 'glob';
import { initAsyncCompiler, type AsyncCompiler } from 'sass-embedded';
import CleanCSS from 'clean-css';

import { outputFileSync, copyFileSync } from '../utils.ts';

import Config from './config.ts';

const base = process.cwd();

/**
 * 并发上限
 * @description 默认取 CPU 逻辑核心数；在无 CPU 信息的环境下回退为 4。
 * 可通过环境变量 `OPEN_SCRIPTS_STYLE_CONCURRENCY` 覆盖。
 */
const CONCURRENCY = Number(process.env.OPEN_SCRIPTS_STYLE_CONCURRENCY) || cpus().length || 4;

/**
 * 以固定并发数执行一批异步任务
 * @description 采用工作池（worker pool）模式，避免一次性创建过多 Promise 导致内存压力。
 * 任务结果按输入顺序返回，与并发执行顺序无关。
 * @param tasks 任务工厂数组（惰性求值，仅在 worker 取到时才调用）
 * @param concurrency 最大并发数
 * @returns 所有任务的执行结果，顺序与输入一致
 */
async function runWithConcurrency<T>(tasks: Array<() => Promise<T>>, concurrency: number): Promise<T[]> {
  const results: T[] = new Array(tasks.length);
  let cursor = 0;

  // 单个 worker 不断从队列中领取任务执行，直到队列耗尽
  async function worker(): Promise<void> {
    while (cursor < tasks.length) {
      const index = cursor++;
      results[index] = await tasks[index]();
    }
  }

  const workerCount = Math.min(concurrency, tasks.length);
  await Promise.all(Array.from({ length: workerCount }, () => worker()));
  return results;
}

/**
 * 编译单个 SCSS 文件并输出到 es / lib / dist 目录
 * @description 统一处理 index.scss、theme 子目录 index.scss、skin 文件（theme-*.scss）三种场景。
 * - 所有编译产物写入 es/ 与 lib/
 * - 根 index.scss 额外写入 dist/index.css 与 dist/index.min.css
 * - theme/<非_开头>/index.scss 额外写入 dist 对应路径的 .css 与 .min.css
 * @param fl 相对于 input 的 POSIX 风格路径
 * @param input SCSS 源码根目录的绝对路径
 * @param compiler 复用的 AsyncCompiler 实例
 */
async function compileScssFile(fl: string, input: string, compiler: AsyncCompiler): Promise<void> {
  const fPath = path.resolve(input, fl);
  console.log(`compiling ${fl}`);
  const result = await compiler.compileAsync(fPath, {});

  const cssName = fl.replace(/\.scss$/, '.css');
  outputFileSync(`es/${cssName}`, result.css);
  outputFileSync(`lib/${cssName}`, result.css);

  // 根 index.scss → dist/index.css + dist/index.min.css + dist/index.scss
  if (fl === 'index.scss') {
    outputFileSync('dist/index.css', result.css);
    const compress = new CleanCSS().minify(result.css);
    outputFileSync('dist/index.min.css', compress.styles);
    outputFileSync('dist/index.scss', "@import '../es/index.scss';");
  }

  // theme/<非_开头>/index.scss → dist 对应 .css 与 .min.css
  if (/theme\/(?!_)[^/]+\/index.scss$/.test(fl)) {
    const distCss = fl.replace(/\.scss$/, '.css');
    const distMin = fl.replace(/\.scss$/, '.min.css');
    outputFileSync(`dist/${distCss}`, result.css);
    const compress = new CleanCSS().minify(result.css);
    outputFileSync(`dist/${distMin}`, compress.styles);
  }
}

/**
 * 处理 style/index.ts 入口文件
 * @description 将 .ts 文件拷贝为 .js，并生成对应的 css.js 变体（将 .scss 引用替换为 .css）。
 * @param fl 相对于 input 的 POSIX 风格路径
 * @param input SCSS 源码根目录的绝对路径
 */
function processStyleEntry(fl: string, input: string): void {
  const fpath = path.resolve(input, fl);
  const toFl = fl.replace(/\.ts$/, '.js');
  copyFileSync(fpath, `es/${toFl}`);
  copyFileSync(fpath, `lib/${toFl}`);

  const content = readFileSync(fpath, 'utf-8');
  const css = content
    .replace(/\.scss/g, '.css')
    .replace(/\/style';/g, "/style/css';")
    .replace(/\/_styles';/g, "/_styles/css';")
    .replace(/theme-(.+)\.index/g, 'theme-$1.index.css');

  const cssFile = fl.endsWith('/index.ts') ? fl.replace(/index\.ts$/, 'css.js') : fl.replace(/\.ts$/, '.css.js');
  outputFileSync(`es/${cssFile}`, css);
  outputFileSync(`lib/${cssFile}`, css);
}

export default async function main() {
  console.log('generating style...');
  const input = path.resolve(base, Config.input);

  // ── 收集所有 scss / css 文件 ──
  const allFiles = globSync('**/*.{scss,css}', {
    cwd: input,
    posix: true,
  });

  mkdirSync('dist', { recursive: true });

  // ── 阶段 1：并发拷贝所有 scss / css 文件到 es / lib ──
  await runWithConcurrency(
    allFiles.map((fl) => async () => {
      const fPath = path.resolve(input, fl);
      copyFileSync(fPath, `es/${fl}`);
      copyFileSync(fPath, `lib/${fl}`);
    }),
    CONCURRENCY,
  );

  // ── 阶段 2：使用 AsyncCompiler 并发编译 SCSS ──
  // index.scss 文件与 skin 文件（theme-*.scss）都需要编译
  const indexScssFiles = allFiles.filter((fl) => /index\.scss$/.test(fl));
  const skinScssFiles = allFiles.filter((fl) => /theme-.+\.scss$/.test(fl));
  const scssToCompile = [...indexScssFiles, ...skinScssFiles];

  if (scssToCompile.length > 0) {
    const compiler = await initAsyncCompiler();
    try {
      await runWithConcurrency(
        scssToCompile.map((fl) => () => compileScssFile(fl, input, compiler)),
        CONCURRENCY,
      );
    } finally {
      await compiler.dispose();
    }
  }

  // ── 阶段 3：并发处理 style/index.ts 入口文件 ──
  const idxFiles = globSync(['**/style/**/*index.ts', '_styles/index.ts'], {
    cwd: input,
    posix: true,
  });
  await runWithConcurrency(
    idxFiles.map((fl) => async () => processStyleEntry(fl, input)),
    CONCURRENCY,
  );

  // ── 阶段 4：生成 scss 入口文件 ──
  const scssIndexContent = "import './index.scss';";
  outputFileSync('es/scss.mjs', scssIndexContent);
  outputFileSync('lib/scss.js', scssIndexContent);

  // ── 阶段 5：并发拷贝 code-snippets ──
  const codeSnippets = globSync('theme/**/*code-snippets', { cwd: input });
  await runWithConcurrency(
    codeSnippets.map((item) => async () => {
      const fpath = path.resolve(input, item);
      copyFileSync(fpath, item.replace('theme', 'code-snippets'));
    }),
    CONCURRENCY,
  );

  console.log('style generation done.');
}
