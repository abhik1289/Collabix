import express from 'express'
import { signInSchema, signUpSchema } from '../../validation/auth'
import { validation } from '../../validation'
import { signInHandler, signUpHandler } from '../../controllers/auth.controller'

const authRouter = express.Router()

authRouter.post('/signup', validation(signUpSchema), signUpHandler)

authRouter.post('/signin', validation(signInSchema), signInHandler)

export default authRouter
