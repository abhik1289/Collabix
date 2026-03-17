import dotenv from 'dotenv'
import z from 'zod'

dotenv.config()

const serverConfig = z.object({
  port: z.coerce.number().default(3000),
  accessTokenSecret: z.string(),
  refreshTokenSecret: z.string(),
  DB_URL: z.string(),
  environment: z
    .enum(['development', 'production', 'test'])
    .default('development'),
})

export const serverConfigEnv = serverConfig.parse(process.env)
