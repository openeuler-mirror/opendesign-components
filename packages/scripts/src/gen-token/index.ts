import path from 'path';
import fs from 'fs-extra';

export interface TokenConfigT {
  output: string;
  prefix: string;
  themeMap: Array<{ key: string; name: string }>;
  defaultTheme: string;
  tokenFile: string[];
  codeSnippetsFile: string;
}
interface FlatTokenT {
  prefix: string;
  catgName: string;
  key: string;
  tokenKey: string;
  name: string;
  type: string;
  group: string;
  description: string;
  themes: string[];
  value: {
    [key: string]: string;
  };
}
interface ThemeTokenT {
  prefix: string;
  catgName: string;
  key: string;
  tokenKey: string;
  name: string;
  type: string;
  group: string;
  description: string;
  themes: string[];
  value: string;
}

export interface TokenT {
  [key: string]: {
    name: string;
    type: string;
    value: Array<{
      key: string;
      name: string;
      description: string;
      value: {
        [key: string]: string;
      };
    }>;
  };
}

/**
 * 读取配置文件
 */
async function readConfig(cfg: string) {
  const base = process.cwd();
  const configFile = path.resolve(base, cfg || './token.config.ts');
  const configData: TokenConfigT = await require(configFile);
  const cfgDir = path.dirname(configFile);

  const { tokenFile, output = './', codeSnippetsFile } = configData;

  configData.output = path.resolve(cfgDir, output);

  if (codeSnippetsFile) {
    configData.codeSnippetsFile = path.resolve(cfgDir, codeSnippetsFile);
  }

  if (Array.isArray(tokenFile)) {
    configData.tokenFile = tokenFile.map((item) => path.resolve(cfgDir, item));
  } else if (typeof tokenFile === 'string') {
    configData.tokenFile = [path.resolve(cfgDir, tokenFile)];
  }

  return {
    file: configFile,
    data: configData,
  };
}
/**
 * 读取tokens
 */
async function readTokens(configData: TokenConfigT) {
  console.warn('reading tokens...');

  const { prefix, tokenFile } = configData;
  const tokens: Record<string, FlatTokenT> = {};

  tokenFile.forEach((tk) => {
    try {
      const tokenContent: TokenT = require(tk);
      Object.keys(tokenContent).forEach((k) => {
        const catg = tokenContent[k];
        catg.value.forEach((item) => {
          const { key, value, ...rest } = item;
          const tokenKey = `${prefix}${item.key}`;

          if (tokens[key]) {
            console.warn('重复定义的token:', tokenKey);
          }

          tokens[key] = {
            key,
            tokenKey,
            value,
            prefix,
            type: catg.type,
            group: k,
            catgName: catg.name,
            themes: Object.keys(value),
            ...rest,
          };
        });
      });
    } catch (error) {
      console.warn('load token eror:', tk);
    }
  });

  return tokens;
}
/**
 * 生成css的模板
 */
function tokenCssTemplate(themeArray: string[], tokens: Array<ThemeTokenT>) {
  const content = tokens.map((item) => {
    const { tokenKey, value, name = '', type = '', description = '', group = '' } = item;
    return `  /**
   * @name ${name}
   * @type ${type}
   * @group ${group}
   * @description ${description}
   */
  ${tokenKey}: ${value};`;
  });

  const selector = themeArray.map((t) => {
    if (t === 'default') {
      return ':root';
    }
    return `[data-o-theme="${t}"]`;
  });

  return `/* theme: ${themeArray.join('|')} */
${selector.join(',\n')} {
${content.join('\n')}
}`;
}

/**
 * 生成token.css
 */
function generateTokenCss(tokens: Record<string, FlatTokenT>, themes: Array<{ key: string; name: string }>, defaultTheme: string, outDir: string) {
  const themeToken: Record<string, Array<ThemeTokenT>> = {};

  Object.keys(tokens).forEach((k) => {
    const token = tokens[k];
    const { value, ...rest } = token;

    themes.forEach((theme) => {
      if (!themeToken[theme.name]) {
        themeToken[theme.name] = [];
      }
      if (value[theme.key]) {
        themeToken[theme.name].push({
          value: value[theme.key],
          ...rest,
        });
      }
    });
  });

  themes.forEach((theme) => {
    let themeArray = [theme.name];
    if (theme.name === defaultTheme) {
      themeArray.unshift('default');
    }
    const content = tokenCssTemplate(themeArray, themeToken[theme.name]);

    fs.outputFileSync(path.join(outDir, `${themeArray.join('-')}.token.css`), content);
    console.log(`[${themeArray.join('|')}] theme token file generated!`);
  });
}

function generateCodeSnippets(tokens: Record<string, FlatTokenT>, outFile: string) {
  const snippets: Record<string, any> = {};
  Object.keys(tokens).forEach((k) => {
    const token = tokens[k];
    const { value, tokenKey, description } = token;
    const themes = Object.keys(value).map((theme) => `${theme}: ${value[theme]}`);
    const desc = `${description || ''}[${themes.join(', ')}]`;
    const code = `var(${tokenKey})`;

    snippets[tokenKey] = {
      prefix: [code],
      body: code,
      description: desc,
      scope: 'css,scss,less',
    };
  });
  fs.outputFileSync(outFile, JSON.stringify(snippets, null, '  '));
  console.log('code snippets generated!');
}

export default async function main(options: { config: string }) {
  const { data } = await readConfig(options.config);

  const tokens = await readTokens(data);

  generateTokenCss(tokens, data.themeMap, data.defaultTheme, data.output);

  if (data.codeSnippetsFile) {
    generateCodeSnippets(tokens, data.codeSnippetsFile);
  }
}
