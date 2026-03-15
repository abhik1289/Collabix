import mongoose, { Schema, Document, Model, ObjectId } from 'mongoose'
// import { Schema } from 'zod'

const { ObjectId } = mongoose.Types

export interface IMessage extends Document {
  senderId: ObjectId
  body: string
  chnannelId: ObjectId
  imageUrl?: string
  workspaceId: ObjectId
}

const messageSchema = new Schema<IMessage>(
  {
    body: {
      type: String,
      required: true,
    },
    senderId: {
      type: ObjectId,
      required: true,
      ref: 'User',
    },
    chnannelId: {
      type: ObjectId,
      required: true,
    },
    imageUrl: {
      type: String,
    },
    workspaceId: {
      type: ObjectId,
      required: true,
    },
  },
  { timestamps: true },
)

const MessageModel: Model<IMessage> = mongoose.model<IMessage>(
  'Message',
  messageSchema,
)
export default MessageModel
