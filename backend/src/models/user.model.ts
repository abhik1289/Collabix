import { Document, Model, Schema, model } from 'mongoose'
import { hashSync } from 'bcrypt'

export interface IUser extends Document {
  name: string
  email: string
  password: string
  username: string
  avatar?: string
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      maxLength: 50,
      minLength: 2,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
      trim: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      minLength: 4,
    },
    password: {
      select: false,
      type: String,
      required: true,
    },
    avatar: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
)

userSchema.pre('save', function () {
  this.username = this.username.toLowerCase()

  if (!this.isModified('password')) {
    return
  }

  if (!this.avatar) {
    const seed = this.name || this.username
    this.avatar = `https://api.dicebear.com/9.x/initials/svg?seed=${seed}`
  }

  this.password = hashSync(this.password, 10)
})

const User: Model<IUser> = model<IUser>('User', userSchema)

export default User
