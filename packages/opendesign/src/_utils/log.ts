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
  info(...msg: any[]) {
    printLog('info', ...msg);
  }

  warn(...msg: any[]) {
    printLog('warn', ...msg);
  }

  error(...msg: any[]) {
    printLog('error', ...msg);
  }
}

const logger = new Log();

export default logger;
