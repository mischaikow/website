import winston from 'winston';
import fs from 'fs';

import { dateTimeString } from './utils.js';

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
  const timestamp = dateTimeString();

  const logFileName = `logs/${timestamp}.log`;

  if (level() === WARN_LEVEL) {
    if (!fs.existsSync('/app/logs')) {
      fs.mkdirSync('/app/logs');
    }

    if (!fs.existsSync(`/app/${logFileName}`)) {
      fs.writeFileSync(`/app/${logFileName}`, '');
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
