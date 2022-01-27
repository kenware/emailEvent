import winston from 'winston';

const { format } = winston;

const logFormat = format.printf((info) => `${info.timestamp} ${info.level}: ${JSON.stringify(info.message)}`);

const logger = winston.createLogger({
  level: 'info',
  defaultMeta: { service: 'user-service' },
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        format.json(),
        format.splat(),
        logFormat,
        format.colorize(),
      ),
    })
  ],
});

export default logger;
