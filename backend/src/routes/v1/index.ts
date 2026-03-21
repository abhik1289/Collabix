import express from 'express'
import authRouter from './auth.routes'
import workspaceRrouter from './workspace.route'

const v1Router = express.Router()

//check helath
v1Router.get('/health', (_req, res) => {
  res.status(200).send('ok')
})

v1Router.use('/auth', authRouter)
v1Router.use('/workspace', workspaceRrouter)

export default v1Router
