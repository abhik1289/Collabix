import { UserRepository } from '../repositories/user-repositories'
import { BadRequestError } from '../utils/error/error'
import bcrypt from 'bcryptjs'
import { generateAccessToken, generateRefreshToken } from '../utils/token'

interface ISignUp {
  name: string
  email: string
  password: string
  avatar?: string
}

export class AuthService {
  private userRepository: UserRepository

  constructor() {
    this.userRepository = new UserRepository()
  }

  async signIn(email: string, password: string) {
    const isExits = await this.userRepository.getUserByEmail(email)
    console.log(isExits)
    if (!isExits) {
      throw new BadRequestError({
        message: 'Invalid email or password',
        code: 'INVALID_CREDENTIALS',
      })
    }
    console.log(isExits)

    const passwordMatch = bcrypt.compareSync(password, isExits.password)
    // console.log('===========>', passwordMatch)
    if (!passwordMatch) {
      throw new BadRequestError({ message: 'Invalid email or password' })
    }

    console.log(passwordMatch)
    const userId = isExits._id.toString()

    const accessToken = generateAccessToken(userId)
    const refreshToken = generateRefreshToken(userId)

    console.log(accessToken, refreshToken)

    return {
      accessToken,
      refreshToken,
    }
  }

  async signUp(data: ISignUp) {
    const { email } = data

    const isExits = await this.userRepository.getUserByEmail(email)

    if (isExits) {
      throw new BadRequestError({
        message: 'Email already exists',
        code: 'DUPLICATE_KEY',
      })
    }

    // const hashedPassword = await bcrypt.hash(password, 10)

    const payload = { ...data, username: email }

    return await this.userRepository.create(payload)
  }
}
