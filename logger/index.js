const { createLogger, config, format, transports } = require('winston');
const { combine, timestamp, label, printf } = format;

const myFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${level}]: [${message}]`;
});

const timeZoned = () => {
  return new Date().toLocaleString('he-IL', {
    timeZone: 'Asia/Jerusalem',
  });
};

const logger = createLogger({
  levels: config.syslog.levels,
  format: combine(
    label({ label: 'env' }),
    format.colorize(),
    timestamp({ format: timeZoned }),
    myFormat
  ),
  transports: [
    new transports.Console(),
    new transports.File({
      colorize: true,
      filename: 'log-files/combined.log',
      level: 'info',
      prettyPrint: true,
    }),
  ],
});

module.exports = {
  logger,
};
