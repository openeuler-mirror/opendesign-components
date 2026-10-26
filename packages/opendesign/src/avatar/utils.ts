import { isNumber } from '../_utils/is.ts';

export function normalizeSize(size: number | string | undefined): string {
  if (size === undefined) return '';
  if (isNumber(size)) return `${size}px`;
  const sizeStr = String(size);
  if (/^\d+$/.test(sizeStr)) return `${sizeStr}px`;
  return sizeStr;
}

/**
 * 辅助色数量上限，对应 --o-color-auxiliary1 ~ --o-color-auxiliary8。
 */
const AUXILIARY_COLOR_COUNT = 8;

/**
 * 将名称字符串确定性映射到 1-8 的辅助色索引。
 *
 * @description 基于 name 字符串的 charCode 累加取模，确保同一名称始终返回同一索引值。
 *   用于 OAvatar 文字模式下的背景色选择，替代 Math.random() 以保证 SSR 水合一致性。
 *   name 为空时回退到索引 1。
 * @param name 头像名称字符串
 * @returns 1-8 的颜色索引
 */
export function nameToColorIndex(name: string | undefined): number {
  if (!name) return 1;
  const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return (hash % AUXILIARY_COLOR_COUNT) + 1;
}
