// import { serverConfig } from './configs/server.config'
import express from 'express'
import v1Router from './routes/v1/index'
import { serverConfigEnv } from './configs/server.config'
import { errorMiddleware } from './middleware/error.middleware';
import {connectDB} from './utils/db/db'

const app = express()

app.use(express.json())
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