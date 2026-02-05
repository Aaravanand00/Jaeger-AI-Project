/**
 * Simple Logger Utility
 * 
 * Provides structured logging without external dependencies.
 * In production, replace with winston or pino.
 */

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

class Logger {
    private formatMessage(level: LogLevel, message: string, meta?: object): string {
        const timestamp = new Date().toISOString();
        const metaStr = meta ? ` ${JSON.stringify(meta)}` : '';
        return `[${timestamp}] [${level.toUpperCase()}] ${message}${metaStr}`;
    }

    info(message: string, meta?: object): void {
        console.log(this.formatMessage('info', message, meta));
    }

    warn(message: string, meta?: object): void {
        console.warn(this.formatMessage('warn', message, meta));
    }

    error(message: string, meta?: object): void {
        console.error(this.formatMessage('error', message, meta));
    }

    debug(message: string, meta?: object): void {
        console.debug(this.formatMessage('debug', message, meta));
    }
}

export const logger = new Logger();
