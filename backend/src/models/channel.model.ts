import mongoose, { Document, Model, Schema, model } from 'mongoose'

export interface IChannel extends Document {
  name: string
  workspaceId: string
}

const channelSchema = new Schema<IChannel>(
  {
    name: {
      type: String,
      required: true,
    },
    workspaceId: {
      type: String,
      required: true,
      ref: 'Workspace',
    },
  },
  {
    timestamps: true,
  },
)

const ChannelModel: Model<IChannel> = model<IChannel>('Channel', channelSchema)

export default ChannelModel
