import ChannelModel, { IChannel } from '../models/channel.model'
import { curdRepository } from './curd-repositories'

export class channelRepository extends curdRepository<IChannel> {
  constructor() {
    super(ChannelModel)
  }

  async findChannelByWorkspaceId(workspaceId: string) {
    return await ChannelModel.findById({ workspaceId }).populate<{
      workspaceId: { name: string }
    }>({
      path: 'workspaceId',
    })
  }
}
