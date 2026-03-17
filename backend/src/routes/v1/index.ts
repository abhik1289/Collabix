import express from 'express'
import authRouter from './auth'

const v1Router = express.Router()

//check helath
v1Router.get('/health', (_req, res) => {
  res.status(200).send('ok')
})



v1Router.use("/auth",authRouter);

export default v1Router
