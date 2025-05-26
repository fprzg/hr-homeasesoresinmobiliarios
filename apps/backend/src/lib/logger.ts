export enum LogLevel {
  DEBUG = "DEBUG",
  INFO = "INFO",
  WARN = "WARN",
  ERROR = "ERROR",
  FATAL = "FATAL",
}

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: Record<string, any>;
}

export class Logger {
  private minLevel: LogLevel;

  constructor(minLevel: LogLevel = LogLevel.INFO) {
    this.minLevel = minLevel;
  }

  private shouldLog(level: LogLevel): boolean {
    const levels = Object.values(LogLevel);
    return levels.indexOf(level) >= levels.indexOf(this.minLevel);
  }

  private emitLog(entry: LogEntry): void {
    console.log(JSON.stringify(entry));
  }

  public debug(message: string, context?: Record<string, any>): void {
    if (this.shouldLog(LogLevel.DEBUG)) {
      this.emitLog({
        timestamp: new Date().toISOString(),
        level: LogLevel.DEBUG,
        message,
        context,
      });
    }
  }

  public info(message: string, context?: Record<string, any>): void {
    if (this.shouldLog(LogLevel.INFO)) {
      this.emitLog({
        timestamp: new Date().toISOString(),
        level: LogLevel.INFO,
        message,
        context,
      });
    }
  }

  public warn(message: string, context?: Record<string, any>): void {
    if (this.shouldLog(LogLevel.WARN)) {
      this.emitLog({
        timestamp: new Date().toISOString(),
        level: LogLevel.WARN,
        message,
        context,
      });
    }
  }

  public error(message: string, error?: Error, context?: Record<string, any>): void {
    if (this.shouldLog(LogLevel.ERROR)) {
      const errorContext = error ? { name: error.name, message: error.message, stack: error.stack } : undefined;
      this.emitLog({
        timestamp: new Date().toISOString(),
        level: LogLevel.ERROR,
        message,
        context: { ...context, error: errorContext },
      });
    }
  }

  public fatal(message: string, error?: Error, context?: Record<string, any>): void {
    if (this.shouldLog(LogLevel.FATAL)) {
      const errorContext = error ? { name: error.name, message: error.message, stack: error.stack } : undefined;
      this.emitLog({
        timestamp: new Date().toISOString(),
        level: LogLevel.FATAL,
        message,
        context: { ...context, error: errorContext },
      });
      // En un caso real, aquí podrías considerar salir de la aplicación o tomar acciones más drásticas.
      // process.exit(1); 
    }
  }

  // Método para recibir un JSON (simula la entrada de un sistema externo)
  public receiveLog(jsonString: string): LogEntry | null {
    try {
      const logEntry: LogEntry = JSON.parse(jsonString);
      // Opcional: podrías validar la estructura de logEntry aquí
      console.log("Received log entry:", logEntry);
      return logEntry;
    } catch (error) {
      console.error("Failed to parse incoming log JSON:", error);
      return null;
    }
  }
}

export const logger = new Logger();