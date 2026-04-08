import { NextFunction, Request, Response } from 'express'
import { verifyAccessToken } from '../utils/token'
import User from '../models/user.model'
import { AuthUser } from '../types/express'
import { asyncHandler } from '../utils/error/async-handler'
import { NotFoundError, UnAuthenticatedError } from '../utils/error/error'

export const isAuthenticated = asyncHandler(
  async (req: Request, _res: Response, next: NextFunction) => {
  
    const token = req.headers['x-access-token'] as string
    console.log('TOKEN', req.headers)
    if (!token) {
      throw new UnAuthenticatedError('Unauthorized', 'AUTHENTICATION_ERROR')
    }

    let payload
    try {
      payload = verifyAccessToken(token)
    } catch (error: any) {
      if (error.name === 'TokenExpiredError') {
        throw new UnAuthenticatedError('Token expired', 'TOKEN_EXPIRED')
      }
      throw new UnAuthenticatedError('Invalid token', 'AUTHENTICATION_ERROR')
    }

    // console.log('PAYLOAD', payload)

    if (!payload) {
      throw new UnAuthenticatedError('Unauthorized')
    }

    const findUser = await User.findById(payload.id)
    if (!findUser) {
      throw new NotFoundError('User not found')
    }

    // const req.user as

    req.user as {
      id: string
      name: string
      email: string
    }

    req.user = {
      id: payload.id,
      name: findUser.name,
      email: findUser.email,
    } as AuthUser

    next()
  },
)
