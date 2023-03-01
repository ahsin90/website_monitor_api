import appRoot from 'app-root-path';
import winston from 'winston';
const { transports, format } = winston;

const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white',
};

winston.addColors(colors);

const options = {
  file: {
    level: 'info',
    filename: `${appRoot}/logs/app.log`,
    handleExceptions: true,
    json: true,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
    colorize: true,
  },
  console: {
    level: 'debug',
    handleExceptions: true,
    json: false,
    colorize: true,
  },
};

const print = format.printf((info) => {
  const log = `${info.level}: ${info.message}`;

  return info.stack ? `${log}\n${info.stack}` : log;
});

const log = winston.createLogger({
  transports: [new winston.transports.File(options.file), new winston.transports.Console(options.console)],
  format: format.combine(format.errors({ stack: true }), print),
  exitOnError: false,
});

export default log;
