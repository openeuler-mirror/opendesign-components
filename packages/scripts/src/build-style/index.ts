import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { globSync } from 'glob';
import { compile } from 'sass-embedded';
import CleanCSS from 'clean-css';

import { outputFileSync, copyFileSync } from '../utils.ts';

import Config from './config.ts';

const base = process.cwd();

export default function main() {
  console.log('generating style...');
  const input = path.resolve(base, Config.input);

  // compile scss
  const files = globSync('**/*.{scss,css}', {
    cwd: input,
    posix: true,
  });
  mkdirSync('dist', { recursive: true });

  files.forEach((fl) => {
    const fPath = path.resolve(input, fl);
    // Copy SCSS and CSS files to es/lib directories
    copyFileSync(fPath, `es/${fl}`);
    copyFileSync(fPath, `lib/${fl}`);

    if (/index\.scss/.test(fl)) {
      // Compile all index.scss files to CSS
      console.log(`compiling ${fl}`);
      const result = compile(fPath, {});

      const cssName = fl.replace('.scss', '.css');
      outputFileSync(`es/${cssName}`, result.css);
      outputFileSync(`lib/${cssName}`, result.css);

      // Compile index.scss and theme/**/index.scss to dist directory
      if (fl === 'index.scss') {
        outputFileSync('dist/index.css', result.css);
        // compile min.css
        const compress = new CleanCSS().minify(result.css);
        outputFileSync('dist/index.min.css', compress.styles);

        writeFileSync('dist/index.scss', "@import '../es/index.scss';");
      }
      if (/theme\/(?!_)[^/]+\/index.scss$/.test(fl)) {
        outputFileSync(`dist/${fl.replace(/\.scss$/, '.css')}`, result.css);
        const compress = new CleanCSS().minify(result.css);
        outputFileSync(`dist/${fl.replace(/\.scss$/, '.min.css')}`, compress.styles);
      }
    }
    // Compile Skin files
    if (/theme-.+\.scss$/.test(fl)) {
      const result = compile(fPath, {});
      outputFileSync(`es/${fl.replace(/\.scss$/, '.css')}`, result.css);
      outputFileSync(`lib/${fl.replace(/\.scss$/, '.css')}`, result.css);
    }
  });
  // build index
  const idxFiles = globSync(['**/style/**/*index.ts', '_styles/index.ts'], {
    cwd: input,
    posix: true,
  });
  idxFiles.forEach((fl) => {
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
    let cssFile = '';
    if (fl.endsWith('/index.ts')) {
      cssFile = fl.replace(/index\.ts$/, 'css.js');
    } else {
      cssFile = fl.replace(/\.ts$/, '.css.js');
    }
    outputFileSync(`es/${cssFile}`, css);
    outputFileSync(`lib/${cssFile}`, css);
  });

  // copy scss index
  const scssIndexContent = "import './index.scss';";
  outputFileSync('es/scss.mjs', scssIndexContent);
  outputFileSync('lib/scss.js', scssIndexContent);

  // copy code-snippets
  const codeSnippets = globSync('theme/**/*code-snippets', { cwd: input });
  codeSnippets.forEach((item) => {
    const fpath = path.resolve(input, item);
    copyFileSync(fpath, item.replace('theme', 'code-snippets'));
  });
}
