import express from 'express'

const v1Router = express.Router()

//check helath
v1Router.get('/health', (req, res) => {
  res.status(200).send('ok')
})

export default v1Router
