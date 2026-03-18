type LogLevel = 'info' | 'warn' | 'error';

interface LogPayload {
  level:     LogLevel;
  message:   string;
  timestamp: string;
  [key: string]: unknown;
}

function log(level: LogLevel, message: string, context?: Record<string, unknown>): void {
  const payload: LogPayload = {
    level,
    message,
    timestamp: new Date().toISOString(),
    ...context,
  };
  console[level](JSON.stringify(payload));
}

export const logger = {
  info:  (message: string, context?: Record<string, unknown>) => log('info',  message, context),
  warn:  (message: string, context?: Record<string, unknown>) => log('warn',  message, context),
  error: (message: string, context?: Record<string, unknown>) => log('error', message, context),
};
