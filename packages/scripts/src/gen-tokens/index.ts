import path from 'path';
import fs from 'fs-extra';

export interface TokenOptionsT {
  config: string
}
export interface TokenConfigT {
  output: string,
  prefix: string,
  tokens: Array<{ theme: string, file: Array<string> }>,
  globalTokenFile: Array<string>,
}
interface FlatTokenT {
  prefix: string,
  catgName: string,
  key: string,
  value: string,
  name: string,
  type: string,
  group: string,
  description: string
}

export interface TokenT {
  [key: string]: {
    name: string,
    type: string,
    value: Array<{
      key: string,
      value: string,
      name: string,
      description: string
    }>
  }
}

type TokenListT = Array<{ theme: string, tokens: TokenT }>

const base = process.cwd();

async function readTokens(configFile: string) {
  const cfg = path.resolve(base, configFile || './token.config.ts');
  const configData: TokenConfigT = await require(cfg);
  const { prefix, tokens, output, globalTokenFile = [] } = configData;
  let tokenData: TokenListT = [];

  if (Array.isArray(tokens)) {
    tokenData = tokens.map(tk => {

      const files = tk.file.concat(globalTokenFile);
      const themeToken = {};

      files.forEach(f => {
        const fpath = path.resolve(path.dirname(cfg), f);
        try {
          const content = require(fpath);
          Object.assign(themeToken, content);
        } catch (error) {
          console.warn('load token eror:', fpath);
        }
      });

      return {
        theme: tk.theme,
        tokens: themeToken
      };

    });
  }

  const outDir = path.resolve(path.dirname(cfg), output);
  return {
    prefix,
    tokens: tokenData,
    outDir
  };
}

function generateTokenCss(tokenData: { tokens: TokenListT, prefix: string }, outDir: string) {

  const { tokens, prefix = '--o-' } = tokenData;

  tokens.forEach(tk => {
    const flatToken: Array<FlatTokenT> = [];
    const { theme } = tk;

    Object.keys(tk.tokens).forEach(k => {
      const catg = tk.tokens[k];
      catg.value.forEach(item => {
        flatToken.push({
          ...item,
          prefix,
          type: catg.type,
          group: k,
          catgName: catg.name
        });
      });
    });

    const content = flatToken.map(item => {
      const { prefix: p, key, value, name = '', type = '', description = '', group = '' } = item;
      return `  /**
   * @name ${name}
   * @type ${type}
   * @group ${group}
   * @description ${description}
   */
  ${p}${key}: ${value};`;
    });

    const themeStr = Array.isArray(theme) ? theme : [theme];
    const selector = themeStr.map(t => {
      if (t === 'default') {
        return ':root';
      }
      return `:root[theme="${t}"]`;
    });

    fs.outputFileSync(path.join(outDir, `${themeStr.join('-')}.token.css`), `/* theme: ${theme} */
${selector.join(',\n')} {
${content.join('\n')}
}`);
  });



}


export default async function main(options: TokenOptionsT) {
  const { tokens, prefix, outDir } = await readTokens(options.config);
  generateTokenCss({ tokens, prefix }, outDir);
}