import winston from 'winston';
import { correlationStorage } from '../middleware/correlation-id';

const correlationIdFormat = winston.format((info) => {
  info['correlationId'] = correlationStorage.getStore()?.correlationId ?? '-';
  return info;
});

const transports: winston.transport[] = [
  new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.printf(({ level, message, correlationId, timestamp, ...rest }) => {
        const meta = Object.keys(rest).length ? ` ${JSON.stringify(rest)}` : '';
        return `${timestamp} [${correlationId}] ${level}: ${message}${meta}`;
      })
    ),
  }),
];

if (process.env.OPENSEARCH_HOST) {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { OpenSearchTransport } = require('winston-opensearch');
  transports.push(
    new OpenSearchTransport({
      level: 'info',
      indexPrefix: process.env.OPENSEARCH_INDEX_PREFIX || 'p-frog-logs',
      clientOpts: {
        node: process.env.OPENSEARCH_HOST,
        auth: process.env.OPENSEARCH_USERNAME
          ? { username: process.env.OPENSEARCH_USERNAME, password: process.env.OPENSEARCH_PASSWORD }
          : undefined,
        ssl: { rejectUnauthorized: process.env.NODE_ENV === 'production' },
      },
    })
  );
}

export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    correlationIdFormat(),
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports,
});
