import { IWorkspace } from '../models/workspace.schema'
import { WorkSpaceRepository } from '../repositories/workspace-repositories'
import { BadRequestError, NotFoundError } from '../utils/error/error'
import { channelRepository } from '../repositories/channel-repositories'
import { v4 as uuidv4 } from 'uuid'
// import { ObjectId } from "mongodb";
import { Types } from 'mongoose'

// Represents a workspace where members.memberId and channels have been populated
type PopulatedMember = {
  memberId:
    | {
        _id: Types.ObjectId
        name: string
        email: string
        avatar: string
        username: string
      }
    | Types.ObjectId
  role: 'admin' | 'member'
}
type WorkspaceWithPopulatedMembers = Omit<
  IWorkspace,
  'members' | 'channels'
> & {
  members: PopulatedMember[]
  channels: Types.ObjectId[] | { name: string }[]
}

export class WorkSpaceService {
  private workSpaceRepository: WorkSpaceRepository
  private channelRepository: channelRepository

  constructor() {
    this.workSpaceRepository = new WorkSpaceRepository()
    this.channelRepository = new channelRepository()
  }

  async isUserIsAWorkSpaceAdmin(
    workspace: WorkspaceWithPopulatedMembers | IWorkspace,
    userId: string,
  ) {
    return workspace.members.find(
      (m) => m.memberId.toString() === userId && m.role === 'admin',
    )
  }

  async isUserIsAWorkSpaceMember(
    workspace: WorkspaceWithPopulatedMembers | IWorkspace,
    userId: string,
  ) {
    return workspace.members.find((m) => m.memberId.toString() === userId)
  }

  async createWorkSpace(data: Partial<IWorkspace>, userId: string) {
    const joinCode = uuidv4().substring(0, 6)

    const response = await this.workSpaceRepository.create({
      ...data,
      joinCode,
    })

    await this.workSpaceRepository.addMemberToWorkSpace(
      response._id.toString(),
      userId,
      'admin',
    )

    const updateWorkspce = await this.workSpaceRepository.addMemberToChannel(
      response._id.toString(),
      'general',
    )

    return updateWorkspce
  }

  async getWorkSpaceById(id: string) {
    return this.workSpaceRepository.findById(id)
  }

  async updateWorkSpace(id: string, userId: string, data: Partial<IWorkspace>) {
    const workSpaceId = new Types.ObjectId(id)
    const _userId = new Types.ObjectId(userId)

    const workspace = await this.getWorkSpaceById(workSpaceId.toString())

    if (!workspace) {
      throw new NotFoundError('Workspace not found')
    }
    console.log(workspace._id)

    const isAllowed = await this.isUserIsAWorkSpaceAdmin(
      workspace,
      _userId.toString(),
    )

    if (!isAllowed) {
      throw new BadRequestError({
        message: 'You are not allowed to update this workspace',
      })
    }

    const response = await this.workSpaceRepository.update(
      workSpaceId.toString(),
      data,
    )
    return response
  }

  async deleteWorkSpace(workSpaceId: string, userId: string) {
    const workspace = await this.getWorkSpaceById(workSpaceId)

    if (!workspace) {
      throw new NotFoundError('Workspace not found')
    }

    const isAllowed = await this.isUserIsAWorkSpaceAdmin(workspace, userId)

    if (!isAllowed) {
      throw new BadRequestError({
        message: 'You are not allowed to delete this workspace',
      })
    }

    await this.channelRepository.deleteMany(workSpaceId)

    const response = await this.workSpaceRepository.delete(workSpaceId)

    return response
  }

  async joinWorkSpaceService(
    workspaceId: string,
    userId: string,
    joinCode: string,
  ) {
    const workspace =
      await this.workSpaceRepository.findWorkSpaceById(workspaceId)

    if (!workspace) {
      throw new NotFoundError('Workspace not found')
    }

    if (workspace.joinCode !== joinCode) {
      throw new BadRequestError({ message: 'Invalid join code' })
    }

    const isMember = await this.isUserIsAWorkSpaceMember(workspace, userId)

    if (isMember) {
      throw new BadRequestError({
        message: 'You are already a member of this workspace',
      })
    }

    await this.workSpaceRepository.addMemberToWorkSpace(
      workspaceId,
      userId,
      'member',
    )

    return workspace
  }

  async addMemberToWorkSpaceService(workspaceId: string, userId: string,memberId: string) {

    const workspace =
      await this.workSpaceRepository.findWorkSpaceById(workspaceId)


      // console.log(userId)

    if (!workspace) {
      throw new NotFoundError('Workspace not found')
    }
    console.log(workspace)

    const isWorkSpaceAdmin = await this.isUserIsAWorkSpaceAdmin(workspace, userId)

    if (!isWorkSpaceAdmin) {
      throw new BadRequestError({
        message: 'You are not a admin of this workspace',
      })
    }
    const isMember = await this.isUserIsAWorkSpaceMember(workspace, memberId)

    if (isMember) {
      throw new BadRequestError({
        message: 'You are already a member of this workspace',
      })
    }

    await this.workSpaceRepository.addMemberToWorkSpace(
      workspaceId,
      userId,
      'member',
    )

  }

  async leaveWorkSpaceService(workspaceId: string, userId: string) {
    const workspace =
      await this.workSpaceRepository.findWorkSpaceById(workspaceId)

    if (!workspace) {
      throw new NotFoundError('Workspace not found')
    }

    const isMember = await this.isUserIsAWorkSpaceMember(workspace, userId)

    if (!isMember) {
      throw new BadRequestError({
        message: 'You are not a member of this workspace',
      })
    }

    //remove member from workspace
    await this.workSpaceRepository.removeMemberFromWorkSpace(
      workspaceId,
      userId,
    )

    return workspace
  }

  async deleteMemberFormWorkSpace(workspaceId: string, userId: string) {
    const workspace =
      await this.workSpaceRepository.findWorkSpaceById(workspaceId)

    if (!workspace) {
      throw new NotFoundError('Workspace not found')
    }

    const isMember = await this.isUserIsAWorkSpaceMember(workspace, userId)

    if (!isMember) {
      throw new BadRequestError({
        message: 'You are not a member of this workspace',
      })
    }

    const isWorkSpaceAdmin = await this.isUserIsAWorkSpaceAdmin(
      workspace,
      userId,
    )

    if (!isWorkSpaceAdmin) {
      throw new BadRequestError({
        message: 'You are not a admin of this workspace',
      })
    }

    //remove member from workspace
    await this.workSpaceRepository.removeMemberFromWorkSpace(
      workspaceId,
      userId,
    )
  }

  async addChannelToWorkSpace(workspaceId: string, channelId: string) {


    const workspace =
      await this.workSpaceRepository.findWorkSpaceById(workspaceId)

    if (!workspace) {
      throw new NotFoundError('Workspace not found')
    }

    const isWorkSpaceAdmin = await this.isUserIsAWorkSpaceAdmin(
      workspace,
      workspaceId,
    )

    if (!isWorkSpaceAdmin) {
      throw new BadRequestError({
        message: 'You are not a admin of this workspace',
      })
    }

    await this.workSpaceRepository.addChannelToWorkSpace(workspaceId, channelId)

    return {
      message: 'Channel added to workspace successfully',
    }
  }

  async getWorkSpaceMembersService(workspaceId: string) {
    const workspace = await this.workSpaceRepository.findWorkSpaceById(workspaceId)

    if (!workspace) {
      throw new NotFoundError('Workspace not found')
    }

   

    const members = workspace.members.map((m: any) => ({
      role: m.role,
      name: m.memberId.name,
      email: m.memberId.email,
    }))

   

    return members
  }

  async getWorkSpaceChannelsService(workspaceId: string) {
    const workspace =
      await this.workSpaceRepository.findWorkSpaceById(workspaceId)

    if (!workspace) {
      throw new NotFoundError('Workspace not found')
    }

    const channels = workspace.channels.map((m: any) => ({
      id: m._id.toString(),
      name: m.name,
      createdAt: m.createdAt,
    }))

    return channels
  }

  async getWorkSpaces(id: string) {
    return this.workSpaceRepository.findAllWorkSpaceByMemberId(id)
  }

  async deleteChannelToWorkSpace(workspaceId: string,userId: string, channelId: string) {
   


    const workspace = await this.workSpaceRepository.findWorkSpaceById(workspaceId)

    if (!workspace) {
      throw new NotFoundError('Workspace not found')
    }

    const isWorkSpaceAdmin = await this.isUserIsAWorkSpaceAdmin(workspace, userId)

    if (!isWorkSpaceAdmin) {
      throw new BadRequestError({
        message: 'You are not a admin of this workspace',
      })
    }

    await this.workSpaceRepository.removeChannelFromWorkSpace(workspaceId, channelId)

  }
}
