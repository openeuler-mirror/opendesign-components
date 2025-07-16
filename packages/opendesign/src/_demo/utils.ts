const canLog = process.env.NODE_ENV === 'development';
const validTagAttrName = (name: string) => /^[a-zA-Z0-9_\-]+$/.test(name);
/**
 * 将组件的props转为属性字符串以便拼接到html标签中
 * 仅在__docs__/__case__/ 中使用
 * @param props 组件的props
 * @param exclude 不转化的props属性名
 * @returns 属性字符串
 */
export function propsToAttrStr(props: Record<string, any>, exclude = [] as string[]) {
  return Object.entries(props)
    .reduce((acc, [key, value]) => {
      if (exclude.includes(key)) {
        return acc;
      }
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
          return `${acc} ${key}="${value}"`;
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
