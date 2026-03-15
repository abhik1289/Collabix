import { Types } from 'mongoose'
import ChannelModel, { IChannel } from '../models/channel.model'
import Workspace, { IWorkspace } from '../models/workspace.schema'
import { BadRequestError, NotFoundError } from '../utils/error'
import { curdRepository } from './curd-repositories'
import { UserRepository } from './user-repositories'

interface IWorkSpaceMember {
  name: string
  email: string
  avatar: string
  username: string
}

export class WorkRepository extends curdRepository<IWorkspace> {
  private userRepository: UserRepository

  constructor() {
    super(Workspace)
    this.userRepository = new UserRepository()
  }

  async findWorkSpaceById(id: string) {
    return await Workspace.findById(id)
      .populate<{
        members: IWorkSpaceMember[]
      }>('members.memberId', 'name email avatar username')
      .populate<{
        channels: { name: string }[]
      }>('channels', 'name')
  }

  async getWorkSpaceByName(name: string) {
    return await Workspace.findOne({ name })
  }

  async getWokSpaceByJoinCode(joinCode: string) {
    return await Workspace.findOne({ joinCode })
  }

  async addMemberToWorkSpace(
    workspcaeId: string,
    memberId: string,
    role: 'admin' | 'member',
  ) {
    const isWorkSpaceExits = await this.findById(workspcaeId)

    if (!isWorkSpaceExits) {
      throw new NotFoundError('Workspace not found')
    }

    const validUserId = await this.userRepository.findById(memberId)

    if (!validUserId) {
      throw new NotFoundError('User not found')
    }

    const isMember = isWorkSpaceExits.members.find(
      (member) => member.memberId.toString() === memberId,
    )

    if (isMember) {
      throw new BadRequestError('User is already a member of this workspace')
    }

    isWorkSpaceExits.members.push({
      memberId: new Types.ObjectId(memberId),
      role,
    })

    await isWorkSpaceExits.save()

    return isWorkSpaceExits
  }

  async addMemberToChannel(workSpaceId: string, channelName: string) {
    const isWorkSpaceExists = await Workspace.findById(workSpaceId).populate<{
      channels: IChannel[]
    }>('channels')

    if (!isWorkSpaceExists) {
      throw new NotFoundError('Workspace not found')
    }

    const isChannelExists = isWorkSpaceExists.channels.find(
      (ch) => ch.name === channelName,
    )

    if (isChannelExists) {
      throw new BadRequestError('Channel is already a member of this workspace')
    }

    const createChannel = await ChannelModel.create({
      name: channelName,
      workspaceId: workSpaceId,
    })

    isWorkSpaceExists.channels.push(createChannel)

    await isWorkSpaceExists.save()

    return isWorkSpaceExists
  }

  async findAllWorkSpaceByMemberId(memebrId: string) {
    return await Workspace.find({
      'members.memberId': new Types.ObjectId(memebrId),
    }).populate<{
      members: IWorkSpaceMember[]
    }>('members.memberId', 'name email avatar username')
  }
}
