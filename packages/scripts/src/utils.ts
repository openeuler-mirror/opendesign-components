import { mkdirSync, rmSync, writeFileSync, cpSync } from 'node:fs';
import { dirname } from 'node:path';
import { createJiti } from 'jiti';

export const toKebabCase = (string: string): string => {
  return string.replace(/[A-Z]+/g, (match, offset) => {
    return `${offset > 0 ? '-' : ''}${match.toLocaleLowerCase()}`;
  });
};

export const toPascalCase = (string: string): string => {
  return string
    .replace(/^./, (match) => match.toLocaleUpperCase())
    .replace(/-(.)/g, (match, $1: string) => {
      return $1.toLocaleUpperCase();
    });
};

export function outputFileSync(filePath: string, data: string): void {
  mkdirSync(dirname(filePath), { recursive: true });
  writeFileSync(filePath, data);
}

export function emptyDirSync(dir: string): void {
  rmSync(dir, { recursive: true, force: true });
  mkdirSync(dir, { recursive: true });
}

export function copyFileSync(src: string, dest: string): void {
  mkdirSync(dirname(dest), { recursive: true });
  cpSync(src, dest);
}

/**
 * 动态加载TS/JS模块的默认导出，兼容ESM与CJS
 */
export async function loadModule<T = unknown>(filePath: string): Promise<T> {
  const jiti = createJiti(import.meta.url, {
    interopDefault: true,
  });

  return (await jiti.import(filePath)) as T;
}
