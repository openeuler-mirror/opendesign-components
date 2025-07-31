import { type SFCBlock } from '@vue/compiler-sfc';
export function getLangByFileName(_fileName: string) {
  const fileName = _fileName.slice(_fileName.lastIndexOf('/') + 1);
  const [name, lang, ext] = fileName.split('.');
  if (!ext) {
    return { name, lang: '', ext: lang };
  }
  return { name, lang, ext };
}

export function generateCode(block: SFCBlock) {
  return `<${block.type}${Object.entries(block.attrs)
    .map(([key, value]) => {
      if (typeof value === 'string') {
        return ` ${key}="${value}"`;
      } else {
        return ` ${key}`;
      }
    })
    .join('')}>${block.content}</${block.type}>\n`;
}

/**
 * 解析vue文件的自定义块docs
 * @param code 带解析的md代码
 * @returns 解析产物
 */
export function parseDocsCode(code: string) {
  const langSeparator = /<!-{2,}\s*([a-z]+-[A-Z]+)\s*-{2,}>/gm;
  const langMatchList = Array.from(code.matchAll(langSeparator));
  return langMatchList.map((langMatch, matchIndex) => {
    const lang = langMatch[1];
    const langCode = code.slice(
      langMatch.index + langMatch[0].length,
      matchIndex === langMatchList.length - 1 ? code.length : langMatchList[matchIndex + 1].index,
    );
    return {
      lang,
      code: langCode,
    };
  });
}

export function escapeRegExp(str: string) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * 异步替换字符串中的匹配项
 * @param str - 原始字符串
 * @param regex - 正则表达式或字符串形式的正则，若想全局替换，请设置正则表达式的g标志
 * @param asyncReplacer - 异步替换函数
 * @returns 处理后的字符串
 */
export async function asyncReplace(
  str: string,
  regex: RegExp | string,
  asyncReplacer: (matched: RegExpExecArray) => Promise<string> | string,
): Promise<string> {
  const finalRegex = typeof regex === 'string' ? new RegExp(escapeRegExp(regex)) : regex;

  const matches = finalRegex.global ? Array.from(str.matchAll(finalRegex)) : [finalRegex.exec(str)].filter(Boolean);
  const replacements = await Promise.all(matches.map((matched) => asyncReplacer(matched)));

  let lastIndex = 0;
  let result = '';

  matches.forEach((matched, i) => {
    // 添加非匹配内容
    result += str.slice(lastIndex, matched.index);
    // 添加替换内容
    result += replacements[i];
    // 正确更新最后索引位置
    lastIndex = matched.index + matched[0].length;
  });

  // 添加剩余内容
  result += str.slice(lastIndex);
  return result;
}
