/**
 * @description 封装日志打印，兼容浏览器与 Node（SSR）环境
 * - 使用全局 `console` 而非 `window.console`，确保 Node 环境下也可正常输出
 * - 仅在开发环境生效，生产环境所有日志均为空操作
 */
const logFunction = {
  // eslint-disable-next-line no-console
  info: console.info,
  // eslint-disable-next-line no-console
  warn: console.warn,
  // eslint-disable-next-line no-console
  error: console.error,
};

type LogLevel = keyof typeof logFunction;

/**
 * @description 获取指定等级的日志函数，开发环境绑定全局 console，生产环境返回空操作
 * @param {LogLevel} level - 日志等级（info / warn / error）
 * @param {string} [prefix] - 可选前缀，如 `[OVirtualList]`
 * @returns {(...args: any[]) => void} 日志输出函数
 */
function getLogFunction(level: LogLevel, prefix?: string) {
  // 非生产环境，打开日志打印；使用全局 console 以兼容 SSR（Node）环境
  if (process.env.NODE_ENV === 'development') {
    if (prefix) {
      return logFunction[level].bind(console, prefix);
    } else {
      return logFunction[level].bind(console);
    }
  }
  return () => {};
}

export class Log {
  private prefix: string = '';
  constructor(prefix?: string) {
    if (prefix) {
      this.prefix = `[${prefix}]`;
    }
  }
  get info() {
    return getLogFunction('info', this.prefix);
  }

  get warn() {
    return getLogFunction('warn', this.prefix);
  }

  get error() {
    return getLogFunction('error', this.prefix);
  }
}

export const log = new Log();
