import { serverConfig } from './configs/server.config'
import express from 'express'
import v1Router from './routes/v1/index'

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

app.listen(serverConfig.port, () => {
  console.log(`Server is running on port ${serverConfig.port}`)
})
