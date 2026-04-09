import pino from 'pino';

const isProduction = process.env.NODE_ENV === 'production';

export const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  
  // REDACTION: Crucial for compliance (GDPR/CCPA/SOC2). 
  // Never leak credentials or PII into your log aggregator.
  redact: [
    'req.headers.authorization',
    'req.headers.cookie',
    'body.password',
    'body.creditCard',
    'email'
  ],
  ...(isProduction ? {} : {
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'SYS:standard',
        ignore: 'pid,hostname', // Cleans up local terminal output
      },
    },
  }),
});