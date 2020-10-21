const winston = require('winston');
const winstonDaily = require('winston-daily-rotate-file');

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

const logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp({
      format: "YYYY-MM-DD HH:mm:ss"
    }),
    winston.format.printf(
      info => `${info.timestamp} [${info.level.toUpperCase()}] - ${info.stack ? info.stack : info.message}`
    )
  ),
  transports: [infoTransport, errorTransport]
});

logger.stream = {
  write: message => {
    logger.info(message);
  }
};

module.exports = logger;