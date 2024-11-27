type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  data?: any;
}

class Logger {
  private static instance: Logger;
  private logs: LogEntry[] = [];
  private readonly MAX_LOGS = 1000;

  private constructor() {
    // Initialize logger
    console.log('Logger initialized');
  }

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  private formatDate(): string {
    return new Date().toISOString();
  }

  private addLog(level: LogLevel, message: string, data?: any) {
    const logEntry: LogEntry = {
      timestamp: this.formatDate(),
      level,
      message,
      data
    };

    // Add to local array
    this.logs.push(logEntry);
    
    // Keep only last MAX_LOGS entries
    if (this.logs.length > this.MAX_LOGS) {
      this.logs = this.logs.slice(-this.MAX_LOGS);
    }

    // Also log to console
    const consoleMsg = `${logEntry.timestamp} - ${level}: ${message}`;
    switch (level) {
      case 'error':
        console.error(consoleMsg, data);
        break;
      case 'warn':
        console.warn(consoleMsg, data);
        break;
      case 'debug':
        console.debug(consoleMsg, data);
        break;
      default:
        console.log(consoleMsg, data);
    }

    // Store in localStorage for persistence
    try {
      localStorage.setItem('app_logs', JSON.stringify(this.logs));
    } catch (error) {
      console.error('Failed to store logs in localStorage:', error);
    }
  }

  info(message: string, data?: any) {
    this.addLog('info', message, data);
  }

  warn(message: string, data?: any) {
    this.addLog('warn', message, data);
  }

  error(message: string, data?: any) {
    this.addLog('error', message, data);
  }

  debug(message: string, data?: any) {
    this.addLog('debug', message, data);
  }

  getLogs(): LogEntry[] {
    return this.logs;
  }

  clearLogs() {
    this.logs = [];
    localStorage.removeItem('app_logs');
  }
}

export const logger = Logger.getInstance();
