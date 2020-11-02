import winston from 'winston';
import winstonDaily from 'winston-daily-rotate-file';

const logDir = 'logs';

const infoTransport = new winstonDaily({
  level: 'info',
  dirname: logDir,
  datePattern: 'YYYY-MM-DD',
  filename: `%DATE%_info.log`,
  maxFiles: 30
});

const errorTransport = new winstonDaily({
  level: 'error',
  dirname: logDir,
  datePattern: 'YYYY-MM-DD',
  filename: `%DATE%_error.log`,
  maxFiles: 30
});

interface TransformableInfo {
  level: string;
  message: string;
  [key: string]: string;
}

const logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    winston.format.printf((info: TransformableInfo) => `${info.timestamp} [${info.level.toUpperCase()}] - ${info.stack ? info.stack : info.message}`)
  ),
  transports: [infoTransport, errorTransport]
});

export const stream = {
  write: (message: string): void => {
    logger.info(message);
  }
};

export default logger;
