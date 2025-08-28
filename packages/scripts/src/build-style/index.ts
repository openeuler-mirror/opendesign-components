import fs from 'fs-extra';
import path from 'path';
import { globSync } from 'glob';
import Config from './config';
import { compile } from 'sass-embedded';
import CleanCSS from 'clean-css';

const base = process.cwd();

export default function main() {
  console.log('generating style...');
  const input = path.resolve(base, Config.input);

  // compile scss
  const files = globSync('**/*.{scss,css}', {
    cwd: input,
    posix: true,
  });
  fs.ensureDir('dist');

  files.forEach((fl) => {
    const fPath = path.resolve(input, fl);
    // Copy SCSS and CSS files to es/lib directories
    fs.copySync(fPath, `es/${fl}`);
    fs.copySync(fPath, `lib/${fl}`);

    if (/index\.scss/.test(fl)) {
      // Compile all index.scss files to CSS
      console.log(`compiling ${fl}`);
      const result = compile(fPath, {});

      const cssName = fl.replace('.scss', '.css');
      fs.outputFile(`es/${cssName}`, result.css);
      fs.outputFile(`lib/${cssName}`, result.css);

      // Compile index.scss and theme/**/index.scss to dist directory
      if (fl === 'index.scss') {
        fs.outputFile('dist/index.css', result.css);
        // compile min.css
        const compress = new CleanCSS().minify(result.css);
        fs.outputFile('dist/index.min.css', compress.styles);

        fs.writeFileSync('dist/index.scss', "@import '../es/index.scss';");
      }
      if (/theme\/.+\/index.scss$/.test(fl)) {
        fs.outputFile(`dist/${fl.replace(/\.scss$/, '.css')}`, result.css);
        const compress = new CleanCSS().minify(result.css);
        fs.outputFile(`dist/${fl.replace(/\.scss$/, '.min.css')}`, compress.styles);
      }
    }
  });
  // build index
  const idxFiles = globSync('**/style/**/*index.ts', {
    cwd: input,
  });
  idxFiles.forEach((fl) => {
    const fpath = path.resolve(input, fl);
    const toFl = fl.replace(/\.ts$/, '.js');
    fs.copySync(fpath, `es/${toFl}`);
    fs.copySync(fpath, `lib/${toFl}`);
  });

  // copy scss index
  const scssIndexContent = "import './index.scss';";
  fs.outputFile('es/scss.mjs', scssIndexContent);
  fs.outputFile('lib/scss.js', scssIndexContent);

  // copy code-snippets
  const codeSnippets = globSync('theme/**/*code-snippets', { cwd: input });
  codeSnippets.forEach((item) => {
    const fpath = path.resolve(input, item);
    fs.copySync(fpath, item.replace('theme', 'code-snippets'));
  });
}
