import jwt from 'jsonwebtoken'
import { serverConfigEnv } from '../configs/server.config'

export const generateAccessToken = (id: string) => {
  return jwt.sign({ id }, serverConfigEnv.accessTokenSecret, {
    expiresIn: '15m',
  })
}

export const generateRefreshToken = (id: string) => {
  return jwt.sign({ id }, serverConfigEnv.refreshTokenSecret, {
    expiresIn: '7d',
  })
}
