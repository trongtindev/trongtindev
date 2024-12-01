/* eslint-disable @typescript-eslint/no-explicit-any */
export const logger = {
  error: (message?: any, ...optionalParams: any[]) => {
    console.error('\x1b[31m', message, optionalParams);
  },
  warn: (message?: any, ...optionalParams: any[]) => {
    console.warn('\x1b[33m', message, optionalParams);
  },
  log: (message?: any, ...optionalParams: any[]) => {
    console.log('\x1b[0m', message, optionalParams);
  },
  verbose: (message?: any, ...optionalParams: any[]) => {
    if (!import.meta.dev) return;
    console.info('\x1b[36m', message, optionalParams);
  },
  debug: (message?: any, ...optionalParams: any[]) => {
    if (!import.meta.dev) return;
    console.log('\x1b[35m', message, optionalParams);
  }
};
