import { isNumber } from '../_utils/is.ts';

export function normalizeSize(size: number | string | undefined): string {
  if (size === undefined) return '';
  if (isNumber(size)) return `${size}px`;
  const sizeStr = String(size);
  if (/^\d+$/.test(sizeStr)) return `${sizeStr}px`;
  return sizeStr;
}
