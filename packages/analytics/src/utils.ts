/**
 * 生成随机字符串
 * @param prefix 前缀
 * @param length 字符串长度
 */
export function uniqueId(prefix: string = '', length: number = 8, Separator: string = '-'): string {
  const gen = (len: number): string => {
    if (len <= 11) {
      return Math.random()
        .toString(36)
        .slice(2, 2 + len)
        .padEnd(len, '0');
    } else {
      return gen(11) + gen(len - 11);
    }
  };
  return prefix ? `${prefix}${Separator}${gen(length)}` : gen(length);
}
