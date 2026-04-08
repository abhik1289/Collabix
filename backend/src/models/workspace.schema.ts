import { Document, Model, Schema, model, Types } from 'mongoose'

export interface IWorkspaceMember {
  memberId: Types.ObjectId
  role: 'admin' | 'member'
}

export interface IWorkspace extends Document {
  name: string
  description?: string
  joinCode: string
  members: IWorkspaceMember[]
  channels: Types.ObjectId[]
}

const workspaceSchema = new Schema<IWorkspace>(
  {
    name: {
      type: String,
      required: [true, 'Workspace name is required'],
      // unique: true,
    },
    description: {
      type: String,
    },
    members: [
      {
        memberId: {
          type: Schema.Types.ObjectId,
          ref: 'User',
        },
        role: {
          type: String,
          enum: ['admin', 'member'],
          default: 'member',
        },
      },
    ],
    joinCode: {
      type: String,
      required: [true, 'Join code is required'],
    },
    channels: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Channel',
      },
    ],
  },
  {
    timestamps: true,
  },
)

const Workspace: Model<IWorkspace> = model<IWorkspace>('Workspace', workspaceSchema)

export default Workspace
