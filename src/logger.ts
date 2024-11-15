import winston from 'winston';
import fs from 'fs';

const DEBUG_LEVEL = 'debug';
const WARN_LEVEL = 'warn';

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

const level = () => {
  const env = process.env.NODE_ENV || 'development';
  const isDevelopment = env === 'development';
  return isDevelopment ? DEBUG_LEVEL : WARN_LEVEL;
};

const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white',
};
winston.addColors(colors);

const format = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
  winston.format.colorize({ all: true }),
  winston.format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`),
);

const gitLogFileName = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');

  const logFileName = `logs/${year}-${month}-${day}-${hours}-${minutes}-${seconds}.log`;

  if (level() === WARN_LEVEL) {
    if (!fs.existsSync('/app/logs')) {
      fs.mkdirSync('/app/logs');
    }
    return `/app/${logFileName}`;
  }
  return logFileName;
};

const logger = winston.createLogger({
  levels: levels,
  level: level(),
  format: format,
  transports: [new winston.transports.Console(), new winston.transports.File({ filename: gitLogFileName() })],
});

export default logger;
