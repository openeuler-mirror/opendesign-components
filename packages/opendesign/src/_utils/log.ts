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
  if (prefix) {
    return logFunction[level].bind(window.console, prefix);
  } else {
    return logFunction[level].bind(window.console);
  }
}

export class Logger {
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

export const logger = new Logger();
