/**
 * 标记与关键字匹配的字符串
 */
const ESCAPE_CHARACTER_REG = /[.*+?^${}()|[\]\\]/g;

export function escapeRegExp(str: string) {
  ESCAPE_CHARACTER_REG.lastIndex = 0;
  return str.replace(ESCAPE_CHARACTER_REG, '\\$&');
}

export function splitByMatch(dataSource: string, keyword: string | RegExp): Array<string> {
  if (!dataSource || !keyword) {
    return [];
  }

  const regexp = typeof keyword === 'string' ? new RegExp(escapeRegExp(keyword), 'ig') : keyword;
  const matchedList = dataSource.matchAll(regexp);
  const result: Array<string> = [];

  let preMatchIndex = 0;
  for (const match of matchedList) {
    result.push(dataSource.slice(preMatchIndex, match.index));
    result.push(match[0]);
    preMatchIndex = match.index + match[0].length;
  }

  if (preMatchIndex < dataSource.length) {
    result.push(dataSource.slice(preMatchIndex));
  }

  return result;
}
