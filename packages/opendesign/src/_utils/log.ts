const logFunction = {
  info: console.info,
  warn: console.warn,
  error: console.error,
};

export type LogLevel = keyof typeof logFunction;

function printLog(level: LogLevel, ...msg: any[]) {
  const fn = logFunction[level];
  if (fn) {
    fn(...msg);
  }
}

export class Log {
  prefix: string;
  constructor(namespace?: string) {
    this.prefix = '';
    if (namespace) {
      this.prefix = `[${namespace}]`;
    }
  }
  info(...msg: any[]) {
    if (this.prefix) {
      msg.unshift(this.prefix);
    }
    printLog('info', ...msg);
  }

  warn(...msg: any[]) {
    if (this.prefix) {
      msg.unshift(this.prefix);
    }
    printLog('warn', ...msg);
  }

  error(...msg: any[]) {
    if (this.prefix) {
      msg.unshift(this.prefix);
    }
    printLog('error', ...msg);
  }
}

const logger = new Log();

export default logger;
