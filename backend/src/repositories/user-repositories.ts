import User, { IUser } from '../models/user.model'
import { curdRepository } from './curd-repositories'

export class UserRepository extends curdRepository<IUser> {
  constructor() {
    super(User)
  }

  async getUserByEmail(email: string): Promise<IUser | null> {
    return await User.findOne({ email }).select('_id password email name')
  }

  async getUserByUsername(username: string): Promise<IUser | null> {
    return await User.findOne({ username })
  }
}
