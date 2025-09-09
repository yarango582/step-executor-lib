// Simple logger implementation without external dependencies
export enum LogLevel {
    ERROR = 0,
    WARN = 1,
    INFO = 2,
    DEBUG = 3
}

class SimpleLogger {
    private level: LogLevel = LogLevel.INFO;

    setLevel(level: LogLevel): void {
        this.level = level;
    }

    private log(level: LogLevel, message: string): void {
        if (level <= this.level) {
            const timestamp = new Date().toISOString();
            const levelName = LogLevel[level];
            console.log(`${timestamp} [${levelName}]: ${message}`);
        }
    }

    error(message: string): void {
        this.log(LogLevel.ERROR, message);
    }

    warn(message: string): void {
        this.log(LogLevel.WARN, message);
    }

    info(message: string): void {
        this.log(LogLevel.INFO, message);
    }

    debug(message: string): void {
        this.log(LogLevel.DEBUG, message);
    }
}

const simpleLogger = new SimpleLogger();

export const logInfo = (message: string): void => {
    simpleLogger.info(message);
};

export const logError = (message: string): void => {
    simpleLogger.error(message);
};

export const logWarn = (message: string): void => {
    simpleLogger.warn(message);
};

export const logDebug = (message: string): void => {
    simpleLogger.debug(message);
};

export { simpleLogger as logger };