import { Types } from 'mongoose'
import ChannelModel, { IChannel } from '../models/channel.model'
import Workspace, { IWorkspace } from '../models/workspace.schema'
import { BadRequestError, NotFoundError } from '../utils/error/error'
import { curdRepository } from './curd-repositories'
import { UserRepository } from './user-repositories'
import { channelRepository } from './channel-repositories'

interface IWorkSpaceMemberPopulated {
  memberId: Types.ObjectId
  role: 'admin' | 'member'
}

export class WorkSpaceRepository extends curdRepository<IWorkspace> {
  private userRepository: UserRepository
  private channelRepository: channelRepository

  constructor() {
    super(Workspace)
    this.userRepository = new UserRepository()
    this.channelRepository = new channelRepository()
  }

  async findWorkSpaceById(id: string) {
    return await Workspace.findById(id)
      .populate<{
        members: IWorkSpaceMemberPopulated[]
      }>('members')
      .populate<{
        channels: { name: string }[]
      }>('channels', 'name')
  }

  async getWorkSpaceByName(name: string) {
    return await Workspace.findOne({ name })
  }


  async getWorkSpaceByNameAndId(name:string,id: string) {


    const workspace = await Workspace.findOne({name,
      members:{
        $elemMatch:{
          memberId:new Types.ObjectId(id)
        }
      }
    })

   
    return workspace;

   

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
      throw new BadRequestError({ message: 'User is already a member of this workspace' })
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
      throw new BadRequestError({ message: 'Channel is already a member of this workspace' })
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
    })
  }

  async addChannelToWorkSpace(workSpaceId:string,channelName:string){
    

    const workspace = await this.findWorkSpaceById(workSpaceId);

    if (!workspace) {
      throw new NotFoundError('Workspace not found')
    }

  

    const isChannelExists = workspace.channels.find(
      (ch) => ch.name === channelName,
    )

    if (isChannelExists) {
      throw new BadRequestError({ message: 'Two Channel cannot have same name' })
    }

    const channel = await this.channelRepository.create({
      name: channelName,
      workspaceId: workSpaceId,
    },
  );

    workspace.channels.push(channel);
    await workspace.save();
    return workspace;



  }

  

  async removeMemberFromWorkSpace(workSpaceId: string, memberId: string) {
   


    await Workspace.findByIdAndUpdate(workSpaceId, {
      $pull: {
        members: {
          memberId: new Types.ObjectId(memberId),
        },
      },
    });

    return true;


  }

  async removeChannelFromWorkSpace(workSpaceId: string, channelId: string) {
    await Workspace.findByIdAndUpdate(workSpaceId, {
      $pull: {
        channels: {
          _id: new Types.ObjectId(channelId),
        },
      },
    });

    return true;
  }
}
