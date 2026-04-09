// import { serverConfig } from './configs/server.config'
import express from 'express'
import v1Router from './routes/v1/index'
import pinoHttp from 'pino-http';
import { serverConfigEnv } from './configs/server.config'
import { errorMiddleware } from './middleware/error.middleware';
import {connectDB} from './utils/db/db'
import { logger } from './utils/logger';

const app = express()

app.use(express.json())
app.use(
  pinoHttp({
    logger,
    genReqId: function (req, res) {
      // If a tracing ID is passed from an API Gateway or previous microservice, use it.
      const existingId = req.id ?? req.headers['x-trace-id'] ?? req.headers['x-request-id'];
      if (existingId) return existingId;
      
      // Otherwise, generate a new one
      const id = crypto.randomUUID();
      res.setHeader('X-Trace-Id', id);
      return id;
    },

    // Customize the log message based on response status
    customLogLevel: function (_req, res, err) {
      if (res.statusCode >= 500 || err) return 'error';
      if (res.statusCode >= 400 && res.statusCode < 500) return 'warn';
      return 'info';
    },

    // Optional: Filter out noisy routes like health checks
    autoLogging: {
      ignore: (req) => req.url === '/health'
    },
 serializers: {
      req: (req) => ({ id: req.id, method: req.method, url: req.url }),
      res: (res) => ({ statusCode: res.statusCode }),
    },
    customErrorMessage(req, _res, error) {
      return `Request for ${req.method} ${req.url} resulted in error: ${error.message}`;
    },
  })
);
app.use(express.urlencoded({ extended: true }))

app.get('/', (_req, res) => {
  res.status(200).json({
    message: 'Syncra backend is running',
    health: '/api/v1/health',
  })
})
//integrate router
app.use('/api/v1', v1Router)


app.use(errorMiddleware);


const startServer = async()=>{
 await connectDB();
app.listen(serverConfigEnv.port, () => {
  // connectDB();
  console.log(`Server is running on port ${serverConfigEnv.port}`)
})

}


startServer()