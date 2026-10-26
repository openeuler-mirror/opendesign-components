/**
 * @description 封装日志打印，兼容浏览器与 Node（SSR）环境
 * - 使用全局 `console` 而非 `window.console`，确保 Node 环境下也可正常输出
 * - 仅在开发环境生效，生产环境所有日志均为空操作
 * - 测试环境通过 setLogEnabled(true) 手动开启日志输出
 */

type LogLevel = 'info' | 'warn' | 'error';

/**
 * 是否打印 log。
 * 库构建产物保留 process.env.NODE_ENV 表达式原样（不替换为字面量），
 * 交由消费者的打包器（Vite / Webpack）根据其构建模式做文本替换：
 * - 消费者 dev → 替换为 "development" → "development" === 'development' → true → 日志可见
 * - 消费者 build → 替换为 "production" → "production" === 'development' → false → 日志静默
 *
 * 文本替换后产物中不残留 process 引用，浏览器环境无 ReferenceError 风险。
 * UMD 构建不覆盖 define，始终替换为 "production"，浏览器直引场景日志静默。
 */
let isLogEnabled = process.env.NODE_ENV === 'development';

/**
 * @description 测试专用：设置是否打印 log
 * 库构建产物保留了 process.env.NODE_ENV 表达式，由消费者打包器替换。
 * 但在某些环境下（如 Vitest）NODE_ENV 可能非 "development"，
 * 调用 setLogEnabled(true) 可在测试中显式开启日志输出
 * @param {boolean} enabled - 是否打印 log
 */
export function setLogEnabled(enabled: boolean) {
  isLogEnabled = enabled;
}

/**
 * @description 获取指定等级的日志函数，开发环境运行时从 console 动态获取，
 * 生产环境返回空操作
 * - 运行时查找 console[level] 而非模块加载时缓存，确保 vi.spyOn 能拦截
 * @param {LogLevel} level - 日志等级（info / warn / error）
 * @param {string} [prefix] - 可选前缀，如 `[OVirtualList]`
 * @returns 日志输出函数
 */
function getLogFunction(level: LogLevel, prefix?: string) {
  if (isLogEnabled) {
    // 运行时从 console 动态获取方法，确保 vi.spyOn(console, 'warn') 等拦截能生效
    // eslint-disable-next-line no-console
    const fn = console[level];
    if (prefix) {
      return fn.bind(console, prefix);
    }
    return fn.bind(console);
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
