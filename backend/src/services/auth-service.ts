import { UserRepository } from '../repositories/user-repositories'
import { BadRequestError } from '../utils/error'
import bcrypt from 'bcryptjs'
import { generateAccessToken, generateRefreshToken } from '../utils/token'

interface ISignUp {
  name: string
  email: string
  password: string
  avatar: string
}

export class AuthService {
  private userRepository: UserRepository

  constructor() {
    this.userRepository = new UserRepository()
  }

  async signIn(email: string, password: string) {
    const isExits = await this.userRepository.getUserByEmail(email)

    if (!isExits) {
      throw new BadRequestError('Invalid email or password')
    }

    const passwordMatch = await bcrypt.compare(password, isExits.password)

    if (!passwordMatch) {
      throw new BadRequestError('Invalid email or password')
    }

    const userId = isExits._id.toString()

    const accessToken = generateAccessToken(userId)
    const refreshToken = generateRefreshToken(userId)

    return {
      accessToken,
      refreshToken,
    }
  }

  async signUp(data: ISignUp) {
    const { password,email} = data

    const isExits = await this.userRepository.getUserByEmail(email)

    if (isExits) {
      throw new BadRequestError('Email already exists')
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const payload = { ...data, password: hashedPassword, username: email }

    return await this.userRepository.create(payload)
  }
}
