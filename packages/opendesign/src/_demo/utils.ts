const canLog = process.env.NODE_ENV === 'development';
const validTagAttrName = (name: string) => /^[a-zA-Z0-9_-]+$/.test(name);

export function hyphenate(str: string) {
  return str.replace(/\B([A-Z])/g, '-$1').toLowerCase();
}
/**
 * 将组件的props转为属性字符串以便拼接到html标签中
 * 仅在__docs__/__case__/ 中使用
 * @param props 组件的props
 * @param exclude 不转化的props属性名
 * @returns 属性字符串
 */
export function propsToAttrStr<T extends Record<string, any>>(props: T, exclude: (keyof T)[] = []): string {
  return Object.entries(props)
    .reduce((acc, [_key, value]) => {
      if (exclude.includes(_key as any)) {
        return acc;
      }
      const key = hyphenate(_key);
      if (!validTagAttrName(key)) {
        if (canLog) {
          console.warn(`Invalid tag attr name: ${name}`);
        }
        return acc;
      }
      switch (typeof value) {
        case 'boolean':
          if (value) {
            return `${acc} ${key}`;
          } else {
            return `${acc} :${key}="false"`;
          }
        case 'string':
          return `${acc} ${key}="${value.replace(/"/g, '&quot;')}"`;
        case 'number':
        case 'bigint':
          return `${acc} :${key}="${value.toString()}"`;
        case 'function':
        case 'symbol':
        case 'undefined':
          return acc;
        default:
          try {
            return `${acc} :${key}='${JSON.stringify(value)}'`;
          } catch (error) {
            return acc;
          }
      }
    }, '')
    .slice(1);
}

const REPLACEMENTS: Record<string, string> = {
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&apos;',
  '&': '&amp;',
};
function replaceCellChar(ch: string) {
  return REPLACEMENTS[ch];
}
// 避免xss注入
export function escapeHTML(value?: string) {
  const ESCAPE_REPLACE_RE = /[<>"'&]/g;
  return value ? value.replace(ESCAPE_REPLACE_RE, replaceCellChar) : '';
}
