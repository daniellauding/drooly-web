type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogGroup {
  id: string;
  emoji: string;
  color?: string;
}

export const LOG_GROUPS = {
  FIREBASE: { id: 'Firebase', emoji: '🔥' },
  AUTH: { id: 'Auth', emoji: '🔐' },
  SYSTEM: { id: 'System', emoji: '⚙️' },
  PERFORMANCE: { id: 'Performance', emoji: '⚡' },
  DATA: { id: 'Data', emoji: '📊' },
  UI: { id: 'UI', emoji: '🎨' }
} as const;

class Logger {
  private static instance: Logger;
  private isDebugMode: boolean;

  private constructor() {
    this.isDebugMode = import.meta.env.MODE === 'development';
  }

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  private formatMessage(group: LogGroup, message: string): string {
    return `${group.emoji} [${group.id}] ${message}`;
  }

  group(group: LogGroup, title: string) {
    if (!this.isDebugMode) return;
    console.group(this.formatMessage(group, title));
  }

  groupEnd() {
    if (!this.isDebugMode) return;
    console.groupEnd();
  }

  log(group: LogGroup, message: string, data?: any) {
    if (!this.isDebugMode) return;
    console.log(this.formatMessage(group, message), data || '');
  }

  table(group: LogGroup, title: string, data: any[]) {
    if (!this.isDebugMode) return;
    this.log(group, title);
    if (data.length > 0) {
      console.table(data);
    } else {
      console.log(`${group.emoji} No data available`);
    }
  }

  logCollection(group: LogGroup, title: string, snapshot: any) {
    if (!this.isDebugMode) return;
    this.group(group, title);
    this.log(group, `Total count: ${snapshot.size}`);
    if (snapshot.size > 0) {
      this.table(group, 'Items:', snapshot.docs.map((doc: any) => ({
        id: doc.id,
        ...doc.data()
      })));
    } else {
      this.log(group, 'No items found');
    }
    this.groupEnd();
  }
}

export const logger = Logger.getInstance();
