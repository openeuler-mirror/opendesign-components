/**
 * 封装日志打印
 */
const logFunction = {
  info: console.info,
  warn: console.warn,
  error: console.error,
};

type LogLevel = keyof typeof logFunction;

function getLogFunction(level: LogLevel, prefix?: string) {
  // 非生产环境，打开日志打印
  if (process.env.NODE_ENV === 'development') {
    if (prefix) {
      return logFunction[level].bind(window.console, prefix);
    } else {
      return logFunction[level].bind(window.console);
    }
  }
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
